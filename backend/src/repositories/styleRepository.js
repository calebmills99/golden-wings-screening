import { query } from '../db/pool.js';

const serializeStyle = (row) => {
  if (!row) return null;
  return {
    variant: row.variant,
    cssVariables: row.css_variables ?? {},
    mobileLayout: row.mobile_layout ?? {},
    heroCopy: row.hero_copy ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const styleRepository = {
  async findByVariant(variant) {
    const { rows } = await query(
      `SELECT variant, css_variables, mobile_layout, hero_copy, created_at, updated_at
       FROM event_styles
       WHERE variant = $1
       LIMIT 1`,
      [variant]
    );

    return serializeStyle(rows[0]);
  },

  async list() {
    const { rows } = await query(
      `SELECT variant, css_variables, mobile_layout, hero_copy, created_at, updated_at
       FROM event_styles
       ORDER BY updated_at DESC NULLS LAST, variant ASC`
    );

    return rows.map(serializeStyle);
  },

  async upsert(style) {
    const { rows } = await query(
      `INSERT INTO event_styles (variant, css_variables, mobile_layout, hero_copy)
       VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb)
       ON CONFLICT (variant)
       DO UPDATE SET css_variables = EXCLUDED.css_variables,
                     mobile_layout = EXCLUDED.mobile_layout,
                     hero_copy = EXCLUDED.hero_copy,
                     updated_at = NOW()
       RETURNING variant, css_variables, mobile_layout, hero_copy, created_at, updated_at`,
      [
        style.variant,
        JSON.stringify(style.cssVariables ?? {}),
        JSON.stringify(style.mobileLayout ?? {}),
        JSON.stringify(style.heroCopy ?? {}),
      ]
    );

    return serializeStyle(rows[0]);
  }
};
