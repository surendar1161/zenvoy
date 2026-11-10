# DealPilot — ICP, Positioning and Message House

Built with the `pmm-positioning` skills (ideal-customer-profile, positioning-messaging, message-house), in that order. The positioning skill needs a named primary persona and at least three alternatives including the status quo; both are below.

**Read this first.** No customer interviews, win/loss notes or usage data exist yet. Everything about buyers is a **hypothesis to test in your first 10 conversations**, not a finding. Product facts come from the repo. A field with no source is marked `[MISSING]` rather than invented. The skill's own 7-point verification gate was not visible to me, so the checks in section 8 are my own.

## 1. Inputs

| Input | Value | Source |
|---|---|---|
| Primary persona | Solo freelance designer or web developer who sells scoped projects to direct clients | Owner's choice in earlier plans |
| Alternatives (4) | **Status quo:** proposal in Google Docs or Word, sent by email, signed and invoiced in other tools. **Chat AI:** drafting with a general chatbot, then formatting by hand. **Freelance suites:** Bonsai, HoneyBook. **Proposal tools:** Proposify, PandaDoc, Better Proposals | Names from `lib/directory-listings.ts`; their features and prices are **not verified here** |
| Product facts | See section 3 | Repo (`lib/plans.ts`, `app/api/*`, `components/*`) |

## 2. Ideal customer profile (hypothesis)

**Who:** a solo freelancer (designer, web developer, UX, copywriter) who sends several proposals a month to direct clients and writes each one mostly from scratch.

**Trigger events (why now):** a new inbound lead arrives and they dread writing the proposal; a client went quiet after a proposal; a deal was lost over slow turnaround or unclear scope; they started charging more and want to look more professional; they are tired of chasing deposits.

**Buyer map:** the freelancer is user, buyer and payer (no committee). The *client* is the second audience: they open the link, sign and pay, so the client experience is part of the value.

**Jobs to be done (hypotheses):**
- When a lead sends a brief, help me send a clear, scoped proposal quickly so I don't lose them while I think.
- After I send it, tell me whether it was opened so I know when to follow up.
- When the client says yes, let them sign and pay a deposit in one step so the deal is actually closed.

**Disqualify early:** people who only bid on marketplace jobs where the platform sets the format; fewer than one proposal a month; teams with an established sales stack; people who need the product in a language other than English `[MISSING: not checked]`.

**To validate:** what they use today and what it costs them, how long a proposal takes, how many go quiet, whether they would pay $12 a month for tracking and e-signature, and who else they know with the problem. If three of ten don't fit this profile, change it.

## 3. What is true about the product (verified in the repo)

| Capability | Plan | Source |
|---|---|---|
| Draft a proposal from a pasted brief or job post | Free (5 proposals a month) | `app/api/generate-proposal`, `app/api/parse-job-post`; `lib/plans.ts` |
| 19+ templates, brand kit, web proposal link, Stripe payment links | Free | `lib/plans.ts` |
| 15 contract types | Free (2 contracts a month) | `lib/plans.ts` |
| Digital e-signatures, open tracking and notifications, analytics, password protection, expiry, content library | **Pro and above** (not Free) | `lib/plans.ts` ("notIncluded" list for Free) |
| Section-level AI regeneration, good/better/best tiers, milestone payments, white-label | Pro and above | `lib/plans.ts` |
| Client portal, invoices, time tracking, automations, automatic proposal follow-ups | Present in the app | route folders under `app/(dashboard)`, `app/api/cron` |
| Pro $12/month ($9 yearly); Business $29/month ($22 yearly) | | `lib/plans.ts` |

Notes:
- **Do not name the AI model in public copy.** The app's AI client uses OpenAI first and falls back to Claude (`lib/ai-client.ts`), so "generated with Claude", which appears in the directory copy, may be wrong. Check which model actually runs before repeating it.
- The "60 seconds" claim has no measured source `[MISSING]`. Time a real run before using it.
- "1,200+ freelancers" and the 4.9 rating on the home page have no source in the repo `[MISSING]`. Don't repeat them in new copy.

## 4. Positioning (Dunford sequence)

**Competitive alternatives:** see section 1. For the persona, the real competitor is the status quo: Docs, email and several separate tools.

**Unique attributes** (things the alternatives, as a group, don't offer *together* in one low-priced workspace; individual competitor features unverified):
1. Starts from the client's brief, not a blank page.
2. The same link carries the proposal, the signature and the deposit payment.
3. Free plan that works for a real proposal; paid tier at $12/month.

**Value:** less time per proposal, faster yes, deposit collected at the moment of agreement, and a clear signal for when to follow up.

**Who cares most:** the hypothesis in section 2. Confirm in calls.

**Market category:** "proposal software for freelancers" (a recognised category the buyer already searches for). Not "AI contract platform".

**Positioning statement (draft):**
> For solo freelance designers and developers who lose evenings writing proposals and then lose deals in the silence after sending, DealPilot is proposal software that turns a client's brief into a draft you can edit, send as one link, and get signed and paid. Unlike writing in Docs and stitching together separate tools, it keeps the proposal, signature and deposit in one place, and the free plan is enough to try it on a real lead.

## 5. Message house

**Roof**
| Field | Draft |
|---|---|
| Tagline | Turn a client brief into a signed, paid project. |
| Core promise | Write a proposal from the brief, send one link, get a signature and a deposit. |
| Audience | Solo freelance designers and web developers |
| Differentiator | Proposal, signature and payment in one link, starting from the brief, with a free plan |

**Pillars**
| Pillar | Message | Proof available now | Proof still needed |
|---|---|---|---|
| 1. Start from the brief | Paste the client's message and get a scoped draft to edit | Brief-to-draft feature in the app; free plan with 5 proposals a month | Measured time per proposal `[MISSING]`; before/after from a real user `[MISSING]` |
| 2. One link to yes | The client opens, signs and pays from one link | Signature (Pro), Stripe payment links and milestone payments exist | A real signed-and-paid example `[MISSING]` |
| 3. Know when to follow up | See when the proposal is opened and follow up with a reason | Open tracking and automatic follow-ups exist (Pro) | Evidence that follow-ups win more deals `[MISSING]` |

Use "your" and verbs about what the freelancer *does*, not feature lists. Save "AI" for the how, not the headline.

## 6. Use it in outreach

Opening line for the DM in `FIRST_CUSTOMERS_PLAYBOOK.md`: refer to the pain (evenings lost, silence after sending), not to the product. Mention DealPilot only when they say the problem is real.

## 7. Still needed (the `[MISSING]` list)

- [ ] Time one real brief-to-sent proposal and record the minutes.
- [ ] Confirm which AI model runs in production, then fix the directory copy if "Claude" is wrong.
- [ ] Get one real user's story (with permission) for pillars 1 and 2.
- [ ] Verify competitor facts before any comparison page: features, price, free tier. Do not repeat the repo's guesses.
- [ ] Remove or source the home-page user count and rating.
- [ ] After 10 conversations, update section 2 and the positioning statement.

## 8. Self-check (my checklist, not the skill's gate)

- [x] A named primary persona, at least three alternatives including the status quo.
- [x] Every capability claim traces to the repo; plan tiers checked against `lib/plans.ts`.
- [x] Nothing invented about customers, results or competitors; gaps are marked.
- [x] Pillars capped at three.
- [ ] Not yet tested with real buyers. The ICP is a hypothesis.
