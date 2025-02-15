'use client'

import { useEffect, useState } from 'react';

const Players = () => {

  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    const getPlayerStats = async () => {
      try {
        const res = await fetch('./api/playerStats');
        const data = await res.json();
        if (res.ok) {
          setPlayerStats(data);
        }
        else {
          console.error('Error: ', data.error);
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    }

    getPlayerStats();
  }, []);

  return (
    <main className="flex-1 p-6">
      <h2>{playerStats.length}</h2>

    </main>
  )
}

export default Players;