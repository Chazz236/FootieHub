import { getAllPlayers, getPlayer } from '@/db/players';

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

//get player by id
export async function getPlayerByID(id) {
    //make sure there is an id for player
    if (!id) {
      throw new Error('need player id');
    }
  
    try {
      const [[player]] = await getPlayer(id);
      return player;
    } catch (error) {
      console.error(`error getting player info for player ${id}:`, error);
      throw new Error(`error getting player info for player ${id}`);
    }
}