const dotenv = require('dotenv');

dotenv.config();

const rawAllowedOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawAllowedOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!allowedOrigins.length) {
  allowedOrigins.push('http://localhost:8080', 'http://localhost:3000');
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  allowedOrigins,
  logLevel: process.env.LOG_LEVEL || 'info',
  defaultTheme: process.env.DEFAULT_THEME || 'skyward-courage'
};

module.exports = config;
