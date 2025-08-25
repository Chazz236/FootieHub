import { getMatch } from '@/lib/data/matches';
import Display from './display';


export default async function Match({ params }) {
  try {
    const id = (await params).id;
    const res = await getMatch(id);
    let match = res.match[0];
    let stats = res.stats;
    let goals = res.goals;

    return (
      <Display match={match} stats={stats} goals={goals} />
    )
  } catch (error) {
    console.log('error getting matches:', error)
  }
}