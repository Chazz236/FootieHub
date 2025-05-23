import { getMatches } from '@/db/matches';

export async function getAllMatches() {
    try {
        const { matches, goals } = await getMatches();
        //console.log('got the matches');
        return { matches, goals };
    } catch (error) {
        throw new Error('failed to retrieve matches');
    }
}