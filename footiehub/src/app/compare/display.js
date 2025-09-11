'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/20/solid';
import LineChart from '../components/charts/LineChart';
import Card from '@/app/components/ui/Card';

const Display = ({ players, stats }) => {
  const [comparePlayers, setComparePlayers] = useState(players.slice(0, 3));
  const [compareStats, setCompareStats] = useState(stats.slice(0, 3));

  const maxCompares = 3;

  const handlePlayerChange = async (e, i) => {
    const id = parseInt(e.target.value);
    setComparePlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[i] = players.find(player => player.id === id);
      return newPlayers;
    });
    setCompareStats(prevStats => {
      const newStats = [...prevStats];
      newStats[i] = stats.find(player => player.id === id);
      return newStats;
    });
  };

  const handleYearChange = async (e, i) => {
    const year = e.target.value === 'All Time' ? e.target.value : Number(e.target.value);
    const comparePlayer = { ...comparePlayers[i], compareYear: year };
    setComparePlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[i] = comparePlayer;
      return newPlayers;
    });
    setCompareStats(prevStats => {
      const newStats = [...prevStats];
      if (year === 'All Time') {
        newStats[i] = stats.find(player => player.id === comparePlayer.id);
      }
      else {
        newStats[i] = stats.find(player => player.id === comparePlayer.id && player.year === year);
      }
      return newStats;
    });
  };

  const addPlayer = () => {
    if (comparePlayers.length < maxCompares) {
      const player = players[0];
      const playerStats = stats[0];
      setComparePlayers(prevPlayers => [...prevPlayers, player]);
      setCompareStats(prevStats => [...prevStats, playerStats]);
    }
  };

  const removePlayer = (index) => {
    setComparePlayers(prevPlayers => prevPlayers.filter((_, i) => i !== index));
    setCompareStats(prevStats => prevStats.filter((_, i) => i !== index));
  };

  const getMaxStat = (stat) => {
    let max = -Infinity;
    compareStats.forEach(compareStat => {
      if (stat === 'win_percentage') {
        const winPercentage = compareStat.games > 0 ? compareStat.wins / compareStat.games * 100 : 0;
        max = Math.max(max, winPercentage);
      }
      else {
        max = Math.max(max, compareStat[stat]);
      }
    });
    return max;
  };

  const tableRow = (statName, stat) => {
    return (
      <tr>
        <td className='px-2 py-2 text-sm font-bold text-foreground text-left'>{statName}</td>
        {compareStats.map((compareStat, i) => {
          const max = getMaxStat(stat);
          let statValue = compareStat[stat];
          let isMax = false;
          if (statName === 'Value') {
            isMax = statValue === max;
            statValue = `$${Intl.NumberFormat().format(statValue)}`;
          }
          else if (statName === 'Win Percentage') {
            statValue = compareStat.games > 0 ? compareStat.wins / compareStat.games * 100 : 0;
            isMax = statValue.toFixed(2) === max.toFixed(2);
            statValue = `${statValue.toFixed(2)}%`;
          }
          else {
            isMax = statValue === max;
          }
          return (
            <td key={`${statName}-${i}`} className={`px-2 py-2 text-sm font-medium text-foreground text-center  ${isMax ? 'bg-green-100 rounded-lg font-bold' : ''}`}>{statValue}</td>
          );
        })}
      </tr>
    );
  };

  const datasets = compareStats.map(stats => {
    const sortedTransferChanges = stats.transferChanges.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    let value = stats.value;
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
      label: stats.name,
      data: points,
      tension: 0.1,
      fill: false
    };
  });

  const transferData = {
    datasets: datasets
  };

  const transferOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'nearest',
        intersect: false
      },
      colors: {
        forceOverride: true
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM'
          }
        },
        ticks: {
          autoSkip: true
        },
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  };

  return (
    <main className='flex-1 p-6'>
      <h2 className='text-2xl font-bold text-foreground mb-6'>Compare</h2>
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Card className='flex flex-wrap justify-center items-center gap-4 p-4 mb-6'>
            {comparePlayers.map((selectedPlayer, i) => (
              <div key={`${i}-name`} className='relative flex flex-col items-center gap-2'>
                <select id={selectedPlayer.id} onChange={e => handlePlayerChange(e, i)} value={selectedPlayer.id}
                  className='p-2 bg-white rounded-lg shadow-md border border-gray-200'>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
                <select id={`${i}-years`} onChange={e => handleYearChange(e, i)} value={selectedPlayer.compareYear}
                  className='p-2 bg-white rounded-lg shadow-md border border-gray-200'>
                  {players.filter(player => player.id === selectedPlayer.id).map(player => (
                    player.years.map(year => (
                      <option key={`${player.id}-${year}`} value={year}>
                        {year}
                      </option>
                    ))
                  ))}
                </select>
                {comparePlayers.length > 2 &&
                  <button onClick={() => removePlayer(i)} className='text-danger-color p-1 absolute -top-2 -right-2 z-10'>
                    <XCircleIcon className='h-5 w-5'></XCircleIcon>
                  </button>
                }
              </div>
            ))}
            <button
              onClick={addPlayer}
              disabled={comparePlayers.length >= maxCompares}
              className={`flex items-center block p-2 bg-white rounded-lg shadow-md border border-gray-200 
              ${comparePlayers.length >= maxCompares
                  ? 'text-disable-text'
                  : 'text-foreground'}
            `}>
              <PlusCircleIcon className={`h-5 w-5 ${comparePlayers.length >= maxCompares ? 'text-disable-text' : 'text-primary-accent'}`}></PlusCircleIcon>
              Add Player
            </button>
          </Card>
          <Card className='p-6'>
            <h3 className='text-lg font-bold text-foreground mb-6'>Stats</h3>
            <table className='table-auto mt-4 mx-auto'>
              <thead>
                <tr>
                  <th></th>
                  {compareStats.map((stat, i) => {
                    return (
                      <th key={`${i}-${stat.year}`} className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>
                        <Link href={`/players/${stat.id}`}>{stat.name}</Link>
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
              <LineChart data={transferData} options={transferOptions} />
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Display;