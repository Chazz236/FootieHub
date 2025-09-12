'use client';

import { useState } from 'react';
import DoughnutChart from '@/app/components/charts/DoughnutChart';
import LineChart from '@/app/components/charts/LineChart';
import Card from '@/app/components/ui/Card'

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

const Display = ({ transferChanges, stats }) => {

  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

  // const [marketValue, setMarketValue] = useState(`\$${Intl.NumberFormat().format(stats[0].value)}`);
  // const [marketDate, setMarketDate] = useState(`As of ${new Date(transferChanges[transferChanges.length - 1].date).toLocaleDateString('en-US', dateOptions)}`);

  const [selectedYear, setSelectedYear] = useState(stats[0].year);
  const yearStats = stats.find(stat => stat.year === selectedYear);

  const gamesChart = doughnutChartConfig(yearStats.games, yearStats.games, 'rgb(31, 41, 55)', 'Games');
  const winsChart = doughnutChartConfig(yearStats.games, yearStats.wins, 'rgb(22, 151, 87)', 'Wins');
  const drawsChart = doughnutChartConfig(yearStats.games, yearStats.draws, 'rgb(132, 151, 22)', 'Draws');
  const lossesChart = doughnutChartConfig(yearStats.games, yearStats.losses, 'rgb(151, 37, 22)', 'Losses');

  // const sortedTransferChanges = [...transferChanges].sort((a, b) => {
  //   return new Date(b.date) - new Date(a.date);
  // })
  // let value1 = yearStats.value;
  // const values = [];

  // const transferData = {
  //   datasets: [
  //     {
  //       data: sortedTransferChanges.map(change => {
  //         values.unshift(value1);
  //         value1 -= change.value_change;
  //         return {
  //           x: new Date(change.date),
  //           y: values[0]
  //         };
  //       }),
  //       borderColor: 'rgb(75, 192, 192)',
  //       tension: 0.1,
  //       fill: false
  //     }
  //   ]
  // };

  // const transferOptions = {
  //   responsive: true,
  //   hoverRadius: 20,
  //   plugins: {
  //     tooltip: {
  //       enabled: false
  //     },
  //     legend: {
  //       display: false
  //     },
  //   },
  //   scales: {
  //     x: {
  //       type: 'time',
  //       time: {
  //         unit: 'month',
  //         displayFormats: {
  //           month: 'MMM',
  //         },
  //       },
  //       ticks: {
  //         display: false
  //       },
  //       grid: {
  //         display: false
  //       },
  //       border: {
  //         display: false
  //       }
  //     },
  //     y: {
  //       display: false,
  //     },
  //   },
  //   onHover: (e, elements, chart) => {
  //     if (elements.length > 0) {
  //       const dataIndex = elements[0].index;
  //       const datasetIndex = elements[0].datasetIndex;
  //       const hoveredPoint = chart.data.datasets[datasetIndex].data[dataIndex];

  //       const date = new Date(hoveredPoint.x);
  //       const value = hoveredPoint.y;
  //       const lastDate = new Date(transferChanges[transferChanges.length - 1].date);

  //       if (date.getTime() === lastDate.getTime() && value === value) {
  //         setMarketDate(`As of ${lastDate.toLocaleDateString('en-US', dateOptions)}`);
  //       }
  //       else {
  //         setMarketDate(`${date.toLocaleDateString('en-US', dateOptions)}`);
  //       }

  //       setMarketValue(`\$${Intl.NumberFormat().format(value)}`);
  //     } else {
  //       setMarketValue(`\$${Intl.NumberFormat().format(value)}`);
  //       setMarketDate(`As of ${new Date(transferChanges[transferChanges.length - 1].date).toLocaleDateString('en-US', dateOptions)}`);
  //     }
  //   }
  // };

  const handleYearChange = (e) => {
    const year = e.target.value === 'All Time' ? e.target.value : Number(e.target.value);
    setSelectedYear(year);
  };

  return (
    <main className='flex-1 p-6'>
      <h2 className='text-2xl font-bold text-foreground mb-6'>{stats[0].name}</h2>
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
              <tr key={stats[0].name}>
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
        {/* <Card className='p-6'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-bold text-foreground'>Market Value:</h3>
            <h3 className='text-lg font-bold text-foreground'>{marketValue}</h3>
          </div>
          <h3 className='text-sm font-bold text-foreground text-right'>{marketDate}</h3>
          <LineChart data={transferData} options={transferOptions} />
          <p className='text-xs text-gray-500'>Hover over points to see past market values</p>
        </Card> */}
      </div>
    </main>
  )
}

export default Display;