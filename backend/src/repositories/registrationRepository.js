import { query } from '../db/pool.js';

const serializeRegistration = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    specialRequests: row.special_requests,
    source: row.source,
    createdAt: row.created_at,
  };
};

export const registrationRepository = {
  async create(registration) {
    const { rows } = await query(
      `INSERT INTO rsvp_registrations (full_name, email, phone, special_requests, source)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, special_requests, source, created_at`,
      [
        registration.fullName,
        registration.email,
        registration.phone,
        registration.specialRequests,
        registration.source,
      ]
    );

    return serializeRegistration(rows[0]);
  },

  async list({ limit = 50, offset = 0 } = {}) {
    const { rows } = await query(
      `SELECT id, full_name, email, phone, special_requests, source, created_at
       FROM rsvp_registrations
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return rows.map(serializeRegistration);
  }
};
