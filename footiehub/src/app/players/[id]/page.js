import { getStats, getYears } from '@/lib/data/players';
import { getPlayerChanges } from '@/lib/data/transfers';
import Display from './display';

export default async function Player({ params }) {

  try {
    const id = (await params).id;
    const [stats, transferChanges] = await Promise.all([
      getStats(id),
      getPlayerChanges(id),
    ]);

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

    //fix value, its always 10 mil
    // let i = 0;
    // for (let j = 0; j < stats.length; j++) {
    //   if (j > 0 && stats[j].id === stats[j - 1].id) {
    //     stats[j].value = stats[j - 1].value;
    //   }
    //   else {
    //     stats[j].value = 10000000;
    //   }
    //   stats[j].transferChanges = [];
    //   if (stats[j].year === null) {
    //     continue;
    //   }
    //   while (i < transferChanges.length && transferChanges[i].player_id === stats[j].id && new Date(transferChanges[i].date).getFullYear() === stats[j].year) {
    //     stats[j].value += transferChanges[i].value_change;
    //     stats[j].transferChanges.push(transferChanges[i]);
    //     i++;
    //   }
    // }

    // const playerTransferChanges = transferChanges && transferChanges.length > 0 ? transferChanges : [{
    //   value_change: stats[0].value,
    //   date: new Date().toISOString()
    // }];

    let playerTransferChanges = 0;

    if (stats[0].year !== null) {
      const allTimeStats = Object.values(stats.reduce((accumulator, currentStats) => {
        const { id, name, games, wins, draws, losses, clean_sheets, goals, assists, value } = currentStats;
        if (!accumulator[name]) {
          accumulator[name] = { id, name, games, wins, draws, losses, clean_sheets, goals, assists, value, year: 'All Time' };
        }
        else {
          accumulator[name].games += games;
          accumulator[name].wins += wins;
          accumulator[name].draws += draws;
          accumulator[name].losses += losses;
          accumulator[name].clean_sheets += clean_sheets;
          accumulator[name].goals += goals;
          accumulator[name].assists += assists;
          accumulator[name].value = value;
        }
        return accumulator;
      }, {}));

      const allStats = [...allTimeStats, ...stats];

      return (
        <Display transferChanges={playerTransferChanges} stats={allStats} />
      )
    }

    stats[0].year = 'All Time';

    return (
      <Display transferChanges={playerTransferChanges} stats={stats} />
    )
  } catch (error) {
    console.error('error getting player stuff:', error);
  }
}