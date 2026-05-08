-- Feature 5: Workflow Automations

CREATE TABLE IF NOT EXISTS workflow_automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'proposal_accepted','proposal_viewed','proposal_signed','proposal_declined',
    'contract_signed','invoice_paid','invoice_overdue','invoice_sent',
    'payment_received','payment_failed'
  )),
  conditions JSONB DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  last_triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  is_template BOOLEAN DEFAULT FALSE,
  template_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE workflow_automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own automations"
  ON workflow_automations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES workflow_automations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  trigger_data JSONB DEFAULT '{}',
  actions_executed JSONB DEFAULT '[]',
  status TEXT NOT NULL CHECK (status IN ('success','partial','failed')),
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON automation_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_automations_trigger
  ON workflow_automations (user_id, trigger_type, enabled) WHERE enabled = TRUE;

CREATE INDEX IF NOT EXISTS idx_automation_logs_recent
  ON automation_logs (user_id, created_at DESC);
