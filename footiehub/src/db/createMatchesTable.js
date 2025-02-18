import db from '@/db/mysql';

const createMatchesTable = async () => {
  const query = 
    `CREATE TABLE IF NOT EXISTS matches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      home_score INT NOT NULL,
      away_score INT NOT NULL
    );`;
  try {
      await db.query(query);
      console.log('Matches table created');
  } catch (error) {
      console.error('Error creating matches table: ', error);
      throw error;
  }
}

export default createMatchesTable;