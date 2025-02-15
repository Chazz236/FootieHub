const db = require('./mysql');

const createGoalContributionsTable = async () => {
    const query = 
    `CREATE TABLE IF NOT EXISTS goal_contributions (
	    id INT AUTO_INCREMENT PRIMARY KEY,
        match_id INT NOT NULL,
        goal_scorer_id INT NOT NULL,
        assist_maker_id INT NOT NULL,
	    FOREIGN KEY (match_id) REFERENCES matches(id),
        FOREIGN KEY (goal_scorer_id) REFERENCES players(id),
        FOREIGN KEY (assist_maker_id) REFERENCES players(id)
    );`;
    try {
        await db.query(query);
        console.log('Goalcontributions table created');
    } catch (error) {
        console.error('Error creating goalcontributions table: ', error);
        throw error;
    }
}

export default createGoalContributionsTable;