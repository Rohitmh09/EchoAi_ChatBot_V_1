import mysql from 'mysql2/promise'; /// promise => is allow to use await and async functions 
import conf from '../config/conf.js';

// Create a connection pool with promises
const pool = mysql.createPool({
  connectionLimit: 10, // Number of connections to maintain
  host: conf.echoAI_Host,
  user: conf.echoAI_Username,
  password: conf.echoAI_Password,
  database: conf.echoAI_Database,
});

export default pool;
