-- ============================================================
-- Update 02 — Subscriptions
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id                     UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT        UNIQUE,
  stripe_subscription_id TEXT        UNIQUE,
  plan                   TEXT        NOT NULL DEFAULT 'free'
                         CHECK (plan IN ('free','pro','business')),
  billing_period         TEXT        NOT NULL DEFAULT 'monthly'
                         CHECK (billing_period IN ('monthly','yearly')),
  status                 TEXT        NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active','trialing','past_due','canceled','unpaid')),
  current_period_end     TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN     DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sub_select_own" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sub_insert_own" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sub_update_own" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Service-role upsert for webhook handler (bypasses RLS)
-- The webhook API route uses the anon key only for reads; upserts are done via service_role

CREATE INDEX IF NOT EXISTS idx_sub_user    ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_sub_stripe  ON subscriptions (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_cust    ON subscriptions (stripe_customer_id);

CREATE OR REPLACE TRIGGER trg_sub_updated
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create free subscription on user signup
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, billing_period, status)
  VALUES (NEW.id, 'free', 'monthly', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_sub ON auth.users;
CREATE TRIGGER on_auth_user_sub
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_subscription();
