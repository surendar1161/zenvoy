# DealPilot — Marketing Plan & Product Improvements

Date: 2026-11-09. Based on the codebase and a live check of https://www.dealpilot.co.in/ (home, pricing, robots, sitemap, new routes).
Frameworks used: campaign-plan (marketing plugin), find-first-customers (founderos).

## 0. Fix first (these block every marketing channel)

| # | Problem found on the live site | Fix |
|---|---|---|
| 1 | **Production is stale.** `/generate/proposal`, `/generate/library` redirect to sign-in; `/blog/best-ai-proposal-generators` is 404; robots.txt lacks the new Allow lines. Commit `bb93ae3` is not live. | Check the Vercel project's Git link/branch and the latest deployment log; redeploy. |
| 2 | **Canonicals, sitemap and robots point to `zenvoy.vercel.app`**, not dealpilot.co.in. Google is told the canonical home is the wrong domain. | Set `NEXT_PUBLIC_APP_URL=https://www.dealpilot.co.in` in Vercel env (Production), redeploy, then resubmit the sitemap in Search Console. |
| 3 | **Pricing disagrees with the code.** Live page shows Pro $9 / Business $22 (yearly-equivalent) with "Save 25%", but yearly = exactly 12 x shown price, and the monthly price ($12 / $29 in `lib/plans.ts`) is never shown. Free plan on the page lists e-signatures, tracking, password protection; `plans.ts` says Free lacks them. | Show monthly and yearly prices side by side; make the Free column match `plans.ts` (or change the plan); one source of truth. |
| 4 | Hero stat counters read "0" in the page text; "0% close-rate uplift" attributed to a third party; resource pack says "5 templates" but lists 4. | Server-render real numbers or remove; use DealPilot's own data once you have it. |
| 5 | "Loved by 1,200+ freelancers", 4.9 rating, testimonials without photos. | Only keep if true and verifiable. If not, replace with honest early-stage proof (see section 3). Unverifiable proof costs more trust than none. |
| 6 | Pricing "Contact sales" links to the Business sign-up. | Point to a real contact form or mailto. |

## 1. Positioning

- Today's hero: "Your AI envoy for every client, every deal." It is brand voice, not a promise. The visitor cannot tell who it is for.
- Recommended: **"Paste the brief. Send a proposal your client can sign and pay — in 60 seconds."** Sub: "AI proposals, e-signature, and deposit links for freelancers. Free for 5 proposals a month."
- Wedge ICP (pick one first): **freelance designers and web developers**, who already have `/for/designers` and `/for/web-developers` pages. The old Calm Flight design and designer sign-up tracking are already built for this.
- Differentiator vs Bonsai / HoneyBook / Proposify / PandaDoc: starts from a *job post or brief*, ends at *signed + deposit paid*, at a solo-freelancer price.

## 2. Channel plan (ranked by effort vs expected lead quality)

### A. Programmatic SEO (already built, needs to go live) — highest leverage
- 220 generator URLs, FAQ + breadcrumb schema, 13-tool roundup, 12 guides — all blocked by item 0.1 and 0.2.
- After deploy: submit sitemap, request indexing for the hub, roundup, and 10 top generators, link the hub from the home footer and nav.
- Add the **public try-before-signup** step: generator pages should produce a 1-section preview without login, then gate the full document behind sign-up. That converts search traffic into leads.
- Add 20 more comparison/alternative pages (Qwilr, Better Proposals, Hubflo, Bonsai pricing, "free" variants), one per week.
- Targets (90 days): 150+ indexed URLs, 1,500 organic visits/month, 3% visit-to-signup = ~45 signups/month from SEO alone. Treat as estimates, not promises.

### B. Communities (zero cost, founder-led, do not automate)
- Reddit: handled manually by the owner, outside this plan.
- Indie Hackers, Hacker News "Show HN" (once the public generator works without login), Product Hunt launch (own listing for dealpilot.co.in — do not use the existing unrelated "Deal Pilot" page).
- Facebook groups and Slack/Discord for freelancers and Upwork/Fiverr sellers.

### C. Directory and review listings (already scripted: `npm run listings`)
- G2, Capterra, SaaSHub, AlternativeTo, Product Hunt, Launch Llama (done). After going live add each URL to `SAME_AS` in `lib/directory-listings.ts`.
- Ask the first 10 users for a review each — reviews feed both SEO and AI-answer citations.

