-- update-22: Portal features — client file uploads, notification prefs
-- Run after update-21-scheduling.sql

-- Allow clients (unauthenticated) to insert files via API
CREATE POLICY "pfiles_client_insert" ON portal_files
  FOR INSERT WITH CHECK (uploaded_by = 'client');

-- Portal notification preference columns
ALTER TABLE notification_preferences
  ADD COLUMN IF NOT EXISTS portal_file_uploaded    BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS portal_message_received BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS portal_invoice_sent     BOOLEAN DEFAULT TRUE;
