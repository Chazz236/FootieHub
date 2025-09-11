import { getPlayers } from '@/lib/data/players';
import { getAllStats } from '@/lib/data/stats';
import { getTransferChanges } from '@/lib/data/transfers';
import Display from './display'

export default async function Compare() {
  try {
    const [stats, players, transferChanges] = await Promise.all([
      getAllStats(),
      getPlayers(),
      getTransferChanges()
    ]);

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

    let i = 0;
    for (let j = 0; j < stats.length; j++) {
      if (j > 0 && stats[j].id === stats[j - 1].id) {
        stats[j].value = stats[j - 1].value;
      }
      else {
        stats[j].value = 10000000;
      }
      stats[j].transferChanges = [];
      if (stats[j].year === null) {
        continue;
      }
      while (i < transferChanges.length && transferChanges[i].player_id === stats[j].id && new Date(transferChanges[i].date).getFullYear() === stats[j].year) {
        stats[j].value += transferChanges[i].value_change;
        stats[j].transferChanges.push(transferChanges[i]);
        i++;
      }
    }

    const allTimeStats = Object.values(stats.reduce((accumulator, currentStats) => {
      const { id, name, games, wins, clean_sheets, goals, assists, value, transferChanges } = currentStats;
      if (!accumulator[name]) {
        accumulator[name] = { id, name, games, wins, clean_sheets, goals, assists, value, transferChanges, year: 'All Time' };
      }
      else {
        accumulator[name].games += games;
        accumulator[name].wins += wins;
        accumulator[name].clean_sheets += clean_sheets;
        accumulator[name].goals += goals;
        accumulator[name].assists += assists;
        accumulator[name].value = value;
        accumulator[name].transferChanges = [...accumulator[name].transferChanges, transferChanges].flat();
      }
      return accumulator;
    }, {}));

    const yearsMap = new Map();

    stats.forEach(stat => {
      if (!yearsMap.has(stat.id)) {
        yearsMap.set(stat.id, []);
      }
      let years = yearsMap.get(stat.id);
      if (!years.includes('All Time')) {
        yearsMap.get(stat.id).push('All Time');
      }
      if (stat.year !== null) {
        yearsMap.get(stat.id).push(stat.year);
      }
    });

    players.forEach(player => {
      player.years = yearsMap.get(player.id);
      player.compareYear = player.years[0];
    });

    const allStats = [...allTimeStats, ...stats];

    return (
      <Display
        players={players}
        stats={allStats}
      />
    )
  } catch (error) {
    console.error('error getting stats to compare:', error);
  }
}