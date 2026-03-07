'use server'

import { addPlayer } from '@/db/players';
import { revalidatePath } from 'next/cache';

//create a new player to add to database, revalidate players page
export async function createPlayer(name) {

  //make sure name is real
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