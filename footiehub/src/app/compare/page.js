'use client';

import { useState, useEffect } from 'react';

export async function getPlayers() {
  const res = await fetch('http://localhost:3000/api/players');
  const data = await res.json();
  return data;
}

export default function Compare() {

  const [player1Id, setPlayer1Id] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);
  const [player1Stats, setPlayer1Stats] = useState({});
  const [player2Stats, setPlayer2Stats] = useState({});
  const [players, setPlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState({});


  useEffect(() => {
    const getPlayerNames = async () => {
      const playerNames = await getPlayers();
      setPlayers(playerNames);

      if (playerNames.length > 1) {
        setPlayer1Id(playerNames[0].id);
        setPlayer2Id(playerNames[1].id);
      }

    }
    getPlayerNames();
  }, []);

  useEffect(() => {
    const getStats = async () => {
      if (player1Id && player2Id) {
        try {
          const res1 = await fetch(`http://localhost:3000/api/players/${player1Id}`);
          const data1 = await res1.json();
          setPlayer1Stats(data1.stats[0]);
          console.log(res1);
          const res2 = await fetch(`http://localhost:3000/api/players/${player2Id}`);
          const data2 = await res2.json();
          setPlayer2Stats(data2.stats[0]);

          setPlayerStats(prevStats => ({ ...prevStats, [player1Id]: data1,  [player2Id]: data2}));
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    }
    getStats();
  }, [player1Id, player2Id]);

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
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => handlePlayerChange(e, 'player2')} value={player2Id}>
          {players.map(player => (
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
            <td className={`text-center ${player1Stats.wins/player1Stats.games*100 >= player2Stats.wins/player2Stats.games*100 ? 'bg-lime-300' : ''}`}>{parseFloat(player1Stats.wins/player1Stats.games*100).toFixed(2)}%</td>
            <td className={`text-center ${player2Stats.wins/player2Stats.games*100 >= player1Stats.wins/player1Stats.games*100 ? 'bg-lime-300' : ''}`}>{parseFloat(player2Stats.wins/player2Stats.games*100).toFixed(2)}%</td>
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

      {/*add a line graph that shows the value change between two players?*/}

    </main>
  )
}
