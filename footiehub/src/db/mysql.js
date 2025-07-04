import 'dotenv/config';
import mysql from 'mysql2'

// require('dotenv').config();
// const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    port: process.env.DB_PORT,
});

const db = pool.promise();
export default db;
  