import Link from 'next/link';
import Card from '@/app/components/ui/Card';

const DisplayGoals = ({ goals }) => (
  <>
    {goals.map((goal, i) => (
      <div key={i}>
        <Link href={`/players/${goal.id}`}>{goal.name}</Link>
        {Array.from({ length: goal.goals }).map((_, j) => (
          <img key={j} src='/ball.png' alt='Soccer Ball' className='inline-block w-3 h-3' />
        ))}
      </div>
    ))}
  </>
);

const Display = ({ matches, goals }) => {

  return (
    <main className='flex-1 p-6'>
      <h2 className='text-2xl font-bold text-foreground mb-6'>Matches</h2>
      <Card className='p-6'>
        <div className='h-[calc(100vh-10rem)] overflow-y-scroll'>
          <table className='table-fixed w-full mx-auto'>
            <thead>
              <tr>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'>Date</th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'></th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'>Score</th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase w-1/4'></th>
              </tr>
            </thead>
            <tbody>
              {matches.map(match => {

                const homeWins = match.home_score > match.away_score;
                const awayWins = match.away_score > match.home_score;

                return (
                  <tr key={match.id} className='border-y border-gray-200 hover:bg-gray-100'>
                    <td className='p-4 text-sm font-medium text-foreground text-center align-top'>{new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                    <td className='p-4 text-sm text-foreground text-right align-top'>
                      <div className='flex flex-col items-end'>
                        <div className={`${homeWins ? 'font-bold' : 'font-medium'} mb-2`}>
                          Home
                        </div>
                        <div className='font-medium text-xs'>
                          <DisplayGoals
                            goals={goals.filter((goal) => goal.team === 'home' && goal.match_id === match.id && goal.goals > 0)}
                          />
                        </div>
                      </div>
                    </td>
                    <td className='p-4 text-sm text-foreground text-center align-top'>
                      <span className={`${homeWins ? 'font-bold' : 'font-medium'}`}>{match.home_score}</span>-<span className={`${awayWins ? 'font-bold' : 'font-medium'}`}>{match.away_score}</span>
                    </td>
                    <td className='p-4 text-sm font-medium text-foreground text-left align-top'>
                      <div className='flex flex-col items-start'>
                        <div className={`${awayWins ? 'font-bold' : 'font-medium'} mb-2`}>
                          Away
                        </div>
                        <div className='font-medium text-xs'>
                          <DisplayGoals
                            goals={goals.filter((goal) => goal.team === 'away' && goal.match_id === match.id && goal.goals > 0)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}

export default Display;