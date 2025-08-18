import Link from 'next/link'
import { getStats } from '@/db/playerStats';
import Card from '@/app/components/ui/Card';
import Players from './players/page';


export default async function Home() {

  const stats = await getStats();
  const allPlayersStats = stats[0];

  const getSortedPlayers = (players, stat) => {
    return [...players].sort((a, b) => b[stat] - a[stat]);
  };

  const goals = getSortedPlayers(allPlayersStats, 'goals');
  const assists = getSortedPlayers(allPlayersStats, 'assists');
  const winPercentages = getSortedPlayers(allPlayersStats, 'win_percentage');

  const createNormalizer = ((players, stat) => {
    const values = players.map(player => player[stat]);
    const max = Math.max(...values);
    const min = Math.min(...values);

    if (max === min) {
      return 0;
    }
    return (value) => (value - min) / (max - min);
  })

  const normalizeGoals = createNormalizer(allPlayersStats, 'goals');
  const normalizeAssists = createNormalizer(allPlayersStats, 'assists');
  const normalizeCleanSheets = createNormalizer(allPlayersStats, 'clean_sheets');
  const normalizeWinPercentage = createNormalizer(allPlayersStats, 'win_percentage');
  const normalizeGames = createNormalizer(allPlayersStats, 'games');
  const normalizeValues = createNormalizer(allPlayersStats, 'value');

  const scoredPlayers = allPlayersStats.map(player => {
    const score =
      (normalizeGoals(player.goals) * 0.2) +
      (normalizeAssists(player.assists) * 0.2) +
      (normalizeCleanSheets(player.clean_sheets) * 0.1) +
      (normalizeWinPercentage(player.win_percentage) * 0.25) +
      (normalizeGames(player.games) * 0.1) +
      (normalizeValues(player.value) * 0.15);
    return { ...player, score };
  }).sort((a, b) => b.score - a.score)

  return (
    <main className='flex-1 p-6'>
      <div className='grid grid-cols-4 gap-6'>
        <div className='col-span-3'>
          <h2 className='text-2xl font-bold text-foreground mb-6'>Home</h2>
          <Card className='mb-6 p-6'>
            <h3 className='text-lg font-bold text-foreground mb-4'>Team Of The Year</h3>
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-3 gap-2 text-center'>
                {scoredPlayers.slice(0, 3).map(player => (
                  <Card key={player.id} className='p-3'>
                    <div className='flex flex-col gap-1 text-sm'>
                      <div className='flex justify-between'>
                        <h3 className='font-bold text-success-color'><Link href={`/players/${player.id}`}>{player.name}</Link></h3>
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
              <div className='grid grid-cols-2 gap-2 text-center w-2/3 mx-auto'>
                {scoredPlayers.slice(3, 5).map(player => (
                  <Card key={player.id} className='p-3'>
                    <div className='flex flex-col gap-1 text-sm'>
                      <div className='flex justify-between'>
                        <h3 className='font-bold text-success-color'><Link href={`/players/${player.id}`}>{player.name}</Link></h3>
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
            </div>
          </Card>
          <Card className='p-6'>
            <h3 className='text-lg font-bold text-foreground mb-4'>Flops Of The Year</h3>
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-3 gap-2 text-center'>
                {scoredPlayers.slice(-3).map(player => (
                  <Card key={player.id} className='p-3'>
                    <div className='flex flex-col gap-1 text-sm'>
                      <div className='flex justify-between'>
                        <h3 className='font-bold text-danger-color'><Link href={`/players/${player.id}`}>{player.name}</Link></h3>
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
              <div className='grid grid-cols-2 gap-2 text-center w-2/3 mx-auto'>
                {scoredPlayers.slice(scoredPlayers.length - 5, scoredPlayers.length - 3).map(player => (
                  <Card key={player.id} className='p-3'>
                    <div className='flex flex-col gap-1 text-sm'>
                      <div className='flex justify-between'>
                        <h3 className='font-bold text-danger-color'><Link href={`/players/${player.id}`}>{player.name}</Link></h3>
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
            </div>
          </Card>
        </div>
        <div className='col-span-1'>
          <div className='flex flex-col gap-2 mt-2'>
            <Card className='p-6'>
              <table className='table-auto w-full'>
                <thead>
                  <tr>
                    <th colSpan={2} className='text-center pb-2'>Most Goals</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.slice(0, 4).map((player, i) => (
                    <tr key={player.id} className={`text-center text-sm ${i === 0 ? 'bg-green-100 rounded-lg font-bold' : ''}`}>
                      <td className='px-2 text-left'><Link href={`/players/${player.id}`}>{player.name}</Link></td>
                      <td className='px-2 text-right'>{player.goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card className='p-6'>
              <table className='table-auto w-full'>
                <thead>
                  <tr>
                    <th colSpan={2} className='text-center pb-2'>Most Assists</th>
                  </tr>
                </thead>
                <tbody>
                  {assists.slice(0, 4).map((player, i) => (
                    <tr key={player.id} className={`text-center text-sm ${i === 0 ? 'bg-green-100 rounded-lg font-bold' : ''}`}>
                      <td className='px-2 text-left'><Link href={`/players/${player.id}`}>{player.name}</Link></td>
                      <td className='px-2 text-right'>{player.assists}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card className='p-6'>
              <table className='table-auto w-full'>
                <thead>
                  <tr>
                    <th colSpan={2} className='text-center pb-2'>Best Win Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {winPercentages.slice(0, 4).map((player, i) => (
                    <tr key={player.id} className={`text-center text-sm ${i === 0 ? 'bg-green-100 rounded-lg font-bold' : ''}`}>
                      <td className='px-2 text-left'><Link href={`/players/${player.id}`}>{player.name}</Link></td>
                      <td className='px-2 text-right'>{parseFloat(player.win_percentage).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}