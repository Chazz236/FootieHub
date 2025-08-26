import { getAllStats } from '@/lib/data/stats';
import Display from './display';

const Players = async () => {
  try {
    const stats = await getAllStats();

    if (!stats || stats.length === 0) {
      return (
        <main className='flex-1 p-6'>
          <div className='flex justify-center items-center h-full'>
            <h2 className='text-2xl font-medium text-foreground -mt-16'>
              Add some players and matches to see stats!
            </h2>
          </div>
        </main>
      );
    }

    return (
      <Display stats={stats} />
    )
  } catch (error) {
    console.error('error getting players:', error);
  }
}

export default Players;