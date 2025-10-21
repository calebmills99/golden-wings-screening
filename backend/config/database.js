const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const ssl = (() => {
  if (process.env.DATABASE_SSL === 'false') {
    return undefined;
  }
  if (process.env.DATABASE_SSL === 'true' || process.env.NODE_ENV === 'production') {
    return { rejectUnauthorized: false };
  }
  return undefined;
})();

let pool = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl,
    max: Number(process.env.DATABASE_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.DATABASE_IDLE_TIMEOUT || 30000),
  });
} else {
  console.warn('DATABASE_URL is not set. Backend RSVP storage will be disabled.');
}

const query = async (text, params) => {
  if (!pool) {
    throw Object.assign(new Error('Database connection not configured'), { status: 503 });
  }
  return pool.query(text, params);
};

module.exports = {
  pool,
  query,
};
