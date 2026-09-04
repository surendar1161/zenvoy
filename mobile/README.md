# DealPilot Mobile (React Native / Expo)

Native iOS & Android app for DealPilot freelancers. Shares the same Supabase backend and Next.js API routes as the web app.

## Design system (SDK)

Colors, typography, and text styles live in `src/design-system/` and match the web app (`#0ea5e9` primary, Inter font).

```ts
import { colors, textStyles, theme } from "@/design-system";
// or for embeddable SDK builds:
import { theme, createDealPilotClient } from "@/sdk";
```

| Token | Value |
|-------|--------|
| Primary | `#0ea5e9` |
| Primary dark | `#0369a1` |
| Text | `#0f172a` |
| Background | `#f8fafc` |
| Font | Inter (400–800) |

Text variants: `hero`, `h1`, `h2`, `h3`, `body`, `bodySmall`, `caption`, `label`, `button`, `link`.

## Flows implemented

| Flow | Screen |
|------|--------|
| Sign in / Sign up | `(auth)/` |
| Today (dashboard) | `(tabs)/index` |
| Pipeline | `(tabs)/pipeline` |
| Clients + detail | `(tabs)/clients`, `client/[id]` |
| Money (invoices) | `(tabs)/money` |
| More hub | `(tabs)/more` |
| Generate proposal (AI) | `generate` |
| Proposal detail | `proposal/[id]` |
| Contracts, Projects, Portals | list screens |
| Templates, Automations, Bookings | list screens |
| Analytics, Expenses | list screens |
| Time tracking | placeholder |
| Settings, Subscription + usage | `settings`, `subscription` |

## Setup

1. Copy env from web project:

```bash
cd mobile
cp .env.example .env
# Set EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
# EXPO_PUBLIC_APP_URL=http://localhost:3000 (or your deployed URL)
```

2. Install and run (web API must be running for AI generate / usage APIs):

```bash
npm install
npm start
```

3. Press `i` for iOS simulator or `a` for Android emulator, or scan QR with Expo Go.

## Build for stores

```bash
npx eas build --platform all
```

(Requires [EAS](https://expo.dev/eas) account and `eas.json` — add when ready for production.)

## Architecture

```
mobile/
  app/           Expo Router screens
  src/
    design-system/   Colors, typography, textStyles
    sdk/               Exported client + theme for white-label SDK
    lib/               Supabase, API client
    components/        UI primitives
```

API calls use Supabase JWT (`Authorization: Bearer`) against your Next.js `app/api/*` routes.
