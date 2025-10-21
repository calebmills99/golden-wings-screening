import { Pool } from 'pg';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

let pool;

if (config.databaseUrl) {
  pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
  });

  pool.on('error', (error) => {
    logger.error('Unexpected database error', { error: error.message });
  });
} else {
  logger.warn('DATABASE_URL is not defined. API routes depending on the database will be disabled.');
}

const ensurePool = () => {
  if (!pool) {
    throw new Error('Database pool not initialised. Provide DATABASE_URL to enable persistence.');
  }
  return pool;
};

export const query = (text, params) => ensurePool().query(text, params);
export const getClient = () => ensurePool().connect();
