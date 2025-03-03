import { NextResponse } from 'next/server';
import { getStats, getTopGoals, getTopAssists, getTopValue } from '@/db/playerStats';

export async function GET() {
    try {
        const [stats] = await getStats();
        const [goals] = await getTopGoals();
        const [assists] = await getTopAssists();
        const [value] = await getTopValue();
        //console.log('Fetched player stats:', stats);
        return NextResponse.json({stats, goals, assists, value});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}