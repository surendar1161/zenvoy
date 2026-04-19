-- ============================================================
-- Update 12 — Demo data tracking flag on profiles
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS has_demo_data BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS demo_seeded_at TIMESTAMPTZ;
