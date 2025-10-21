const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const logger = require('../utils/logger');

const memoryStore = [];

async function ensureSchema() {
  if (!db.isEnabled) {
    logger.warn('Skipping database schema creation because DATABASE_URL is not configured.');
    return;
  }

  db.createPool();

  const schemaPath = path.resolve(__dirname, '../../db/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await db.query(schemaSql);
  logger.info('Database schema ensured.');
}

async function createRsvp(payload) {
  const record = {
    name: payload.name,
    email: payload.email.toLowerCase(),
    phone: payload.phone || '',
    special_requests: payload.specialRequests || '',
    source: payload.source || 'unknown',
    submitted_at: payload.submittedAt ? new Date(payload.submittedAt) : new Date()
  };

  if (!db.isEnabled) {
    memoryStore.push({ id: memoryStore.length + 1, ...record });
    return memoryStore[memoryStore.length - 1];
  }

  const insertSql = `
    INSERT INTO rsvps (name, email, phone, special_requests, source, submitted_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      special_requests = EXCLUDED.special_requests,
      source = EXCLUDED.source,
      submitted_at = EXCLUDED.submitted_at
    RETURNING *;
  `;

  const values = [
    record.name,
    record.email,
    record.phone,
    record.special_requests,
    record.source,
    record.submitted_at
  ];

  const result = await db.query(insertSql, values);
  return result.rows[0];
}

async function listRsvps(limit = 25) {
  if (!db.isEnabled) {
    return memoryStore.slice(-limit).reverse();
  }

  const listSql = `
    SELECT id, name, email, phone, special_requests AS "specialRequests", source, submitted_at AS "submittedAt"
    FROM rsvps
    ORDER BY submitted_at DESC
    LIMIT $1;
  `;

  const result = await db.query(listSql, [limit]);
  return result.rows;
}

module.exports = {
  ensureSchema,
  createRsvp,
  listRsvps
};
