import db from '@/db/mysql';

export async function getMatches() {
    const query =
        `SELECT * FROM matches;`;
    const query2 = 
        `SELECT 
            players.name, 
            player_performance.match_id, 
            player_performance.team, 
            player_performance.goals 
         FROM players
         LEFT JOIN player_performance
            ON players.id = player_performance.player_id
         WHERE player_performance.match_id IS NOT NULL;`;
    try {
        const [matches] = await db.query(query);
        const [goals] = await db.query(query2);
        return {matches, goals};
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
    
    if (Array.isArray(goalContributions)) {
        // Proceed with processing the goal contributions
        console.log('Goal Contributions:', goalContributions);
        // Add your logic to insert into the database
      } else {
        // If goalContributions is not an array
        console.log('not an array');
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

export async function updatePlayerPerformance(matchID, homeTeam, awayTeam, connection) {
    const players = [...homeTeam, ...awayTeam];
    const playerStats = players.reduce((stats, id) => {
        stats[id] = { goals: 0, assists: 0 };
        return stats;
    }, {})

    console.log(players);
    console.log(playerStats);

    const query =
    `SELECT goal_scorer_id, assist_player_id
     FROM goal_contributions
	 WHERE match_id = ?`;

    try {
        const result = await connection.query(query, [matchID]);
        console.log(result[0]);
        result[0].forEach(({ goal_scorer_id, assist_player_id }) => {
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