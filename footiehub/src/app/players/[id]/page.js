import { getStats } from '@/lib/data/players';
import { getPlayerChanges } from '@/lib/data/transfers';
import Display from './display';

export default async function Player({ params }) {

  try {
    const id = (await params).id;
    const[stats, transferChanges] = await Promise.all([
      getStats(id),
      getPlayerChanges(id)
    ])

    const playerTransferChanges = transferChanges && transferChanges.length > 0 ? transferChanges : [{
      value_change: stats[0].value,
      date: new Date().toISOString()
    }];

    return (
      <Display stats={stats} transferChanges={playerTransferChanges} />
    )
  } catch (error) {
    console.error('error getting player stuff:', error);
  }
}