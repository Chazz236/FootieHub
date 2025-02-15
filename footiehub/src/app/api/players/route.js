import { NextResponse } from "next/server";
import { getAllPlayers, addPlayer } from "@/db/players";

export async function GET() {
    try {
        const [players] = await getAllPlayers();
        console.log("Fetched players:", players);
        return NextResponse.json(players);
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function POST(req) {
    const {name, playstyle} = await req.json();
    try {
        await addPlayer(name, playstyle);
        return NextResponse.json({message: 'Player added'});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}