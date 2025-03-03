import { NextResponse } from 'next/server';
import { getPlayer } from '@/db/players';
import { getPlayerStats, getPlayerWins, getWhoAssists, getWhoScores, getWhoWins } from '@/db/playerStats';

export async function GET(req, {params}) {
    const {id} = await params;
    try {
        const [player] = await getPlayer(id);
        const [stats] = await getPlayerStats(id);
        const [wins] = await getPlayerWins(id);
        const [assists] = await getWhoAssists(id);
        const [goals] = await getWhoScores(id);
        const [winWho] = await getWhoWins(id);
        return NextResponse.json({player, stats, wins, assists, goals, winWho});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}