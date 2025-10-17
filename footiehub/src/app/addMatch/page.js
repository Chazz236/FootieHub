import { getPlayers } from '@/lib/data/players';
import Display from './display';

//server component to get players
export default async function AddMatch() {

  try {

    //get all players
    const players = await getPlayers();

    //handle if there are no players
    if (!players || players.length === 0) {
      return (
        <main className='flex-1 p-6'>
          <div className='flex justify-center items-center h-full'>
            <h2 className='text-2xl font-medium text-foreground -mt-16'>
              Add some players first!
            </h2>
          </div>
        </main>
      );
    }

    return (
      <Display players={players} />
    )
  } catch (error) {
    console.error('error getting teammates/player:', error);
  }
}