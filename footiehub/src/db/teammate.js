import db from '@/db/mysql';

export async function getAllTeammates(id) {
    const query = 
    `SELECT
	players.name AS name,
    COALESCE(assistedOnGoals, 0) + COALESCE(goalsScoredOn, 0) AS total_contributions,
    COUNT(CASE
         WHEN player_performance.team = 'home' AND matches.home_score > matches.away_score THEN 1
         WHEN player_performance.team = 'away' AND matches.away_score > matches.home_score THEN 1
         ELSE NULL
         END)/COUNT(player_performance.match_id)*100 AS win_percentage
FROM players
LEFT JOIN (
	SELECT goal_scorer_id, COUNT(*) AS assistedOnGoals
    FROM goal_contributions
    WHERE assist_player_id = ?
    GROUP BY goal_scorer_id
) gc1
	ON players.id = gc1.goal_scorer_id
LEFT JOIN (
	SELECT assist_player_id, COUNT(*) AS goalsScoredOn
    FROM goal_contributions
    WHERE goal_scorer_id = ?
    GROUP BY assist_player_id
) gc2
	ON players.id = gc2.assist_player_id
LEFT JOIN player_performance 
	ON players.id = player_performance.player_id
LEFT JOIN matches 
	ON player_performance.match_id = matches.id
WHERE players.id != ?
GROUP BY players.id;`;
    try {
        return await db.query(query, [id]);
    } catch (error) {
        console.error('Error getting teammates: ', error);
        throw error;
    }
}