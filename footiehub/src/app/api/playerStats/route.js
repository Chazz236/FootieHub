import { NextResponse } from "next/server";
import { getStats } from "@/db/playerStats";

export async function GET() {
    try {
        const [stats] = await getStats();
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}