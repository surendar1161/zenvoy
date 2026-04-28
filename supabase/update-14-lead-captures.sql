-- ── Lead Captures (landing page lead magnet) ──────────────────────────────────
create table if not exists lead_captures (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  name         text,
  source       text default 'lead_magnet',   -- lead_magnet | footer | pricing | other
  magnet       text default 'proposal_templates', -- what they signed up for
  ip_address   text,
  user_agent   text,
  converted    boolean default false,         -- true when they sign up for an account
  created_at   timestamptz default now(),
  unique(email)
);

create index if not exists idx_lead_captures_email      on lead_captures(email);
create index if not exists idx_lead_captures_created_at on lead_captures(created_at desc);

-- Public insert (no auth required — landing page visitors)
alter table lead_captures enable row level security;
create policy "lead_captures_insert" on lead_captures for insert with check (true);
create policy "lead_captures_service_read" on lead_captures for select using (auth.role() = 'service_role');
