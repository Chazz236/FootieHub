import { addMatch, addGoalContributions, updatePlayerPerformance, getMatches } from '@/db/matches';
import { NextResponse } from 'next/server';
import db from '@/db/mysql';

export async function POST(req) {
    const {date, homeScore, awayScore, homeTeam, awayTeam, goalContributions} = await req.json();
    
    if (!date || !homeScore || !awayScore || !homeTeam || !awayTeam || !Array.isArray(goalContributions)) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const matchID = await addMatch(date, homeScore, awayScore, connection);
        await addGoalContributions(matchID, goalContributions, connection)
        await updatePlayerPerformance(matchID, homeTeam, awayTeam, homeScore, awayScore, connection);
        await connection.commit();
        return NextResponse.json({message: 'Match, goal contributions, player performances added/updated'});
    } catch (error) {
        await connection.rollback();
        return NextResponse.json({error: error.message}, {status: 500});
    } finally {
        connection.release();
    }
}

export async function GET() {
    try {
        const {matches, goals} = await getMatches();
        //console.log('got the matches');
        return NextResponse.json({matches, goals});

    } catch (error) {
        return NextResponse.json({error: error.message}, {status:500});
    }
}