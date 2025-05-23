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