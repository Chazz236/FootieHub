import { NextResponse } from 'next/server';
import { getPlayerStats, getTransferChanges } from '@/db/playerStats';

export async function GET(req, {params}) {
    const {id} = await params;
    try {
        const [stats] = await getPlayerStats(id);
        const [transferChanges] = await getTransferChanges(id);
        return NextResponse.json({ stats, transferChanges });
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}