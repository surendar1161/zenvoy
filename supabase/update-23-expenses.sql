-- update-23: Expense tracking for freelancers
-- Run after update-22-portal-features.sql

CREATE TABLE IF NOT EXISTS expenses (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id       UUID          REFERENCES clients(id) ON DELETE SET NULL,
  title           TEXT          NOT NULL,
  amount          NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency        TEXT          DEFAULT 'USD',
  category        TEXT          NOT NULL DEFAULT 'other'
                  CHECK (category IN (
                    'software','hardware','travel','office',
                    'marketing','education','subscriptions',
                    'meals','other'
                  )),
  date            DATE          NOT NULL DEFAULT CURRENT_DATE,
  receipt_url     TEXT,
  notes           TEXT,
  vendor          TEXT,
  is_recurring    BOOLEAN       DEFAULT FALSE,
  recurrence      TEXT          CHECK (recurrence IN ('weekly','monthly','quarterly','yearly')),
  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   DEFAULT NOW()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expenses_own" ON expenses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_expenses_user     ON expenses (user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date     ON expenses (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (user_id, category);
CREATE INDEX IF NOT EXISTS idx_expenses_client   ON expenses (client_id);

-- Storage bucket for expense receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('expense-receipts', 'expense-receipts', true)
ON CONFLICT DO NOTHING;
