import { NextResponse } from 'next/server';
import { getStats, getTopGoals, getTopAssists } from '@/db/playerStats';

export async function GET() {
    try {
        const [stats] = await getStats();
        const [goals] = await getTopGoals();
        const [assists] = await getTopAssists();
        return NextResponse.json({stats, goals, assists});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}