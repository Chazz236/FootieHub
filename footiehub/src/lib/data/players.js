import { getAllPlayers } from '@/db/players';

//get all players
export async function getPlayers() {

  try {
    const [players] = await getAllPlayers();
    return players;
  } catch (error) {
    console.error('error getting all players:', error);
    throw new Error('error getting all players');
  }
}