export async function getPlayer(id) {
  const res = await fetch(`http://localhost:3000/api/players/${id}`);
  const data = await res.json();
  return data;
}

const Player = async ({ params }) => {

  const id = (await params).id;
  const { player, stats, wins, assists, goals, winWho } = await getPlayer(id);

  return (
    <main className='flex-1 p-6'>
      <h1 className='text-4xl font-bold text-gray-900 mt-4 mb-2'>{player[0].name}</h1>
      <h1 className='text-4xl font-bold text-gray-900 mt-4 mb-2'>${Intl.NumberFormat().format(player[0].value)}</h1>
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
            <td className='px-6'>{stats[0].goals ?? 0}</td>
            <td className='px-6'>{stats[0].assists ?? 0}</td>
            <td className='px-6'>{((stats[0].goals ?? 0) / stats[0].games).toFixed(2)}</td>
            <td className='px-6'>{((stats[0].assists ?? 0) / stats[0].games).toFixed(2)}</td>
            <td className='px-6'>{(((wins[0].wins ?? 0) / stats[0].games) * 100).toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
      {/* <h1 className='text-xl font-bold text-gray-900 mt-4 mb-2'>Who Assists You?</h1> */}
      <div className='flex'>
        <table className='table-auto'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Assists</th>
            </tr>
          </thead>
          <tbody>
            {
              assists.map((assist, i) => (
                <tr key={i} className='text-center'>
                  <td className='px-6'>{assist.name}</td>
                  <td className='px-6'>{assist.assists ?? 0}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <table className='table-auto'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Goals</th>
            </tr>
          </thead>
          <tbody>
            {
              goals.map((goal, i) => (
                <tr key={i} className='text-center'>
                  <td className='px-6'>{goal.name}</td>
                  <td className='px-6'>{goal.goals ?? 0}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <table className='table-auto'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Games</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {
              winWho.map((whoWin, i) => (
                <tr key={i} className='text-center'>
                  <td className='px-6'>{whoWin.name}</td>
                  <td className='px-6'>{whoWin.games ?? 0}</td>
                  <td className='px-6'>{whoWin.wins ?? 0}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Player;