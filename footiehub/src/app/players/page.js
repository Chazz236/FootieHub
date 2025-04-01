//DOUBLE CHECK AS PLAYERSTATS.JS HAS BEEN CHANGED
import Link from 'next/link'

export async function getPlayerStats() {
  const res = await fetch('http://localhost:3000/api/playerStats');
  const data = await res.json();
  return data;
}

const Players = async () => {

  const { stats } = await getPlayerStats();

  return (
    <main className='flex-1 p-6'>
      <table className='table-auto'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Games</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {
            stats.map((player, i) => (
              <tr key={i} className='text-center'>
                <td className='px-6'><Link href={`/players/${i+1}`}>{player.name}</Link></td>
                <td className='px-6'>{player.games}</td>
                <td className='px-6'>{player.goals ?? 0}</td>
                <td className='px-6'>{player.assists ?? 0}</td>
                <td className='px-6'>${Intl.NumberFormat().format(player.value)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </main>
  )
}

export default Players;