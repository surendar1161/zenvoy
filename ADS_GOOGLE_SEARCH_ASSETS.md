# DealPilot — Google Search Ad Assets (draft)

Responsive search ad text for Google Ads. Documentation only; nothing here has been created in any ad account. Character counts were computed in code against Google's limits (headline 30, description 90, display path 15 each), and the set was screened for duplicates, repeated punctuation, all-caps words, emoji and phone-like numbers (none found). Date written: 2026-11-10.

**Before any of this runs:** the funnel must pass its production re-test, the Google tag must be live with a sign-up conversion set up (see `MARKETING_PLAN.md`), and the Google Ads account must be linked. Nothing is a promise of results or of ad approval.

## 1. Headlines (15)

| # | Headline | Chars | Role | Fact it rests on |
|---|---|---|---|---|
| 1 | Freelance Proposal Generator | 28 | keyword | product category |
| 2 | Proposal Tool for Freelancers | 29 | keyword | product category |
| 3 | Turn a Brief Into a Proposal | 28 | benefit | brief-to-draft feature |
| 4 | Paste the Brief, Edit, Send | 27 | benefit | same |
| 5 | Send a Link, Collect a Deposit | 30 | benefit | Stripe payment links on Free |
| 6 | Branded Proposal Links | 22 | feature | branded web link |
| 7 | Free Plan: 5 Proposals/Month | 28 | offer | `lib/plans.ts` Free limit |
| 8 | No Credit Card to Start | 23 | offer | generator page FAQ |
| 9 | Pro Plan From $12/Month | 23 | offer | `lib/plans.ts` Pro monthly price |
| 10 | Proposals for Web Designers | 27 | audience | web-design generator page |
| 11 | Know When Clients Open It | 25 | feature (Pro) | open tracking is a Pro feature |
| 12 | Try It Now, No Sign-Up | 22 | call to action | public preview works without login |
| 13 | DealPilot Proposal Software | 27 | brand | name |
| 14 | Edit Every Line Before Sending | 30 | feature | editor; generator page copy |
| 15 | DealPilot | 9 | brand, short | name (also satisfies Performance Max's 15-or-fewer headline) |

## 2. Descriptions (4)

| # | Description | Chars |
|---|---|---|
| 1 | Paste a client's brief and get a proposal draft with scope, timeline and pricing to edit. | 89 |
| 2 | Send a branded link with a Stripe deposit link. E-signature is included on Pro. | 79 |
| 3 | Free plan: 5 proposals a month, no credit card to start. Pro is $12 a month. | 76 |
| 4 | Built for freelance designers, developers, consultants and copywriters. Try the preview. | 88 |

## 3. Display paths

`proposals` (9) and `freelancers` (11).

## 4. Landing pages (match the ad to the page)

- Keyword theme "freelance proposal generator" → `https://www.dealpilot.co.in/generate/proposal/freelance-proposal`
- Keyword theme "web design proposal" → `https://www.dealpilot.co.in/generate/proposal/web-design-proposal`
- Other niches have their own pages (`/generate/proposal/<niche>-proposal`). Send each ad group to the page that matches its keywords. The ad must match the page: "Try It Now, No Sign-Up" is true only on a generator page with the preview.

## 5. Keyword themes to test (no volumes or costs verified)

"freelance proposal generator", "proposal generator for freelancers", "freelance proposal template", "web design proposal template", "proposal software for freelancers", "ai proposal generator". Cost and volume are unknown until the ad account is linked; pull the keyword estimates before committing a budget.

Negative keyword ideas (add after seeing real search terms): "jobs", "salary", "course", "free download pdf", "upwork bid".

## 6. Records to keep before the ad runs

| Claim in the ad | Keep on file |
|---|---|
| 5 proposals a month on the Free plan | `lib/plans.ts` (Free limits) |
| No credit card to start | The sign-up flow with no card step; the generator page text |
| Pro is $12 a month | `lib/plans.ts` and the live pricing page; recheck if prices change |
| E-signature is on Pro | `lib/plans.ts` (Free excludes it) |
| Open tracking (Pro) | `lib/plans.ts` |
| Deposit link via Stripe | The user must have connected their own Stripe account for it to work |
| "Try It Now, No Sign-Up" | The preview is rate-limited (3 per hour per visitor); keep this in mind if the ad drives bursts |

## 7. Deliberately left out

- "60 seconds", "1,200+ freelancers", a 4.9 rating, "43% higher close rate": no verified source (see the checklist).
- Any mention of which AI model is used: not confirmed (see the checklist).
- Competitor names or comparisons: competitor features and prices are not verified.
- A claim that the Free plan includes e-signatures: it does not. Headline 5 was changed from "sign and pay" to "collect a deposit" for that reason.

## 8. Not covered here

Sitelinks, callouts and structured snippets: their character limits were not in the verified rules, so I gave no sizes. Check Google's current spec before drafting them. Images and video (needed for Performance Max and Demand Gen) are not part of this set and the site has no hosted logo yet. Budgets, bids and audiences are your decision.

## 9. Rules screened

No whole-word capitals, no repeated punctuation, no emoji, no phone numbers, no superlative claims, no unconfirmed urgency, no implication about the viewer, and no offer that the landing page doesn't show. Passing these checks does not guarantee Google will approve the ad; review decides.
