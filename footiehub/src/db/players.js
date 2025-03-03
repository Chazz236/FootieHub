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
    `INSERT INTO players (name)
	 VALUES (?)`;
    try {
        await db.query(query, [name]);
    } catch (error) {
        console.error('Error adding player: ', error);
        throw error;
    }
}

export async function getPlayer(id) {
    const query = 
    `SELECT name, value
     FROM players
     WHERE id = ?;`;
    try {
        return await db.query(query, [id]);
    } catch (error) {
        console.error('Error getting the players: ', error);
        throw error;
    }
}