'use client'

import { useState, useEffect } from 'react';

export async function getPlayers() {
  const res = await fetch('http://localhost:3000/api/players');
  const data = await res.json();
  return data;
}

const AddMatch = () => {

  const [date, setDate] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeTeam, setHomeTeam] = useState([]);
  const [awayTeam, setAwayTeam] = useState([]);
  const [goalContributions, setGoalContributions] = useState([{ goal_scorer_id: 0, assist_player_id: 0 }]);

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const getPlayerNames = async () => {
      const playerNames = await getPlayers();
      setPlayers(playerNames);
    }
    getPlayerNames();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    if (!Array.isArray(goalContributions)) {
      console.error('goalContributions is not an array:', goalContributions);
      return;
    }

    if (!date || !homeScore || !awayScore || !homeTeam || !awayTeam || !goalContributions) {
      alert('Please fill all required fields and select players for both teams');
      return;
    }

    if (goalContributions.length !== homeScore + awayScore) {
      alert('Goal contributions count does not match the total score:', goalContributions, homeScore + awayScore);
      return;
    }

    try {
      const res = await fetch('/api/matches', { method: 'POST', body: JSON.stringify({ date, homeScore, awayScore, homeTeam, awayTeam, goalContributions }) });
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

    setDate('');
    setHomeScore(0);
    setAwayScore(0);
    setHomeTeam([]);
    setAwayTeam([]);
    setGoalContributions([{ goal_scorer_id: 0, assist_player_id: 0 }]);
  };

  const handleHomeTeamChange = (playerID) => {
    setHomeTeam((team) => team.includes(playerID) ? team.filter(id => id != playerID) : [...team, playerID]);
  }

  const handleAwayTeamChange = (playerID) => {
    setAwayTeam((team) => team.includes(playerID) ? team.filter(id => id != playerID) : [...team, playerID]);
  }

  const handleGoalContributionChange = (i, field, value) => {
    const updatedGoalContributions = [...goalContributions];
    updatedGoalContributions[i][field] = parseInt(value, 10);
    setGoalContributions(updatedGoalContributions);
  }

  const addGoalContribution = () => {
    setGoalContributions([...goalContributions, { goal_scorer_id: 0, assist_player_id: 0 }]);
  };

  const removeGoalContribution = (i) => {
    const updatedGoalContributions = goalContributions.filter((_, j) => j !== i);
    setGoalContributions(updatedGoalContributions);
  };

  return (
    <main className='flex-1 p-6'>
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label>Date</label>
          <input type='date' id='date' value={date} onChange={(e) => setDate(e.target.value)} className='ml-2 border border-black' required />
        </div>

        <div className='mb-6'>
          <label>Home Score</label>
          <input type='number' id='homeScore' value={homeScore} onChange={(e) => setHomeScore(parseInt(e.target.value, 10))} className='ml-2 border border-black' required />
        </div>

        <div className='mb-6'>
          <label>Away Score</label>
          <input type='number' id='awayScore' value={awayScore} onChange={(e) => setAwayScore(parseInt(e.target.value, 10))} className='ml-2 border border-black' required />
        </div>

        <div className='flex'>
          <div className='mb-6'>
            <label>Home Team</label>
            {players.map((player) => (
              <div key={player.id}>
                <input type='checkbox' id={player.id} onChange={() => handleHomeTeamChange(player.id)} className='ml-2 border border-black' />
                <label>{player.name}</label>
              </div>
            ))}
          </div>

          <div className='mb-6'>
            <label>Away Team</label>
            {players.map((player) => (
              <div key={player.id}>
                <input type='checkbox' id={player.id} onChange={() => handleAwayTeamChange(player.id)} className='ml-2 border border-black' />
                <label>{player.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <label>Goal Contributions</label>
          {console.log('goalContributions:', goalContributions)}
          {Array.isArray(goalContributions) && goalContributions.map((contribution, i) => (
            <div key={i}>
              <div>
                <label>Goal</label>
                <select value={contribution.goal_scorer_id} onChange={(e) => handleGoalContributionChange(i, 'goal_scorer_id', e.target.value)} className='ml-2 border border-black'>
                  <option key='' value=''>Goal</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>{player.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Assist</label>
                <select value={contribution.assist_player_id} onChange={(e) => handleGoalContributionChange(i, 'assist_player_id', e.target.value)} className='ml-2 border border-black'>
                  <option key='' value=''>Assist</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>{player.name}</option>
                  ))}
                </select>
              </div>
              <button type='button' onClick={() => removeGoalContribution(i)} className="ml-2 text-red-500">Remove</button>
            </div>
          ))}
          <button type='button' onClick={addGoalContribution} className="ml-2 text-red-500">Add Goal Contribution</button>
        </div>

        <button type='submit' className='border border-black'>Add Match</button>
      </form>
    </main>
  )
}

export default AddMatch;