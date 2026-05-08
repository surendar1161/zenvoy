-- Feature 3: Recurring Invoice Automation
-- Adds series tracking and parent linkage for recurring invoices

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS parent_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS recurring_series_id UUID;

CREATE INDEX IF NOT EXISTS idx_invoices_recurring
  ON invoices (user_id, is_recurring, next_invoice_at) WHERE is_recurring = TRUE;

CREATE INDEX IF NOT EXISTS idx_invoices_series
  ON invoices (recurring_series_id) WHERE recurring_series_id IS NOT NULL;
