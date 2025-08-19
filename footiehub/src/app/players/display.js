'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import Card from '@/app/components/ui/Card'
import { ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

const Display = ({ stats }) => {

  const [sorter, setSorter] = useState({ col: null, sort: 'none' });
  const [sortedStats, setSortedStats] = useState(stats);

  useEffect(() => {
    if (sorter.col === 'name') {
      if (sorter.sort === 'ascending') {
        const sortedCopy = [...sortedStats].sort((a, b) => a.name.localeCompare(b.name));
        setSortedStats(sortedCopy);
      }
      else if (sorter.sort === 'descending') {
        const sortedCopy = [...sortedStats].sort((a, b) => b.name.localeCompare(a.name));
        setSortedStats(sortedCopy);
      }
      else {
        setSortedStats(stats);
      }
    }
    else {
      if (sorter.sort === 'ascending') {
        const sortedCopy = [...sortedStats].sort((a, b) => a[sorter.col] - b[sorter.col]);
        setSortedStats(sortedCopy);
      }
      else if (sorter.sort === 'descending') {
        const sortedCopy = [...sortedStats].sort((a, b) => b[sorter.col] - a[sorter.col]);
        setSortedStats(sortedCopy);
      }
      else {
        setSortedStats(stats);
      }
    }
  }, [sorter])

  const changeSort = (col) => {
    let sort = 'ascending';
    if (sorter.col === col) {
      if (sorter.sort === 'ascending') {
        sort = 'descending';
      }
      else if (sorter.sort === 'descending') {
        sort = 'none';
      }
    }
    setSorter({ col, sort });
  };

  return (
    <main className='flex-1 p-6'>
      <h2 className='text-2xl font-bold text-foreground mb-6'>Players</h2>
      <Card className='p-6'>
        <div className='max-h-96 overflow-y-scroll'>
          <table className='table-fixed w-full'>
            <thead>
              <tr>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>
                  <div className='flex items-center justify-center gap-1' onClick={() => changeSort('name')}>
                    Name
                    {sorter.col !== 'name' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'name' && sorter.sort === 'none' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'name' && sorter.sort === 'ascending' && <ChevronUpIcon className='w-4 h-4' />}
                    {sorter.col === 'name' && sorter.sort === 'descending' && <ChevronDownIcon className='w-4 h-4' />}
                  </div>
                </th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>
                  <div className='flex items-center justify-center gap-1' onClick={() => changeSort('games')}>
                    Games
                    {sorter.col !== 'games' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'games' && sorter.sort === 'none' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'games' && sorter.sort === 'ascending' && <ChevronUpIcon className='w-4 h-4' />}
                    {sorter.col === 'games' && sorter.sort === 'descending' && <ChevronDownIcon className='w-4 h-4' />}
                  </div>
                </th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>
                  <div className='flex items-center justify-center gap-1' onClick={() => changeSort('goals')}>
                    Goals
                    {sorter.col !== 'goals' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'goals' && sorter.sort === 'none' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'goals' && sorter.sort === 'ascending' && <ChevronUpIcon className='w-4 h-4' />}
                    {sorter.col === 'goals' && sorter.sort === 'descending' && <ChevronDownIcon className='w-4 h-4' />}
                  </div>
                </th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>
                  <div className='flex items-center justify-center gap-1' onClick={() => changeSort('assists')}>
                    Assists
                    {sorter.col !== 'assists' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'assists' && sorter.sort === 'none' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'assists' && sorter.sort === 'ascending' && <ChevronUpIcon className='w-4 h-4' />}
                    {sorter.col === 'assists' && sorter.sort === 'descending' && <ChevronDownIcon className='w-4 h-4' />}
                  </div>
                </th>
                <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>
                  <div className='flex items-center justify-center gap-1' onClick={() => changeSort('clean_sheets')}>
                    Clean Sheets
                    {sorter.col !== 'clean_sheets' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'clean_sheets' && sorter.sort === 'none' && <ChevronUpDownIcon className='w-4 h-4' />}
                    {sorter.col === 'clean_sheets' && sorter.sort === 'ascending' && <ChevronUpIcon className='w-4 h-4' />}
                    {sorter.col === 'clean_sheets' && sorter.sort === 'descending' && <ChevronDownIcon className='w-4 h-4' />}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStats.map(player => (
                <tr key={player.id}>
                  <td className='py-2 text-sm font-medium text-foreground text-center'><Link href={`/players/${player.id}`}>{player.name}</Link></td>
                  <td className='py-2 text-sm font-medium text-foreground text-center'>{player.games}</td>
                  <td className='py-2 text-sm font-medium text-foreground text-center'>{player.goals}</td>
                  <td className='py-2 text-sm font-medium text-foreground text-center'>{player.assists}</td>
                  <td className='py-2 text-sm font-medium text-foreground text-center'>{player.clean_sheets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}

export default Display;