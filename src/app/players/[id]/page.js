export const dynamic = 'force-dynamic';

import { getPlayerByID } from '@/lib/data/players';
import { getPlayerStatsByID } from '@/lib/data/stats';
import { getPlayerChanges } from '@/lib/data/transfers';
import Display from './display';

//server component to get player stats and transfer changes
export default async function Player({ params }) {

  try {
    const id = (await params).id;

    //get info, stats, and transfer changes of player
    const [player, stats, transferChanges] = await Promise.all([
      getPlayerByID(id),
      getPlayerStatsByID(id),
      getPlayerChanges(id),
    ]);

    //handle if there are no stats
    if (!player || !player.name) {
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

    //fix for date
    const playerData = {...player, joinedAt: new Date(player.joinedAt).toISOString().split('T')[0]};

    //start transfer value with $10,000,000 and add in transfer changes
    let value = 0;
    const firstValue = { value_change: 10000000, date: player.joinedAt };
    const playerTransferChanges = [firstValue, ...transferChanges];

    //find current value by adding in all the value changes
    for (const change of playerTransferChanges) {
      change.date = new Date(change.date).toISOString().split('T')[0];
      value += change.value_change;
    }

    //reduce yearly stats into a single 'all time' stats object for each player if there are years
    if (stats && stats.length > 0) {
      const allTimeStats = Object.values(stats.reduce((accumulator, currentStats) => {
        const { games, wins, draws, losses, clean_sheets, goals, assists } = currentStats;
        if (!accumulator[player.id]) {
          accumulator[player.id] = { id: player.id, name: player.name, games, wins, draws, losses, clean_sheets, goals, assists, year: 'All Time', value: value };
        }
        else {
          accumulator[player.id].games += games;
          accumulator[player.id].wins += wins;
          accumulator[player.id].draws += draws;
          accumulator[player.id].losses += losses;
          accumulator[player.id].clean_sheets += clean_sheets;
          accumulator[player.id].goals += goals;
          accumulator[player.id].assists += assists;
        }
        return accumulator;
      }, {}));

      //combine all time stats with yearly stats
      const allStats = [...allTimeStats, ...stats];

      return (
        <Display transferChanges={playerTransferChanges} stats={allStats} player={playerData} />
      )
    }

    //if there are no years, default
    const defaultStats = [{
      id: player.id,
      name: player.name,
      games: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      clean_sheets: 0,
      goals: 0,
      assists: 0,
      year: 'All Time',
      value: value
    }];

    return (
      <Display transferChanges={playerTransferChanges} stats={defaultStats} player={playerData} />
    )
  } catch (error) {
    console.error('error getting player stuff:', error);
  }
}