import db from '@/db/mysql';

export async function getAllMatches() {
    const query =
        `SELECT * FROM matches;`;
    try {
        return await db.query(query);
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
        return data.insertId;
    } catch (error) {
        console.error('Error adding match: ', error);
        throw error;
    }
}

export async function addGoalContributions(matchID, goalContributions, connection) {
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

export async function updatePlayerPerformance(matchID, homeTeam, awayTeam, connection) {
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
        result.forEach(({ goal_scorer_id, assist_player_id }) => {
            playerStats[goal_scorer_id].goals += 1;
            playerStats[assist_player_id].assists += 1;
        });

        const query2 =
        `INSERT INTO player_performance (player_id, match_id, team, goals, assists)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE goals = ?, assists = ?`;

        const performances = players.map(id => {
            const { goals, assists } = playerStats[id];
            const team = homeTeam.includes(id) ? 'home' : 'away';
            return connection.query(query2, [id, matchID, team, goals, assists, goals, assists]);
        });
        await Promise.all(performances);
    } catch (error) {
        console.error('Error updating player performance: ', error);
        throw error;
    }
}