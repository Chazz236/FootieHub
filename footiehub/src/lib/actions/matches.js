'use server'

import { addMatch, addGoalContributions, updatePlayerPerformance } from '@/db/matches';
import db from '@/db/mysql';
import { revalidatePath } from 'next/cache';

export async function createMatch(data) {
  const { date, homeScore, awayScore, homeTeam, awayTeam, goalContributions } = data;

  //this sucks make it better
  if (!date || homeScore === null || homeScore === undefined || homeScore === '' || awayScore === null || awayScore === undefined || awayScore === '' || homeTeam.length === 0 || awayTeam.length === 0 || !Array.isArray(goalContributions)) {
    throw new Error('invalid input');
  }

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