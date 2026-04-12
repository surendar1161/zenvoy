-- ============================================================
-- Update 05 — Branded Client Portal
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Client Portals ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_portals (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id       UUID        REFERENCES clients(id) ON DELETE SET NULL,

  -- Access
  token           TEXT        NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  is_active       BOOLEAN     DEFAULT TRUE,

  -- Branding
  title           TEXT,                   -- e.g. "Acme Corp Project Hub"
  welcome_message TEXT,
  brand_override  JSONB,                  -- {primaryColor, logoUrl, fontFamily} overrides brand kit

  -- Status
  last_client_visit TIMESTAMPTZ,
  client_name     TEXT,                   -- snapshot for display
  client_email    TEXT,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE client_portals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portals_own"    ON client_portals FOR ALL  USING (auth.uid() = user_id);
CREATE POLICY "portals_public" ON client_portals FOR SELECT USING (TRUE); -- clients access via token
CREATE INDEX IF NOT EXISTS idx_portals_user  ON client_portals (user_id);
CREATE INDEX IF NOT EXISTS idx_portals_token ON client_portals (token);
CREATE INDEX IF NOT EXISTS idx_portals_client ON client_portals (client_id);

CREATE OR REPLACE TRIGGER trg_portals_updated
  BEFORE UPDATE ON client_portals FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Portal Files ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portal_files (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_id     UUID        NOT NULL REFERENCES client_portals(id) ON DELETE CASCADE,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  name          TEXT        NOT NULL,
  original_name TEXT,
  size_bytes    INTEGER,
  mime_type     TEXT,
  storage_path  TEXT        NOT NULL,    -- Supabase Storage path
  storage_url   TEXT,                   -- public URL

  category      TEXT        DEFAULT 'general'
                CHECK (category IN ('contract','invoice','design','document','image','general')),
  uploaded_by   TEXT        DEFAULT 'freelancer'
                CHECK (uploaded_by IN ('freelancer','client')),

  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portal_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pfiles_own"    ON portal_files FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "pfiles_public" ON portal_files FOR SELECT USING (TRUE);
CREATE INDEX IF NOT EXISTS idx_pfiles_portal ON portal_files (portal_id);

-- ── Portal Messages (Chat) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS portal_messages (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_id           UUID        NOT NULL REFERENCES client_portals(id) ON DELETE CASCADE,

  sender              TEXT        NOT NULL CHECK (sender IN ('freelancer','client')),
  sender_name         TEXT,
  content             TEXT        NOT NULL,

  read_by_client      BOOLEAN     DEFAULT FALSE,
  read_by_freelancer  BOOLEAN     DEFAULT FALSE,

  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pmsg_insert_any"    ON portal_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "pmsg_select_any"    ON portal_messages FOR SELECT USING (TRUE);
CREATE POLICY "pmsg_update_owner"  ON portal_messages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM client_portals p WHERE p.id = portal_id AND p.user_id = auth.uid()));
CREATE INDEX IF NOT EXISTS idx_pmsg_portal ON portal_messages (portal_id, created_at);

-- Enable Realtime on portal_messages for live chat
ALTER PUBLICATION supabase_realtime ADD TABLE portal_messages;

-- ── Portal Invoices ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portal_invoices (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_id       UUID        NOT NULL REFERENCES client_portals(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  invoice_number  TEXT,
  title           TEXT        NOT NULL,
  line_items      JSONB       DEFAULT '[]',  -- [{description, quantity, unit_price, amount}]

  subtotal        NUMERIC(15,2) DEFAULT 0,
  tax_rate        NUMERIC(5,2)  DEFAULT 0,
  tax_amount      NUMERIC(15,2) DEFAULT 0,
  total           NUMERIC(15,2) DEFAULT 0,
  currency        TEXT          DEFAULT 'USD',

  status          TEXT        DEFAULT 'draft'
                  CHECK (status IN ('draft','sent','viewed','paid','overdue','cancelled')),
  due_date        TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  payment_link    TEXT,
  notes           TEXT,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portal_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pinv_own"    ON portal_invoices FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "pinv_public" ON portal_invoices FOR SELECT USING (TRUE);
CREATE INDEX IF NOT EXISTS idx_pinv_portal ON portal_invoices (portal_id);

CREATE OR REPLACE TRIGGER trg_pinv_updated
  BEFORE UPDATE ON portal_invoices FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Supabase Storage bucket (run separately if needed) ───────
-- Go to: Supabase Dashboard → Storage → Create bucket "portal-files" (public: false)
-- Or run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portal-files', 'portal-files', false)
-- ON CONFLICT DO NOTHING;
