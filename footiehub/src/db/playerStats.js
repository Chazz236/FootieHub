import db from '@/db/mysql';

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

export async function getPlayerStats(id) {
    const query =
        `SELECT
	    COUNT(player_performance.match_id) as games_played,
	    SUM(player_performance.goals) AS goals,
	    SUM(player_performance.assists) AS assists
     FROM players
     LEFT JOIN player_performance 
	    ON players.id = player_performance.player_id
     WHERE id = ?;`;
    try {
        return await db.query(query, [id]);
    } catch (error) {
        console.error('Error getting stats: ', error);
        throw error;
    }
}

export async function getPlayerWins(id) {
    const query =
        `SELECT COUNT(CASE
         WHEN player_performance.team = 'home' AND matches.home_score > matches.away_score THEN 1
         WHEN player_performance.team = 'away' AND matches.away_score > matches.home_score THEN 1
         ELSE NULL
         END) AS wins
         FROM player_performance
         LEFT JOIN matches
         ON matches.id = player_performance.match_id
         WHERE player_performance.player_id = ?;`;
    try {
        return await db.query(query, [id]);
    } catch (error) {
        console.error('Error getting wins: ', error);
        throw error;
    }
}

export async function getWhoAssists(id) {
    const query =
        `SELECT players.name, COUNT(*) AS assists
         FROM players
         LEFT JOIN goal_contributions
         ON players.id = goal_contributions.assist_player_id
         WHERE goal_contributions.goal_scorer_id = ?
         GROUP BY assist_player_id
         ORDER BY COUNT(*) DESC
         LIMIT 5;`;
    try {
        return await db.query(query, [id]);
    } catch (error) {
        console.error('Error getting who assists: ', error);
        throw error;
    }
}

export async function getWhoScores(id) {
    const query =
        `SELECT players.name, COUNT(*) AS goals
         FROM players
         LEFT JOIN goal_contributions
         ON players.id = goal_contributions.goal_scorer_id
         WHERE goal_contributions.assist_player_id = ?
         GROUP BY goal_scorer_id
         ORDER BY COUNT(*) DESC
         LIMIT 5;`;
    try {
        return await db.query(query, [id]);
    } catch (error) {
        console.error('Error getting who scores: ', error);
        throw error;
    }
}

export async function getWhoWins(id) {
    const query =
        `SELECT pp2.player_id AS id, players.name AS name, COUNT(DISTINCT matches.id) AS games, COUNT(*) AS wins
         FROM matches
         JOIN player_performance pp1 ON matches.id = pp1.match_id
         JOIN player_performance pp2 ON matches.id = pp2.match_id
         JOIN players ON players.id = pp2.player_id
         WHERE pp1.player_id = ?
         AND pp1.player_id != pp2.player_id
         AND (
            pp1.team = pp2.team AND
            (
                (pp1.team = 'home' AND matches.home_score > matches.away_score) OR
                (pp1.team = 'away' AND matches.away_score > matches.home_score)
            )
         )
         GROUP BY pp2.player_id
         ORDER BY wins DESC
         LIMIT 5;`;
    try {
        return await db.query(query, [id]);
    } catch (error) {
        console.error('Error getting who wins: ', error);
        throw error;
    }
}