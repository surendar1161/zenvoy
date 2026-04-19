-- ============================================================
-- Update 13 — 30-day trial for new users
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Add trial column to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Set trial for existing users who don't have it yet
-- (gives them 30 days from now)
UPDATE profiles
SET trial_ends_at = NOW() + INTERVAL '30 days'
WHERE trial_ends_at IS NULL;

-- Update the signup trigger to set trial on new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, freelancer_email, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    NOW() + INTERVAL '30 days'
  )
  ON CONFLICT (id) DO UPDATE
    SET trial_ends_at = COALESCE(profiles.trial_ends_at, NOW() + INTERVAL '30 days');
  RETURN NEW;
END;
$$;
