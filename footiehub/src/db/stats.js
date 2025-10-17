import db from '@/db/mysql';

//get the stats of all players
export async function getStats() {
  
  const query =
    `SELECT
    players.id AS id,
    players.name AS name,
    players.createdAt AS createdAt,
    YEAR(matches.date) AS year,
    COUNT(player_performance.match_id) AS games,
      CAST(COALESCE(SUM(CASE
        WHEN (player_performance.team = 'home' AND matches.home_score > matches.away_score) OR (player_performance.team = 'away' AND matches.away_score > matches.home_score)
        THEN 1
        ELSE 0
      END), 0) AS UNSIGNED) AS wins,
      CAST(COALESCE(SUM(CASE
        WHEN (player_performance.team = 'home' AND matches.away_score = 0) OR (player_performance.team = 'away' AND matches.home_score = 0)
        THEN 1
        ELSE 0
      END), 0) AS UNSIGNED) AS clean_sheets,
    CAST(COALESCE(SUM(player_performance.goals), 0) AS UNSIGNED) AS goals,
    CAST(COALESCE(SUM(player_performance.assists), 0) AS UNSIGNED) AS assists
FROM players
LEFT JOIN player_performance 
    ON players.id = player_performance.player_id
LEFT JOIN matches
    ON matches.id = player_performance.match_id
GROUP BY players.id, year
ORDER BY players.id, year;`;
  
  try {
    return await db.query(query);
  } catch (error) {
    console.error('Error getting stats: ', error);
    throw error;
  }
}

//get the stats of player with id
export async function getPlayerStats(id) {
  
  const query =
    `SELECT
    players.id AS id,
    players.name AS name,
    players.createdAt AS createdAt,
    YEAR(matches.date) AS year,
    COUNT(player_performance.match_id) AS games,
      CAST(COALESCE(SUM(CASE
        WHEN (player_performance.team = 'home' AND matches.home_score > matches.away_score) OR (player_performance.team = 'away' AND matches.away_score > matches.home_score)
        THEN 1
        ELSE 0
      END), 0) AS UNSIGNED) AS wins,
      CAST(COALESCE(SUM(CASE
        WHEN (matches.away_score = matches.home_score)
        THEN 1
        ELSE 0
      END), 0) AS UNSIGNED) AS draws,
      CAST(COALESCE(SUM(CASE
        WHEN (player_performance.team = 'home' AND matches.home_score < matches.away_score) OR (player_performance.team = 'away' AND matches.away_score < matches.home_score)
        THEN 1
        ELSE 0
      END), 0) AS UNSIGNED) AS losses,
      CAST(COALESCE(SUM(CASE
        WHEN (player_performance.team = 'home' AND matches.away_score = 0) OR (player_performance.team = 'away' AND matches.home_score = 0)
        THEN 1
        ELSE 0
      END), 0) AS UNSIGNED) AS clean_sheets,
    CAST(COALESCE(SUM(player_performance.goals), 0) AS UNSIGNED) AS goals,
    CAST(COALESCE(SUM(player_performance.assists), 0) AS UNSIGNED) AS assists
FROM players
LEFT JOIN player_performance 
    ON players.id = player_performance.player_id
LEFT JOIN matches
    ON matches.id = player_performance.match_id
WHERE players.id = ?
GROUP BY year
ORDER BY year DESC;`;
  
  try {
    return await db.query(query, [id]);
  } catch (error) {
    console.error('Error getting stats: ', error);
    throw error;
  }
}