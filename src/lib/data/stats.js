import { getStats, getPlayerStats } from '@/db/stats';

//get stats of all players
export async function getAllStats() {

  try {
    const [stats] = await getStats();
    return stats;
  } catch (error) {
    console.error('error getting all stats:', error);
    throw new Error('error getting all stats');
  }
}

//get stats of player with id
export async function getPlayerStatsByID(id) {

  //make sure there is an id for player
  if (!id) {
    throw new Error('need player id');
  }

  try {
    const [stats] = await getPlayerStats(id);
    return stats;
  } catch (error) {
    console.error(`error getting player stats for player ${id}:`, error);
    throw new Error(`error getting player stats for player ${id}`);
  }
}