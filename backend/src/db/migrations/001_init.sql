CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  special_requests TEXT,
  source TEXT DEFAULT 'gwingz.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps (email);

CREATE TABLE IF NOT EXISTS style_profiles (
  id SERIAL PRIMARY KEY,
  style_token TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_style_profiles_updated_at ON style_profiles;
CREATE TRIGGER set_style_profiles_updated_at
BEFORE UPDATE ON style_profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

