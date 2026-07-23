-- Golden Wings audience list and watch telemetry.
CREATE TABLE IF NOT EXISTS leads (
  email TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS watch_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  page TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_watch_events_email ON watch_events(email);
CREATE INDEX IF NOT EXISTS idx_watch_events_created_at ON watch_events(created_at);
