# DealPilot — Monorepo

```
ai-proposal-generator/
├── frontend/          ← React 18 + Vite + Ant Design  (deploy to Vercel / Netlify)
├── backend/           ← Supabase Edge Functions (deploy to Supabase)
├── supabase/          ← SQL migrations (run in Supabase Dashboard)
└── README.md
```

---

## Frontend — React + Ant Design

```bash
cd frontend
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev          # → http://localhost:5173
npm run build        # production bundle → dist/
```

**Deploy to Vercel:**
```bash
npm i -g vercel
cd frontend
vercel               # follow prompts
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

### Key directories
| Path | Purpose |
|---|---|
| `src/lib/supabase.ts` | Supabase browser client |
| `src/lib/api.ts` | Typed API calls to Edge Functions |
| `src/lib/theme.ts` | Ant Design theme tokens |
| `src/hooks/useAuth.ts` | Auth state hook |
| `src/router/index.tsx` | React Router config + auth guards |
| `src/pages/` | One file per page/route |
| `src/components/` | Shared UI components |

---

## Backend — Supabase Edge Functions (Deno)

```bash
cd backend
npm install          # installs supabase CLI
```

**Local development:**
```bash
supabase start                           # starts local Supabase stack
supabase functions serve                 # serves all functions locally
```

**Deploy to Supabase:**
```bash
supabase link --project-ref ubutaehhczggyhyjgqjp
supabase secrets set --env-file .env     # push API keys
supabase functions deploy                # deploy all functions
```

### Edge Functions
| Function | Trigger | Purpose |
|---|---|---|
| `generate-proposal` | POST (auth) | Streams AI proposal via Claude |
| `generate-contract` | POST (auth) | Streams AI contract via Claude |
| `parse-job-post` | POST (auth) | Extracts fields from pasted job brief |
| `regenerate-section` | POST (auth) | Returns 3 AI alternatives for a section |
| `create-payment-link` | POST (auth) | Creates Stripe payment link |
| `create-milestone-links` | POST (auth) | Creates multiple Stripe milestone links |
| `chargebee-checkout` | POST (auth) | Creates Chargebee hosted checkout |
| `chargebee-webhook` | POST (no auth) | Handles Chargebee subscription events |
| `stripe-webhook` | POST (no auth) | Handles Stripe payment events |
| `track-view` | POST (no auth) | Records client viewing a proposal |
| `sign-document` | POST (no auth) | Saves e-signature on a proposal/contract |

### Secrets (set via `supabase secrets set KEY=value`)
```
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
CHARGEBEE_SITE
CHARGEBEE_API_KEY
CHARGEBEE_PRO_MONTHLY_PLAN_ID
CHARGEBEE_PRO_YEARLY_PLAN_ID
CHARGEBEE_BUSINESS_MONTHLY_PLAN_ID
CHARGEBEE_BUSINESS_YEARLY_PLAN_ID
FRONTEND_URL
```

---

## Database — Supabase SQL Migrations

Run in order at:
**https://supabase.com/dashboard/project/ubutaehhczggyhyjgqjp/sql/new**

```
supabase/migrations.sql              ← Base tables (run first)
supabase/update-01-signatures-tracking.sql
supabase/update-02-subscriptions.sql
supabase/update-03-clients.sql       ← Required for Clients page
supabase/update-04-chargebee.sql
supabase/update-05-portal.sql
supabase/update-06-projects-tasks.sql
```

---

## Architecture

```
Browser (React SPA)
    │
    ├── Supabase JS client  ── reads/writes DB directly (auth + RLS)
    │
    └── fetch() to Edge Functions ── for AI, payments, webhooks
             │
             ├── Anthropic Claude API  (AI generation)
             ├── Stripe API            (payment links)
             └── Chargebee API         (subscriptions)
```

**Why this split:**
- **DB reads/writes** → direct from browser via Supabase JS (fast, no server hop)
- **Secret API keys** → only in Edge Functions (never exposed to browser)
- **AI generation** → Edge Function streams back to browser
- **Webhooks** → Edge Functions receive from Stripe/Chargebee and update DB
