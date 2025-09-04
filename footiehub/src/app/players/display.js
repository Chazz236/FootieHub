'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import Card from '@/app/components/ui/Card'
import { ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';

const Display = ({ stats }) => {

  const years = ['All Time', ...new Set(stats.map(stat => stat.year).filter(year => year !== null).sort())];
  const [year, setYear] = useState(years[0]);

  const allTimeStats = Object.values(stats.reduce((accumulator, currentStats) => {
    const { id, name, games, wins, clean_sheets, goals, assists, value } = currentStats;
    if (!accumulator[name]) {
      accumulator[name] = { id, name, games, wins, clean_sheets, goals, assists, value };
    }
    else {
      accumulator[name].games += games;
      accumulator[name].wins += wins;
      accumulator[name].clean_sheets += clean_sheets;
      accumulator[name].goals += goals;
      accumulator[name].assists += assists;
      accumulator[name].value = value;
    }
    return accumulator;
  }, {}));

  const [yearStats, setYearStats] = useState(allTimeStats);
  const [sorter, setSorter] = useState({ col: null, sort: 'none' });

  useEffect(() => {
    if (sorter.col === 'name') {
      if (sorter.sort === 'ascending') {
        const sortedCopy = [...yearStats].sort((a, b) => a.name.localeCompare(b.name));
        setYearStats(sortedCopy);
      }
      else if (sorter.sort === 'descending') {
        const sortedCopy = [...yearStats].sort((a, b) => b.name.localeCompare(a.name));
        setYearStats(sortedCopy);
      }
      else {
        if (year !== 'All Time') {
          setYearStats(stats.filter(stat => stat.year === year));
        }
        else {
          setYearStats(allTimeStats);
        }
      }
    }
    else {
      if (sorter.sort === 'ascending') {
        const sortedCopy = [...yearStats].sort((a, b) => a[sorter.col] - b[sorter.col]);
        setYearStats(sortedCopy);
      }
      else if (sorter.sort === 'descending') {
        const sortedCopy = [...yearStats].sort((a, b) => b[sorter.col] - a[sorter.col]);
        setYearStats(sortedCopy);
      }
      else {
        if (year !== 'All Time') {
          setYearStats(stats.filter(stat => stat.year === year));
        }
        else {
          setYearStats(allTimeStats);
        }
      }
    }
  }, [sorter]);

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
        <div className='flex items-center justify-center gap-1 cursor-pointer' onClick={() => changeSort(sort)}>
          {sort === 'clean_sheets' ? 'Clean Sheets' : sort.charAt(0).toUpperCase() + sort.slice(1)}
          {sorter.col !== sort && <ChevronUpDownIcon className='w-4 h-4' />}
          {sorter.col === sort && sorter.sort === 'none' && <ChevronUpDownIcon className='w-4 h-4' />}
          {sorter.col === sort && sorter.sort === 'ascending' && <ChevronUpIcon className='w-4 h-4' />}
          {sorter.col === sort && sorter.sort === 'descending' && <ChevronDownIcon className='w-4 h-4' />}
        </div>
      </th>
    );
  };

  const handleYearChange = (dir) => {
    let i = years.indexOf(year);
    if (dir === 'next') {
      i = (i + 1) % years.length;
    }
    else {
      i = (i - 1 + years.length) % years.length;
    }
    const newYear = years[i];
    setYear(newYear);
    if (newYear !== 'All Time') {
      setYearStats(stats.filter(stat => stat.year === newYear));
    }
    else {
      setYearStats(allTimeStats);
    }
  };

  return (
    <main className='flex-1 p-6'>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>Players</h2>
        <div className='flex items-start'>
          <ChevronLeftIcon className='w-8 h-8 p-1 cursor-pointer' onClick={() => handleYearChange('prev')} />
          <h3 className='text-lg font-bold text-foreground w-24 text-center'>{year}</h3>
          <ChevronRightIcon className='w-8 h-8 p-1 cursor-pointer' onClick={() => handleYearChange('next')} />
        </div>
      </div>
      <Card className='p-6'>
        <div className='max-h-[calc(100vh-10rem)] overflow-y-scroll'>
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
              {yearStats.map(player => (
                <tr key={player.id}>
                  <td className='py-2 text-sm font-medium text-foreground text-center'><Link href={`/players/${player.id}`}>{player.name}</Link></td>
                  <td className='py-2 text-sm font-medium text-foreground text-center'>{player.games}</td>
                  <td className='py-2 text-sm font-medium text-foreground text-center'>{player.goals}</td>
                  <td className='py-2 text-sm font-medium text-foreground text-center'>{player.assists}</td>
                  <td className='py-2 text-sm font-medium text-foreground text-center'>{player.clean_sheets}</td>
                  <td className={`py-2 text-sm font-medium text-center ${player.value > 0 ? 'text-success-color' : 'text-danger-color'}`}>
                    {player.value >= 0 ? '$' : '-$'}{Intl.NumberFormat().format(Math.abs(player.value))}
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