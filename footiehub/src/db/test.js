const db = require('./mysql');

const test = async () => {
	try {
		const [rows, fields] = await db.query('SELECT 1 AS test');
		console.log('connected:', rows);
	} catch (error) {
		console.error('failed:', error);
	}
};



test();