### D. Founder-led outbound (first 10 paying customers)
- Build a list of 40 named freelancers (Upwork top-rated profiles, Dribbble/Behance designers, freelance web devs on LinkedIn) who recently posted that they are taking clients.
- Message (4 sentences max): reference their work, name the problem (writing proposals takes an evening), offer a free proposal built for one of their real leads in exchange for 15 minutes of feedback.
- Track: contacted -> replied -> call -> trial -> paid. Expect low reply rates; log every "no" reason before changing the script.

### E. Content and social (low effort, repurpose the same assets)
- Weekly: one teardown ("I rewrote a real freelance proposal"), one pricing post, one short screen recording of brief -> proposal -> signed.
- Platforms: LinkedIn (freelancers, consultants), X, YouTube Shorts / Reels for the 60-second demo. One demo video on the home page is currently missing and is the single best asset to produce.

### F. Paid (only after the funnel converts organically)
- Do not spend until sign-up -> first proposal sent is above ~30%. Then test Google Search on "proposal template/generator" intent with a small budget and the generator pages as landers.

### G. Lifecycle (retention converts free to paid)
- Email sequence for new sign-ups: day 0 (generate first proposal), day 2 (send it with tracking), day 5 (e-sign + deposit link), day 9 (free-limit nudge). Pro unlocks tracking/analytics, so the "someone opened your proposal" email is the natural upgrade trigger.

## 3. Proof you can build honestly
- Publish 3 real case studies (even tiny): "Designer sent proposal at 9pm, signed by 11am". Use the user's own numbers, with permission.
- Public changelog and build-in-public posts.
- Replace unverifiable counters with live ones from your DB (proposals generated, documents signed) if the numbers are real.

## 4. 90-day calendar

| Weeks | Focus | Output |
|---|---|---|
| 1 | Item 0 fixes, deploy, Search Console, analytics events on the sign-up funnel | Live site matches repo; canonical correct |
| 2 | Home hero + pricing rewrite, demo video, public generator preview | Higher visit -> sign-up rate |
| 3-4 | Directory listings, Product Hunt/Indie Hackers launch, 40-person outreach list | First reviews, first 10 conversations |
| 5-8 | Weekly comparison page + 1 teardown post, community answers daily (15 min) | Indexed pages grow; referral traffic |
| 9-12 | Review funnel data, email sequence tuned, small paid test if conversion is healthy | Decide what to double down on |

## 5. Metrics
- North star: **proposals sent to real clients per week** (not sign-ups).
- Funnel: visit -> sign-up -> first proposal generated -> first proposal sent -> first signature/payment -> upgrade.
- Channel: organic clicks/impressions (Search Console), indexed pages, community referrals, listing referrals, cost per paid sign-up.
- Reporting cadence: weekly, 30 minutes.

## 6. Product improvements (ordered by impact on leads and conversion)

**Activation**
1. Public, no-login generator preview on `/generate/proposal/[slug]` (gate download/send behind sign-up).
2. Guided first-run: after sign-up, jump straight to "paste a brief" with a sample brief pre-filled; do not land on an empty dashboard.
3. Show "proposal opened" notifications on Free for the first proposal as a taste of Pro tracking.

**Conversion and trust**
4. Pricing page fixes in section 0; add a monthly/yearly toggle that defaults to monthly or clearly labelled.
5. Clearer legal copy for e-signature: state what is supported, and link to a short compliance page; the FAQ currently undercuts itself.
6. Add a refund/guarantee statement that matches policy (live page: "no refunds"). A 14-day money-back would reduce friction on annual plans.
7. Show the model used in a consistent way, or stop naming it on Pro only.

**Growth loops**
8. "Made with DealPilot" footer on Free proposals linking to a tracked sign-up page (removed by white-label on Pro). Every proposal sent becomes an ad to the client, who is often a freelancer-adjacent buyer.
9. Referral: free extra proposals for each referred sign-up.
10. Shareable public proposal examples (anonymized) as SEO + social content.

**Product and quality**
11. Add real analytics events (Vercel Analytics is installed): sign-up, first generate, first send, first sign, upgrade, limit hit. Without them the plan cannot be measured.
12. Add Open Graph images per generator/guide for better sharing.
13. `NEXT_PUBLIC_APP_URL` should be validated at build time (fail if it is not the production domain) so item 0.2 cannot silently recur.
14. Consolidate `README.md` (still describes the old Vite app) and stale root status reports to reduce confusion for contributors.

