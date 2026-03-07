import { getMatches, getMatchStats } from '@/db/matches';

//get matches and player stats
export async function getAllMatches() {

  try {
    const { matches, stats } = await getMatches();
    return { matches, stats };
  } catch (error) {
    throw new Error('failed to retrieve matches');
  }
}

//get match details and stats from id
export async function getMatch(id) {

  //make sure there is id for match
  if (!id) {
    throw new Error('need match id');
  }

  try {
    const { match, stats, goals } = await getMatchStats(id);
    return { match, stats, goals };
  } catch (error) {
    console.error(`error getting match stats for match ${id}:`, error);
    throw new Error(`error getting match stats for match ${id}`);
  }
}