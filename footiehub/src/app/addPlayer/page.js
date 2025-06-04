'use client'

import { useState } from 'react';
import { createPlayer } from '@/lib/actions/players';

const AddPlayer = () => {
  
  const [name, setName] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name)
    {
      return;
    }
    try {
          const res = await createPlayer(name);
          alert(res.message);
          setName('')
        } catch (error) {
          console.error('failed to add player:', error.message);
          alert(`Error: ${error.message}`);
        }
  };

  return (
    <main className='flex-1 p-6'>
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label>Name</label>
          <input type='text' id='name' value={name} onChange={e => setName(e.target.value)} className='ml-2 border border-black' required />
        </div>
        <button type='submit' className='border border-black'>Add Player</button>
      </form>
    </main>
  )
}

export default AddPlayer;