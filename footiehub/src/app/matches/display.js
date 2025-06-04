'use client'

import React, { useState } from 'react';

const DisplayGoals = ({ goals }) => (
  <>
    {goals.map((goal, i) => (
      <div key={i}>
        {goal.name}
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
          <td>{goal.name}</td>
          <td className='px-2'>{goal.goals}G</td>
          <td className='px-2'>{goal.assists}A</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Display = ({ matches, goals }) => {

  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleClick = (match) => {
    setSelectedMatch(match);
  }

  return (
    <main className='flex-1 p-6'>
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
                  <button onClick={() => handleClick(match)}>Details</button>
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

      {selectedMatch && (
        <div className='fixed top-10 right-0 w-1/3 h-full p-6'>
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
        </div>
      )}

    </main>
  )
}

export default Display;