## 7. Risks
- SEO pages are thin if all 220 share templated copy. Mitigation: unique includes/FAQ per niche (already per-niche fields), add real examples, and monitor for "crawled, not indexed".
- Unverified social proof is a trust and potentially legal risk. Mitigation: keep only verifiable numbers.
- Free plan too generous (or inconsistent) hurts upgrades. Mitigation: align Free with `plans.ts` and test limits.

## 8. Checklist (open items)

- [ ] **Referral reward** (deferred by owner on 2026-11-09). Proposed defaults: both sides get 2 extra proposals on the monthly limit, granted after the new user generates their first proposal; self-referral blocked; referrer bonus capped at 20; share link shown in Settings. Needs a SQL migration applied by hand in Supabase (`update-27-referrals.sql`), `?ref=` capture on sign-up (like `signup_source`), and a safe server-side credit route. Read new columns defensively so the dashboard does not break before the migration is applied.
- [ ] **Refund guarantee decision.** Pricing FAQ now explains the no-refund policy clearly; a 14-day money-back guarantee on annual plans is an owner decision.
- [ ] **Confirm `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel** so the "Made with DealPilot" badge can read another user's plan. Test on a Free-plan proposal link.
- [ ] **Fix `NEXT_PUBLIC_APP_URL` in Vercel** to `https://www.dealpilot.co.in` (build guard covers it, but the variable itself is still wrong).
- [ ] **Confirm funnel events in Vercel Analytics:** `proposal_generated`, `proposal_link_copied`, `document_viewed`, `proposal_accepted`, `document_signed`, `preview_generated`, `preview_cta_click`.
- [ ] Record a 60-second product demo for the home page and YouTube.
- [ ] **Push the local commits** (the AI assistant cannot run `git push` here): in the prompt type `! git push origin main`, then check `git status -sb` shows no "ahead".

### Directory listings (details, copy and status table: `DIRECTORY_LISTINGS.md`)

Do the first item before the rest; it blocks most listings.

- [ ] **Prepare assets:** square logo PNG (the site hosts none), 2 to 3 screenshots (generated proposal, client view with pricing tiers, signature screen), a company-domain email such as you@dealpilot.co.in.
- [ ] **BetaList: finish the draft before 2026-11-17 02:20 UTC.** Open the claim link (shared in chat only; never save it in a file), confirm email, upload an icon and a screenshot, check the plan prices, then decide whether to pay. It is a paid listing; skip it if the price is not worth the backlink.
- [ ] **SaaSHub:** submit by hand at `https://www.saashub.com/services/submit` (the site asks AI agents not to submit). Add categories and competitors (Bonsai, HoneyBook, Proposify, PandaDoc, Better Proposals), verify with the company email.
- [ ] **G2** at `https://www.g2.com/products/new` (bot check blocks automated browsers; do it in your own browser). Then check whether the listing also appears on **Capterra, GetApp and Software Advice**; if not, use each one's vendor page.
- [ ] **Uneed:** submit by hand at `https://www.uneed.best/submit`, free waiting line. Do not ask friends for upvotes or buy any.
- [ ] **AlternativeTo:** sign up, then "Suggest new application" in the user menu; read `alternativeto.net/faq` first (account-age and queue rules are unconfirmed).
- [ ] **Look up and submit the rest:** Toolify, Future Tools, Best of AI, ToolScout, Crunchbase, SourceForge. Check each site's current terms and cost before submitting.
- [ ] **Decide on paid options** (owner decision, free routes first): There's An AI For That ($49 or $437), Futurepedia (about $497, reported by third parties), BetaList plan.
- [ ] **Product Hunt:** plan one launch day when you can answer comments for a full day; not a drive-by submit.
- [ ] **After each listing goes live:** record the live URL and date in `DIRECTORY_LISTINGS.md`, view the page source to see whether the link has `rel="nofollow"`, `ugc` or `sponsored`, and fix any wrong details.
- [ ] **Add real listing URLs to `SAME_AS`** in `lib/directory-listings.ts` (small code change, only for listings that exist).
- [ ] **Code fixes for later:** host a logo/favicon (the schema logo URL `/icon.png` is 404) and correct the outdated directory URLs in `lib/directory-listings.ts` and `scripts/open-directory-listings.mjs` (SaaSHub `/services/submit`; AlternativeTo and Futurepedia links are broken).
