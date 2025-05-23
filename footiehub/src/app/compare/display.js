'use client';

import { useState } from 'react';

const Display = ({ allPlayers, allStats, firstPlayerId, secondPlayerId }) => {
  const [player1Id, setPlayer1Id] = useState(firstPlayerId);
  const [player2Id, setPlayer2Id] = useState(secondPlayerId);

  const player1Stats = allStats[player1Id];
  const player2Stats = allStats[player2Id];

  const handlePlayerChange = async (e, player) => {
    const id = e.target.value;
    if (player === 'player1') {
      setPlayer1Id(id);
    }
    else if (player === 'player2') {
      setPlayer2Id(id);
    }
  };

  return (
    <main className='flex-1 p-6'>
      <div>
        <select onChange={(e) => handlePlayerChange(e, 'player1')} value={player1Id}>
          {allPlayers.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => handlePlayerChange(e, 'player2')} value={player2Id}>
          {allPlayers.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      <table className='table-auto border-separate border-spacing-4'>
        <thead>
          <tr>
            <th></th>
            <th>{player1Stats.name}</th>
            <th>{player2Stats.name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Value</td>
            <td className={`text-center ${player1Stats.value >= player2Stats.value ? 'bg-lime-300' : ''}`}>${Intl.NumberFormat().format(player1Stats.value)}</td>
            <td className={`text-center ${player2Stats.value >= player1Stats.value ? 'bg-lime-300' : ''}`}>${Intl.NumberFormat().format(player2Stats.value)}</td>
          </tr>
          <tr>
            <td>Games</td>
            <td className={`text-center ${player1Stats.games >= player2Stats.games ? 'bg-lime-300' : ''}`}>{player1Stats.games}</td>
            <td className={`text-center ${player2Stats.games >= player1Stats.games ? 'bg-lime-300' : ''}`}>{player2Stats.games}</td>
          </tr>
          <tr>
            <td>Wins</td>
            <td className={`text-center ${player1Stats.wins >= player2Stats.wins ? 'bg-lime-300' : ''}`}>{player1Stats.wins}</td>
            <td className={`text-center ${player2Stats.wins >= player1Stats.wins ? 'bg-lime-300' : ''}`}>{player2Stats.wins}</td>
          </tr>
          <tr>
            <td>Win Percentage</td>
            <td className={`text-center ${player1Stats.wins / player1Stats.games * 100 >= player2Stats.wins / player2Stats.games * 100 ? 'bg-lime-300' : ''}`}>{parseFloat(player1Stats.wins / player1Stats.games * 100).toFixed(2)}%</td>
            <td className={`text-center ${player2Stats.wins / player2Stats.games * 100 >= player1Stats.wins / player1Stats.games * 100 ? 'bg-lime-300' : ''}`}>{parseFloat(player2Stats.wins / player2Stats.games * 100).toFixed(2)}%</td>
          </tr>
          <tr>
            <td>Goals</td>
            <td className={`text-center ${player1Stats.goals >= player2Stats.goals ? 'bg-lime-300' : ''}`}>{player1Stats.goals}</td>
            <td className={`text-center ${player2Stats.goals >= player1Stats.goals ? 'bg-lime-300' : ''}`}>{player2Stats.goals}</td>
          </tr>
          <tr>
            <td>Assists</td>
            <td className={`text-center ${player1Stats.assists >= player2Stats.assists ? 'bg-lime-300' : ''}`}>{player1Stats.assists}</td>
            <td className={`text-center ${player2Stats.assists >= player1Stats.assists ? 'bg-lime-300' : ''}`}>{player2Stats.assists}</td>
          </tr>
          <tr>
            <td>Clean Sheets</td>
            <td className={`text-center ${player1Stats.clean_sheets >= player2Stats.clean_sheets ? 'bg-lime-300' : ''}`}>{player1Stats.clean_sheets}</td>
            <td className={`text-center ${player2Stats.clean_sheets >= player1Stats.clean_sheets ? 'bg-lime-300' : ''}`}>{player2Stats.clean_sheets}</td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}

export default Display;