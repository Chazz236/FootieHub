import { getMatches, getMatchStats } from '@/db/matches';

export async function getAllMatches() {
    try {
        const { matches, goals } = await getMatches();
        return { matches, goals };
    } catch (error) {
        throw new Error('failed to retrieve matches');
    }
}

export async function getMatch(id) {
    if (!id) {
        throw new Error('need match id');
    }
    try {
        const { match, stats, goals } = await getMatchStats(id);
        return { match, stats, goals };
    } catch (error) {
        console.error(`error getting match stats for match ${id}:`, error);
        throw new Error(`error getting match stats for match ${id}`);
    }
}