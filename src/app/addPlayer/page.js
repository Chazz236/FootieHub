'use client'

import { useState } from 'react';
import { createPlayer } from '@/lib/actions/players';
import Card from '@/app/components/ui/Card';

//page to add a new player to the database
const AddPlayer = () => {

  const [name, setName] = useState('');
  const [joinedAt, setJoinedAt] = useState(new Date().toISOString().split('T')[0]);

  //check if there is a name, then add player to the database
  const handleAdd = async () => {
    if (!name || !joinedAt) {
      alert('add both name and join date');
      return;
    }

    try {
      const res = await createPlayer(name, joinedAt);
      alert(res.message);
      setName('');
      setJoinedAt(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('failed to add player:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <main className='flex-1 p-6'>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-foreground'>Add New Player</h2>
          <div>
            <button type='button' onClick={handleAdd} className='w-full py-2 px-4 bg-primary-accent text-panel-foreground font-semibold rounded-md shadow-sm'>Add Player</button>
          </div>
        </div>
        <Card className='w-full max-w-md p-6'>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-foreground mb-1'>Name</label>
            <input type='text' id='name' value={name} onChange={e => setName(e.target.value)} className='w-full p-2 border border-gray-300 rounded-md text-foreground bg-white' required autoComplete='off' />
          </div>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-foreground mb-1'>Joined Date</label>
            <input type='date' id='joinDate' value={joinedAt} onChange={e => setJoinedAt(e.target.value)} className='w-full p-2 border border-gray-300 rounded-md text-foreground bg-white' required autoComplete='off' />
          </div>
        </Card>
      </form>
    </main>
  )
}

export default AddPlayer;