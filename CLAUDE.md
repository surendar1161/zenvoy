# CLAUDE.md — Long-Term Project Memory

Persistent context for this repo. Claude Code auto-loads this file each session. Keep it accurate; update when architecture or conventions change. (Last reviewed: 2026-11-09.)

## What this is

**DealPilot** (repo folder `zenvoy`, npm name `@dealpilot/app`, live at https://dealpilot.co.in) — an AI-powered proposal, contract, and client-work platform for freelancers and small agencies. Flow: generate a proposal/contract with AI → edit in a rich editor → send via web link → client views/e-signs/pays → project, invoicing, time tracking, client portal.

## Repo layout (monorepo, but the ROOT is the real app)

| Path | Status | Notes |
|---|---|---|
| `app/`, `components/`, `lib/`, `middleware.ts` | **Active** | Next.js 14 App Router app at repo root, deployed on Vercel |
| `supabase/` | **Active** | `migrations.sql` (base) + `update-01…26-*.sql` applied manually in order in Supabase SQL editor |
| `native/` | Active (untracked/new) | Capacitor Android/iOS thin shells around the live site; not part of Vercel build. `npm run native:*` |
| `tests/` | Active | Vitest integration tests (01–10) hitting Supabase; `tests/README.md` |
| `scripts/` | Active | `seed-demo.ts`, `open-directory-listings.mjs` (SEO directory submissions) |
| `frontend/`, `backend/` | **Legacy** | Old Vite + Supabase Edge Functions version described in `README.md`. Don't extend. |
| `mobile/` | Prototype | Expo app; superseded by `native/` |
| `packages/shared` | Minor | Shared types |
| Root `*_COMPLETE.md`, `FIXES_APPLIED.md`, `UX_AUDIT_REPORT.md`, etc. | Historical | Past implementation reports; reference only |

## Stack

- Next.js 14 (App Router), React 18, TypeScript (strict-ish; `tsconfig.tsbuildinfo` is committed and churns — don't hand-edit)
- UI: Ant Design 6 + Tailwind 3; design system "Calm Flight" (`lib/design-tokens.ts`, `lib/theme.ts`, `components/site/*`, `components/ui`)
- Editor: TipTap 3 (`components/RichEditor.tsx`, `DocumentEditor.tsx`)
- Backend: Supabase (Postgres, Auth, RLS) via `@supabase/ssr`; clients in `lib/supabase/`
- AI: `lib/ai-client.ts` — OpenAI `gpt-4o` primary (raw fetch, if `OPENAI_API_KEY` set), falls back to Anthropic (`claude-opus-4-6`)
- Billing: **Chargebee** (primary; `lib/chargebee.ts`, `app/api/chargebee/*`) with Stripe for client payment links/milestones (`create-payment-link`, `stripe-webhook`)
- Email: `lib/email.ts`, `lib/email-templates.ts`; PDF: `lib/pdf/`; Analytics: Vercel Analytics + `lib/analytics.ts`
- Tests: Vitest (`npm test`). Install uses `--legacy-peer-deps` (see `vercel.json`).
- Vercel crons: `/api/cron/recurring-invoices` (06:00), `/api/cron/proposal-follow-ups` (07:00)

## Commands

```bash
npm run dev            # next dev
npm run build / start
npm run lint
npm test               # vitest run (needs real Supabase env in .env.test)
npm run seed:demo      # demo data
npm run listings       # SEO directory listings helper
npm run native:sync | native:android | native:ios
```

## Environment variables (see `.env.local.example`)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, (`OPENAI_API_KEY` optional), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CHARGEBEE_*` (site, API key, plan price-point IDs, webhook password; Product Catalog 2.0 only), `NEXT_PUBLIC_APP_URL`, `GOOGLE_SITE_VERIFICATION`. Never commit `.env*` secrets.

## App architecture

Route groups under `app/`:
- `(public)` — marketing/SEO: home, `pricing`, `features/*`, `for/<niche>`, `alternative/<competitor>` (bonsai, honeybook, pandadoc, proposify), `compare`, `blog/*`, `guides/[slug]`, `ai-generators/[slug]`, `proposal-templates`, `free-proposal-maker`, `ai-proposal-generator`, `freelance-crm`, **`generate/{proposal,library}`** (public, no-login proposal tool)
- `(auth)` — sign-in/up, forgot/reset password; `auth/callback`
- `(dashboard)` — freelancer app: dashboard, proposals, contracts, clients, projects, pipeline, invoices, expenses, time-tracking, capacity, automations, bookings, templates, content-library, brand, portals, analytics, website-analyzer, subscription, settings, generate
- `(client)/my-portal`, `portal/[token]` — client-facing portal
- `proposal/[id]`, `contract/[id]` — public client view/sign pages; `editor/{proposal,contract}/[id]` — editors
- `api/*` — route handlers: generate-proposal/contract/section-content, regenerate-section, parse-job-post, analyze-website, sign-document, accept-document, track-view, pdf, portal/*, bookings, automations, notifications, usage, lead-magnet, cron/*, chargebee/*, stripe-webhook, seed/delete-demo, unsubscribe

`middleware.ts`: Supabase session check; **role split** — freelancer-only route list (`FREELANCER_ONLY`) redirects clients to `/my-portal`; unauthenticated users go to sign-in. Skips auth entirely if Supabase URL is a placeholder. `/generate/library` and `/generate/proposal*` are explicitly public (the `/generate` prefix is otherwise freelancer-only) — keep that exception when editing.

Key `lib/` modules: `plans.ts` (Free 5 proposals/2 contracts; Pro $12/mo ($9 yearly), Business $29/mo, 5 seats), `usage.ts`/`trial.ts` (limits & trial), `generators.ts`/`guides.ts`/`blog.ts`/`proposal-catalog.ts` (programmatic SEO content data), `templates*.ts`, `contract-types.ts` (15 contract types), `automations/` (engine, actions, templates), `recurring.ts` (recurring invoices), `sanitize.ts` + `isomorphic-dompurify` (sanitize all user/AI HTML), `brand.ts` (brand kit; localStorage key `dealpilot_brand`).

## SEO subsystem (heavy recent focus)

`lib/seo.ts` (page metadata + sitemap source), `lib/json-ld.ts` (schema.org), `lib/directory-listings.ts` (G2/Capterra/PH `SAME_AS` profiles), `app/sitemap.ts`, `app/robots.txt/route.ts`, `app/llms.txt/route.ts`, `app/agents.md`. When adding a public page: add it to `lib/seo.ts` page list/sitemap, add JSON-LD, add to `llms.txt`, and link from Footer/Nav as appropriate. Programmatic pages are driven by data files (`proposal-catalog.ts` → `ProposalToolPage.tsx`; `generators.ts` → `GeneratorLanding.tsx`; `guides.ts` → `GuideArticle.tsx`; `blog.ts` → `BlogArticle.tsx`).

## Domain rules worth remembering

- **Signed contracts are immutable**: editor blocks edits UI-side; DB trigger in `update-24`. Late edits to sent proposals are tracked (`update-25`: `last_edited_at`, `edit_count`, `edited_after_sent`). Tests 08/09 cover this and handle DBs with/without those migrations.
- Free plan lacks e-signatures, analytics/tracking, password protection, expiry, content library.
- Supabase schema changes = add a new numbered `supabase/update-NN-*.sql`; they are applied by hand, not by a migration runner.

## Git / workflow notes

- Branch `main`; commit style is sentence-style summaries of outcome (e.g. "Ship the SEO pages and schema…") alongside older `feat:` prefixes.
- At time of writing, uncommitted work: SEO/GEO changes (`llms.txt`, `robots.txt`, `seo.ts`, `json-ld.ts`, `blog.ts`, Footer, middleware), new `app/(public)/generate/`, `blog/best-ai-proposal-generators/`, `ProposalToolPage.tsx`, `lib/proposal-catalog.ts`, and `native/`.
- Don't commit/push unless asked.

## Known gotchas

- Many root-level `.md` status reports are stale narrative, not specs; trust the code.
- `README.md` describes the legacy Vite/`frontend` setup, not the current Next.js app.
- AI model IDs in `lib/ai-client.ts` (`gpt-4o`, `claude-opus-4-6`) are hard-coded; update there if models change.
- Tests are integration tests needing live Supabase credentials — they'll fail without `.env.test`.
