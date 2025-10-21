const { Pool } = require('pg');
const { config, requireDatabaseUrl } = require('../config/env');

function buildSslConfig(connectionString) {
  const isLocalhost = /localhost|127\.0\.0\.1/.test(connectionString);
  if (isLocalhost) {
    return false;
  }

  return {
    rejectUnauthorized: false
  };
}

const connectionString = requireDatabaseUrl();

const pool = new Pool({
  connectionString,
  ssl: buildSslConfig(connectionString)
});

pool.on('error', (error) => {
  console.error('Unexpected Postgres error', error);
});

async function withClient(callback) {
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  withClient,
  config
};
