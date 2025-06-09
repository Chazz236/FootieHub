import Link from 'next/link'
import { getAllStats } from '@/lib/data/stats';

const Players = async () => {

  try {
    const stats = await getAllStats();
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
                  <td className='px-6'><Link href={`/players/${player.id}`}>{player.name}</Link></td>
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
  } catch (error) {
    console.error('error getting players:', error);
  }
}

export default Players;