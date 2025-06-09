'use client';

import Link from 'next/link';
import { useState } from 'react';

const Display = ({ allPlayers, allStats, firstPlayerId, secondPlayerId }) => {
  const [players, setPlayers] = useState([firstPlayerId, secondPlayerId]);

  const maxCompares = 8;

  const handlePlayerChange = async (e, player) => {
    const id = e.target.value;
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[player] = parseInt(id);
      return newPlayers;
    })
  };

  const addPlayer = () => {
    if (players.length < maxCompares) {
      const player = allPlayers.find(player => !players.includes(player.id));
      setPlayers(prevPlayers => [...prevPlayers, player.id]);
    }
  };

  const removePlayer = () => {
    setPlayers(prevPlayers => prevPlayers.slice(0, prevPlayers.length - 1));
  };

  const getMaxStat = (stat) => {
    let max = -Infinity;
    players.forEach(id => {
      const stats = allStats[id];
      if (stat === 'win_percentage') {
        const winPercentage = stats.wins / stats.games * 100;
        max = Math.max(max, winPercentage); //check for NaN?
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
        <td>{statName}</td>
        {players.map(id => {
          const stats = allStats[id];
          const max = getMaxStat(stat);
          let isMax = stats[stat] === max;
          if (statName === 'Value') {
            return (
              <td className={`text-center ${isMax ? 'bg-lime-300' : ''}`}>${Intl.NumberFormat().format(stats.value)}</td>
            );
          }
          else if (statName === 'Win Percentage') {
            isMax = stats[stat].toFixed(2) === max.toFixed(2);
            return (
              <td className={`text-center ${isMax ? 'bg-lime-300' : ''}`}>{stats.win_percentage.toFixed(2)}%</td>
            );
          }
          else {
            return (
              <td className={`text-center ${isMax ? 'bg-lime-300' : ''}`}>{stats[stat]}</td>
            );
          }
        })}
      </tr>
    );
  };

  return (
    <main className='flex-1 p-6'>
      <div className='flex flex-wrap'>
        {players.length < maxCompares && <button onClick={addPlayer}>Add Player</button>}
        {players.map((player, i) => (
          <div>
            <select onChange={e => handlePlayerChange(e, i)} value={player}>
              {allPlayers.filter(play => play.id === player || !players.includes(play.id)).map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        {players.length > 2 && <button onClick={removePlayer}>Remove Player</button>}
      </div>
      <table className='table-auto border-separate border-spacing-4'>
        <thead>
          <tr>
            <th></th>
            {players.map(id => {
              const playerStats = allStats[id];
              return (
                <th>
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
    </main>
  )
}

export default Display;