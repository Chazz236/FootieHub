import db from '@/db/mysql';

export async function getPlayerTransferChanges(id) {
    const query =
        `SELECT
  player_performance.value_change,
  matches.date
FROM player_performance
LEFT JOIN matches
  ON player_performance.match_id = matches.id
WHERE player_performance.player_id = ?
ORDER BY matches.date ASC;`;
    try {
        return await db.query(query, [id]);
    } catch (error) {
        console.error('Error getting stats: ', error);
        throw error;
    }
}

export async function getAllTransferChanges() {
    const query =
        `SELECT player_id, value_change, date
FROM player_performance
LEFT JOIN matches
ON player_performance.match_id = matches.id;`;
    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error getting stats: ', error);
        throw error;
    }
}