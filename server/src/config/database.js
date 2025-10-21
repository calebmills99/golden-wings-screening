const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

let pool = null;

function createPool() {
  if (!env.databaseUrl) {
    logger.warn('DATABASE_URL is not set. The API will operate in in-memory mode.');
    return null;
  }

  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
  });

  pool.on('error', (error) => {
    logger.error({ err: error }, 'Unexpected database error');
  });

  return pool;
}

async function query(text, params) {
  if (!pool) {
    throw new Error('Database connection is not configured.');
  }

  return pool.query(text, params);
}

module.exports = {
  get pool() {
    return pool || createPool();
  },
  createPool,
  query,
  isEnabled: Boolean(env.databaseUrl)
};
