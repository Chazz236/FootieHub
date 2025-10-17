'use server'

import { addMatch, addGoalContributions, updatePlayerPerformance } from '@/db/matches';
import db from '@/db/mysql';
import { revalidatePath } from 'next/cache';

//create a new match and add to the database, and revalidate matches page
export async function createMatch(data) {

  const { date, homeScore, awayScore, homeTeam, awayTeam, goalContributions } = data;

  //make sure there is a date, scores, and the teams have players from the database
  if (!date || Number.isNaN(homeScore) || Number.isNaN(awayScore) || homeTeam.length === 0 || awayTeam.length === 0) {
    throw new Error('invalid input');
  }

  //database transaction to make sure all operations are pass and fail together
  const connection = await db.getConnection();
  await connection.beginTransaction();
  
  try {
    const matchID = await addMatch(date, homeScore, awayScore, connection);
    await addGoalContributions(matchID, goalContributions, connection)
    await updatePlayerPerformance(matchID, homeTeam, awayTeam, homeScore, awayScore, connection);
    await connection.commit();
    revalidatePath('/matches');
    return { message: 'match, goal contributions, player performances added/updated' };
  } catch (error) {
    await connection.rollback();
    throw new Error('failed to create match');
  } finally {
    connection.release();
  }
}