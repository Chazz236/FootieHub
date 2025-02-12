'use client'

import Header from '../app/components/Header';
import Sidebar from '../app/components/Sidebar';
import { useEffect } from 'react';

const Home = () => {

  useEffect(() => {
      const setupDB = async () => {
        try {
          const res = await fetch('./api/setup-db');
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className ="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2>Stuff here?</h2>
          <p>some more stuff?</p>
        </main>
      </div>
    </div>
  )
}

export default Home;