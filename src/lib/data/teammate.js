import { getAllTeammates } from "@/db/teammate";

//get stats of all teammates that have played with player with id
export async function getTeammateStats(id) {

  //make sure there is id for player
  if (!id) {
    throw new Error('need player id');
  }

  try {
    const [teammateStats] = await getAllTeammates(id);
    return teammateStats;
  } catch (error) {
    console.error('error getting teammate stats:', error);
    throw new Error('error getting teammate stats');
  }
}