import { getStats, getTopGoals, getTopAssists, getTopWinPercentage, getTopValue } from '@/db/playerStats';

export async function getAllStats() {
  try {
    const [stats] = await getStats();
    // console.log(stats);
    return stats;
  } catch (error) {
    console.error('error getting all stats:', error);
    throw new Error('error getting all stats');
  }
}

export async function getGoalsOrdered() {
  try {
    const [goals] = await getTopGoals();
    return goals;
  } catch (error) {
    console.error('error getting goals:', error);
    throw new Error('error getting goals');
  }
}

export async function getAssistsOrdered() {
  try {
    const [assists] = await getTopAssists();
    return assists;
  } catch (error) {
    console.error('error getting assists:', error);
    throw new Error('error getting assists');
  }
}

export async function getWinPercentageOrdered() {
  try {
    const [winPercentage] = await getTopWinPercentage();
    return winPercentage;
  } catch (error) {
    console.error('error getting win percentage:', error);
    throw new Error('error getting win percentage');
  }
}

export async function getValuesOrdered() {
  try {
    const [value] = await getTopValue();
    return value;
  } catch (error) {
    console.error('error getting values:', error);
    throw new Error('error getting values');
  }
}