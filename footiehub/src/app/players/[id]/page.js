import DoughnutChart from "@/app/components/DoughnutChart";

export async function getPlayer(id) {
  const res = await fetch(`http://localhost:3000/api/players/${id}`);
  const data = await res.json();
  return data;
}

//bar chart to show past 5 games goals and assists, each one bar

const Player = async ({ params }) => {

  const id = (await params).id;
  const { stats, transferChanges } = await getPlayer(id);
  console.log(transferChanges);

  const gameData = {
    datasets: [
      {
        data: [stats[0].games, stats[0].games - stats[0].games],
        backgroundColor: ['rgb(31, 41, 55)', 'rgb(252, 252, 252)'],
        borderWidth: 0
      }
    ]
  }
  const gameOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Games',
        font: {
          size: 18
        }
      },
      centerText: {
        display: true,
        text: `${stats[0].games}`,
        font: {
          size: 24,
          weight: 'bold'
        },
        color: 'rgba(0, 0, 0, 0.6)'
      }
    },
  }

  const winData = {
    datasets: [
      {
        data: [stats[0].wins, stats[0].games - stats[0].wins],
        backgroundColor: ['rgb(22, 151, 87)', 'rgb(252, 252, 252)'],
        borderWidth: 0
      }
    ]
  }
  const winOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Wins',
        font: {
          size: 18
        }
      },
      centerText: {
        display: true,
        text: `${stats[0].wins}`,
        font: {
          size: 24,
          weight: 'bold'
        },
        color: 'rgba(0, 0, 0, 0.6)'
      }
    },
  }

  const drawData = {
    datasets: [
      {
        data: [stats[0].draws, stats[0].games - stats[0].draws],
        backgroundColor: ['rgb(132, 151, 22)', 'rgb(252, 252, 252)'],
        borderWidth: 0
      }
    ]
  }
  const drawOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Draws',
        font: {
          size: 18
        }
      },
      centerText: {
        display: true,
        text: `${stats[0].draws}`,
        font: {
          size: 24,
          weight: 'bold'
        },
        color: 'rgba(0, 0, 0, 0.6)'
      }
    },
  }

  const lossData = {
    datasets: [
      {
        data: [stats[0].losses, stats[0].games - stats[0].losses],
        backgroundColor: ['rgb(151, 37, 22)', 'rgb(252, 252, 252)'],
        borderWidth: 0
      }
    ]
  }
  const lossOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Losses',
        font: {
          size: 18
        }
      },
      centerText: {
        display: true,
        text: `${stats[0].losses}`,
        font: {
          size: 24,
          weight: 'bold'
        },
        color: 'rgba(0, 0, 0, 0.6)'
      }
    },
  }

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
      <div className='flex w-32'>
        <div className='w-32 h-32'><DoughnutChart data={gameData} options={gameOptions} /></div>
        <div className='w-32 h-32'><DoughnutChart data={winData} options={winOptions} /></div>
        <div className='w-32 h-32'><DoughnutChart data={drawData} options={drawOptions} /></div>
        <div className='w-32 h-32'><DoughnutChart data={lossData} options={lossOptions} /></div>
      </div>
      <div>
      {/* line chart to show value change */}
      </div>
    </main>
  )
}

export default Player;