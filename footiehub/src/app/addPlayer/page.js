'use client'

import { useState } from 'react';
import { createPlayer } from '@/lib/actions/players';
import Card from '@/app/components/ui/Card';

const AddPlayer = () => {

  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
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
    <main className='flex-1 p-6 flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>Add New Player</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-foreground mb-1'>Name</label>
            <input type='text' id='name' value={name} onChange={e => setName(e.target.value)} className='w-full p-2 border border-gray-300 rounded-md text-foreground bg-white' required autoComplete='off' />
          </div>
          <button type='submit' className='w-full py-2 px-4 bg-primary-accent text-panel-foreground font-semibold rounded-md shadow-sm'>Add Player</button>
        </form>
      </Card>
    </main>
  )
}

export default AddPlayer;