import { NextResponse } from 'next/server';
import { getAllTeammates } from '@/db/teammate';

export async function GET(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    try {
        const [stats] = await getAllTeammates(id);
        //console.log('Fetched teammate stats:', stats);
        return NextResponse.json({stats});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}