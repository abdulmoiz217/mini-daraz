const { Pool } = require('pg');
require('dotenv').config();

// Test direct connection with pg
const connectionString = process.env.DATABASE_URL;

console.log('Testing connection to:', connectionString);

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection failed:', err.message);
    console.error('Full error:', err);
  } else {
    console.log('Connection successful!');
    console.log('Current time from database:', res.rows[0].now);
  }
  pool.end();
});