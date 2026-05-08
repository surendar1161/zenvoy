-- ============================================================
-- Update 18 — Time Tracking Enhancements
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Add default hourly rate to projects for rate inheritance
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS default_hourly_rate NUMERIC(10,2);

-- Index for quickly finding running timers (header indicator)
CREATE INDEX IF NOT EXISTS idx_time_running
  ON time_entries (user_id, is_running)
  WHERE is_running = TRUE;
