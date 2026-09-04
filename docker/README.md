# Docker

Run the DealPilot Next.js app in a container. Database/auth remain on **Supabase** (external).

## Quick start (production)

```bash
cp .env.docker.example .env.docker
# Edit .env.docker — same keys as .env.local

docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

## Development (hot reload)

```bash
cp .env.docker.example .env.docker
docker compose -f docker-compose.dev.yml up --build
```

## Build image only

```bash
docker build -t dealpilot:web \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  .
```

## Environment variables

| When | Variables |
|------|-----------|
| **Build** (`NEXT_PUBLIC_*`) | Baked into the client bundle. Set via `docker-compose.yml` build `args` or `docker build --build-arg`. |
| **Runtime** | Server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, Stripe, Chargebee, `RESEND_API_KEY`, `CRON_SECRET`) via `.env.docker`. |

Set `NEXT_PUBLIC_APP_URL` to the URL users reach in the browser (e.g. `https://app.yourdomain.com`).

## Cron jobs (replaces Vercel crons)

From any scheduler, call with header `Authorization: Bearer $CRON_SECRET`:

- `GET /api/cron/recurring-invoices` — daily 06:00 UTC
- `GET /api/cron/proposal-follow-ups` — daily 07:00 UTC

Example with curl:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-domain.com/api/cron/proposal-follow-ups
```

## Notes

- **Mobile** (`mobile/`) is not included — use Expo locally or EAS for iOS/Android builds.
- Image uses Next.js `output: "standalone"` (~Node 20 Alpine, non-root user).
- Healthcheck: `GET /` on port 3000.
