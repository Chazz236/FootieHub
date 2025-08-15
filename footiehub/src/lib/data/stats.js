import { getStats } from '@/db/playerStats';

export async function getAllStats() {
  try {
    const [stats] = await getStats();
    return stats;
  } catch (error) {
    console.error('error getting all stats:', error);
    throw new Error('error getting all stats');
  }
}