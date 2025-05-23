import { getAllTransferChanges, getPlayerTransferChanges } from '@/db/transferValues';

export async function getTransferChanges() {
  try {
    const [transferChanges] = await getAllTransferChanges();
    return transferChanges;
  } catch (error) {
    console.error('error getting all transfer changes:', error);
    throw new Error('error getting transfer changes');
  }
}

export async function getPlayerChanges(id) {
    try {
      const [transferChanges] = await getPlayerTransferChanges(id);
      return transferChanges;
    } catch (error) {
      console.error(`error getting transfer changes for player ${id}:`, error);
      throw new Error(`error getting transfer changes for player ${id}`);
    }
}