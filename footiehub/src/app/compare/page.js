import { getPlayers } from '@/lib/data/players';
import { getAllStats } from '@/lib/data/stats';
import { getTransferChanges } from '@/lib/data/transfers';
import Display from './display'

//server component to get players, stats, and transfer changes
export default async function Compare() {

  try {

    //get all players, their stats, and their transfer changes
    const [stats, players, transferChanges] = await Promise.all([
      getAllStats(),
      getPlayers(),
      getTransferChanges()
    ]);

    //handle if there are no stats or players
    if (!players || players.length === 0 || !stats || stats.length === 0) {
      return (
        <main className='flex-1 p-6'>
          <div className='flex justify-center items-center h-full'>
            <h2 className='text-2xl font-medium text-foreground -mt-16'>
              Add some players and matches to compare players!
            </h2>
          </div>
        </main>
      );
    }

    //calculate each player's market value per year and add transfer changes by year
    let t = 0;
    for (let i = 0; i < stats.length; i++) {
      stats[i].transferChanges = [];
      if (i > 0 && stats[i].id === stats[i - 1].id) {
        stats[i].value = stats[i - 1].value;
        stats[i].transferChanges.push({ player_id: stats[i].id, value_change: stats[i].value, date: transferChanges[t - 1].date })
      }
      else {
        stats[i].value = 10000000;
        stats[i].transferChanges.push({ player_id: stats[i].id, value_change: 10000000, date: stats[i].createdAt })
      }
      while (t < transferChanges.length && transferChanges[t].player_id === stats[i].id && new Date(transferChanges[t].date).getFullYear() === stats[i].year) {
        stats[i].value += transferChanges[t].value_change;
        stats[i].transferChanges.push(transferChanges[t]);
        t++;
      }
    }

    //for every player, start with a value of $10,000,000
    const allTransferChanges = {};
    for (const player of players) {
      allTransferChanges[player.id] = [{ player_id: player.id, value_change: 10000000, date: player.createdAt }]
    }

    //push all the transfer changes by player
    for (const change of transferChanges) {
      allTransferChanges[change.player_id].push(change);
    }

    //reduce yearly stats into a single 'all time' stats object for each player
    const allTimeStats = Object.values(stats.reduce((accumulator, currentStats) => {
      const { id, name, games, wins, clean_sheets, goals, assists, value } = currentStats;
      if (!accumulator[name]) {
        accumulator[name] = { id, name, games, wins, clean_sheets, goals, assists, value, transferChanges: allTransferChanges[id], year: 'All Time' };
      }
      else {
        accumulator[name].games += games;
        accumulator[name].wins += wins;
        accumulator[name].clean_sheets += clean_sheets;
        accumulator[name].goals += goals;
        accumulator[name].assists += assists;
        accumulator[name].value = value;
      }
      return accumulator;
    }, {}));

    const yearsMap = new Map();

    //put all the years a player has played into the map
    stats.forEach(stat => {
      if (!yearsMap.has(stat.id)) {
        yearsMap.set(stat.id, []);
      }
      if (stat.year !== null) {
        yearsMap.get(stat.id).push(stat.year);
      }
    });

    //set up the options for players to select what years to compare
    for (const [id, years] of yearsMap.entries()) {
      years.sort((a, b) => b - a);
      yearsMap.set(id, ['All Time', ...years])
    }

    //add years to each player and make 'all time' the default
    players.forEach(player => {
      player.years = yearsMap.get(player.id);
      player.compareYear = player.years[0];
    });

    //combine all time stats and yearly stats
    const allStats = [...allTimeStats, ...stats];

    return (
      <Display players={players} stats={allStats} />
    )
  } catch (error) {
    console.error('error getting stats to compare:', error);
  }
}