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
  const [bestTeammateChartData, setBestTeammateChartData] = useState(null);
  const [bestTeammateChartOptions, setBestTeammateChartOptions] = useState(null);
  const [teammateGoalsAssistsChartData, setTeammateGoalsAssistsChartData] = useState(null);
  const [teammateGoalsAssistsChartOptions, setTeammateGoalsAssistsChartOptions] = useState(null);


  useEffect(() => {
    const getPlayerNames = async () => {
      const playerNames = await getPlayers();
      console.log(playerNames);
      setPlayers(playerNames);
      setPlayerId(playerNames[0].id)
      try {
        const res = await fetch(`/api/teammate?id=${playerNames[0].id}`);
        const data = await res.json();
        setStats(data.stats);
        // console.log(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    getPlayerNames();
  }, []);

  useEffect(() => {
    if (stats && stats.length > 0) {
      const bestTeammateData = stats.map(player => ({
        x: player.win_percentage,
        y: player.assists_received + player.assists_provided,
        label: player.name
      }));
      const bestTeammateValueData = {
        datasets: [
          {
            label: 'Teammates Performance',
            data: bestTeammateData,
            pointRadius: 5
          }
        ]
      };
      const bestTeammateValueOptions = {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
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
      };
      setBestTeammateChartData(bestTeammateValueData);
      setBestTeammateChartOptions(bestTeammateValueOptions);

      const teammateGoalsAssistsData = stats.map(player => ({
        x: player.assists_received,
        y: player.assists_provided,
        label: player.name
      }));

      const teammateGoalsAssistsValueData = {
        datasets: [
          {
            label: 'Teammate Goals and Assists',
            data: teammateGoalsAssistsData,
            pointRadius: 5
          }
        ]
      };

      const teammateGoalsAssistsValueOptions = {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return tooltipItem.raw.label + ': (' + tooltipItem.raw.x + ' Assists Received, ' + tooltipItem.raw.y + ' Assists Provided)';
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
            text: 'Teammate Assists Distribution',
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
              text: 'Assists Received'
            },
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Assists Provided'
            }
          }
        }
      }
      setTeammateGoalsAssistsChartData(teammateGoalsAssistsValueData);
      setTeammateGoalsAssistsChartOptions(teammateGoalsAssistsValueOptions);
    }
  }, [stats]);

  const handlePlayerChange = async (event) => {
    const id = event.target.value;
    setPlayerId(id);

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
      {players.length > 0 ?
        <select onChange={handlePlayerChange} value={playerId}>
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        :
        <div></div>
      }
      <div className='flex'>
        {bestTeammateChartData ? (
          <ScatterChart
            data={bestTeammateChartData}
            options={bestTeammateChartOptions}
          />
        ) : (
          <div></div>
        )}

        {teammateGoalsAssistsChartData ? (
          <ScatterChart
            data={teammateGoalsAssistsChartData}
            options={teammateGoalsAssistsChartOptions}
          />
        ) : (
          <div></div>
        )}
      </div>

    </div>
  );
}