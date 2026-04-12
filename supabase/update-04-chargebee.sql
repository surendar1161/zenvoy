-- ============================================================
-- Update 04 — Chargebee columns on subscriptions
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS chargebee_customer_id      TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS chargebee_subscription_id  TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS payment_provider           TEXT DEFAULT 'chargebee'
        CHECK (payment_provider IN ('chargebee', 'stripe', 'free'));

CREATE INDEX IF NOT EXISTS idx_sub_cb_cust ON subscriptions (chargebee_customer_id);
CREATE INDEX IF NOT EXISTS idx_sub_cb_sub  ON subscriptions (chargebee_subscription_id);
