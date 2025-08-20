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

  const tableHeader = sort => {
    return (
      <th className='py-2 text-center text-xs font-bold text-foreground uppercase'>
        <div className='flex items-center justify-center gap-1' onClick={() => changeSort(sort)}>
          {sort === 'clean_sheets' ? 'Clean Sheets' : sort.charAt(0).toUpperCase() + sort.slice(1)}
          {sorter.col !== sort && <ChevronUpDownIcon className='w-4 h-4' />}
          {sorter.col === sort && sorter.sort === 'none' && <ChevronUpDownIcon className='w-4 h-4' />}
          {sorter.col === sort && sorter.sort === 'ascending' && <ChevronUpIcon className='w-4 h-4' />}
          {sorter.col === sort && sorter.sort === 'descending' && <ChevronDownIcon className='w-4 h-4' />}
        </div>
      </th>
    );
  };

  return (
    <main className='flex-1 p-6'>
      <h2 className='text-2xl font-bold text-foreground mb-6'>Players</h2>
      <Card className='p-6'>
        <div className='max-h-96 overflow-y-scroll'>
          <table className='table-fixed w-full'>
            <thead>
              <tr>
                {tableHeader('name')}
                {tableHeader('games')}
                {tableHeader('goals')}
                {tableHeader('assists')}
                {tableHeader('clean_sheets')}
                {tableHeader('value')}
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
                  <td className={`py-2 text-sm font-medium text-center ${player.value > 0 ? 'text-success-color' : 'text-danger-color'}`}>
                    {player.value > 0 ? '$' : '-$'}{Intl.NumberFormat().format(Math.abs(player.value))}
                  </td>
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