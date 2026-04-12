-- ============================================================
-- Update 10 — Standalone Invoices, Time Tracking, Team Members
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Standalone Invoices ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id       UUID          REFERENCES clients(id) ON DELETE SET NULL,

  invoice_number  TEXT,
  title           TEXT          NOT NULL,
  line_items      JSONB         DEFAULT '[]',

  subtotal        NUMERIC(15,2) DEFAULT 0,
  tax_rate        NUMERIC(5,2)  DEFAULT 0,
  tax_amount      NUMERIC(15,2) DEFAULT 0,
  discount        NUMERIC(15,2) DEFAULT 0,
  total           NUMERIC(15,2) DEFAULT 0,

  currency        TEXT          DEFAULT 'USD',
  status          TEXT          DEFAULT 'draft'
                  CHECK (status IN ('draft','sent','viewed','paid','overdue','cancelled')),

  due_date        TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,

  payment_link    TEXT,
  notes           TEXT,
  footer          TEXT,

  -- Recurrence
  is_recurring    BOOLEAN       DEFAULT FALSE,
  recurrence      TEXT          CHECK (recurrence IN ('weekly','monthly','quarterly','yearly')),
  next_invoice_at TIMESTAMPTZ,

  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   DEFAULT NOW()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices_own" ON invoices FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_invoices_user   ON invoices (user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices (client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (user_id, status);

CREATE OR REPLACE TRIGGER trg_invoices_updated
  BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Time Entries ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS time_entries (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id      UUID          REFERENCES projects(id) ON DELETE CASCADE,
  task_id         UUID          REFERENCES tasks(id) ON DELETE SET NULL,
  client_id       UUID          REFERENCES clients(id) ON DELETE SET NULL,
  invoice_id      UUID          REFERENCES invoices(id) ON DELETE SET NULL,

  description     TEXT,
  date            DATE          NOT NULL DEFAULT CURRENT_DATE,

  -- Duration stored in minutes
  duration        INTEGER       NOT NULL DEFAULT 0,  -- minutes

  -- Timer support
  timer_started_at TIMESTAMPTZ,
  is_running      BOOLEAN       DEFAULT FALSE,

  billable        BOOLEAN       DEFAULT TRUE,
  hourly_rate     NUMERIC(10,2),
  amount          NUMERIC(15,2) GENERATED ALWAYS AS
                    (ROUND((duration::NUMERIC / 60) * COALESCE(hourly_rate, 0), 2)) STORED,

  invoiced        BOOLEAN       DEFAULT FALSE,

  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   DEFAULT NOW()
);

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "time_entries_own" ON time_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_time_user    ON time_entries (user_id);
CREATE INDEX IF NOT EXISTS idx_time_project ON time_entries (project_id);
CREATE INDEX IF NOT EXISTS idx_time_date    ON time_entries (user_id, date DESC);

CREATE OR REPLACE TRIGGER trg_time_updated
  BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Team Members ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id        UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  email           TEXT          NOT NULL,
  name            TEXT,
  role            TEXT          NOT NULL DEFAULT 'freelancer_member'
                  CHECK (role IN ('freelancer_member','client_member','admin')),

  status          TEXT          DEFAULT 'invited'
                  CHECK (status IN ('invited','active','suspended')),

  invite_token    TEXT          UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  invited_at      TIMESTAMPTZ   DEFAULT NOW(),
  accepted_at     TIMESTAMPTZ,

  permissions     JSONB         DEFAULT '{"proposals":true,"contracts":true,"clients":true,"projects":true,"invoices":true,"portals":false}',

  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   DEFAULT NOW(),

  UNIQUE (owner_id, email)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team_members_own" ON team_members FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_team_owner ON team_members (owner_id);
CREATE INDEX IF NOT EXISTS idx_team_email ON team_members (email);

CREATE OR REPLACE TRIGGER trg_team_updated
  BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();
