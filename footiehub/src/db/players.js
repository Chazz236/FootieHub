import db from '@/db/mysql';

export async function getAllPlayers() {
  const query =
    `SELECT * FROM players;`;
  try {
    return await db.query(query);
  } catch (error) {
    console.error('Error getting the players: ', error);
    throw error;
  }
}

export async function addPlayer(name) {
  const query =
    `INSERT INTO players (name, value)
	 VALUES (?, ?)`;
  try {
    await db.query(query, [name, 10000000]);
  } catch (error) {
    console.error('Error adding player: ', error);
    throw error;
  }
}

export async function getPlayerStats(id, year = null) {

  let yearCondition = '';
  const params = [id];

  if (year !== null) {
    yearCondition = 'AND YEAR(matches.date) = ?';
    params.push(year);
  }

  const query =
    `SELECT
      players.name AS name,
      COALESCE(COUNT(player_performance.match_id), 0) AS games,
      COALESCE(SUM(CASE
        WHEN (player_performance.team = 'home' AND matches.home_score > matches.away_score) OR (player_performance.team = 'away' AND matches.away_score > matches.home_score)
        THEN 1
        ELSE 0
      END), 0) AS wins,
      COALESCE(SUM(CASE
        WHEN (matches.home_score = matches.away_score)
        THEN 1
        ELSE 0
      END), 0) AS draws,
      COALESCE(SUM(CASE
        WHEN (player_performance.team = 'home' AND matches.home_score < matches.away_score) OR (player_performance.team = 'away' AND matches.away_score < matches.home_score)
        THEN 1
        ELSE 0
      END), 0) AS losses,
      COALESCE(SUM(CASE
        WHEN (player_performance.team = 'home' AND matches.away_score = 0) OR (player_performance.team = 'away' AND matches.home_score = 0)
        THEN 1
        ELSE 0
      END), 0) AS clean_sheets,
      CAST(COALESCE(SUM(player_performance.goals), 0) AS UNSIGNED) AS goals,
      CAST(COALESCE(SUM(player_performance.assists), 0) AS UNSIGNED) AS assists
    FROM players
    LEFT JOIN player_performance 
      ON players.id = player_performance.player_id
    LEFT JOIN matches
      ON matches.id = player_performance.match_id
    WHERE players.id = ? ${yearCondition}
    GROUP BY players.id;`;
  try {
    return await db.query(query, params);
  } catch (error) {
    console.error('Error getting stats: ', error);
    throw error;
  }
}

export async function getPlayedYears(id) {
  const query =
    `SELECT DISTINCT YEAR(matches.date) AS year
FROM matches
JOIN player_performance
	ON matches.id = player_performance.match_id
WHERE player_performance.player_id = ?`;
  try {
    const [years] = await db.query(query, [id]);
    return { years };
  } catch (error) {
    console.error('Error getting matches: ', error);
    throw error;
  }
}