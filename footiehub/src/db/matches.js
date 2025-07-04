import db from '@/db/mysql';

export async function getMatches() { //maybe change query 2?
    const query =
        `SELECT * FROM matches;`;
    const query2 =
        `SELECT 
            players.id,
            players.name, 
            player_performance.match_id, 
            player_performance.team, 
            player_performance.goals,
            player_performance.assists  
         FROM players
         JOIN player_performance
            ON players.id = player_performance.player_id;`;
    try {
        const [matches] = await db.query(query);
        const [goals] = await db.query(query2);
        return { matches, goals };
    } catch (error) {
        console.error('Error getting matches: ', error);
        throw error;
    }
}

export async function addMatch(date, home_score, away_score, connection) {
    const query =
        `INSERT INTO matches (date, home_score, away_score)
	 VALUES (?, ?, ?)`;
    try {
        const [data] = await connection.query(query, [date, home_score, away_score]);
        console.log('added match');
        return data.insertId;
    } catch (error) {
        console.error('Error adding match: ', error);
        throw error;
    }
}

export async function addGoalContributions(matchID, goalContributions, connection) {
    if (goalContributions.length === 0) {
        console.log('no goal contributions for this match');
        return;
    }

    const query =
        `INSERT INTO goal_contributions (match_id, goal_scorer_id, assist_player_id)
	 VALUES ?`;
    const contributions = goalContributions.map(contribution => [
        matchID,
        contribution.goal_scorer_id,
        contribution.assist_player_id
    ]);
    try {
        await connection.query(query, [contributions]);
    } catch (error) {
        console.error('Error adding goal contributions: ', error);
        throw error;
    }
}

export async function updatePlayerPerformance(matchID, homeTeam, awayTeam, homeScore, awayScore, connection) {
    const players = [...homeTeam, ...awayTeam];
    const playerStats = players.reduce((stats, id) => {
        stats[id] = { goals: 0, assists: 0 };
        return stats;
    }, {})

    const query =
        `SELECT goal_scorer_id, assist_player_id
     FROM goal_contributions
	 WHERE match_id = ?`;

    try {
        const result = await connection.query(query, [matchID]);

        if (result[0].length > 0) {
            result[0].forEach(({ goal_scorer_id, assist_player_id }) => {
                playerStats[goal_scorer_id].goals += 1;
                playerStats[assist_player_id].assists += 1;
            });
        }
        else {
            console.log('no goal contributions for match: ' + matchID)
        }

        const query2 =
            `INSERT INTO player_performance (player_id, match_id, team, goals, assists, value_change)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE goals = ?, assists = ?, value_change = ?`;

        const values = [];

        const performances = players.map(id => {
            const { goals, assists } = playerStats[id];
            const team = homeTeam.includes(id) ? 'home' : 'away';
            const win = team === 'home' ? (homeScore > awayScore ? 1 : 0) : (awayScore > homeScore ? 1 : 0);
            const loss = team === 'home' ? (homeScore < awayScore ? 1 : 0) : (awayScore < homeScore ? 1 : 0);
            const draw = homeScore === awayScore ? 1 : 0;
            const goalDifference = team === 'home' ? (homeScore - awayScore) : (awayScore - homeScore);
            const cleanSheet = team === 'home' ? (awayScore === 0 ? 1 : 0) : (homeScore === 0 ? 1 : 0);
            console.log(`${goals} * 1000000 + ${assists} * 500000 + ${win} * 5000000 + ${loss} * -3000000 + ${draw} * 1000000 + ${goalDifference} * 1000000 + ${cleanSheet} * 2000000;`);
            const valueChange = goals * 1000000 + assists * 500000 + win * 5000000 + loss * -3000000 + draw * 1000000 + goalDifference * 1000000 + cleanSheet * 2000000;
            values.push({ id, valueChange });
            return connection.query(query2, [id, matchID, team, goals, assists, valueChange, goals, assists, valueChange]);
        });
        await Promise.all(performances);

        const query3 = `UPDATE players SET value = value + ? WHERE id = ?`;
        const updateValues = values.map(({ id, valueChange }) => {
            return connection.query(query3, [valueChange, id]);
        });
        await Promise.all(updateValues);

    } catch (error) {
        console.error('Error updating player performance: ', error);
        throw error;
    }
}

