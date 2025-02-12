const db = require('./mysql');

const createPlayerPerformanceTable = async () => {
  const query = 
    `CREATE TABLE IF NOT EXISTS player_performance (
	    player_id INT NOT NULL,
      match_id INT NOT NULL,
      team ENUM('home', 'away') NOT NULL,
      goals INT NOT NULL DEFAULT 0,
      assists INT NOT NULL DEFAULT 0,
      PRIMARY KEY (player_id, match_id),
      FOREIGN KEY (player_id) REFERENCES players(id),
      FOREIGN KEY (match_id) REFERENCES matches(id)
    );`;
  try {
      await db.query(query);
      console.log('Playerperformance table created');
  } catch (error) {
      console.error('Error creating playerperformance table: ', error);
      throw error;
  }
}

export default createPlayerPerformanceTable;