-- ============================================================
-- Update 11 — Project Files
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS project_files (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  name         TEXT        NOT NULL,
  storage_path TEXT        NOT NULL,
  storage_url  TEXT,
  size_bytes   INTEGER,
  mime_type    TEXT,

  uploaded_by  TEXT        NOT NULL DEFAULT 'freelancer'
               CHECK (uploaded_by IN ('freelancer','client')),
  uploader_name TEXT,

  category     TEXT        DEFAULT 'general'
               CHECK (category IN ('design','document','image','contract','invoice','reference','general')),

  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

-- Freelancer: full access to files in their own projects
CREATE POLICY "project_files_freelancer"
  ON project_files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
        AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Client: can read & insert files in projects where they are the linked client
CREATE POLICY "project_files_client_select"
  ON project_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = project_files.project_id
        AND c.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "project_files_client_insert"
  ON project_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = project_files.project_id
        AND c.email = auth.jwt() ->> 'email'
    )
  );

CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files (project_id, created_at DESC);

-- Storage bucket (run separately if needed):
-- Supabase Dashboard → Storage → New bucket → name: "project-files" → public: false
-- Or:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false) ON CONFLICT DO NOTHING;
