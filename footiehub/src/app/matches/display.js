'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import Card from '@/app/components/ui/Card';

const DisplayGoals = ({ goals }) => (
  <>
    {goals.map((goal, i) => (
      <div key={i}>
        <Link href={`/players/${goal.id}`}>{goal.name}</Link>
        {Array.from({ length: goal.goals }).map((_, j) => (
          <img key={j} src='/ball.png' alt='Soccer Ball' className='inline-block w-3 h-3' />
        ))}
      </div>
    ))}
  </>
);

const GoalDetails = ({ goals }) => (
  <table>
    <tbody>
      {goals.map(goal => (
        <tr>
          <td><Link href={`/players/${goal.id}`}>{goal.name}</Link></td>
          <td className='px-2'>{goal.goals}G</td>
          <td className='px-2'>{goal.assists}A</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Display = ({ matches, goals }) => {

  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <main className='flex-1 p-6'>
      <h2 className='text-2xl font-bold text-foreground mb-6'>Matches</h2>
      <div className='flex gap-6 items-start'>
        <Card className='h-[calc(100vh-7rem)] w-3/5 overflow-y-auto'>
          <table className='table-auto'>
            <tbody>
              {matches.map((match, i) => (
                <React.Fragment key={match.id}>
                  <tr>
                    <td className='px-6'>{new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                    <td className='px-6 text-right'>Home</td>
                    <td className='px-6 text-center'>{match.home_score} - {match.away_score}</td>
                    <td className='px-6 text-left'>Away</td>
                  </tr>
                  <tr key={i} className='text-center'>
                    <td></td>
                    <td className='px-6 text-xs align-text-top text-right'>
                      <DisplayGoals
                        goals={goals.filter(
                          (goal) => goal.team === 'home' && goal.match_id === match.id && goal.goals > 0
                        )}
                      />
                    </td>
                    <td className='px-6 text-xs align-text-top text-center text-blue-600'>
                      <button onClick={() => setSelectedMatch(match)}>Details</button>
                    </td>
                    <td className='px-6 text-xs align-text-top text-left'>
                      <DisplayGoals
                        goals={goals.filter(
                          (goal) => goal.team === 'away' && goal.match_id === match.id && goal.goals > 0
                        )}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </Card>
        {selectedMatch && (
          <Card>
            <div>
              <h2>Match Details</h2>
              <p>
                <strong>Date: </strong>
                {new Date(selectedMatch.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p>
                <strong>Winner: </strong>
                {selectedMatch.home_score > selectedMatch.away_score
                  ? 'Home'
                  : selectedMatch.home_score < selectedMatch.away_score
                    ? 'Away'
                    : 'Draw'
                }
              </p>
              <p>
                <strong>Final Score: <span className='font-normal'>{selectedMatch.home_score} - {selectedMatch.away_score}</span></strong>
              </p>
              <div className='flex space-x-24'>
                <div>
                  <strong>Home Team</strong>
                  <GoalDetails
                    goals={goals.filter((goal) => goal.team === 'home' && goal.match_id === selectedMatch.id)}
                  />
                </div>
                <div>
                  <strong>Away Team</strong>
                  <GoalDetails
                    goals={goals.filter((goal) => goal.team === 'away' && goal.match_id === selectedMatch.id)}
                  />
                </div>
              </div>
              <button onClick={() => setSelectedMatch()} className='flex items-center text-sm font-medium p-2 rounded-md shadow-sm mt-6 border-2 border-solid border-foreground'>
                Close
              </button>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}

export default Display;