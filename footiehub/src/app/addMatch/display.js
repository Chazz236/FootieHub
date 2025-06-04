'use client'

import { useState, useEffect } from 'react';
import { createMatch } from '@/lib/actions/matches';

const Display = ({ players }) => {

  const [date, setDate] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeTeam, setHomeTeam] = useState([]);
  const [awayTeam, setAwayTeam] = useState([]);
  const [goalContributions, setGoalContributions] = useState([]);
  const [homeGoals, setHomeGoals] = useState([]);
  const [awayGoals, setAwayGoals] = useState([]);

  useEffect(() => {
    if (homeScore < homeGoals.length) {
      setHomeGoals((goals) => {
        const updatedGoals = [...goals];
        while (homeScore < updatedGoals.length) {
          updatedGoals.shift();
        }
        return updatedGoals;
      });
    }
    else if (homeScore > homeGoals.length) {
      setHomeGoals((goals) => {
        const updatedGoals = [...goals];
        while (homeScore > updatedGoals.length) {
          updatedGoals.unshift({ goal_scorer_id: 0, assist_player_id: 0 });
        }
        return updatedGoals;
      });
    }
  }, [homeScore]);

  useEffect(() => {
    if (awayScore < awayGoals.length) {
      setAwayGoals((goals) => {
        const updatedGoals = [...goals];
        while (awayScore < updatedGoals.length) {
          updatedGoals.shift();
        }
        return updatedGoals;
      });
    }
    else if (awayScore > awayGoals.length) {
      setAwayGoals((goals) => {
        const updatedGoals = [...goals];
        while (awayScore > updatedGoals.length) {
          updatedGoals.unshift({ goal_scorer_id: 0, assist_player_id: 0 });
        }
        return updatedGoals;
      });
    }
  }, [awayScore]);

  useEffect(() => {
    setGoalContributions([...homeGoals, ...awayGoals]);
  }, [homeGoals, awayGoals])

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(goalContributions);

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

    const matchData = {
      date,
      homeScore: parseInt(homeScore, 10),
      awayScore: parseInt(awayScore, 10),
      homeTeam,
      awayTeam,
      goalContributions
    };

    try {
      const res = await createMatch(matchData);
      alert(res.message);
      setDate('');
      setHomeScore(0);
      setAwayScore(0);
      setHomeTeam([]);
      setAwayTeam([]);
      setHomeGoals([]);
      setAwayGoals([]);
    } catch (error) {
      console.error('Failed to submit match:', err.message);
      alert(`Error: ${err.message}`);
    }


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

  const handleHomeGoalContributionChange = (i, field, value) => {
    const updatedHomeGoalContributions = [...homeGoals];
    updatedHomeGoalContributions[i][field] = parseInt(value, 10);
    setHomeGoals(updatedHomeGoalContributions);
  }

  const handleAwayGoalContributionChange = (i, field, value) => {
    const updatedAwayGoalContributions = [...awayGoals];
    updatedAwayGoalContributions[i][field] = parseInt(value, 10);
    setAwayGoals(updatedAwayGoalContributions);
  }

  return (
    <main className='flex-1 p-6'>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-32'>
          <div>
            <div className='mb-6'>
              <label>Date</label>
              <input type='date' id='date' value={date} onChange={e => setDate(e.target.value)} className='ml-2 border border-black' required />
            </div>

            <div className='mb-6'>
              <label>Home Score</label>
              <input type='number' id='homeScore' value={homeScore} onChange={e => setHomeScore(parseInt(e.target.value, 10))} className='ml-2 border border-black' min='0' required />
            </div>

            <div className='mb-6'>
              <label>Away Score</label>
              <input type='number' id='awayScore' value={awayScore} onChange={e => setAwayScore(parseInt(e.target.value, 10))} className='ml-2 border border-black' min='0' required />
            </div>

            <div className='flex'>
              <div>
                <label>Home Team</label>
                {players.map(player => (
                  <div key={player.id}>
                    <input type='checkbox' id={player.id} checked={homeTeam.includes(player.id)} onChange={() => handleHomeTeamChange(player.id)} className='ml-2 border border-black' />
                    <label>{player.name}</label>
                  </div>
                ))}
              </div>

              <div className='ml-6'>
                <label>Away Team</label>
                {players.map(player => (
                  <div key={player.id}>
                    <input type='checkbox' id={player.id} checked={awayTeam.includes(player.id)} onChange={() => handleAwayTeamChange(player.id)} className='ml-2 border border-black' />
                    <label>{player.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='mb-6'>
            <label>Home Goals</label>
            {Array.isArray(homeGoals) && homeGoals.map((contribution, i) => (
              <div key={i} className='mb-3'>
                <div>
                  <label>Goal</label>
                  <select value={contribution.goal_scorer_id} onChange={e => handleHomeGoalContributionChange(i, 'goal_scorer_id', e.target.value)} className='ml-2 border border-black'>
                    <option key='' value=''>Goal</option>
                    {players.filter(player => homeTeam.includes(player.id) && player.id !== contribution.assist_player_id).map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Assist</label>
                  <select value={contribution.assist_player_id} onChange={e => handleHomeGoalContributionChange(i, 'assist_player_id', e.target.value)} className='ml-2 border border-black'>
                    <option key='' value=''>Assist</option>
                    {players.filter(player => homeTeam.includes(player.id) && player.id !== contribution.goal_scorer_id).map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          <div className='mb-6'>
            <label>Away Goals</label>
            {Array.isArray(awayGoals) && awayGoals.map((contribution, i) => (
              <div key={i} className='mb-3'>
                <div>
                  <label>Goal</label>
                  <select value={contribution.goal_scorer_id} onChange={e => handleAwayGoalContributionChange(i, 'goal_scorer_id', e.target.value)} className='ml-2 border border-black'>
                    <option key='' value=''>Goal</option>
                    {players.filter(player => awayTeam.includes(player.id) && player.id !== contribution.assist_player_id).map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Assist</label>
                  <select value={contribution.assist_player_id} onChange={e => handleAwayGoalContributionChange(i, 'assist_player_id', e.target.value)} className='ml-2 border border-black'>
                    <option key='' value=''>Assist</option>
                    {players.filter(player => awayTeam.includes(player.id) && player.id !== contribution.goal_scorer_id).map(player => (
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

export default Display;