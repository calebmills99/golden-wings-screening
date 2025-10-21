CREATE TABLE IF NOT EXISTS rsvps (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  special_requests TEXT,
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS themes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  motif TEXT,
  palette JSONB,
  mobile_cta JSONB,
  is_active BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS themes_active_unique ON themes ((is_active)) WHERE is_active;
