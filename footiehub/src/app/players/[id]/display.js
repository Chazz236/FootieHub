'use client';

import { useState } from 'react';
import DoughnutChart from '@/app/components/charts/DoughnutChart';
import LineChart from '@/app/components/charts/LineChart';
import Card from '@/app/components/ui/Card'

const doughnutChartConfig = (games, value, colour, title) => {
  const data = {
    datasets: [
      {
        data: [value, games - value],
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


const Display = ({ stats, transferChanges }) => {

  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

  const [marketValue, setMarketValue] = useState(`\$${Intl.NumberFormat().format(stats[0].value)}`);
  const [marketDate, setMarketDate] = useState(`As of ${new Date(transferChanges[transferChanges.length - 1].date).toLocaleDateString('en-US', dateOptions)}`)

  const gamesChart = doughnutChartConfig(stats[0].games, stats[0].games, 'rgb(31, 41, 55)', 'Games');
  const winsChart = doughnutChartConfig(stats[0].games, stats[0].wins, 'rgb(22, 151, 87)', 'Wins');
  const drawsChart = doughnutChartConfig(stats[0].games, stats[0].draws, 'rgb(132, 151, 22)', 'Draws');
  const lossesChart = doughnutChartConfig(stats[0].games, stats[0].losses, 'rgb(151, 37, 22)', 'Losses');

  const sortedTransferChanges = [...transferChanges].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  })
  let value = stats[0].value;
  const values = [];

  const transferData = {
    datasets: [
      {
        data: sortedTransferChanges.map(change => {
          values.unshift(value);
          value -= change.value_change;
          return {
            x: new Date(change.date),
            y: values[0]
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
    onHover: (e, elements, chart) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const hoveredPoint = chart.data.datasets[datasetIndex].data[dataIndex];

        const date = new Date(hoveredPoint.x);
        const value = hoveredPoint.y;

        console.log(date);
        console.log(transferChanges[transferChanges.length - 1].date)

        if (date.getTime() === transferChanges[transferChanges.length - 1].date.getTime() && value === stats[0].value ) {
          setMarketDate(`As of ${new Date(transferChanges[transferChanges.length - 1].date).toLocaleDateString('en-US', dateOptions)}`);
        }
        else {
          setMarketDate(`${date.toLocaleDateString('en-US', dateOptions)}`);
        }

        setMarketValue(`\$${Intl.NumberFormat().format(value)}`);
      } else {
        setMarketValue(`\$${Intl.NumberFormat().format(stats[0].value)}`);
        setMarketDate(`As of ${new Date(transferChanges[transferChanges.length - 1].date).toLocaleDateString('en-US', dateOptions)}`);
      }
    }
  };

  return (
    <main className='flex-1 p-6'>
      <h1 className='text-2xl font-bold text-foreground mb-6'>{stats[0].name}</h1>
      <div className='grid grid-cols-2 gap-6 items-start'>
        <Card>
          <div className='flex justify-between mb-4 '>
            <h2 className='text-lg font-bold text-foreground'>Statistics</h2>
          </div>
          <table className='table-auto mb-8'>
            <thead>
              <tr>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/6'>Games</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/6'>Goals</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/6'>Assists</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/6'>Goals/Game</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/6'>Assists/Game</th>
                <th className='px-2 py-2 text-center text-xs font-bold text-foreground uppercase w-1/6'>Win Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr key={stats.name}>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{stats[0].games}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{stats[0].goals}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{stats[0].assists}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{(stats[0].goals / stats[0].games).toFixed(2)}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{(stats[0].assists / stats[0].games).toFixed(2)}</td>
                <td className='px-2 py-2 text-sm font-medium text-foreground text-center'>{stats[0].win_percentage.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
          {stats && stats.length > 0 ? (
            <div className='flex w-32 mb-6'>
              <div className='w-32 h-32'><DoughnutChart data={gamesChart.data} options={gamesChart.options} /></div>
              <div className='w-32 h-32'><DoughnutChart data={winsChart.data} options={winsChart.options} /></div>
              <div className='w-32 h-32'><DoughnutChart data={drawsChart.data} options={drawsChart.options} /></div>
              <div className='w-32 h-32'><DoughnutChart data={lossesChart.data} options={lossesChart.options} /></div>
            </div>
          ) : (
            <div></div>
          )}
        </Card>
        <Card>
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-bold text-foreground'>Market Value:</h2>
            <h2 className='text-lg font-bold text-foreground'>{marketValue}</h2>
          </div>
          <h3 className='text-sm font-bold text-foreground text-right'>{marketDate}</h3>
          <LineChart data={transferData} options={transferOptions} />
        </Card>
      </div>
    </main>
  )
}

export default Display;