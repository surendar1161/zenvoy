-- Follow-up Automation ("Nudge") for unopened proposals

-- Track follow-up state on proposals
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS follow_up_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS follow_up_count INTEGER DEFAULT 0;

-- Efficient lookup for the cron job
CREATE INDEX IF NOT EXISTS idx_proposals_follow_up
  ON proposals (user_id, status, view_count, sent_at)
  WHERE status = 'sent' AND view_count = 0;

-- User preference toggle
ALTER TABLE notification_preferences
  ADD COLUMN IF NOT EXISTS proposal_follow_up BOOLEAN DEFAULT TRUE;

-- Expand workflow_automations trigger_type CHECK to include new trigger
ALTER TABLE workflow_automations
  DROP CONSTRAINT IF EXISTS workflow_automations_trigger_type_check;
ALTER TABLE workflow_automations
  ADD CONSTRAINT workflow_automations_trigger_type_check
  CHECK (trigger_type IN (
    'proposal_accepted','proposal_viewed','proposal_signed','proposal_declined',
    'contract_signed','invoice_paid','invoice_overdue','invoice_sent',
    'payment_received','payment_failed','proposal_follow_up'
  ));
