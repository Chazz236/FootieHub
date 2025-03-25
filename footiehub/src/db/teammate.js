import db from '@/db/mysql';

export async function getAllTeammates(id) {
    const query = 
    `SELECT pp2.player_id AS id,
       players.name AS name,
       COALESCE(gc1.assistedOnGoals, 0) + COALESCE(gc2.goalsScoredOn, 0) AS total_contributions,
       COUNT(DISTINCT matches.id) AS games,
       COUNT(CASE
                 WHEN (pp1.team = pp2.team
                       AND ((pp1.team = 'home'
                             AND matches.home_score > matches.away_score)
                            OR (pp1.team = 'away'
                                AND matches.away_score > matches.home_score))) THEN 1
                 ELSE NULL
             END) AS wins,
       (COUNT(CASE
                  WHEN (pp1.team = pp2.team
                        AND ((pp1.team = 'home'
                              AND matches.home_score > matches.away_score)
                             OR (pp1.team = 'away'
                                 AND matches.away_score > matches.home_score))) THEN 1
                  ELSE NULL
              END) / COUNT(DISTINCT matches.id)) * 100 AS win_percentage
FROM matches
JOIN player_performance pp1 ON matches.id = pp1.match_id
JOIN player_performance pp2 ON matches.id = pp2.match_id
JOIN players ON players.id = pp2.player_id
LEFT JOIN
  (SELECT goal_scorer_id,
          COUNT(*) AS assistedOnGoals
   FROM goal_contributions
   WHERE assist_player_id = ?
   GROUP BY goal_scorer_id) gc1 ON players.id = gc1.goal_scorer_id
LEFT JOIN
  (SELECT assist_player_id,
          COUNT(*) AS goalsScoredOn
   FROM goal_contributions
   WHERE goal_scorer_id = ?
   GROUP BY assist_player_id) gc2 ON players.id = gc2.assist_player_id
WHERE pp1.player_id = ?
  AND pp1.player_id != pp2.player_id
  AND pp1.team = pp2.team
GROUP BY pp2.player_id
ORDER BY id ASC;`;
    try {
        return await db.query(query, [id, id, id]);
    } catch (error) {
        console.error('Error getting teammates: ', error);
        throw error;
    }
}