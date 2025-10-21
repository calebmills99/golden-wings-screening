CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email CITEXT NOT NULL UNIQUE,
  phone TEXT DEFAULT '',
  special_requests TEXT DEFAULT '',
  source TEXT DEFAULT 'unknown',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_submitted_at ON rsvps (submitted_at DESC);
