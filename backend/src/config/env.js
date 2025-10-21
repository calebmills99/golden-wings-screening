const path = require('path');
const dotenv = require('dotenv');

const envPath = process.env.NODE_ENV === 'test'
  ? path.resolve(process.cwd(), '.env.test')
  : path.resolve(process.cwd(), '.env');

dotenv.config({ path: envPath, override: true });

const nodeEnv = process.env.NODE_ENV || 'development';

const config = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT) || 8080,
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

function requireDatabaseUrl() {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not defined. Set it in your environment variables.');
  }
  return config.databaseUrl;
}

module.exports = {
  config,
  requireDatabaseUrl
};
