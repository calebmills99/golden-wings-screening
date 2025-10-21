const { withClient } = require('../db/pool');

async function createRsvp(payload) {
  const query = `
    INSERT INTO rsvps (full_name, email, phone, special_requests, source)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, full_name AS "fullName", email, phone, special_requests AS "specialRequests", source, created_at AS "createdAt"
  `;

  const values = [
    payload.name,
    payload.email,
    payload.phone || null,
    payload.specialRequests || null,
    payload.source || 'gwingz.com'
  ];

  return withClient(async (client) => {
    const result = await client.query(query, values);
    return result.rows[0];
  });
}

async function listRsvps(limit = 100) {
  const query = `
    SELECT id, full_name AS "fullName", email, phone, special_requests AS "specialRequests", source, created_at AS "createdAt"
    FROM rsvps
    ORDER BY created_at DESC
    LIMIT $1
  `;

  return withClient(async (client) => {
    const result = await client.query(query, [limit]);
    return result.rows;
  });
}

module.exports = {
  createRsvp,
  listRsvps
};
