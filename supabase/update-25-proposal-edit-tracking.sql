-- ============================================================
-- Update 25 — Proposal Edit Tracking (Late Edit Detection)
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Add columns to track edits after proposal is sent
ALTER TABLE proposals 
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS edited_after_sent BOOLEAN DEFAULT false;

-- Create function to track proposal edits
CREATE OR REPLACE FUNCTION track_proposal_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if proposal text changed
  IF NEW.proposal_text IS DISTINCT FROM OLD.proposal_text THEN
    -- Update last edited timestamp
    NEW.last_edited_at := NOW();
    
    -- Increment edit count
    NEW.edit_count := COALESCE(OLD.edit_count, 0) + 1;
    
    -- Mark as edited after sent if status is not draft
    IF OLD.status IN ('sent', 'viewed', 'accepted', 'declined') THEN
      NEW.edited_after_sent := true;
      
      -- Log warning (visible in Supabase logs)
      RAISE NOTICE 'Late edit detected: Proposal % edited after status "%"', NEW.id, OLD.status;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to proposals table
DROP TRIGGER IF EXISTS trg_track_proposal_edit ON proposals;
CREATE TRIGGER trg_track_proposal_edit
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION track_proposal_edit();

-- Add index for queries
CREATE INDEX IF NOT EXISTS idx_proposals_edited_after_sent 
  ON proposals(user_id, edited_after_sent) 
  WHERE edited_after_sent = true;

-- Add comment
COMMENT ON FUNCTION track_proposal_edit() IS 'Tracks proposal edits and flags late edits (after proposal is sent to client)';

-- Backfill existing proposals with default values
UPDATE proposals 
SET edit_count = 0, 
    edited_after_sent = false 
WHERE edit_count IS NULL;

-- Log the change
DO $$
BEGIN
  RAISE NOTICE 'Proposal edit tracking installed successfully';
END $$;
