import { getMatch } from '@/lib/data/matches';

export default async function Match({ params }) {
  try {
    const id = (await params).id;
    const res = await getMatch(id);
    let match = res.match;
    let stats = res.stats;
    let goals = res.goals;

    console.log(match);
    console.log(stats);
    console.log(goals);
    return (
      <div>
      </div>
    )
  } catch (error) {
    console.log('error getting matches:', error)
  }
}