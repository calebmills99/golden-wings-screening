import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const listFromEnv = (value) => {
  if (!value) return [];
  return value.split(',').map((entry) => entry.trim()).filter(Boolean);
};

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: numberFromEnv(process.env.PORT, 8080),
  databaseUrl: process.env.DATABASE_URL ?? '',
  databaseSsl: (process.env.DATABASE_SSL ?? 'true').toLowerCase() !== 'false',
  corsOrigins: listFromEnv(process.env.CORS_ORIGIN) || ['http://localhost:8080'],
};

export const isProduction = config.env === 'production';
