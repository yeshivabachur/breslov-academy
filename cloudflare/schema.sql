CREATE TABLE IF NOT EXISTS entities (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  school_id TEXT,
  user_email TEXT,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_entities_entity ON entities(entity);
CREATE INDEX IF NOT EXISTS idx_entities_entity_school ON entities(entity, school_id);
CREATE INDEX IF NOT EXISTS idx_entities_entity_user ON entities(entity, user_email);
