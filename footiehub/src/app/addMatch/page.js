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

  useEffect(() => {
    const totalGoals = homeScore + awayScore;
    if (totalGoals !== goalContributions.length) {
      const totalGoalContributions = Array(totalGoals).fill({ goal_scorer_id: 0, assist_player_id: 0 });
      setGoalContributions(totalGoalContributions);
    }
  }, [homeScore, awayScore]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!Array.isArray(goalContributions)) {
      console.error('goalContributions is not an array:', goalContributions);
      return;
    }

    if (!date) {
      alert('Please fill date');
      return;
    }
    if (homeScore === null || homeScore === undefined || homeScore === '') {
      alert('Please fill homeScore');
      return;
    }
    if (awayScore === null || awayScore === undefined || awayScore === '') {
      alert('Please fill awayScore');
      return;
    }
    if (homeTeam.length === 0) {
      alert('Please fill homeTeam');
      return;
    }
    if (awayTeam.length === 0) {
      alert('Please fill awayTeam');
      return;
    }
    // if (!goalContributions) {
    //   alert('Please fill goalContributions');
    //   return;
    // }

    if (goalContributions.length !== homeScore + awayScore) {
      alert('Goal contributions count does not match the total score:', goalContributions, homeScore + awayScore);
      return;
    }

    try {
      const res = await fetch('/api/matches', { method: 'POST', body: JSON.stringify({ date, homeScore, awayScore, homeTeam, awayTeam, goalContributions }) });
      const data = await res.json();
      if (res.ok) {
        console.log('all good, ', data.message);
        alert('Match submitted')
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
    setHomeTeam((oldTeam) => {
      const newTeam = oldTeam.includes(playerID) ? oldTeam.filter(id => id != playerID) : [...oldTeam, playerID];
      setAwayTeam((team) => team.filter(id => id !== playerID));
      return newTeam;
    });
  }

  const handleAwayTeamChange = (playerID) => {
    setAwayTeam((oldTeam) => {
      const newTeam = oldTeam.includes(playerID) ? oldTeam.filter(id => id != playerID) : [...oldTeam, playerID];
      setHomeTeam((team) => team.filter(id => id !== playerID));
      return newTeam;
    });
  }

  const handleGoalContributionChange = (i, field, value) => {
    const updatedGoalContributions = [...goalContributions];
    updatedGoalContributions[i][field] = parseInt(value, 10);
    setGoalContributions(updatedGoalContributions);
  }

  return (
    <main className='flex-1 p-6'>
      <form onSubmit={handleSubmit}>
      <div className='flex gap-32'>
        <div>
        <div className='mb-6'>
          <label>Date</label>
          <input type='date' id='date' value={date} onChange={(e) => setDate(e.target.value)} className='ml-2 border border-black' required />
        </div>

        <div className='mb-6'>
          <label>Home Score</label>
          <input type='number' id='homeScore' value={homeScore} onChange={(e) => setHomeScore(parseInt(e.target.value, 10))} className='ml-2 border border-black' min='0' required />
        </div>

        <div className='mb-6'>
          <label>Away Score</label>
          <input type='number' id='awayScore' value={awayScore} onChange={(e) => setAwayScore(parseInt(e.target.value, 10))} className='ml-2 border border-black' min='0' required />
        </div>

        <div className='flex'>
          <div>
            <label>Home Team</label>
            {players.map((player) => (
              <div key={player.id}>
                <input type='checkbox' id={player.id} checked={homeTeam.includes(player.id)} onChange={() => handleHomeTeamChange(player.id)} className='ml-2 border border-black' />
                <label>{player.name}</label>
              </div>
            ))}
          </div>

          <div className='ml-6'>
            <label>Away Team</label>
            {players.map((player) => (
              <div key={player.id}>
                <input type='checkbox' id={player.id} checked={awayTeam.includes(player.id)} onChange={() => handleAwayTeamChange(player.id)} className='ml-2 border border-black' />
                <label>{player.name}</label>
              </div>
            ))}
          </div>
        </div>
        </div>
        <div className='mb-6'>
          <label>Goal Contributions</label>
          {Array.isArray(goalContributions) && goalContributions.map((contribution, i) => (
            <div key={i} className='mb-3'>
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
            </div>
          ))}
        </div>
        <button type='submit' className='border border-black self-start'>Add Match</button>
        </div>

      </form>
    </main>
  )
}

export default AddMatch;