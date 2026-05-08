-- Scheduling / Booking feature

-- Freelancer scheduling config on profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
  ADD COLUMN IF NOT EXISTS scheduling_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS scheduling_link TEXT,
  ADD COLUMN IF NOT EXISTS scheduling_platform TEXT;

-- Per-proposal scheduling override
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS scheduling_link TEXT,
  ADD COLUMN IF NOT EXISTS show_scheduling BOOLEAN DEFAULT TRUE;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  portal_id UUID REFERENCES client_portals(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Kickoff Call',
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 30,
  timezone TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','cancelled','completed','no_show')),
  meeting_link TEXT,
  meeting_platform TEXT,
  client_name TEXT,
  client_email TEXT,
  notes TEXT,
  source TEXT DEFAULT 'manual'
    CHECK (source IN ('proposal','portal','manual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_own" ON bookings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_proposal ON bookings (proposal_id);
CREATE INDEX IF NOT EXISTS idx_bookings_portal ON bookings (portal_id);
