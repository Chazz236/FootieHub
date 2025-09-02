import { getStats, getYears } from '@/lib/data/players';
import { getPlayerChanges } from '@/lib/data/transfers';
import Display from './display';

export default async function Player({ params }) {

  try {
    const id = (await params).id;
    const [stats, transferChanges, years] = await Promise.all([
      getStats(id),
      getPlayerChanges(id),
      getYears(id)
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

    const statsMap = new Map();
    statsMap.set('All Time', stats)

    const yearsArray = years.map(y => y.year);

    for (const y of yearsArray) {
      let yearStats = await getStats(id, y);
      statsMap.set(y, yearStats);
    }

    if (transferChanges && transferChanges.length > 0) {
      let value = 10000000;
      const yearValues = {};

      let year = new Date(transferChanges[0].date).getFullYear();

      for (const valueChange of transferChanges) {
        const valueChangeYear = new Date(valueChange.date).getFullYear();
        if (valueChangeYear !== year) {
          yearValues[year] = value;
          year = valueChangeYear;
        }
        value += valueChange.value_change;
      }

      yearValues[year] = yearValues['All Time'] = value;

      statsMap.forEach((yearStats, key) => {
        yearStats[0].value = yearValues[key];
      });
      console.log(statsMap);
    }
    else {
      statsMap.forEach(yearStats => {
        yearStats[0].value = 10000000;
      });
      console.log(statsMap);
    }

    const playerTransferChanges = transferChanges && transferChanges.length > 0 ? transferChanges : [{
      value_change: stats[0].value,
      date: new Date().toISOString()
    }];

    return (
      <Display transferChanges={playerTransferChanges} yearStats={statsMap} />
    )
  } catch (error) {
    console.error('error getting player stuff:', error);
  }
}