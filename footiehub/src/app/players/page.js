import Link from 'next/link'
import { getAllStats } from '@/lib/data/stats';
import Table from '@/app/components/ui/Table';

const Players = async () => {
  try {
    const stats = await getAllStats();
    return (
      <main className='flex-1 p-6'>
        <Table className='mx-auto w-5/6'>
          <Table.Header>
            <Table.HeaderRow>
              <Table.HeaderCell>NAME</Table.HeaderCell>
              <Table.HeaderCell className='text-center'>GAMES</Table.HeaderCell>
              <Table.HeaderCell className='text-center'>GOALS</Table.HeaderCell>
              <Table.HeaderCell className='text-center'>ASSISTS</Table.HeaderCell>
              <Table.HeaderCell className='text-right border-r-0'>VALUE</Table.HeaderCell>
            </Table.HeaderRow>
          </Table.Header>
          <Table.Body>
            {
              stats.map((player, i) => (
                <Table.Row key={i}>
                  <Table.Cell className='text-primary-accent font-semibold'><Link href={`/players/${player.id}`}>{player.name}</Link></Table.Cell>
                  <Table.Cell className='text-center'>{player.games}</Table.Cell>
                  <Table.Cell className='text-center'>{player.goals ?? 0}</Table.Cell>
                  <Table.Cell className='text-center'>{player.assists ?? 0}</Table.Cell>
                  <Table.Cell className={`${player.value > 0 ? 'text-success-color' : 'text-danger-color'} text-right font-semibold border-r-0`}>{player.value > 0 ? '$' : '-$'}{Intl.NumberFormat().format(Math.abs(player.value))}</Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </main>
    )
  } catch (error) {
    console.error('error getting players:', error);
  }
}

export default Players;