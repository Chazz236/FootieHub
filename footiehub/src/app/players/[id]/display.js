'use client';

import DoughnutChart from '@/app/components/DoughnutChart';
import LineChart from '@/app/components/LineChart'
//bar chart to show past 5 games goals and assists, each one bar?

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
                label: 'Transfer Change',
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

    const yValues = transferData.datasets[0].data.map(item => item.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const transferOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Market Value Over Time',
                font: {
                    size: 18,
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
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
                    autoSkip: true,
                    // maxTicksLimit: 10
                },
                title: {
                    display: true,
                    text: 'Month',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
                min: Math.round(minY * 1.1),
                max: Math.round(maxY * 1.1)
            },
        },
    };

    return (
        <main className='flex-1 p-6'>
            <div>
                <h1 className='text-4xl font-bold text-gray-900 mt-4 mb-2'>{stats[0].name}</h1>
            </div>
            <div>
                <h1 className='text-4xl font-bold text-gray-900 mt-4 mb-2'>${Intl.NumberFormat().format(stats[0].value)}</h1>
            </div>
            <div>
                <table className=''>
                    <thead>
                        <tr>
                            <td className='px-6'>Year</td>
                            <td className='px-6'>Games</td>
                            <td className='px-6'>Goals</td>
                            <td className='px-6'>Assists</td>
                            <td className='px-6'>Goals/Game</td>
                            <td className='px-6'>Assist/Game</td>
                            <td className='px-6'>Win Percentage</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='px-6'>2025</td>
                            <td className='px-6'>{stats[0].games}</td>
                            <td className='px-6'>{stats[0].goals}</td>
                            <td className='px-6'>{stats[0].assists}</td>
                            <td className='px-6'>{(stats[0].goals / stats[0].games).toFixed(2)}</td>
                            <td className='px-6'>{(stats[0].assists / stats[0].games).toFixed(2)}</td>
                            <td className='px-6'>{((stats[0].wins / stats[0].games) * 100).toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {stats && stats.length > 0 ? (
                <div className='flex w-32'>
                    <div className='w-32 h-32'><DoughnutChart data={gamesChart.data} options={gamesChart.options} /></div>
                    <div className='w-32 h-32'><DoughnutChart data={winsChart.data} options={winsChart.options} /></div>
                    <div className='w-32 h-32'><DoughnutChart data={drawsChart.data} options={drawsChart.options} /></div>
                    <div className='w-32 h-32'><DoughnutChart data={lossesChart.data} options={lossesChart.options} /></div>
                </div>
            ) : (
                <div></div> //could put a loading thing?
            )}
            <div>
                <LineChart data={transferData} options={transferOptions} />
            </div>
        </main>
    )
}

export default Display;