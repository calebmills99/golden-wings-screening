const { withClient } = require('../db/pool');

async function getActiveStyle() {
  const query = `
    SELECT style_token AS "styleToken", label, settings, is_active AS "isActive"
    FROM style_profiles
    WHERE is_active = true
    ORDER BY updated_at DESC
    LIMIT 1
  `;

  return withClient(async (client) => {
    const result = await client.query(query);
    return result.rows[0] || null;
  });
}

async function listStyles() {
  const query = `
    SELECT id, style_token AS "styleToken", label, settings, is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM style_profiles
    ORDER BY created_at DESC
  `;

  return withClient(async (client) => {
    const result = await client.query(query);
    return result.rows;
  });
}

async function createStyle(payload) {
  const query = `
    INSERT INTO style_profiles (style_token, label, settings, is_active)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (style_token)
    DO UPDATE SET label = EXCLUDED.label, settings = EXCLUDED.settings, updated_at = NOW()
    RETURNING id, style_token AS "styleToken", label, settings, is_active AS "isActive"
  `;

  const values = [payload.styleToken, payload.label, payload.settings || {}, Boolean(payload.isActive)];

  return withClient(async (client) => {
    const result = await client.query(query, values);
    return result.rows[0];
  });
}

async function setActiveStyle(styleToken) {
  return withClient(async (client) => {
    await client.query('BEGIN');
    await client.query('UPDATE style_profiles SET is_active = false WHERE is_active = true');
    const activationResult = await client.query(
      `UPDATE style_profiles SET is_active = true, updated_at = NOW() WHERE style_token = $1 RETURNING style_token AS "styleToken", label, settings, is_active AS "isActive"`,
      [styleToken]
    );
    await client.query('COMMIT');
    return activationResult.rows[0] || null;
  });
}

module.exports = {
  getActiveStyle,
  listStyles,
  createStyle,
  setActiveStyle
};
