import { getAllPlayers, getPlayerStats, getPlayedYears } from '@/db/players';

export async function getPlayers() {
  try {
    const [players] = await getAllPlayers();
    return players;
  } catch (error) {
    console.error('error getting all players:', error);
    throw new Error('error getting all players');
  }
}

export async function getStats(id, year = null) {
  if (!id) {
    throw new Error('need player id');
  }
  try {
    const [stats] = await getPlayerStats(id, year);
    return stats;
  } catch (error) {
    console.error(`error getting player stats for player ${id}:`, error);
    throw new Error(`error getting player stats for player ${id}`);
  }
}

export async function getYears(id) {
  if (!id) {
    throw new Error('need match id');
  }
  try {
    const {years} = await getPlayedYears(id);
    return years;
  } catch (error) {
    console.error(`error getting years for player ${id}:`, error);
    throw new Error(`error getting years for player ${id}`);
  }
}