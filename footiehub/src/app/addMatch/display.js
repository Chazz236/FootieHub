'use client'

import { useState, useEffect } from 'react';
import { createMatch } from '@/lib/actions/matches';
import Card from '@/app/components/ui/Card';

//client component for adding a new match
const Display = ({ players }) => {

  //states for form data
  const [date, setDate] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeTeam, setHomeTeam] = useState([]);
  const [awayTeam, setAwayTeam] = useState([]);
  const [goalContributions, setGoalContributions] = useState([]);
  const [homeGoals, setHomeGoals] = useState([]);
  const [awayGoals, setAwayGoals] = useState([]);

  //adds or removes goal contributions for home team based on home score
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
          updatedGoals.unshift({ goal_scorer_id: null, assist_player_id: null });
        }
        return updatedGoals;
      });
    }
  }, [homeScore]);

  //adds or removes goal contributions for away team based on away score
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
          updatedGoals.unshift({ goal_scorer_id: null, assist_player_id: null });
        }
        return updatedGoals;
      });
    }
  }, [awayScore]);

  //combine home and away goal contributions into one array
  useEffect(() => {
    setGoalContributions([...homeGoals, ...awayGoals]);
  }, [homeGoals, awayGoals])


  //submit form data to add match to database, then reset states
  const handleSubmit = async (event) => {
    event.preventDefault();

    //validate the data
    if (!date) {
      alert('Please fill date');
      return;
    }
    if (Number.isNaN(homeScore)) {
      alert('Please fill homeScore');
      return;
    }
    if (Number.isNaN(awayScore)) {
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
      console.error('Failed to submit match:', error.message);
      alert(`Error: ${error.message}`);
    }


  };

  //toggles player selection for home team and remove from away team
  const handleHomeTeamChange = (playerID) => {
    setHomeTeam((oldTeam) => {
      const newTeam = oldTeam.includes(playerID) ? oldTeam.filter(id => id != playerID) : [...oldTeam, playerID];
      setAwayTeam((team) => team.filter(id => id !== playerID));
      return newTeam;
    });
  }

  //toggles player selection for away team and remove from home team
  const handleAwayTeamChange = (playerID) => {
    setAwayTeam((oldTeam) => {
      const newTeam = oldTeam.includes(playerID) ? oldTeam.filter(id => id != playerID) : [...oldTeam, playerID];
      setHomeTeam((team) => team.filter(id => id !== playerID));
      return newTeam;
    });
  }

  //update goal contribution players for home team
  const handleHomeGoalContributionChange = (i, field, value) => {
    const updatedHomeGoalContributions = [...homeGoals];
    updatedHomeGoalContributions[i][field] = value === '' ? null : parseInt(value, 10);
    setHomeGoals(updatedHomeGoalContributions);
  }

  //update goal contribution players for away team
  const handleAwayGoalContributionChange = (i, field, value) => {
    const updatedAwayGoalContributions = [...awayGoals];
    updatedAwayGoalContributions[i][field] = value === '' ? null : parseInt(value, 10);
    setAwayGoals(updatedAwayGoalContributions);
  }

  return (
    <main className='flex-1 p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-foreground'>Add New Match</h2>
        <div>
          <button type='button' onClick={(e) => handleSubmit(e)} className='py-2 px-4 bg-primary-accent text-panel-foreground font-semibold rounded-md shadow-sm'>Add Match</button>
        </div>
      </div>
      <form className='grid grid-cols-[max-content_1fr_1fr_1fr] gap-6 w-full'>
        <div>
          <Card className='p-6'>
            <div className='mb-6'>
              <label className='block text-xs font-medium text-foreground mb-1'>Date</label>
              <input type='date' id='date' value={date} onChange={e => setDate(e.target.value)} className='w-40 p-2 border border-gray-300 rounded-md text-foreground bg-white' required />
            </div>
            <div className='mb-6'>
              <label className='block text-xs font-medium text-foreground mb-1'>Home Score</label>
              <input type='number' id='homeScore' value={homeScore} onChange={e => setHomeScore(parseInt(e.target.value, 10))} className='w-40 p-2 border border-gray-300 rounded-md text-foreground bg-white' min='0' required />
            </div>
            <div>
              <label className='block text-xs font-medium text-foreground mb-1'>Away Score</label>
              <input type='number' id='awayScore' value={awayScore} onChange={e => setAwayScore(parseInt(e.target.value, 10))} className='w-40 p-2 border border-gray-300 rounded-md text-foreground bg-white' min='0' required />
            </div>
          </Card>
        </div>
        <div>
          <Card className='p-6'>
            <div className='flex flex-col gap-2'>
              <label className='block text-xs font-medium text-foreground mb-3'>Select Teams</label>
              <div className='max-h-96 overflow-y-scroll pr-8'>
                <div className='flex items-center justify-between pb-2'>
                  <span></span>
                  <div className='flex items-center gap-8'>
                    <span className='flex justify-center text-xs font-medium text-primary-accent w-3'>Home</span>
                    <span className='flex justify-center text-xs font-medium text-danger-color w-3'>Away</span>
                  </div>
                </div>
                {players.map(player => (
                  <div key={player.id} className='flex items-center justify-between pb-2'>
                    <span className='text-foreground font-medium'>{player.name}</span>
                    <div className='flex items-center gap-8'>
                      <div>
                        <input type='checkbox' id={`home-${player.id}`} checked={homeTeam.includes(player.id)} onChange={() => handleHomeTeamChange(player.id)} className='border border-black accent-primary-accent' />
                      </div>
                      <div>
                        <input type='checkbox' id={`away-${player.id}`} checked={awayTeam.includes(player.id)} onChange={() => handleAwayTeamChange(player.id)} className='border border-black accent-danger-color' />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        <Card className='self-start p-6'>
          <label className='block text-xs font-medium mb-3 text-primary-accent'>Home Goals</label>
          <div className='max-h-96 overflow-y-scroll pr-2'>
            {Array.isArray(homeGoals) && homeGoals.map((contribution, i) => (
              <div key={i} className='mb-4 grid grid-cols-2 gap-4 items-center'>
                <div>
                  <label className='block text-xs font-medium text-foreground mb-1'>Goal</label>
                  <select id={`home-goal-${i}`} value={contribution.goal_scorer_id === null ? '' : contribution.goal_scorer_id} onChange={e => handleHomeGoalContributionChange(i, 'goal_scorer_id', e.target.value)} className='flex-grow p-2 border border-gray-300 rounded-md text-foreground bg-white'>
                    <option value=''>None</option>
                    {players.filter(player => homeTeam.includes(player.id) && player.id !== contribution.assist_player_id).map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-medium text-foreground mb-1'>Assist</label>
                  <select id={`home-assist-${i}`} value={contribution.assist_player_id === null ? '' : contribution.assist_player_id} onChange={e => handleHomeGoalContributionChange(i, 'assist_player_id', e.target.value)} className='flex-grow p-2 border border-gray-300 rounded-md text-foreground bg-white'>
                    <option value=''>None</option>
                    {players.filter(player => homeTeam.includes(player.id) && player.id !== contribution.goal_scorer_id).map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className='self-start p-6'>
          <label className='block text-xs font-medium mb-3 text-danger-color'>Away Goals</label>
          <div className='max-h-96 overflow-y-scroll pr-2'>
            {Array.isArray(awayGoals) && awayGoals.map((contribution, i) => (
              <div key={i} className='mb-4 grid grid-cols-2 gap-4 items-center'>
                <div>
                  <label className='block text-xs font-medium text-foreground mb-1'>Goal</label>
                  <select id={`away-goal-${i}`} value={contribution.goal_scorer_id === null ? '' : contribution.goal_scorer_id} onChange={e => handleAwayGoalContributionChange(i, 'goal_scorer_id', e.target.value)} className='flex-grow p-2 border border-gray-300 rounded-md text-foreground bg-white'>
                    <option value=''>None</option>
                    {players.filter(player => awayTeam.includes(player.id) && player.id !== contribution.assist_player_id).map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-medium text-foreground mb-1'>Assist</label>
                  <select id={`away-assist-${i}`} value={contribution.assist_player_id === null ? '' : contribution.assist_player_id} onChange={e => handleAwayGoalContributionChange(i, 'assist_player_id', e.target.value)} className='flex-grow p-2 border border-gray-300 rounded-md text-foreground bg-white'>
                    <option value=''>None</option>
                    {players.filter(player => awayTeam.includes(player.id) && player.id !== contribution.goal_scorer_id).map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </form>
    </main>
  )
}

export default Display;