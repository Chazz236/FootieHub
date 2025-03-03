'use client'

import React, { useState, useEffect } from 'react';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchResult, setMatchResult] = useState('');

  useEffect(() => {
    const getData = async () => {
      const res = await fetch('http://localhost:3000/api/matches');
      const data = await res.json();
      const { matches, goals } = data;
      setMatches(matches);
      setGoals(goals);
    };
    getData();
  }, []);

  const handleClick = (match) => {
    setSelectedMatch(match);
    if (match.home_score > match.away_score) {
      setMatchResult('Home');
    }
    else if (match.home_score < match.away_score) {
      setMatchResult('Away');
    }
    else {
      setMatchResult('Draw');
    }
  }

  return (
    <main className='flex-1 p-6'>
      <table className='table-auto'>
        <tbody>
          {matches.map((match, i) => (
            <React.Fragment key={i} /*instead of i, can use match.id*/>
              <tr>
                <td className='px-6'>{new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                <td className='px-6 text-right'>Home</td>
                <td className='px-6 text-center'>{match.home_score} - {match.away_score}</td>
                <td className='px-6 text-left'>Away</td>
              </tr>
              <tr key={i} className='text-center'>
                <td></td>
                <td className='px-6 text-xs align-text-top text-right'>
                  {goals.filter((goal) => goal.team === 'home' && goal.match_id - 1 === i && goal.goals > 0)
                    .map((goal, j) => (
                      <div key={j}>
                        {goal.name}
                        {Array.from({ length: goal.goals }).map((_, i) => (
                          <img src='/ball.png' alt='Soccer Ball' className='inline-block w-3 h-3' />
                        ))}
                      </div>
                    ))}
                </td>
                <td className='px-6 text-xs align-text-top text-center text-blue-600'>
                  <button onClick={() => handleClick(match)}>Details</button>
                </td>
                <td className='px-6 text-xs align-text-top text-left'>
                  {goals.filter((goal) => goal.team === 'away' && goal.match_id - 1 === i && goal.goals > 0)
                    .map((goal, k) => (
                      <div key={k}>
                        {goal.name}
                        {Array.from({ length: goal.goals }).map((_, i) => (
                          <img src='/ball.png' alt='Soccer Ball' className='inline-block w-3 h-3' />
                        ))}
                      </div>
                    ))}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {selectedMatch !== null ?
        <div className='fixed top-10 right-0 w-1/3 h-full p-6'>
          <h2>Match Details</h2>
          <p>
            <strong>Date: </strong>
            {new Date(selectedMatch.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <p>
            <strong>Winner: </strong> {matchResult}
          </p>
          <p>
            <strong>Final Score: <span className='font-normal'>{selectedMatch.home_score} - {selectedMatch.away_score}</span></strong>
          </p>
          <div className='flex space-x-24'>
            <p>
              <strong>Home Team</strong>
              <>
                <table>
                  <tbody>
                    {goals.filter((goal) => goal.team === 'home' && goal.match_id === selectedMatch.id)
                      .map((goal, j) => (
                        <tr>
                          <td>{goal.name}</td>
                          <td className='px-2'>{goal.goals}G</td>
                          <td className='px-2'>{goal.assists}A</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            </p>
            <p>
              <strong>Away Team</strong>
              <>
                <table>
                  <tbody>
                    {goals.filter((goal) => goal.team === 'away' && goal.match_id === selectedMatch.id)
                      .map((goal, j) => (
                        <tr>
                          <td>{goal.name}</td>
                          <td className='px-2'>{goal.goals}G</td>
                          <td className='px-2'>{goal.assists}A</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            </p>
          </div>
        </div>
        :
        <div></div>}

    </main>
  )
}

export default Matches;