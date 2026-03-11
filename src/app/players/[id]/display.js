'use client';

import { useState } from 'react';
import DoughnutChart from '@/app/components/charts/DoughnutChart';
import LineChart from '@/app/components/charts/LineChart';
import Card from '@/app/components/ui/Card';
import { updatePlayerId } from '@/lib/actions/players';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

//set up data and options for doughnut chart
const doughnutChartConfig = (games, value, colour, title) => {
  const data = {
    datasets: [
      {
        data: games > 0 ? [value, games - value] : [0, 1],
        backgroundColor: [colour, 'rgb(252, 252, 252)'],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 18
        }
      },
      centerText: {
        display: true,
        text: `${value}`,
        font: {
          size: 24,
          weight: 'bold'
        },
        color: 'rgba(0, 0, 0, 0.6)'
      },
      tooltip: {
        enabled: false
      }
    },
  };

  return { data, options };
}

//client component to display player stats and transfer changes
const Display = ({ transferChanges, stats, player }) => {

  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

  const formatDate = (date) => {
    const d = new Date(date.replace(/-/g, '\/'));
    return new Intl.DateTimeFormat('en-US', dateOptions).format(d);
  };

  //state to show value and date on hover
  const [marketValue, setMarketValue] = useState(`\$${Intl.NumberFormat().format(stats[0].value)}`);
  const [marketDate, setMarketDate] = useState(`As of ${formatDate(transferChanges[transferChanges.length - 1].date)}`);

  //state variables for editing player name and join date
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);
  const [editJoinDate, setEditJoinDate] = useState(player.joinedAt);

  const [selectedYear, setSelectedYear] = useState(stats[0].year);
  const yearStats = stats.find(stat => stat.year === selectedYear);

  //donut charts for game stats
  const gamesChart = doughnutChartConfig(yearStats.games, yearStats.games, 'rgb(31, 41, 55)', 'Games');
  const winsChart = doughnutChartConfig(yearStats.games, yearStats.wins, 'rgb(22, 151, 87)', 'Wins');
  const drawsChart = doughnutChartConfig(yearStats.games, yearStats.draws, 'rgb(132, 151, 22)', 'Draws');
  const lossesChart = doughnutChartConfig(yearStats.games, yearStats.losses, 'rgb(151, 37, 22)', 'Losses');

  //running total of player value
  let sum = 0;

  //set up data and options for transfer chart
  const transferData = {
    datasets: [
      {
        data: transferChanges.map(change => {
          sum += change.value_change;
          return {
            x: new Date(change.date).toISOString().split('T')[0],
            y: sum
          };
        }),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const transferOptions = {
    responsive: true,
    hoverRadius: 20,
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
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
          display: false
        },
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        display: false,
      },
    },
    //for when a point on the transfer chart is hovered
    onHover: (e, elements, chart) => {
      const lastDate = transferChanges[transferChanges.length - 1].date;

      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const hoveredPoint = chart.data.datasets[datasetIndex].data[dataIndex];

        const date = hoveredPoint.x;
        const value = hoveredPoint.y;

        if (date === lastDate && value === stats[0].value) {
          setMarketDate(`As of ${formatDate(date)}`);
        }
        else {
          setMarketDate(formatDate(date));
        }

        setMarketValue(`\$${Intl.NumberFormat().format(value)}`);
      }
      else {
        setMarketValue(`\$${Intl.NumberFormat().format(stats[0].value)}`);
        setMarketDate(`As of ${formatDate(lastDate)}`);
      }
    }
  };

  //handle when user changes year for stats
  const handleYearChange = (e) => {
    const year = e.target.value === 'All Time' ? e.target.value : Number(e.target.value);
    setSelectedYear(year);
  };

  const handleEdit = async () => {
    try {
      await updatePlayerId(player.id, editName, editJoinDate);
      setIsEditing(false);
    } catch (e) {
      alert('player was not updated: ', e)
    }
  };

  return (
    <main className='flex-1 p-6'>
      <div className='flex gap-8 items-center'>
        <div>
          <h2 className='text-2xl font-bold text-foreground mb-1'>{player.name}</h2>
          <h3 className='text-foreground mb-6'>Joined: {new Date(player.joinedAt.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</h3>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className='flex items-center block p-2 bg-white rounded-lg shadow-md border border-gray-200'>
          <PencilSquareIcon className='h-5 w-5 '></PencilSquareIcon>
        </button>
      </div>
      <div className='grid grid-cols-2 gap-6 items-start'>
        <Card className='p-6'>
          <div className='flex justify-between mb-4'>
            <h3 className='text-lg font-bold text-foreground'>Statistics</h3>
            <div>
              <select value={selectedYear} onChange={handleYearChange} className='w-full p-2 border border-gray-300 rounded-md text-foreground bg-white'>
                {stats.map(stat => (
                  <option key={`${stat.id}-${stat.year}`} value={stat.year}>{stat.year}</option>
                ))}
              </select>
            </div>
          </div>
          <table className='table-auto mb-8'>
            <thead>
              <tr>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>Games</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>Goals</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>Assists</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>Goals/Game</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>Assists/Game</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>Win Percentage</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase'>Clean Sheets</th>
              </tr>
            </thead>
            <tbody>
              <tr key={player.name}>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{yearStats.games}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{yearStats.goals}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{yearStats.assists}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{yearStats.games > 0 ? (yearStats.goals / yearStats.games).toFixed(2) : 0}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{yearStats.games > 0 ? (yearStats.assists / yearStats.games).toFixed(2) : 0}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{yearStats.games > 0 ? (yearStats.wins / yearStats.games * 100).toFixed(2) : 0}%</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{yearStats.clean_sheets}</td>
              </tr>
            </tbody>
          </table>
          {yearStats.games > 0 ? (
            <div className='flex mb-14 justify-between'>
              <div className='w-24 h-24'><DoughnutChart data={gamesChart.data} options={gamesChart.options} /></div>
              <div className='w-24 h-24'><DoughnutChart data={winsChart.data} options={winsChart.options} /></div>
              <div className='w-24 h-24'><DoughnutChart data={drawsChart.data} options={drawsChart.options} /></div>
              <div className='w-24 h-24'><DoughnutChart data={lossesChart.data} options={lossesChart.options} /></div>
            </div>
          ) : (
            <div></div>
          )}
        </Card>
        <Card className='p-6'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-bold text-foreground'>Market Value:</h3>
            <h3 className='text-lg font-bold text-foreground'>{marketValue}</h3>
          </div>
          <h3 className='text-sm font-bold text-foreground text-right'>{marketDate}</h3>
          <LineChart data={transferData} options={transferOptions} />
          <p className='text-xs text-gray-500'>Hover over points to see past market values</p>
        </Card>
      </div>

      {isEditing && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <Card className='p-6 w-96 shadow-xl'>
            <h3 className='text-lg font-bold text-foreground mb-4'>Edit Player</h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>Name</label>
                <input type='text' id='name' value={editName} onChange={e => setEditName(e.target.value)} className='w-full p-2 border border-gray-300 rounded-md text-foreground bg-white' required autoComplete='off' />
              </div>
              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>Joined Date</label>
                <input type='date' id='joinDate' value={editJoinDate} onChange={e => setEditJoinDate(e.target.value)} className='w-full p-2 border border-gray-300 rounded-md text-foreground bg-white' required autoComplete='off' />
              </div>
              <div className='flex justify-end gap-2 mt-6'>
                <button onClick={() => setIsEditing(false)} className='py-2 px-4 text-foreground'>Cancel</button>
                <button type='button' onClick={handleEdit} className='py-2 px-4 bg-primary-accent text-panel-foreground font-semibold rounded-md shadow-sm'>Update Player</button>
              </div>
            </div>
          </Card>
        </div>
      )}

    </main>
  )
}

export default Display;