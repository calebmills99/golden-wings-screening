const { query } = require('../config/database');

const createRsvp = async ({ name, email, phone, specialRequests, source }) => {
  const result = await query(
    `INSERT INTO rsvps (name, email, phone, special_requests, source)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, special_requests AS "specialRequests", source, created_at AS "createdAt"`,
    [name, email, phone, specialRequests, source]
  );

  return result.rows[0];
};

const listRsvps = async ({ limit = 50, offset = 0 }) => {
  const result = await query(
    `SELECT id, name, email, phone, special_requests AS "specialRequests", source, created_at AS "createdAt"
     FROM rsvps
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows;
};

const totalRsvps = async () => {
  const result = await query('SELECT COUNT(*)::int AS total FROM rsvps');
  return result.rows[0].total;
};

module.exports = {
  createRsvp,
  listRsvps,
  totalRsvps,
};
