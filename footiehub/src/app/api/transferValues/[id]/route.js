import { NextResponse } from 'next/server';
import { getTransferChanges } from '@/db/transferValues';

export async function GET(req, {params}) {
    const {id} = await params;
    try {
        const [transferChanges] = await getTransferChanges(id);
        return NextResponse.json({transferChanges});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}