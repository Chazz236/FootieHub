import { getPlayers } from '@/lib/data/players';
import { getTeammateStats } from '@/lib/data/teammate';
import Display from './display';

export default async function Teammate() {
  try {
    const players = await getPlayers();
    const player1 = players[0];

    // const allTeammatesStats = {};

    // for (const player of players) {
    //   const teammateStats = await getTeammateStats(player.id);
    //   allTeammatesStats[player.id] = teammateStats;
    // }

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
