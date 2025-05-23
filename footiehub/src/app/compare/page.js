import { getPlayers, getStats } from '@/lib/data/players';
import Display from './display'

export default async function Compare() {
  try {
    const players = await getPlayers();
    const player1 = players[0];
    const player2 = players[1];

    // const allPlayersStats = {};

    // for (const player of players) {
    //   const stats = await getStats(player.id);
    //   allPlayersStats[player.id] = stats[0];
    // }

    const statsPromises = players.map(player => getStats(player.id));
    const allStatsResults = await Promise.all(statsPromises);
    const allPlayersStats = {};
    players.forEach((player, i) => {
      allPlayersStats[player.id] = allStatsResults[i][0];
    });


    return (
      <Display
        allPlayers={players}
        allStats={allPlayersStats}
        firstPlayerId={player1.id}
        secondPlayerId={player2.id}
      />
    )
  } catch (error) {
    console.error('error getting stats to compare:', error);
  }

}
