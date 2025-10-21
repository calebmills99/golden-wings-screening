const { query } = require('../config/database');
const defaultTheme = require('../config/defaultTheme');

const normaliseTheme = (theme) => ({
  tagline: theme.tagline || defaultTheme.tagline,
  motif: theme.motif || defaultTheme.motif,
  palette: theme.palette || defaultTheme.palette,
  mobileCta: theme.mobile_cta || theme.mobileCta || defaultTheme.mobileCta,
});

const getActiveTheme = async () => {
  try {
    const result = await query(
      `SELECT tagline, motif, palette, mobile_cta
       FROM themes
       WHERE is_active = true
       ORDER BY updated_at DESC
       LIMIT 1`
    );

    if (result.rows.length > 0) {
      return normaliseTheme(result.rows[0]);
    }
  } catch (error) {
    if (error.status === 503) {
      // Database not configured; fall back to default theme silently.
      return defaultTheme;
    }
    console.warn('Failed to read theme from database, using default.', error);
  }

  return defaultTheme;
};

module.exports = {
  getActiveTheme,
};
