import { getPlayers } from '@/lib/data/players';
import Display from './display';

export default async function AddMatch() {

  try {
    const players = await getPlayers();

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