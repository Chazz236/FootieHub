const db = require('./mysql');

const createPlayersTable = async () => {
  const query = 
    `CREATE TABLE IF NOT EXISTS players (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );`;
  try {
    await db.query(query);
    console.log('Players table created');
  } catch (error) {
    console.error('Error creating players table: ', error);
    throw error;
  }
}

export default createPlayersTable;