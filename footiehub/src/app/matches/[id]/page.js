import { getMatch } from '@/lib/data/matches';
import Display from './display';

//server component to get match data, player stats, and goal contributions
export default async function Match({ params }) {
  
  try {
    const id = (await params).id;
    
    //get match details
    const { match: [match], stats, goals } = await getMatch(id);

    //handle if there is no match
    if (!match || match.length === 0) {
      return (
        <main className='flex-1 p-6'>
          <div className='flex justify-center items-center h-full'>
            <h2 className='text-2xl font-medium text-foreground -mt-16'>
              Add some players and matches to see match details!
            </h2>
          </div>
        </main>
      );
    }

    return (
      <Display match={match} stats={stats} goals={goals} />
    )
  } catch (error) {
    console.log('error getting matches:', error)
  }
}