import { getStats } from '@/lib/data/players';
import { getPlayerChanges } from '@/lib/data/transfers';
import Display from './display';

export default async function Player({ params }) {

  try {
    const id = (await params).id;
    const [stats, transferChanges] = await Promise.all([
      getStats(id),
      getPlayerChanges(id)
    ])

    if (!stats || stats.length === 0 || !stats[0].name) {
      return (
        <main className='flex-1 p-6'>
          <div className='flex justify-center items-center h-full'>
            <h2 className='text-2xl font-medium text-foreground -mt-16'>
              Player not found!
            </h2>
          </div>
        </main>
      );
    }

    const playerTransferChanges = transferChanges && transferChanges.length > 0 ? transferChanges : [{
      value_change: stats[0].value,
      date: new Date().toISOString()
    }];

    return (
      <Display stats={stats} transferChanges={playerTransferChanges} />
    )
  } catch (error) {
    console.error('error getting player stuff:', error);
  }
}