# DealPilot — Channel Roadmap

The "what, where, and in what order" view. Detail lives elsewhere: strategy and checklist in `MARKETING_PLAN.md`, weekly rhythm in `SOLO_FOUNDER_PLAN.md`, Reddit in `REDDIT_PLAN.md`.

**How to read it:** phases are gated by evidence, not by dates. Move to the next phase when the gate is met, not because the calendar says so. No numeric targets are set here, because there is no traffic baseline yet. Fill the "baseline" cells after two weeks of data.

Control metric across all channels: **proposals sent to real clients per week.** Per-channel attribution uses the `source` tag on sign-up links (`/sign-up?source=<channel>-<detail>`, letters, digits, `_`, `-`, up to 40 characters).

## Phase 0: Make the funnel measurable (before pushing traffic)

| Item | Why |
|---|---|
| Set `SUPABASE_SERVICE_ROLE_KEY` and fix `NEXT_PUBLIC_APP_URL` in Vercel | Badge needs the key; the app URL variable is still wrong (build guard covers it) |
| Test on production: generator preview with a real brief, sign-up, prefill in dashboard, badge on a Free-plan proposal | These shipped but were not tried end to end |
| Confirm events appear in Vercel Analytics: `preview_generated`, `preview_cta_click`, `proposal_generated`, `proposal_link_copied`, `document_viewed`, `proposal_accepted`, `document_signed` | Without this, no channel can be judged |
| Search Console: verify the site, submit the sitemap, request indexing for the hub, roundup and best generator pages | Starts the slow SEO clock |

**Gate to Phase 1:** one real brief goes from public preview to a sent proposal with every event recorded.

## Phase 1: Learn from people (talk before you scale)

| Channel | Action | Asset | Metric |
|---|---|---|---|
| Direct outreach | 10 personalised messages a week to freelancers (design and web first); offer a free proposal for one real lead in exchange for 15 min | Target list, message, call notes | Replies, calls, "no" reasons logged |
| Reddit (helpful, no links at first) | Read rules for 3 subreddits; 3 to 5 genuine answers a week; disclose when mentioning the product | `REDDIT_PLAN.md` drafts | Replies received, mod actions |
| SEO (already live) | Check indexing weekly; fix pages that are "crawled, not indexed" | ~220 generator pages, roundup, guides | Indexed pages, impressions (baseline) |
| Own site | Add a 60-second demo to the home page | Demo video | Home to sign-up rate (baseline) |

**Gate to Phase 2:** at least 10 real conversations held and one repeatable reason people say yes (and one repeatable reason they say no) written down.

## Phase 2: Earn trust and links

| Channel | Action | Asset | Metric |
|---|---|---|---|
| Reviews and directories | Create real listings (G2, Capterra, SaaSHub, AlternativeTo); ask first happy users for a review; then add the URLs to `SAME_AS` in `lib/directory-listings.ts` | Listing copy in `lib/directory-listings.ts` | Listings live, reviews |
| Case study | One short case study from a real user, with permission | Quote, before/after, screenshot | Used in outreach and on site |
| Build in public (LinkedIn, X) | One post a week from a real lesson or call | Posts reuse call notes | Replies, profile visits |
| Comparison content | One new comparison or "alternative to" page per week, written from real objections heard in calls | New page in `lib/seo.ts` | Impressions on those pages |
| Changelog marketing | Public changelog and release-note emails once there are subscribers (the Shipstar plugin installed this session targets this; not set up yet) | Changelog page | Subscribers |
| Email lifecycle | 4-step welcome sequence: generate, send, sign and pay, limit nudge | Email copy | Sign-up to first proposal sent |

**Gate to Phase 3:** a case study exists, listings are live, and sign-up to first-proposal-sent rate is known.

## Phase 3: Scale what works

| Channel | Action | Condition |
|---|---|---|
| Communities | Indie Hackers and relevant Slack/Discord/Facebook groups: contribute first, then share what you built where rules allow | Rules read |
| Launch moment | One planned launch (Product Hunt, "Show HN", Indie Hackers) with the demo, case study and reviews ready | Gate 2 met; do not launch with a thin funnel |
| Partnerships | Freelancer newsletters, template sellers, bootcamps, coworking groups: offer a co-branded template or guest guide | Proof in hand |
| Referral loop | Referral reward (deferred in the checklist) | Funnel baseline known; SQL migration planned |
| Paid | Small, capped search test on proposal-generator intent, using generator pages as landers | Only if sign-up to first proposal sent is healthy and a cost per activated user can be measured |

## Phase 4: Compound

- Refresh top pages every quarter; prune pages that are not indexed.
- Reply to and update Reddit threads that AI engines cite (check with ChatGPT, Perplexity, Gemini, Google AI Overview separately; results vary by engine).
- Template marketplace and integrations ideas go here, after the core loop works.

## Channel scorecard (fill in as data arrives)

| Channel | Effort / week | Sign-ups (30d) | Activated (sent a proposal) | Keep / pause / stop |
|---|---|---|---|---|
| Direct outreach | | | | |
| Reddit | | | | |
| SEO pages | | | | |
| Build in public | | | | |
| Directories / reviews | | | | |
| Email lifecycle | | | | |
| Communities | | | | |
| Launch | | | | |
| Partnerships | | | | |
| Paid | | | | |

Rule: keep at most three active channels until two have shown activated users; pause anything that has no activated users after eight weeks of honest effort.

## Tools on this machine, not yet set up

Several marketing plugins were installed during this session (for SEO and ads data, content planning, email, ActiveCampaign, Shipstar, and a Reddit research tool). None are configured or signed in, and I have not verified what any of them can do for DealPilot. Treat them as options after Phase 1, not prerequisites. Reddit research needs your own Reddit app credentials first (see `REDDIT_PLAN.md`).

## Do not

Fake reviews or upvotes, alternate accounts, buy followers, automate posting on Reddit, launch before the funnel is measurable, or spread across more than three channels at once.
