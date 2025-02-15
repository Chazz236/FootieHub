'use client'

import { useEffect, useState } from 'react';

const Home = () => {

  const [players, setPlayers] = useState([]);

  useEffect(() => {
      const setupDB = async () => {
        try {
          const res = await fetch('./api/setupDB');
          const data = await res.json();
          if (res.ok) {
            console.log(data.message);
          }
          else {
            console.error('Error: ', data.error);
          }
        } catch (error) {
          console.error('Error: ', error);
        }
      }

      setupDB();
    }, []);

    useEffect(() => {
      const getPlayers = async () => {
        try {
          const res = await fetch('./api/players');
          const data = await res.json();
          if (res.ok) {
            setPlayers(data);
          }
          else {
            console.error('Error: ', data.error);
          }
        } catch (error) {
          console.error('Error: ', error);
        }
      }

      getPlayers();
    }, []);

  return (
    <main className="flex-1 p-6">
      <h2>Stuff here?</h2>
      <p>some more stuff?</p>
      <p>{players.length}</p>
    </main>
  )
}

export default Home;