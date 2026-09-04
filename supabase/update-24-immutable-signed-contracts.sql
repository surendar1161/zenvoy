-- ============================================================
-- Update 24 — Prevent Editing Signed Contracts (Immutability)
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Create function to prevent editing signed contracts
CREATE OR REPLACE FUNCTION prevent_signed_contract_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if contract is signed
  IF OLD.status = 'signed' OR OLD.signed_at IS NOT NULL THEN
    -- Allow status updates but prevent text changes
    IF NEW.contract_text IS DISTINCT FROM OLD.contract_text THEN
      RAISE EXCEPTION 'Cannot modify signed contract: Contract is legally binding and immutable (signed at %)', OLD.signed_at;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to contracts table
DROP TRIGGER IF EXISTS trg_prevent_signed_contract_edit ON contracts;
CREATE TRIGGER trg_prevent_signed_contract_edit
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION prevent_signed_contract_edit();

-- Add comment
COMMENT ON FUNCTION prevent_signed_contract_edit() IS 'Prevents modification of contract_text after contract has been signed (immutability protection)';

-- Test the constraint (optional - remove in production)
-- This will fail as expected:
-- UPDATE contracts SET contract_text = 'tampered' WHERE status = 'signed';

-- Log the change
DO $$
BEGIN
  RAISE NOTICE 'Signed contract immutability trigger installed successfully';
END $$;
