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