-- ============================================================
-- Update 08 — Project Messages (Freelancer ↔ Client chat)
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS project_messages (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  sender_name TEXT        NOT NULL,
  sender_role TEXT        NOT NULL DEFAULT 'freelancer'
              CHECK (sender_role IN ('freelancer', 'client')),

  message     TEXT        NOT NULL,
  is_read     BOOLEAN     DEFAULT FALSE,

  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;

-- Freelancer: full access to messages in their own projects
CREATE POLICY "project_messages_freelancer"
  ON project_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_messages.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Client: can read & insert messages in projects where they are the linked client
CREATE POLICY "project_messages_client_select"
  ON project_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = project_messages.project_id
        AND c.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "project_messages_client_insert"
  ON project_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = project_messages.project_id
        AND c.email = auth.jwt() ->> 'email'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_messages_project ON project_messages (project_id, created_at);
CREATE INDEX IF NOT EXISTS idx_project_messages_user    ON project_messages (user_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_unread  ON project_messages (project_id, is_read) WHERE is_read = FALSE;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE project_messages;
