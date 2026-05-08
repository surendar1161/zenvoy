-- ============================================================
-- Update 16 — Email Notification Preferences
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  email_enabled       BOOLEAN DEFAULT TRUE,
  proposal_viewed     BOOLEAN DEFAULT TRUE,
  proposal_signed     BOOLEAN DEFAULT TRUE,
  proposal_accepted   BOOLEAN DEFAULT TRUE,
  proposal_declined   BOOLEAN DEFAULT TRUE,
  invoice_sent        BOOLEAN DEFAULT TRUE,
  invoice_paid        BOOLEAN DEFAULT TRUE,
  invoice_overdue     BOOLEAN DEFAULT TRUE,
  contract_signed     BOOLEAN DEFAULT TRUE,
  payment_received    BOOLEAN DEFAULT TRUE,
  payment_failed      BOOLEAN DEFAULT TRUE,

  unsubscribe_token   TEXT UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notification_prefs_own" ON notification_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notif_prefs_user ON notification_preferences (user_id);

CREATE OR REPLACE TRIGGER trg_notif_prefs_updated
  BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Track which notifications were emailed
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE;
