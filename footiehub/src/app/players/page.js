import { getAllStats } from '@/lib/data/stats';
import Display from './display';

const Players = async () => {
  try {
    const stats = await getAllStats();
    return (
      <Display stats={stats} />
    )
  } catch (error) {
    console.error('error getting players:', error);
  }
}

export default Players;