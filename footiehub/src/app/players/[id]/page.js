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

    return (
      <Display stats={stats} transferChanges={transferChanges} />
    )
  } catch (error) {
    console.error('error getting player stuff:', error);
  }
}