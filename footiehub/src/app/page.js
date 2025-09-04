import Link from 'next/link'
import { getAllStats } from '@/lib/data/stats';
import { getPlayers } from '@/lib/data/players';
import Card from '@/app/components/ui/Card';

export default async function Home() {

  const [stats, players] = await Promise.all([
    getAllStats(),
    getPlayers(),
  ]);

  const currentYear = new Date().getFullYear();
  const currentYearStats = stats.filter(stat => stat.year === currentYear);

  if (!currentYearStats || currentYearStats.length === 0) {
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

  const getSortedPlayers = (players, stat) => {
    if (stat !== 'win_percentage') {
      return [...players].sort((a, b) => {
        if (b[stat] !== a[stat]) {
          return b[stat] - a[stat];
        }
        else {
          return a.games - b.games;
        }
      });
    }
    return [...players].sort((a, b) => {
      const bWinPercentage = b.wins / b.games;
      const aWinPercentage = a.wins / a.games;

      if (bWinPercentage !== aWinPercentage) {
        return bWinPercentage - aWinPercentage;
      }
      else {
        return b.games - a.games;
      }
    });
  };

  const goals = getSortedPlayers(currentYearStats, 'goals');
  const assists = getSortedPlayers(currentYearStats, 'assists');
  const winPercentages = getSortedPlayers(currentYearStats, 'win_percentage');

  const createNormalizer = ((players, stat) => {
    let values;
    if (stat !== 'win_percentage') {
      values = players.map(player => player[stat]);
    }
    else {
      values = players.map(player => player.wins / player.games);
    }
    const max = Math.max(...values);
    const min = Math.min(...values);

    if (max === min) {
      return () => 0;
    }
    return (value) => (value - min) / (max - min);
  });

  const normalizeGoals = createNormalizer(currentYearStats, 'goals');
  const normalizeAssists = createNormalizer(currentYearStats, 'assists');
  const normalizeCleanSheets = createNormalizer(currentYearStats, 'clean_sheets');
  const normalizeWinPercentage = createNormalizer(currentYearStats, 'win_percentage');
  const normalizeGames = createNormalizer(currentYearStats, 'games');

  const valueMap = new Map();
  players.forEach(player => {
    valueMap.set(player.id, player.value);
  })

  const scoredPlayers = currentYearStats.map(player => {
    const score =
      (normalizeGoals(player.goals) * 0.3) +
      (normalizeAssists(player.assists) * 0.25) +
      (normalizeCleanSheets(player.clean_sheets) * 0.2) +
      (normalizeWinPercentage(player.wins / player.games) * 0.2) +
      (normalizeGames(player.games) * 0.05);
    const value = valueMap.get(player.id);
    return { ...player, score, value };
  }).sort((a, b) => b.score - a.score);

  const leaderTable = (stat, players) => {
    return (
      <Card className='p-6'>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th colSpan={2} className='text-center pb-2'>{stat === 'win_percentage' ? 'Best Win Percentage' : `Most ${stat.charAt(0).toUpperCase() + stat.slice(1)}`}</th>
            </tr>
          </thead>
          <tbody>
            {players.slice(0, 4).map((player, i) => (
              <tr key={player.id} className={`text-center text-sm ${i === 0 ? 'bg-green-100 rounded-lg font-bold' : ''}`}>
                <td className='px-2 text-left'><Link href={`/players/${player.id}`}>{player.name}</Link></td>
                <td className='px-2 text-right'>{stat === 'win_percentage' ? `${parseFloat(player.wins / player.games * 100).toFixed(2)}%` : player[stat]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  };

  const teams = (toty, top, row) => {
    return (
      <div className={top ? 'grid grid-cols-3 gap-2 text-center' : 'grid grid-cols-2 gap-2 text-center w-2/3 mx-auto'}>
        {row.map(player => (
          <Card key={player.id} className='p-3'>
            <div className='flex flex-col gap-1 text-sm'>
              <div className='flex justify-between'>
                <h3 className={`font-bold ${toty ? 'text-success-color' : 'text-danger-color'}`}><Link href={`/players/${player.id}`}>{player.name}</Link></h3>
                <p className='font-bold'>${Intl.NumberFormat().format(player.value)}</p>
              </div>
              <div className='flex justify-between text-xs text-gray-500'>
                <span>Goals: {player.goals}</span>
                <span>Assists: {player.assists}</span>
                <span>Clean Sheets: {player.clean_sheets}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <main className='flex-1 p-6'>
      <div className='grid grid-cols-4 gap-6'>
        <div className='col-span-3'>
          <h2 className='text-2xl font-bold text-foreground mb-6'>{currentYear} Home Page</h2>
          <Card className='mb-6 p-6'>
            <h3 className='text-lg font-bold text-foreground mb-4'>Team Of The Year</h3>
            <div className='flex flex-col gap-4'>
              {teams(true, true, scoredPlayers.slice(0, 3))}
              {teams(true, false, scoredPlayers.slice(3, 5))}
            </div>
          </Card>
          <Card className='p-6'>
            <h3 className='text-lg font-bold text-foreground mb-4'>Flops Of The Year</h3>
            <div className='flex flex-col gap-4'>
              {teams(false, true, scoredPlayers.slice(-3))}
              {teams(false, false, scoredPlayers.slice(scoredPlayers.length - 5, scoredPlayers.length - 3))}
            </div>
          </Card>
        </div>
        <div className='col-span-1'>
          <div className='flex flex-col gap-2 mt-2'>
            {leaderTable('goals', goals)}
            {leaderTable('assists', assists)}
            {leaderTable('win_percentage', winPercentages)}
          </div>
        </div>
      </div>
    </main>
  )
}