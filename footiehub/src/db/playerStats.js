const db = require('./mysql');

export async function getStats() {
    const query = 
    `SELECT
	    players.name AS player_name,
	    COUNT(player_performance.match_id) as games_played,
	    SUM(player_performance.goals) AS goals,
	    SUM(player_performance.assists) AS assists
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
	    players.name AS player_name,
	    SUM(player_performance.goals) AS goals
     FROM players
     LEFT JOIN player_performance 
	    ON players.id = player_performance.player_id
     GROUP BY players.id
     ORDER BY goals DESC
     LIMIT 5;`;
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
	    players.name AS player_name,
	    SUM(player_performance.assists) AS assists
     FROM players
     LEFT JOIN player_performance 
	    ON players.id = player_performance.player_id
     GROUP BY players.id
     ORDER BY assists DESC
     LIMIT 5;`;
    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error getting top assists stats: ', error);
        throw error;
    }
}