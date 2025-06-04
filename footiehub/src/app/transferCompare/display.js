'use client'

import { useState } from 'react';
import LineChart from '../components/LineChart';

const Display = ({ allPlayers, firstPlayerId, allChanges }) => {

  const [players, setPlayers] = useState([firstPlayerId]);

  const datasets = players.map(player => {
    const sortedTransferChanges = [...allChanges[player]].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    let value = allPlayers[player-1].value;
    const values = [];
    const points = sortedTransferChanges.map(change => {
      values.unshift(value);
      value -= change.value_change;
      return {
        x: new Date(change.date),
        y: values[0]
      };
    });
    return {
      label: allPlayers[player-1].name,
      data: points,
      tension: 0.1,
      fill: false
    }
  });

const transferData = {
  datasets: datasets
};

  const transferOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Market Value Over Time',
        font: {
          size: 18,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM',
          },
        },
        ticks: {
          autoSkip: true,
          // maxTicksLimit: 10
        },
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  // console.log(allPlayers);
  // console.log(allChanges);
  // console.log(firstPlayerChanges);
  // console.log(firstPlayerId);

  const handleChange = (playerID) => {
    setPlayers((players) => {
      const newPlayers = players.includes(playerID) ? players.filter(id => id != playerID) : [...players, playerID];
      return newPlayers;
    });
  }

  return (
    <main className='flex-1 p-6'>
      <div className='h-96'>
        <LineChart key={players.join('-')} data={transferData} options={transferOptions} />
      </div>
      <div className='flex flex-wrap gap-6 justify-center'>
        {allPlayers.map(player => (
          <div key={player.id} className='space-x-1'>
            <input type='checkbox' id={player.id} checked={players.includes(player.id)} onChange={() => handleChange(player.id)} />
            <label>{player.name}</label>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Display;