import { addMatch, addGoalContributions, updatePlayerPerformance } from '@/db/matches';
import { NextResponse } from 'next/server';
import db from '@/db/mysql';

export async function POST(req) {
    const {date, homeScore, awayScore, homeTeam, awayTeam, goalContributions} = await req.json();
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const matchID = await addMatch(date, homeScore, awayScore, connection);
        for (let contribution of goalContributions) {
            await addGoalContributions(matchID, contribution.goal_scorer_id, contribution.assist_player_id, connection)
        }
        await updatePlayerPerformance(matchID, homeTeam, awayTeam, connection);
        await connection.commit();
        return NextResponse.json({message: 'Match, goal contributions, player performances added/updated'});
    } catch (error) {
        await connection.rollback();
        return NextResponse.json({error: error.message}, {status: 500});
    } finally {
        connection.release();
    }
}