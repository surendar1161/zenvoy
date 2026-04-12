-- ============================================================
-- Update 07 — Role-based access control (freelancer vs client)
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Add role to profiles ───────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'freelancer'
      CHECK (role IN ('freelancer', 'client'));

-- ── 2. Update auto-create trigger to include role ─────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, freelancer_email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'freelancer')
  )
  ON CONFLICT (id) DO UPDATE SET
    role = COALESCE(NEW.raw_user_meta_data ->> 'role', 'freelancer');
  RETURN NEW;
END;
$$;

-- ── 3. Helper: get current user's role ────────────────────────
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ── 4. Update client_portals RLS ──────────────────────────────
-- Freelancer: full access to their own portals
-- Client: SELECT only on portals where their email matches

DROP POLICY IF EXISTS "portals_own"    ON client_portals;
DROP POLICY IF EXISTS "portals_public" ON client_portals;

-- Freelancer: full CRUD on own portals
CREATE POLICY "portals_freelancer_all" ON client_portals
  FOR ALL
  USING (auth.uid() = user_id);

-- Client: read-only on portals where their email matches
CREATE POLICY "portals_client_read" ON client_portals
  FOR SELECT
  USING (
    client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- ── 5. Portal files: client can SELECT their portal's files ───
DROP POLICY IF EXISTS "pfiles_own"    ON portal_files;
DROP POLICY IF EXISTS "pfiles_public" ON portal_files;

CREATE POLICY "pfiles_freelancer_all" ON portal_files
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "pfiles_client_read" ON portal_files
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_portals p
      WHERE p.id = portal_id
        AND p.client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- ── 6. Portal messages: client can SELECT + INSERT ────────────
DROP POLICY IF EXISTS "pmsg_insert_any"    ON portal_messages;
DROP POLICY IF EXISTS "pmsg_select_any"    ON portal_messages;
DROP POLICY IF EXISTS "pmsg_update_owner"  ON portal_messages;

-- Freelancer: full access to their portals' messages
CREATE POLICY "pmsg_freelancer_all" ON portal_messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM client_portals p
      WHERE p.id = portal_id AND p.user_id = auth.uid()
    )
  );

-- Client: read + insert their own portal messages
CREATE POLICY "pmsg_client_read" ON portal_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_portals p
      WHERE p.id = portal_id
        AND p.client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "pmsg_client_insert" ON portal_messages
  FOR INSERT
  WITH CHECK (
    sender = 'client'
    AND EXISTS (
      SELECT 1 FROM client_portals p
      WHERE p.id = portal_id
        AND p.client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Also keep public insert for unauthenticated client portal access
CREATE POLICY "pmsg_public_insert" ON portal_messages
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "pmsg_public_select" ON portal_messages
  FOR SELECT USING (TRUE);

-- ── 7. Portal invoices: client can SELECT ─────────────────────
DROP POLICY IF EXISTS "pinv_own"    ON portal_invoices;
DROP POLICY IF EXISTS "pinv_public" ON portal_invoices;

CREATE POLICY "pinv_freelancer_all" ON portal_invoices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "pinv_client_read" ON portal_invoices
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_portals p
      WHERE p.id = portal_id
        AND p.client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- ── 8. All other tables: freelancer-only (unchanged) ──────────
-- proposals, contracts, clients, projects, tasks, etc. remain
-- scoped to user_id = auth.uid() — clients cannot see these.

-- ── Summary of access ─────────────────────────────────────────
-- Freelancer (surendar1160+1@gmail.com):
--   ✅ All dashboard tabs (proposals, contracts, clients, projects, portals, analytics...)
--
-- Client (surendar1160+2@gmail.com):
--   ✅ client_portals    — SELECT where client_email = their email
--   ✅ portal_files      — SELECT files in their portals
--   ✅ portal_messages   — SELECT + INSERT (can chat)
--   ✅ portal_invoices   — SELECT (can view/pay invoices)
--   ❌ proposals, contracts, clients, projects, analytics — no access
