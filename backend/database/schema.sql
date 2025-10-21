CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS event_styles (
    variant TEXT PRIMARY KEY,
    css_variables JSONB NOT NULL DEFAULT '{}'::jsonb,
    mobile_layout JSONB NOT NULL DEFAULT '{}'::jsonb,
    hero_copy JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rsvp_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    special_requests TEXT,
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_event_styles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_event_styles_updated_at ON event_styles;
CREATE TRIGGER trg_event_styles_updated_at
    BEFORE UPDATE ON event_styles
    FOR EACH ROW
    EXECUTE PROCEDURE set_event_styles_updated_at();

INSERT INTO event_styles (variant, css_variables, mobile_layout, hero_copy)
VALUES (
    'default',
    '{
      "--scheme-background": "#ffffff",
      "--scheme-border": "#dbeafe",
      "--neutral-darkest": "#0f172a",
      "--primary-blue": "#1d4ed8",
      "--primary-blue-light": "#60a5fa"
    }',
    '{
      "hero": {
        "overlayOpacity": 0.65,
        "showVideo": false
      }
    }',
    '{
      "tagline": "Connecting Hearts at 35,000 Feet",
      "supporting": "A compassionate journey through aviation history."
    }'
)
ON CONFLICT (variant) DO NOTHING;
