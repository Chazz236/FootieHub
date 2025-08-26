import React from 'react';
import { getAllMatches } from '@/lib/data/matches';
import Display from './display';

export default async function Matches() {

  let matches = [];
  let goals = [];

  try {
    const res = await getAllMatches();
    matches = res.matches;
    goals = res.goals;

    if (!matches || matches.length === 0) {
      return (
        <main className='flex-1 p-6'>
          <div className='flex justify-center items-center h-full'>
            <h2 className='text-2xl font-medium text-foreground -mt-16'>
              Add some players and matches to see matches!
            </h2>
          </div>
        </main>
      );
    }

    const sortedMatches = [...matches].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    })

    return (
      <Display matches={sortedMatches} goals={goals} />
    )
  } catch (error) {
    console.log('error getting matches:', error)
  }
}