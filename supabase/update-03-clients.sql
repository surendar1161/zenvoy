-- ============================================================
-- Update 03 — Client Management (CRM)
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS clients (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity
  name          TEXT        NOT NULL,
  company       TEXT,
  email         TEXT,
  phone         TEXT,
  website       TEXT,

  -- Location
  country       CHAR(2)     REFERENCES countries(code),
  city          TEXT,
  address       TEXT,

  -- CRM
  status        TEXT        NOT NULL DEFAULT 'lead'
                CHECK (status IN ('lead','active','inactive','churned')),
  source        TEXT,        -- e.g. 'Referral', 'Upwork', 'LinkedIn', 'Cold outreach'
  tags          TEXT[]      DEFAULT '{}',
  notes         TEXT,
  avatar_color  TEXT        DEFAULT '#0ea5e9',  -- for initials avatar

  -- Financials (computed from proposals on read, cached here)
  total_revenue NUMERIC(15,2) DEFAULT 0,
  deal_count    INTEGER     DEFAULT 0,

  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_own" ON clients FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_clients_user   ON clients (user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients (user_id, status);
CREATE INDEX IF NOT EXISTS idx_clients_email  ON clients (user_id, email);
CREATE INDEX IF NOT EXISTS idx_clients_name   ON clients USING gin (name gin_trgm_ops);

CREATE OR REPLACE TRIGGER trg_clients_updated
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Client notes (separate table for audit trail)
CREATE TABLE IF NOT EXISTS client_notes (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id   UUID        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  pinned      BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_notes_own" ON client_notes FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_cn_client ON client_notes (client_id, created_at DESC);

CREATE OR REPLACE TRIGGER trg_client_notes_updated
  BEFORE UPDATE ON client_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add client_id FK to proposals (optional backlink)
ALTER TABLE proposals  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;
ALTER TABLE contracts  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_proposals_client ON proposals (client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client ON contracts (client_id);
