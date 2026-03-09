import db from '@/db/mysql';

//get all data from players table
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

//add new player into the players table with a starting transfer value of $10,000,000
export async function addPlayer(name, joinedAt) {
  
  const query =
    `INSERT INTO players (name, value, joinedAt)
	 VALUES (?, ?, ?)`;
  
  try {
    await db.query(query, [name, 10000000, joinedAt]);
  } catch (error) {
    console.error('Error adding player: ', error);
    throw error;
  }
}