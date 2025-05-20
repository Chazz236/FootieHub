import { NextResponse } from 'next/server';
import { getAllTransferChanges } from '@/db/transferValues';

export async function GET() {
    try {
        const [transferChanges] = await getAllTransferChanges();
        console.log(transferChanges);
        return NextResponse.json(transferChanges);
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}