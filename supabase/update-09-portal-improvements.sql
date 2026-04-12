-- ============================================================
-- Update 09 — Portal Improvements
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Add approval workflow to portal files
ALTER TABLE portal_files
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending'
    CHECK (approval_status IN ('pending','approved','needs_revision')),
  ADD COLUMN IF NOT EXISTS approval_note TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Add project linkage to portals
ALTER TABLE client_portals
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_portals_project ON client_portals (project_id);

-- Activity log table (computed events for audit trail)
CREATE TABLE IF NOT EXISTS portal_activity (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_id   UUID        NOT NULL REFERENCES client_portals(id) ON DELETE CASCADE,
  actor       TEXT        NOT NULL CHECK (actor IN ('freelancer','client','system')),
  actor_name  TEXT,
  event_type  TEXT        NOT NULL,  -- 'file_uploaded','invoice_created','message_sent','file_approved','file_revision','invoice_paid','portal_viewed'
  description TEXT        NOT NULL,
  meta        JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portal_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pactivity_freelancer"
  ON portal_activity FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM client_portals p
      WHERE p.id = portal_activity.portal_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "pactivity_client_select"
  ON portal_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_portals p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = portal_activity.portal_id
        AND c.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "pactivity_client_insert"
  ON portal_activity FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM client_portals p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = portal_activity.portal_id
        AND c.email = auth.jwt() ->> 'email'
    )
  );

CREATE INDEX IF NOT EXISTS idx_pactivity_portal ON portal_activity (portal_id, created_at DESC);

-- Enable realtime on activity
ALTER PUBLICATION supabase_realtime ADD TABLE portal_activity;
