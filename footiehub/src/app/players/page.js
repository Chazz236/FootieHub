import Link from 'next/link'
import { getAllStats } from '@/lib/data/stats';
import Card from '@/app/components/ui/Card';

const Players = async () => {
  try {
    const stats = await getAllStats();
    return (
      <main className='flex-1 p-6'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>Players</h2>
        <Card className='p-6'>
          <div className='max-h-96 overflow-y-scroll'>
            <table className='table-fixed w-full'>
              <thead>
                <tr>
                  <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>Name</th>
                  <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>Games</th>
                  <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>Goals</th>
                  <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>Assists</th>
                  <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>Clean Sheets</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(player => (
                  <tr key={player.id}>
                    <td className='py-2 text-sm font-medium text-foreground text-center'><Link href={`/players/${player.id}`}>{player.name}</Link></td>
                    <td className='py-2 text-sm font-medium text-foreground text-center'>{player.games}</td>
                    <td className='py-2 text-sm font-medium text-foreground text-center'>{player.goals}</td>
                    <td className='py-2 text-sm font-medium text-foreground text-center'>{player.assists}</td>
                    <td className='py-2 text-sm font-medium text-foreground text-center'>{player.clean_sheets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    )
  } catch (error) {
    console.error('error getting players:', error);
  }
}

export default Players;