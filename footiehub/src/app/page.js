'use client';

import { useState, useEffect } from 'react';

const Home = () => {
  const [stats, setStats] = useState({
    goals: [],
    assists: [],
    winPercentage: [],
    value: []
  });

  //await setupDB();
  useEffect(() => {
    const getData = async () => {
      const res = await fetch('http://localhost:3000/api/playerStats');
      const data = await res.json();
      setStats(data);
    };

    getData();
  }, []);

  return (
    <main className='flex-1 p-6'>
      <div className=''>
        <h2 className='text-2xl font-semibold mb-4 text-center'>Race for the Balon D'or</h2>
        <div className='flex justify-center gap-32 mt-8'>
          {stats.value.slice(0, 3).map((player) => (
            <div key={player.id} className='w-1/5 rounded-lg border border-gray-200 p-4'>
              <h3 className='text-xl font-semibold text-center'>{player.name}</h3>
              <p className='text-md mb-2'>
                <span className='inline-block text-left w-1/2'>Goals: </span>
                <span className='inline-block text-right w-1/2'>{stats.goals.find((p => p.id === player.id)).goals}</span>
              </p>
              <p className='text-md mb-2'>
                <span className='inline-block text-left w-1/2'>Assists: </span>
                <span className='inline-block text-right w-1/2'> {stats.assists.find((p => p.id === player.id)).assists}</span>
              </p>
              <p className='text-md mb-2'>
                <span className='inline-block text-left w-1/2'>Win %: </span>
                <span className='inline-block text-right w-1/2'>{parseFloat(stats.winPercentage.find((p => p.id === player.id)).wins).toFixed(2)}%</span>
              </p>
              <p className='text-md mb-2'>
                <span className='inline-block text-left w-1/2'>Value: </span>
                <span className='inline-block text-right w-1/2'>${Intl.NumberFormat().format(player.value)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

<div className='mt-8'>
      <h2 className='text-2xl font-semibold mb-4 text-center'>Leaders</h2>
      <div className='flex justify-evenly'>
        {['goals', 'assists', 'winPercentage'].map((stat) => (
          <table className='table-auto w-1/5 rounded-lg border border-gray-200 border-separate'>
            <thead>
              <tr>
                <th colSpan={2} className='text-center'>{stat === 'winPercentage' ? 'Win Percentage' : stat.charAt(0).toUpperCase() + stat.slice(1)}</th>
              </tr>
            </thead>
            <tbody>
              {stats[stat].slice(0, 5).map((player, i) => (
                <tr key={i} className='text-center'>
                  <td className='px-6 text-left'>{player.name}</td>
                  <td className='px-6 text-right'>
                    {stat === 'winPercentage' ? `${parseFloat(player.wins).toFixed(2)}%` : player[stat] ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
      </div>
    </main>
  )
}

export default Home;