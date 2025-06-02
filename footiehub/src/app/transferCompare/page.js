import { getPlayers } from '@/lib/data/players';
import { getTransferChanges } from '@/lib/data/transfers';
import Display from './display'
export default async function TransferCompare() {
  
  try {
    const players = await getPlayers();
    const player1 = players[0];
    const transferChanges = await getTransferChanges();

    const playerTransferChanges = transferChanges.reduce(
      (accumulator, currentValue) => {
        const id = currentValue.player_id;
        if (!accumulator[id]) {
          accumulator[id] = []
        }
        accumulator[id].push(currentValue);
        return accumulator;
      },
      {}
    );

    return (
      <Display
        allPlayers={players}
        firstPlayerId={player1.id}
        allChanges={playerTransferChanges}
      />
    )
  } catch (error) {
    console.error('error getting all transfer changes:', error);
  }
}