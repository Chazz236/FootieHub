'use client'

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/app/components/ui/Card';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';

const DisplayGoals = ({ goals }) => (
  <>
    {goals.map((goal, i) => (
      <div key={i}>
        {goal.name !== 'Random' ?
          <Link href={`/players/${goal.id}`}>{goal.name}</Link>
          :
          <span>{goal.name}</span>
        }
        {Array.from({ length: goal.goals }).map((_, j) => (
          <img key={j} src='/ball.png' alt='Soccer Ball' className='inline-block w-3 h-3' />
        ))}
      </div>
    ))}
  </>
);

const Display = ({ matches, goals }) => {

  const years = ['All Time', ...new Set(matches.map(match => new Date(match.date).getFullYear()).filter(year => year !== null).sort())];
  const [year, setYear] = useState(years[0]);
  const [yearMatches, setYearMatches] = useState(matches);
  

  const getGoals = (match, team) => {
    const teamGoals = goals.filter((goal) => goal.team === team && goal.match_id === match.id && goal.goals > 0);
    const totalGoals = teamGoals.reduce((sum, goal) => sum + goal.goals, 0);
    const teamScore = team === 'home' ? match.home_score : match.away_score;
    const unaccountedGoals = teamScore - totalGoals;
    const allGoals = [...teamGoals];
    if (unaccountedGoals > 0) {
      allGoals.push({
        name: 'Random',
        goals: unaccountedGoals,
        match_id: match.id,
        team: team,
        id: 'random'
      });
    }
    return allGoals;
  }

  const handleYearChange = (dir) => {
    let i = years.indexOf(year);
    if (dir === 'next') {
      i = (i + 1) % years.length;
    }
    else {
      i = (i - 1 + years.length) % years.length;
    }
    const newYear = years[i];
    setYear(newYear);
    if (newYear !== 'All Time') {
      setYearMatches(matches.filter(match => new Date(match.date).getFullYear() === newYear));
    }
    else {
      setYearMatches(matches);
    }
  };

  return (
    <main className='flex-1 p-6'>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>Matches</h2>
        <div className='flex items-start'>
          <ChevronLeftIcon className='w-8 h-8 p-1 cursor-pointer' onClick={() => handleYearChange('prev')} />
          <h3 className='text-lg font-bold text-foreground w-24 text-center'>{year}</h3>
          <ChevronRightIcon className='w-8 h-8 p-1 cursor-pointer' onClick={() => handleYearChange('next')} />
        </div>
      </div>
      <Card className='p-6'>
        <div className='h-[calc(100vh-10rem)] overflow-y-scroll'>
          <table className='table-fixed w-full mx-auto'>
            <thead>
              <tr>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'>Date</th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'></th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'>Score</th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'></th>
              </tr>
            </thead>
            <tbody>
              {yearMatches.map(match => {

                const homeWins = match.home_score > match.away_score;
                const awayWins = match.away_score > match.home_score;

                const homeGoals = getGoals(match, 'home');
                const awayGoals = getGoals(match, 'away');

                return (
                  <tr key={match.id} className='border-y border-gray-200 hover:bg-gray-100'>
                    <td className='p-4 text-sm font-medium text-foreground text-center align-top'>{new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                    <td className='p-4 text-sm text-foreground text-right align-top'>
                      <div className='flex flex-col items-end'>
                        <div className={`${homeWins ? 'font-bold' : 'font-medium'} mb-2`}>
                          Home
                        </div>
                        <div className='font-medium text-xs'>
                          <DisplayGoals goals={homeGoals} />
                        </div>
                      </div>
                    </td>
                    <td className='p-4 text-sm text-foreground text-center align-top flex flex-col'>
                      <div>
                        <span className={`${homeWins ? 'font-bold' : 'font-medium'}`}>{match.home_score}</span>-<span className={`${awayWins ? 'font-bold' : 'font-medium'}`}>{match.away_score}</span>
                      </div>
                      <div >
                        <Link href={`/matches/${match.id}`} className='text-xs text-primary-accent'>Details</Link>
                      </div>
                    </td>
                    <td className='p-4 text-sm font-medium text-foreground text-left align-top'>
                      <div className='flex flex-col items-start'>
                        <div className={`${awayWins ? 'font-bold' : 'font-medium'} mb-2`}>
                          Away
                        </div>
                        <div className='font-medium text-xs'>
                          <DisplayGoals goals={awayGoals} />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}

export default Display;