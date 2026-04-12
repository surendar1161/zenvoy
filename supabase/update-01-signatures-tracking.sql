-- ============================================================
-- Update 01 — Signatures, Tracking, Expiry, Password, Content Library
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Extend proposals table ────────────────────────────────
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS document_type    TEXT    DEFAULT 'proposal'
      CHECK (document_type IN ('proposal','quote','sow','brochure','job-offer','sign-off')),
  ADD COLUMN IF NOT EXISTS expires_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS view_password    TEXT,          -- hashed or plain for demo
  ADD COLUMN IF NOT EXISTS view_count       INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_viewed_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signer_name      TEXT,
  ADD COLUMN IF NOT EXISTS signer_email     TEXT,
  ADD COLUMN IF NOT EXISTS signature_data   TEXT,          -- base64 or typed name
  ADD COLUMN IF NOT EXISTS signature_type   TEXT,          -- 'typed' | 'drawn'
  ADD COLUMN IF NOT EXISTS signature_ip     TEXT,
  ADD COLUMN IF NOT EXISTS signature_ua     TEXT,
  ADD COLUMN IF NOT EXISTS signed_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_at      TIMESTAMPTZ,   -- accept without signing
  ADD COLUMN IF NOT EXISTS onboarding_steps JSONB DEFAULT '[]';   -- post-sign flow

-- ── 2. Extend contracts table ─────────────────────────────────
ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS expires_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS view_password    TEXT,
  ADD COLUMN IF NOT EXISTS view_count       INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_viewed_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signer_name      TEXT,
  ADD COLUMN IF NOT EXISTS signer_email     TEXT,
  ADD COLUMN IF NOT EXISTS signature_data   TEXT,
  ADD COLUMN IF NOT EXISTS signature_type   TEXT,
  ADD COLUMN IF NOT EXISTS signature_ip     TEXT,
  ADD COLUMN IF NOT EXISTS signature_ua     TEXT,
  ADD COLUMN IF NOT EXISTS signed_at        TIMESTAMPTZ;

-- ── 3. Content Library ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_library (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  content     TEXT        NOT NULL,         -- HTML content
  category    TEXT        DEFAULT 'General',-- e.g. About Me, Case Study, T&Cs
  tags        TEXT[]      DEFAULT '{}',
  use_count   INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cl_select_own" ON content_library FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cl_insert_own" ON content_library FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cl_update_own" ON content_library FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cl_delete_own" ON content_library FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_cl_user ON content_library (user_id);
CREATE INDEX IF NOT EXISTS idx_cl_category ON content_library (user_id, category);

CREATE OR REPLACE TRIGGER trg_cl_updated
  BEFORE UPDATE ON content_library
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── 4. View tracking events ───────────────────────────────────
CREATE TABLE IF NOT EXISTS document_views (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id   UUID        NOT NULL,          -- proposal or contract ID
  document_type TEXT        NOT NULL,          -- 'proposal' | 'contract'
  viewer_ip     TEXT,
  viewer_ua     TEXT,
  country       TEXT,
  section_times JSONB       DEFAULT '{}',      -- { sectionId: seconds }
  duration_sec  INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Public insert (client views don't need auth)
ALTER TABLE document_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dv_insert_anon" ON document_views FOR INSERT WITH CHECK (true);
CREATE POLICY "dv_select_owner" ON document_views FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM proposals  p WHERE p.id = document_id AND p.user_id = auth.uid()
    UNION
    SELECT 1 FROM contracts  c WHERE c.id = document_id AND c.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_dv_document ON document_views (document_id, created_at DESC);

-- ── 5. Notifications ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL,  -- 'proposal_viewed','proposal_signed','proposal_accepted'
  document_id UUID,
  document_type TEXT,
  title       TEXT,
  message     TEXT,
  read        BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_own" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications (user_id, read, created_at DESC);
