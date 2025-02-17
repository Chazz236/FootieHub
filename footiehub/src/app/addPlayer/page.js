'use client'

import Form from 'next/form';
import { useState } from 'react';

const AddPlayer = () => {

  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name)
    {
      return;
    }
    try {
      const res = await fetch('/api/players', {method: 'POST', body: JSON.stringify({name})});
      const data = await res.json();
      if (res.ok) {
        console.log('all good, ', data.message);
      }
      else {
        console.log('oh no, ', data.error);
      }
    } catch (error) {
      console.log(error);
    }
    setName('');
  };

  return (
    <main className='flex-1 p-6'>
      <Form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label>Name</label>
          <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} className='ml-2 border border-black' required />
        </div>
        <button type='submit' className='border border-black'>Add Player</button>
      </Form>
    </main>
  )
}

export default AddPlayer;