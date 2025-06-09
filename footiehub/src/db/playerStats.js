import db from '@/db/mysql';

export async function getStats() {
    const query =
        `SELECT
        players.id AS id,
	    players.name AS name,
	    COUNT(player_performance.match_id) as games,
	    SUM(player_performance.goals) AS goals,
	    SUM(player_performance.assists) AS assists,
        players.value AS value
     FROM players
     LEFT JOIN player_performance 
	    ON players.id = player_performance.player_id
     GROUP BY players.id;`;
    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error getting stats: ', error);
        throw error;
    }
}

export async function getTopGoals() {
    const query =
    `SELECT
        players.id AS id,
	    players.name AS name,
	    SUM(player_performance.goals) AS goals
     FROM players
     LEFT JOIN player_performance 
	    ON players.id = player_performance.player_id
     GROUP BY players.id
     ORDER BY goals DESC;`;
    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error getting top goals stats: ', error);
        throw error;
    }
}

export async function getTopAssists() {
    const query =
        `SELECT
        players.id AS id,
	    players.name AS name,
	    SUM(player_performance.assists) AS assists
     FROM players
     LEFT JOIN player_performance 
	    ON players.id = player_performance.player_id
     GROUP BY players.id
     ORDER BY assists DESC;`;
    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error getting top assists stats: ', error);
        throw error;
    }
}

export async function getTopWinPercentage() {
    const query =
    `SELECT
        players.id AS id,
	    players.name AS name,
	    COUNT(player_performance.match_id) as games,
        COUNT(CASE
         WHEN player_performance.team = 'home' AND matches.home_score > matches.away_score THEN 1
         WHEN player_performance.team = 'away' AND matches.away_score > matches.home_score THEN 1
         ELSE NULL
         END)/COUNT(player_performance.match_id)*100 AS wins
     FROM player_performance
     LEFT JOIN players 
	    ON players.id = player_performance.player_id
     LEFT JOIN matches 
	    ON player_performance.match_id = matches.id
     GROUP BY players.id
     ORDER BY wins DESC;`;
    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error getting top win %: ', error);
        throw error;
    }
}

export async function getTopValue() {
    const query =
    `SELECT id, name, value
     FROM players
     ORDER BY value DESC;`;
    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error getting value: ', error);
        throw error;
    }
}