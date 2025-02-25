import React from 'react';

export async function getMatches() {
  const res = await fetch('http://localhost:3000/api/matches');
  const data = await res.json();
  const { matches, goals } = data;
  return { matches, goals };
}

const Matches = async () => {

  const { matches, goals } = await getMatches();
  console.log(matches);

  return (
    <main className='flex-1 p-6'>
      <table className='table-auto'>
        <tbody>
          {matches.map((match, i) => (
            <React.Fragment key={i} /*instead of i, can use match.id*/>
              <tr className='text-center'>
                <td className='px-6'>{new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                <td className='px-6'>Home</td>
                <td className='px-6'>{match.home_score} - {match.away_score}</td>
                <td className='px-6'>Away</td>
              </tr>
              <tr key={i} className='text-center'>
                <td></td>
                <td className='px-6 text-xs flex flex-col items-start'>
                  {goals.filter((goal) => goal.team === 'home' && goal.match_id - 1 === i && goal.goals > 0)
                    .map((goal) => (
                      <div>
                        {goal.name}
                        {Array.from({ length: goal.goals }).map((_, i) => (
                          <img src='/ball.png' alt='Soccer Ball' className='inline-block w-3 h-3' />
                        ))}
                      </div>
                    ))}
                </td>
                <td></td>
                <td className='px-6 text-xs flex flex-col items-start'>
                {goals.filter((goal) => goal.team === 'away' && goal.match_id - 1 === i && goal.goals > 0)
                    .map((goal) => (
                      <div>
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
    </main>
  )
}

export default Matches;