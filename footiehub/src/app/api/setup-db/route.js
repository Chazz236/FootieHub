import { NextResponse } from "next/server";
import playerTable from '@/db/createPlayersTable';
import matchesTable from '@/db/createMatchesTable';
import playerPerformance from "@/db/createPlayerPerformanceTable";
import goalContributions from "@/db/createGoalContributionsTable";

export async function GET() {
  try {
    await playerTable();
    await matchesTable();
    await playerPerformance();
    await goalContributions();
    return NextResponse.json({message: 'Database setup'});
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}