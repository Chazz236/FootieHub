'use server'

import { addPlayer } from '@/db/players';
import { revalidatePath } from 'next/cache';

export async function createPlayer(name) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('name must be real');
  }
  try {
    await addPlayer(name);
    revalidatePath('/players');
    return { message: 'player added' };
  } catch (error) {
    console.error('error adding player:', error);
    throw new Error('error adding player');
  }
}