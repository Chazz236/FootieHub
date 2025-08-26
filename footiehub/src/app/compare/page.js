import { getPlayers, getStats } from '@/lib/data/players';
import { getTransferChanges } from '@/lib/data/transfers';
import Display from './display'

export default async function Compare() {
  try {
    const players = await getPlayers();

    if (!players || players.length === 0) {
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

    const statsPromises = players.map(player => getStats(player.id));
    const allStatsResults = await Promise.all(statsPromises);
    const allPlayersStats = {};
    players.forEach((player, i) => {
      allPlayersStats[player.id] = allStatsResults[i][0];
    });

    const transferChanges = await getTransferChanges();
    const playerTransferChanges = transferChanges.reduce(
      (accumulator, currentValue) => {
        const id = currentValue.player_id;
        if (!accumulator[id]) {
          accumulator[id] = []
        }
        accumulator[id].push(currentValue);
        return accumulator;
      },
      {}
    );

    return (
      <Display
        allPlayers={players}
        allStats={allPlayersStats}
        firstPlayerId={players[0].id}
        secondPlayerId={players[1].id}
        thirdPlayerId={players[2].id}
        allChanges={playerTransferChanges}
      />
    )
  } catch (error) {
    console.error('error getting stats to compare:', error);
  }
}