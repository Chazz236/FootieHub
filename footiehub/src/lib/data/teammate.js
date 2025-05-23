import { getAllTeammates } from "@/db/teammate";

export async function getTeammateStats(id) {
  try {
    if (!id) {
      throw new Error('need player id');
    }
    const [teammateStats] = await getAllTeammates(id);
    // console.log(teammateStats);
    return teammateStats;
  } catch (error) {
    console.error('error getting teammate stats:', error);
    throw new Error('error getting teammate stats');
  }
}