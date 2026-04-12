-- ============================================================
-- Update 06 — Projects & Tasks
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id   UUID        REFERENCES clients(id) ON DELETE SET NULL,

  name        TEXT        NOT NULL,
  description TEXT,
  color       TEXT        DEFAULT '#0ea5e9',

  status      TEXT        NOT NULL DEFAULT 'active'
              CHECK (status IN ('planning','active','review','completed','paused','cancelled')),

  start_date  TIMESTAMPTZ,
  due_date    TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  budget      NUMERIC(15,2),
  currency    TEXT        DEFAULT 'USD',

  tags        TEXT[]      DEFAULT '{}',

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_own" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user   ON projects (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects (client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (user_id, status);

CREATE OR REPLACE TRIGGER trg_projects_updated
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Tasks ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id  UUID        REFERENCES projects(id) ON DELETE CASCADE,
  client_id   UUID        REFERENCES clients(id) ON DELETE SET NULL,

  title       TEXT        NOT NULL,
  description TEXT,

  status      TEXT        NOT NULL DEFAULT 'todo'
              CHECK (status IN ('todo','in_progress','review','done','cancelled')),

  priority    TEXT        NOT NULL DEFAULT 'medium'
              CHECK (priority IN ('low','medium','high','urgent')),

  due_date    TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  position    INTEGER     DEFAULT 0,
  tags        TEXT[]      DEFAULT '{}',

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_own" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user    ON tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client  ON tasks (client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status  ON tasks (user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_due     ON tasks (user_id, due_date);

CREATE OR REPLACE TRIGGER trg_tasks_updated
  BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
