import { getPlayers } from '@/lib/data/players';
import Display from './display';

export default async function AddMatch() {

  try {
    const players = await getPlayers();
    return (
    <Display players={players} />
  )
  } catch (error) {
    console.error('error getting teammates/player:', error);
  }
}