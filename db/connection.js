const { Pool } = require('pg');

const isDevEnv = process.env.NODE_ENV !== 'test';

require('dotenv').config({
  path: isDevEnv ? `.env.development` : `.env.test`,
});

if (!process.env.PGDATABASE) {
  throw new Error('NO PGDATABASE SET...');
}

const db = new Pool({
  database: process.env.PGDATABASE,
});

module.exports = { db };
