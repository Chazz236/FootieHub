'use client';

import { useState, useEffect } from 'react';
import ScatterChart from '../components/charts/ScatterChart';
import Card from '@/app/components/ui/Card';

const Display = ({ allPlayers, teammateStats, firstPlayerId }) => {
  const [playerId, setPlayerId] = useState(firstPlayerId);
  const [stats, setStats] = useState(teammateStats[firstPlayerId]);
  const [bestTeammateChartData, setBestTeammateChartData] = useState(null);
  const [bestTeammateChartOptions, setBestTeammateChartOptions] = useState(null);
  const [teammateGoalsAssistsChartData, setTeammateGoalsAssistsChartData] = useState(null);
  const [teammateGoalsAssistsChartOptions, setTeammateGoalsAssistsChartOptions] = useState(null);
  const [sortBy, setSortBy] = useState('win percentage');

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
            pointRadius: 5,
            backgroundColor: '#4BC0C0',
            borderColor: '#2D8282'
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
            topLeft: '#fdf90033',
            topRight: '#84cc1633',
            bottomRight: '#fdf90033',
            bottomLeft: '#dc262633'
          },
          title: {
            display: true,
            text: 'Success With Teammates',
            font: {
              size: 18
            }
          }
        },
        layout: {
          padding: {
            left: 40
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
            pointRadius: 5,
            backgroundColor: '#4BC0C0',
            borderColor: '#2D8282'
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
            topLeft: '#fdf90033',
            topRight: '#84cc1633',
            bottomRight: '#fdf90033',
            bottomLeft: '#dc262633'
          },
          title: {
            display: true,
            text: 'Teammate Assists Distribution',
            font: {
              size: 18
            }
          }
        },
        layout: {
          padding: {
            left: 40
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
    else {
      setBestTeammateChartData(null);
      setBestTeammateChartOptions(null);
      setTeammateGoalsAssistsChartData(null);
      setTeammateGoalsAssistsChartOptions(null);
    }
  }, [stats]);

  const handlePlayerChange = async (event) => {
    const id = event.target.value;
    setPlayerId(id);
    setStats(teammateStats[id]);
  };

  const sortedTeammates = stats ?
    [...stats].sort((a, b) => {
      if (sortBy === 'win percentage') {
        const winPercentageDiff = b.win_percentage - a.win_percentage;
        if (winPercentageDiff === 0) {
          const aContributions = a.assists_provided + a.assists_received;
          const bContributions = b.assists_provided + b.assists_received;
          return bContributions - aContributions;
        }
        return winPercentageDiff;
      }
      else {
        const aContributions = a.assists_provided + a.assists_received;
        const bContributions = b.assists_provided + b.assists_received;
        const contributionsDiff = bContributions - aContributions;
        if (contributionsDiff === 0) {
          return b.win_percentage - a.win_percentage;
        }
        return contributionsDiff;
      }
    }) : [];

  return (
    <main className='flex-1 p-6'>
      <div className='grid grid-cols-2 gap-6'>
        <div className='flex flex-col gap-6'>
          <h2 className='text-2xl font-bold text-foreground'>Teammate Dynamics</h2>
          <Card className='w-full p-6'>
            <div className='mb-6'>
              <label className='block text-xs font-medium text-foreground mb-1'>Player</label>
              {allPlayers.length > 0 ? (
                <select onChange={handlePlayerChange} value={playerId} className='w-full p-2 border border-gray-300 rounded-md text-foreground bg-white'>
                  {allPlayers.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No Players To Select</p>
              )}
            </div>
          </Card>
          <Card className='p-6'>
            <div className='flex justify-between mb-4'>
              <h3 className='text-lg font-bold text-foreground'>Top Teammates</h3>
              <div>
                <label className='block text-xs font-medium text-foreground mb-1'>Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='w-full p-2 border border-gray-300 rounded-md text-foreground bg-white'>
                  <option value='win percentage'>Win Percentage</option>
                  <option value='contributions'>Goal Contributions</option>
                </select>
              </div>
            </div>
            {sortedTeammates.length > 0 ? (
              <table className='table-fixed'>
                <thead>
                  <tr>
                    <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'>Name</th>
                    <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'>{sortBy === 'win percentage' ? 'Win Percentage' : 'Total Contributions'}</th>
                    <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'>Assists Received</th>
                    <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'>Assists Provided</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeammates.slice(0, 5).map((player) => (
                    <tr key={player.id}>
                      <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{player.name}</td>
                      <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{sortBy === 'win percentage' ? `${parseFloat(player.win_percentage).toFixed(2)}%` : player.assists_received + player.assists_provided}</td>
                      <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{player.assists_received}</td>
                      <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{player.assists_provided}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className='mt-6'>Player has not played with database players</p>
            )}
          </Card>
        </div>
        <div className='flex flex-col gap-6 my-auto'>
          {bestTeammateChartData ? (
            <Card className='p-0'>
              <ScatterChart
                data={bestTeammateChartData}
                options={bestTeammateChartOptions}
              />
              <p className='text-xs text-gray-500 mx-auto'>Hover over points to view teammate data</p>
            </Card>
          ) : (
            <></>
          )}
          {teammateGoalsAssistsChartData ? (
            <Card className='p-0'>
              <ScatterChart
                data={teammateGoalsAssistsChartData}
                options={teammateGoalsAssistsChartOptions}
              />
              <p className='text-xs text-gray-500 mx-auto'>Hover over points to view teammate data</p>
            </Card>
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}

export default Display;