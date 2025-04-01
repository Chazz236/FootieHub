import { NextResponse } from 'next/server';
import { getPlayerStats } from '@/db/playerStats';

export async function GET(req, {params}) {
    const {id} = await params;
    try {
        const [stats] = await getPlayerStats(id);
        return NextResponse.json({ stats });
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}