'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

//client component to display match details split in tabs
const Display = ({ match, stats, goals }) => {

  const [tab, setTab] = useState('matchStats');

  //figure out winning team for styling
  const homeWin = match.home_score > match.away_score;
  const awayWin = match.away_score > match.home_score;

  //filter players into their teams
  const homeTeam = stats.filter(player => player.team === 'home');
  const awayTeam = stats.filter(player => player.team === 'away');

  //handle missing goal scorers by assigning them to random
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].goal_scorer === null) {
      goals[i].goal_scorer = 'Random';
    }
  }

  //split goals into home and away goals
  const homeGoals = goals.slice(0, match.home_score);
  const awayGoals = goals.slice(match.home_score, match.home_score + match.away_score);

  //set text colour depending on value change
  const valueChangeColor = valueChange => {
    if (valueChange > 0) {
      return 'text-success-color';
    }
    else if (valueChange < 0) {
      return 'text-danger-color';
    }
    else {
      return 'text-foreground';
    }
  }

  //set icon depending on value change
  const valueChangeIcon = valueChange => {
    if (valueChange > 0) {
      return <ChevronUpIcon className='w-4 h-4' />;
    }
    else if (valueChange < 0) {
      return <ChevronDownIcon className='w-4 h-4' />;
    }
    else {
      return null;
    }
  }

  //for displaying player match stats
  const matchStats = (
    <div className='grid grid-cols-2 gap-6'>
      <Card className='p-4'>
        <h3 className='text-lg font-bold text-foreground mb-4'>Home</h3>
        <div className='max-h-80 overflow-y-scroll grid grid-cols-2 gap-6'>
          {homeTeam.map(player => (
            <Card key={player.id} className='p-3 w-fit'>
              <div className='flex flex-col gap-1 text-sm'>
                <div className='flex justify-between'>
                  <h3 className='font-bold'><Link href={`/players/${player.id}`}>{player.name}</Link></h3>
                  <p className={`${valueChangeColor(player.value_change)} font-bold flex`}>{valueChangeIcon(player.value_change)}${Intl.NumberFormat().format(Math.abs(player.value_change))}</p>
                </div>
                <div className='flex justify-between text-xs text-gray-500'>
                  <span className='px-5'>Goals: {player.goals}</span>
                  <span className='px-5'>Assists: {player.assists}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
      <Card className='p-4'>
        <h3 className='text-lg font-bold text-foreground mb-4'>Away</h3>
        <div className='max-h-80 overflow-y-scroll grid grid-cols-2 gap-6'>
          {awayTeam.map(player => (
            <Card key={player.id} className='p-3 w-fit'>
              <div className='flex flex-col gap-1 text-sm'>
                <div className='flex justify-between'>
                  <h3 className='font-bold'><Link href={`/players/${player.id}`}>{player.name}</Link></h3>
                  <p className={`${valueChangeColor(player.value_change)} font-bold flex`}>{valueChangeIcon(player.value_change)}${Intl.NumberFormat().format(Math.abs(player.value_change))}</p>
                </div>
                <div className='flex justify-between text-xs text-gray-500'>
                  <span className='px-5'>Goals: {player.goals}</span>
                  <span className='px-5'>Assists: {player.assists}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );

  //for displaying goals in match
  const matchGoals = (
    <Card className='p-4 border-none'>
      <div className='max-h-80 overflow-y-scroll grid grid-cols-2 gap-6 ml-16'>
        <div>
          {homeGoals.map(goal => (
            <div key={goal.id} className='mb-4 text-right'>
              <div className='flex text-sm justify-end'>
                <span className='text-sm'>
                  {goal.goal_scorer}
                </span>
                <span className='ml-2'>
                  <img src='/ball.png' alt='Soccer Ball' className='inline-block w-3 h-3' />
                </span>
              </div>
              {goal.assist_player !== null &&
              <div className='flex text-sm justify-end'>
                <span className='text-sm'>
                  {goal.assist_player}
                </span>
                <span className='ml-2'>
                  <img src='/shoe.png' alt='Soccer Shoe' className='inline-block w-3 h-3 transform -scale-x-100' />
                </span>
              </div>
              }
            </div>
          ))}
        </div>
        <div>
          {awayGoals.map(goal => (
            <div key={goal.id} className='mb-4'>
              <div className='flex text-sm justify-start'>
                <span className='text-sm'>
                  <img src='/ball.png' alt='Soccer Ball' className='inline-block w-3 h-3' />
                </span>
                <span className='ml-2'>
                  {goal.goal_scorer}
                </span>
              </div>
              {goal.assist_player !== null &&
              <div className='flex text-sm justify-start'>
                <span className='text-sm'>
                  <img src='/shoe.png' alt='Soccer Shoe' className='inline-block w-3 h-3' />
                </span>
                <span className='ml-2'>
                  {goal.assist_player}
                </span>
              </div>
              }
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <main className='flex-1 p-6'>
      <Card className='p-4 mb-4'>
        <div className='grid grid-cols-3'>
          <div className='text-left'>
            {new Date(match.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
          </div>
          <div className='text-center'>
            <span className={`${homeWin ? 'font-bold' : 'font-medium'} px-16`}>Home</span>
            <span className={`${homeWin ? 'font-bold' : 'font-medium'} px-2`}>{match.home_score}</span>
            -
            <span className={`${awayWin ? 'font-bold' : 'font-medium'} px-2`}>{match.away_score}</span>
            <span className={`${awayWin ? 'font-bold' : 'font-medium'} px-16`}>Away</span>
          </div>
        </div>
      </Card>
      <div>
        <div className='flex gap-2 px-6'>
          <button onClick={() => setTab('matchStats')} className={`px-2 py-1 bg-white rounded-lg text-foreground ${tab === 'matchStats' ? 'font-semibold' : 'font-normal'}`}>
            Match Facts
          </button>
          <button onClick={() => setTab('matchGoals')} className={`px-2 py-1 bg-white rounded-lg text-foreground ${tab === 'matchGoals' ? 'font-semibold' : 'font-normal'}`}>
            Goal Updates
          </button>
        </div>
        <Card className='p-6 border-none'>
          {tab === 'matchStats' && matchStats}
          {tab === 'matchGoals' && matchGoals}
        </Card>
      </div>
    </main>
  )
}

export default Display;