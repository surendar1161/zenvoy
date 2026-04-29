-- ============================================================
-- Update 15 — Capacity Planning
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Add capacity fields to team_members ──────────────────────
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS title              TEXT,
  ADD COLUMN IF NOT EXISTS avatar_color       TEXT DEFAULT '#0ea5e9',
  ADD COLUMN IF NOT EXISTS capacity_hours_pw  NUMERIC(5,2) DEFAULT 40,
  ADD COLUMN IF NOT EXISTS hourly_rate        NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS skills             TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_active          BOOLEAN DEFAULT TRUE;

-- ── Project assignments ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_assignments (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id        UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_member_id  UUID          NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  project_id      UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  role_on_project TEXT,                           -- e.g. "Lead Designer", "Developer"
  allocated_hours NUMERIC(8,2)  NOT NULL DEFAULT 0, -- total hours allocated
  hours_per_week  NUMERIC(5,2)  DEFAULT 0,          -- weekly commitment

  start_date      DATE,
  end_date        DATE,

  notes           TEXT,
  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   DEFAULT NOW(),

  UNIQUE (team_member_id, project_id)
);

ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments_own" ON project_assignments FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_assignments_owner  ON project_assignments (owner_id);
CREATE INDEX IF NOT EXISTS idx_assignments_member ON project_assignments (team_member_id);
CREATE INDEX IF NOT EXISTS idx_assignments_project ON project_assignments (project_id);

CREATE OR REPLACE TRIGGER trg_assignments_updated
  BEFORE UPDATE ON project_assignments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Feature flag table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feature_flags (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  feature     TEXT    NOT NULL,
  email       TEXT,                 -- NULL = enabled for all users
  enabled     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (feature, email)
);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flags_public_read" ON feature_flags FOR SELECT USING (TRUE);
CREATE POLICY "flags_service_write" ON feature_flags FOR ALL USING (auth.role() = 'service_role');

-- Seed: enable capacity planning only for surendar1160@gmail.com
INSERT INTO feature_flags (feature, email, enabled)
VALUES ('capacity_planning', 'surendar1160@gmail.com', TRUE)
ON CONFLICT (feature, email) DO NOTHING;
