import React from 'react';
import { getAllMatches } from '@/lib/data/matches';
import Display from './display';

//server component to get matches and match stats
export default async function Matches() {

  try {

    //get all matches and their stats
    const { matches, stats } = await getAllMatches();

    //handle if there are no matches
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

    //sort matches by ascending date
    const sortedMatches = [...matches].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    })

    return (
      <Display matches={sortedMatches} stats={stats} />
    )
  } catch (error) {
    console.log('error getting matches:', error)
  }
}