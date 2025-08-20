'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/20/solid';
import LineChart from '../components/charts/LineChart';
import Card from '@/app/components/ui/Card';

const Display = ({ allPlayers, allStats, firstPlayerId, secondPlayerId, thirdPlayerId, allChanges }) => {
  const [players, setPlayers] = useState([firstPlayerId, secondPlayerId, thirdPlayerId]);

  const maxCompares = 3;

  const handlePlayerChange = async (e, player) => {
    const id = parseInt(e.target.value);
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[player] = id;
      return newPlayers;
    })
  };

  const addPlayer = () => {
    if (players.length < maxCompares) {
      const player = allPlayers.find(player => !players.includes(player.id));
      setPlayers(prevPlayers => [...prevPlayers, player.id]);
    }
  };

  const removePlayer = (index) => {
    setPlayers(prevPlayers => prevPlayers.filter((_, i) => i !== index));
  };

  const getMaxStat = (stat) => {
    let max = -Infinity;
    players.forEach(id => {
      const stats = allStats[id];
      if (!stats) {
        return;
      }
      if (stat === 'win_percentage') {
        const winPercentage = stats.games > 0 ? stats.wins / stats.games * 100 : 0;
        max = Math.max(max, winPercentage);
      }
      else {
        max = Math.max(max, stats[stat]);
      }
    });
    return max;
  };

  const tableRow = (statName, stat) => {
    return (
      <tr>
        <td className='px-2 py-2 text-sm font-bold text-foreground text-left'>{statName}</td>
        {players.map(id => {
          const stats = allStats[id];
          if (!stats) {
            return (
              <td key={id} className='px-2 py-2 text-sm font-medium text-foreground text-center'>N/A</td>
            );
          }
          const max = getMaxStat(stat);
          let statValue = stats[stat];
          let isMax = false;
          if (statName === 'Value') {
            isMax = statValue === max;
            statValue = `$${Intl.NumberFormat().format(statValue)}`;
          }
          else if (statName === 'Win Percentage') {
            statValue = stats.games > 0 ? stats.wins / stats.games * 100 : 0;
            isMax = statValue.toFixed(2) === max.toFixed(2);
            statValue = `${statValue.toFixed(2)}%`;
          }
          else {
            isMax = statValue === max;
          }
          return (
            <td key={id} className={`px-2 py-2 text-sm font-medium text-foreground text-center  ${isMax ? 'bg-green-100 rounded-lg font-bold' : ''}`}>{statValue}</td>
          );
        })}
      </tr>
    );
  };

  const datasets = players.map(player => {
    const changes = allChanges[player] || [];
    const sortedTransferChanges = [...changes].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    let value = allPlayers[player - 1].value;
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
      label: allPlayers[player - 1].name,
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

  return (
    <main className='flex-1 p-6'>
      <h2 className='text-2xl font-bold text-foreground mb-6'>Compare</h2>
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Card className='flex flex-wrap justify-center items-center gap-4 p-4 mb-6'>
            {players.map((selectedPlayer, i) => {
              return (
                <div key={`player-${i}`} className='relative flex flex-col items-center gap-2'>
                  <select id={`player-${i}`} onChange={e => handlePlayerChange(e, i)} value={selectedPlayer}
                    className='p-2 bg-white rounded-lg shadow-md border border-gray-200'>
                    {allPlayers.filter(player => player.id === selectedPlayer || !players.includes(player.id)).map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                  {players.length > 2 &&
                    <button onClick={() => removePlayer(i)} className='text-danger-color p-1 absolute -top-2 -right-2 z-10'>
                      <XCircleIcon className='h-5 w-5'></XCircleIcon>
                    </button>
                  }
                </div>
              );
            })}
            <button
              onClick={addPlayer}
              disabled={players.length >= maxCompares}
              className={`flex items-center block p-2 bg-white rounded-lg shadow-md border border-gray-200 
              ${players.length >= maxCompares
                  ? 'text-disable-text'
                  : 'text-foreground'}
            `}>
              <PlusCircleIcon className={`h-5 w-5 ${players.length >= maxCompares ? 'text-disable-text' : 'text-primary-accent'}`}></PlusCircleIcon>
              Add Player
            </button>
          </Card>
          <Card className='p-6'>
            <h3 className='text-lg font-bold text-foreground mb-6'>Stats</h3>
            <table className='table-auto mt-4 mx-auto'>
              <thead>
                <tr>
                  <th></th>
                  {players.map(id => {
                    const playerStats = allStats[id];
                    return (
                      <th key={id} className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>
                        <Link href={`/players/${id}`}>{playerStats.name}</Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {tableRow('Value', 'value')}
                {tableRow('Games', 'games')}
                {tableRow('Wins', 'wins')}
                {tableRow('Win Percentage', 'win_percentage')}
                {tableRow('Goals', 'goals')}
                {tableRow('Assists', 'assists')}
                {tableRow('Clean Sheets', 'clean_sheets')}
              </tbody>
            </table>
          </Card>
        </div>
        <div>
          <Card className='p-6'>
            <h3 className='text-lg font-bold text-foreground mb-6'>Market Value Over Time</h3>
            <div className='h-96'>
              <LineChart key={players.join('-')} data={transferData} options={transferOptions} />
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Display;