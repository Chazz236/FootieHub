'use server'

import { addPlayer, updatePlayer } from '@/db/players';
import { revalidatePath } from 'next/cache';

//create a new player to add to database, revalidate players page
export async function createPlayer(name, joinedAt) {

  //make sure name is real
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('name must be real');
  }

  //should have joined date
  if (!joinedAt) {
    throw new Error('must have joined date')
  }

  try {
    await addPlayer(name, joinedAt);
    revalidatePath('/players');
    return { message: 'player added' };
  } catch (error) {
    console.error('error adding player:', error);
    throw new Error('error adding player');
  }
}

//update player, revalidate individual player's page
export async function updatePlayerId(id, name, joinedAt) {

  //make sure name is real
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('name must be real');
  }

  //should have joined date
  if (!joinedAt) {
    throw new Error('must have joined date')
  }

  try {
    await updatePlayer(id, name, joinedAt);
    revalidatePath('/players');
    revalidatePath(`/players/${id}`);
    return { message: 'player updated' };
  } catch (error) {
    console.error('error updating player:', error);
    throw new Error('error updating player');
  }
}