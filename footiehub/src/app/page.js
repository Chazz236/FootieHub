import { getAllStats, getGoalsOrdered, getAssistsOrdered, getWinPercentageOrdered, getValuesOrdered } from "@/lib/data/stats";

export default async function Home() {

  const [goals, assists, winPercentages, values] = await Promise.all([
    getGoalsOrdered(),
    getAssistsOrdered(),
    getWinPercentageOrdered(),
    getValuesOrdered()
  ]);

  return (
    <main className='flex-1 p-6'>
      <div className=''>
        <h2 className='text-2xl font-semibold mb-4 text-center'>Most Valuable Players</h2>
        <div className='flex justify-center gap-32 mt-8'>
          {values.slice(0, 3).map(player => (
            <div key={player.id} className='w-1/5 rounded-lg border border-gray-200 p-4'>
              <h3 className='text-xl font-semibold text-center'>{player.name}</h3>
              <p className='text-md mb-2'>
                <span className='inline-block text-left w-1/2'>Goals: </span>
                <span className='inline-block text-right w-1/2'>{goals.find((p => p.id === player.id)).goals}</span>
              </p>
              <p className='text-md mb-2'>
                <span className='inline-block text-left w-1/2'>Assists: </span>
                <span className='inline-block text-right w-1/2'> {assists.find((p => p.id === player.id)).assists}</span>
              </p>
              <p className='text-md mb-2'>
                <span className='inline-block text-left w-1/2'>Win %: </span>
                <span className='inline-block text-right w-1/2'>{parseFloat(winPercentages.find((p => p.id === player.id)).wins).toFixed(2)}%</span>
              </p>
              <p className='text-md mb-2'>
                <span className='inline-block text-left w-1/2'>Value: </span>
                <span className='inline-block text-right w-1/2'>${Intl.NumberFormat().format(player.value)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-8'>
        <h2 className='text-2xl font-semibold mb-4 text-center'>Leaders</h2>
        <div className='flex justify-evenly'>
          <table className='table-auto w-1/5 rounded-lg border border-gray-200 border-separate'>
            <thead>
              <tr>
                <th colSpan={2} className='text-center'>Goals</th>
              </tr>
            </thead>
            <tbody>
              {goals.slice(0, 5).map(player => (
                <tr key={player.id} className='text-center'>
                  <td className='px-6 text-left'>{player.name}</td>
                  <td className='px-6 text-right'>{player.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className='table-auto w-1/5 rounded-lg border border-gray-200 border-separate'>
            <thead>
              <tr>
                <th colSpan={2} className='text-center'>Assists</th>
              </tr>
            </thead>
            <tbody>
              {assists.slice(0, 5).map(player => (
                <tr key={player.id} className='text-center'>
                  <td className='px-6 text-left'>{player.name}</td>
                  <td className='px-6 text-right'>{player.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className='table-auto w-1/5 rounded-lg border border-gray-200 border-separate'>
            <thead>
              <tr>
                <th colSpan={2} className='text-center'>Win Percentage</th>
              </tr>
            </thead>
            <tbody>
              {winPercentages.slice(0, 5).map(player => (
                <tr key={player.id} className='text-center'>
                  <td className='px-6 text-left'>{player.name}</td>
                  <td className='px-6 text-right'>{parseFloat(player.wins).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}