import { getAllStats } from '@/lib/data/stats';
import { getTransferChanges } from '@/lib/data/transfers';
import Display from './display';

//server component to get players and transfer values
const Players = async () => {

  try {

    //get the stats and transfer changes of players
    const [stats, transferChanges] = await Promise.all([
      getAllStats(),
      getTransferChanges(),
    ]);

    //handle if there are no stats
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

    //go through stats and transfer changes to get market value for each year
    let i = 0;
    for (let j = 0; j < stats.length; j++) {
      if (j > 0 && stats[j].id === stats[j - 1].id) {
        stats[j].value = stats[j - 1].value;
      }
      else {
        stats[j].value = 10000000;
      }
      if (stats[j].year === null) {
        continue;
      }
      while (i < transferChanges.length && transferChanges[i].player_id === stats[j].id && new Date(transferChanges[i].date).getFullYear() === stats[j].year) {
        stats[j].value += transferChanges[i].value_change;
        i++;
      }
    }

    return (
      <Display stats={stats} />
    )
  } catch (error) {
    console.error('error getting players:', error);
  }
}

export default Players;