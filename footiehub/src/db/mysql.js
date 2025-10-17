import 'dotenv/config';
import mysql from 'mysql2'

//create a connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  port: process.env.DB_PORT,
});

//use promises for pool
const db = pool.promise();

export default db;