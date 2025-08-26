import { getPlayers } from '@/lib/data/players';
import { getTeammateStats } from '@/lib/data/teammate';
import Display from './display';

export default async function Teammate() {
  try {
    const players = await getPlayers();

    if (!players || players.length === 0) {
      return (
        <main className='flex-1 p-6'>
          <div className='flex justify-center items-center h-full'>
            <h2 className='text-2xl font-medium text-foreground -mt-16'>
              Add some players and matches to see teammate details!
            </h2>
          </div>
        </main>
      );
    }

    const player1 = players[0];

    const teammatesPromises = players.map(player => getTeammateStats(player.id));
    const allTeammatesResults = await Promise.all(teammatesPromises);
    const allTeammatesStats = {};
    players.forEach((player, i) => {
      allTeammatesStats[player.id] = allTeammatesResults[i];
    });

    return (
      <Display
        allPlayers={players}
        teammateStats={allTeammatesStats}
        firstPlayerId={player1.id}
      />
    )
  } catch (error) {
    console.error('error getting teammates/player:', error);
  }
}
