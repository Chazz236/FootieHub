import { getPlayerStatsByID } from '@/lib/data/stats';
import { getPlayerChanges } from '@/lib/data/transfers';
import Display from './display';

//server component to get player stats and transfer changes
export default async function Player({ params }) {

  try {
    const id = (await params).id;

    //get stats and transfer changes of player
    const [stats, transferChanges] = await Promise.all([
      getPlayerStatsByID(id),
      getPlayerChanges(id),
    ]);

    //handle if there are no stats
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

    //start transfer value with $10,000,000 and add in transfer changes
    let value = 0;
    const firstValue = { value_change: 10000000, date: stats[0].createdAt };
    const playerTransferChanges = [firstValue, ...transferChanges];

    //find current value by adding in all the value changes
    for (const change of playerTransferChanges) {
      change.date = new Date(change.date).toLocaleDateString();
      value += change.value_change;
    }

    //reduce yearly stats into a single 'all time' stats object for each player if there are years
    if (stats[0].year !== null) {
      const allTimeStats = Object.values(stats.reduce((accumulator, currentStats) => {
        const { id, name, games, wins, draws, losses, clean_sheets, goals, assists } = currentStats;
        if (!accumulator[name]) {
          accumulator[name] = { id, name, games, wins, draws, losses, clean_sheets, goals, assists, year: 'All Time', value: value };
        }
        else {
          accumulator[name].games += games;
          accumulator[name].wins += wins;
          accumulator[name].draws += draws;
          accumulator[name].losses += losses;
          accumulator[name].clean_sheets += clean_sheets;
          accumulator[name].goals += goals;
          accumulator[name].assists += assists;
        }
        return accumulator;
      }, {}));

      //combine all time stats with yearly stats
      const allStats = [...allTimeStats, ...stats];

      return (
        <Display transferChanges={playerTransferChanges} stats={allStats} />
      )
    }

    //if there are no years, default
    stats[0].year = 'All Time';
    stats[0].value = value;

    return (
      <Display transferChanges={playerTransferChanges} stats={stats} />
    )
  } catch (error) {
    console.error('error getting player stuff:', error);
  }
}