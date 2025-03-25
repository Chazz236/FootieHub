'use client';

import { useState, useEffect } from 'react';
import ScatterChart from '../components/ScatterChart';

export async function getPlayers() {
  const res = await fetch('http://localhost:3000/api/players');
  const data = await res.json();
  return data;
}

export default function Page() {
  const [playerId, setPlayerId] = useState(null);
  const [stats, setStats] = useState(null);
  const [players, setPlayers] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const getPlayerNames = async () => {
      const playerNames = await getPlayers();
      setPlayers(playerNames);
    }
    getPlayerNames();
  }, []);

  useEffect(() => {
    if (stats && stats.length > 0) {
      const data = stats.map(player => ({
        x: player.win_percentage,
        y: player.total_contributions,
        label: player.name
      }));
      const value = {
        data: {
          datasets: [
            {
              label: 'Teammates Performance',
              data: data,
              pointRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.raw.label + ': (' + tooltipItem.raw.x + '% Win, ' + tooltipItem.raw.y + ' Contributions)';
                }
              }
            },
            quadrants: {
              topLeft: 'rgba(195, 235, 18, 0.2)',
              topRight: 'rgba(54, 162, 235, 0.2)',
              bottomRight: 'rgba(195, 235, 18, 0.2)',
              bottomLeft: 'rgba(185, 21, 21, 0.2)'
            },
            title: {
              display: true,
              text: 'Best Teammates',
              font: {
                  size: 18
              }
          }
          },
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'Win Percentage'
              },
              min: 0,
              max: 100
            },
            y: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Goals + Assists'
              }
            }
          }
        }
      };
      setChartData(value);
    }
  }, [stats]);

  const handlePlayerChange = async (event) => {
    const id = event.target.value;
    setPlayerId(id);

    if (!id) return;

    try {
      const res = await fetch(`/api/teammate?id=${id}`);
      const data = await res.json();
      setStats(data.stats);
      // console.log(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <select onChange={handlePlayerChange} value={playerId}>
        <option value={null}>Select a Player</option>
        {players.map(player => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>

    
        {chartData ? (
          <ScatterChart value={chartData} />
        ) : (
          <div>Select a Player</div>
        )}
      
    </div>
  );
}
