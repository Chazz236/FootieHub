import db from '@/db/mysql';

export async function getStats() {
    const query =
        `SELECT
    players.id AS id,
	players.name AS name,
    players.value AS value,
	COUNT(player_performance.match_id) AS games,
    COUNT(CASE
         WHEN player_performance.team = 'home' AND matches.home_score > matches.away_score THEN 1
         WHEN player_performance.team = 'away' AND matches.away_score > matches.home_score THEN 1
         ELSE NULL
         END) AS wins,
    COUNT(CASE
         WHEN player_performance.team = 'home' AND matches.home_score = matches.away_score THEN 1
         WHEN player_performance.team = 'away' AND matches.away_score = matches.home_score THEN 1
         ELSE NULL
         END) AS draws,
    COUNT(CASE
         WHEN player_performance.team = 'home' AND matches.home_score < matches.away_score THEN 1
         WHEN player_performance.team = 'away' AND matches.away_score < matches.home_score THEN 1
         ELSE NULL
         END) AS losses,
	COUNT(CASE
         WHEN player_performance.team = 'home' AND matches.away_score = 0 THEN 1
         WHEN player_performance.team = 'away' AND matches.home_score = 0 THEN 1
         ELSE NULL
         END) AS clean_sheets,
    CAST(
         CAST(COUNT(CASE
            WHEN player_performance.team = 'home' AND matches.home_score > matches.away_score THEN 1
		    WHEN player_performance.team = 'away' AND matches.away_score > matches.home_score THEN 1
		    ELSE NULL
		    END) AS DECIMAL) * 100.0 / NULLIF(COUNT(player_performance.match_id), 0) 
    AS FLOAT) AS win_percentage,
	CAST(COALESCE(SUM(player_performance.goals), 0) AS UNSIGNED) AS goals,
	CAST(COALESCE(SUM(player_performance.assists), 0) AS UNSIGNED) AS assists
FROM players
LEFT JOIN player_performance 
	ON players.id = player_performance.player_id
LEFT JOIN matches
	ON matches.id = player_performance.match_id
GROUP BY players.id;`;
    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error getting stats: ', error);
        throw error;
    }
}