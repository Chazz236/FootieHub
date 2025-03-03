export async function getPlayerStats() { //using this method in the page.js in players, could separate
  const res = await fetch('http://localhost:3000/api/playerStats');
  const data = await res.json();
  return data;
}

const Home = async () => {

  //await setupDB();
  const { goals, assists, value } = await getPlayerStats();


  return (
    <main className='flex-1 p-6'>
      <div className='flex'>
        <table className='table-auto'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Goals</th>
            </tr>
          </thead>
          <tbody>
            {
              goals.map((player, i) => (
                <tr key={i} className='text-center'>
                  <td className='px-6'>{player.name}</td>
                  <td className='px-6'>{player.goals ?? 0}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <table className='table-auto'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Assists</th>
            </tr>
          </thead>
          <tbody>
            {
              assists.map((player, i) => (
                <tr key={i} className='text-center'>
                  <td className='px-6'>{player.name}</td>
                  <td className='px-6'>{player.assists ?? 0}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <table className='table-auto'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {
              value.map((player, i) => (
                <tr key={i} className='text-center'>
                  <td className='px-6'>{player.name}</td>
                  <td className='px-6'>${Intl.NumberFormat().format(player.value)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Home;