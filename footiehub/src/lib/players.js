'use server'

import { getAllPlayers, addPlayer } from '@/db/players';
import { getPlayerStats } from '@/db/playerStats';

export async function getPlayers() {
  try {
    const [players] = await getAllPlayers();
    return players;
  } catch (error) {
    console.error('error getting all players:', error);
    throw new Error('error getting all players');
  }
}

export async function createPlayer(name) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('name must be real');
  }
  try {
    await addPlayer(name);
    return { message: 'player added' };
  } catch (error) {
    console.error('error adding player:', error);
    throw new Error('error adding player');
  }
}

export async function getStats(id) {
  if (!id) {
    throw new Error('need player id');
  }
  try {
    const [stats] = await getPlayerStats(id);
    return stats;
  } catch (error) {
    console.error(`error getting player stats for player ${id}:`, error);
    throw new Error(`error getting player stats for player ${id}`);
  }
}