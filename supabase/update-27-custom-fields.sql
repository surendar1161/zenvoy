-- ============================================================
-- Update 27 — Custom fields for projects and tasks
-- Run in: Supabase Dashboard → SQL Editor
-- Additive and reversible: the rollback is at the bottom.
-- ============================================================

-- ── 1. Field definitions (what fields a user has created) ────
CREATE TABLE IF NOT EXISTS custom_field_definitions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  entity       TEXT        NOT NULL CHECK (entity IN ('project', 'task')),
  name         TEXT        NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 60),
  field_type   TEXT        NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'select', 'checkbox')),

  -- Choices for a dropdown field (array of strings). Empty for other types.
  options      JSONB       NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(options) = 'array'),
  required     BOOLEAN     NOT NULL DEFAULT FALSE,
  show_in_list BOOLEAN     NOT NULL DEFAULT TRUE,
  position     INTEGER     NOT NULL DEFAULT 0,

  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT cfd_select_has_options
    CHECK (field_type <> 'select' OR jsonb_array_length(options) >= 2)
);

-- One field name per user and type, ignoring case and surrounding spaces.
CREATE UNIQUE INDEX IF NOT EXISTS uq_cfd_user_entity_name
  ON custom_field_definitions (user_id, entity, lower(btrim(name)));
CREATE INDEX IF NOT EXISTS idx_cfd_user_entity
  ON custom_field_definitions (user_id, entity, position);

ALTER TABLE custom_field_definitions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cfd_own" ON custom_field_definitions;
CREATE POLICY "cfd_own" ON custom_field_definitions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER trg_cfd_updated
  BEFORE UPDATE ON custom_field_definitions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── 2. Free plan limit: 3 fields per type, enforced here ─────
-- Pro, Business and trial users are unlimited. Same rule as the app's
-- hasProAccess(): a pro/business subscription, or an unexpired trial.
CREATE OR REPLACE FUNCTION enforce_custom_field_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  has_pro  BOOLEAN;
  existing INTEGER;
BEGIN
  SELECT EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = NEW.user_id AND s.plan IN ('pro', 'business'))
      OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = NEW.user_id AND p.trial_ends_at > NOW())
    INTO has_pro;
  IF has_pro THEN
    RETURN NEW;
  END IF;

  -- Serialise concurrent inserts for the same user and type so two requests cannot both pass.
  PERFORM pg_advisory_xact_lock(hashtext(NEW.user_id::text || ':' || NEW.entity));

  SELECT COUNT(*) INTO existing
    FROM custom_field_definitions
   WHERE user_id = NEW.user_id AND entity = NEW.entity;

  IF existing >= 3 THEN
    RAISE EXCEPTION 'custom_field_limit: the Free plan allows 3 custom fields for %s (upgrade to Pro for unlimited)', NEW.entity
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cfd_limit ON custom_field_definitions;
CREATE TRIGGER trg_cfd_limit
  BEFORE INSERT ON custom_field_definitions FOR EACH ROW EXECUTE FUNCTION enforce_custom_field_limit();

-- ── 3. Values live on the project / task row, keyed by definition id ──
ALTER TABLE projects ADD COLUMN IF NOT EXISTS custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE tasks    ADD COLUMN IF NOT EXISTS custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_custom_fields_ok;
ALTER TABLE projects ADD CONSTRAINT projects_custom_fields_ok
  CHECK (jsonb_typeof(custom_fields) = 'object' AND pg_column_size(custom_fields) < 16384);

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_custom_fields_ok;
ALTER TABLE tasks ADD CONSTRAINT tasks_custom_fields_ok
  CHECK (jsonb_typeof(custom_fields) = 'object' AND pg_column_size(custom_fields) < 16384);

-- ── 4. Deleting a field removes its values from every row ────
CREATE OR REPLACE FUNCTION strip_deleted_custom_field()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.entity = 'project' THEN
    UPDATE projects SET custom_fields = custom_fields - OLD.id::text
     WHERE user_id = OLD.user_id AND custom_fields ? OLD.id::text;
  ELSE
    UPDATE tasks SET custom_fields = custom_fields - OLD.id::text
     WHERE user_id = OLD.user_id AND custom_fields ? OLD.id::text;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_cfd_cleanup ON custom_field_definitions;
CREATE TRIGGER trg_cfd_cleanup
  AFTER DELETE ON custom_field_definitions FOR EACH ROW EXECUTE FUNCTION strip_deleted_custom_field();

-- ── Rollback (run only to undo this update) ──────────────────
-- DROP TRIGGER IF EXISTS trg_cfd_cleanup ON custom_field_definitions;
-- DROP TRIGGER IF EXISTS trg_cfd_limit   ON custom_field_definitions;
-- DROP FUNCTION IF EXISTS strip_deleted_custom_field();
-- DROP FUNCTION IF EXISTS enforce_custom_field_limit();
-- ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_custom_fields_ok;
-- ALTER TABLE tasks    DROP CONSTRAINT IF EXISTS tasks_custom_fields_ok;
-- ALTER TABLE projects DROP COLUMN IF EXISTS custom_fields;
-- ALTER TABLE tasks    DROP COLUMN IF EXISTS custom_fields;
-- DROP TABLE IF EXISTS custom_field_definitions;
