import { getAllTransferChanges, getPlayerTransferChanges } from '@/db/transferValues';

//get all transfer changes for all players
export async function getTransferChanges() {

  try {
    const [transferChanges] = await getAllTransferChanges();
    return transferChanges;
  } catch (error) {
    console.error('error getting all transfer changes:', error);
    throw new Error('error getting transfer changes');
  }
}

//get all transfer changes for player with id
export async function getPlayerChanges(id) {

  //make sure there is an id for player
  if (!id) {
    throw new Error('need player id');
  }

  try {
    const [transferChanges] = await getPlayerTransferChanges(id);
    return transferChanges;
  } catch (error) {
    console.error(`error getting transfer changes for player ${id}:`, error);
    throw new Error(`error getting transfer changes for player ${id}`);
  }
}