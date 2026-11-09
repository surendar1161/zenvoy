# DealPilot — Solo-Founder Marketing Plan

For one person with limited hours. It picks a few channels, does them every week, and cuts the rest. It builds on `MARKETING_PLAN.md` (strategy and checklist) and `REDDIT_PLAN.md` (Reddit detail); read those for the reasoning.

**Assumption to change:** about 8 hours a week of marketing time, with the rest on product and support. If you have more or less, scale the weekly blocks, not the number of channels.

## 1. One goal, one number

- **Goal for the next 90 days:** real freelancers sending real proposals to their clients.
- **The one number:** proposals sent to clients per week (not sign-ups, not visits). Look at it every Monday.
- **Supporting numbers (read from Vercel Analytics, set up this session):** sign-ups by `source` tag, `proposal_generated`, `document_viewed`, `proposal_accepted`, `document_signed`. Do not set targets until you have two weeks of baseline; guessed targets just create noise.

## 2. What you already have (do not rebuild)

- About 220 public generator pages, a roundup post, and 12 help guides, with schema markup (built this session; indexing takes time).
- A no-login preview on every generator page that hands the brief to the dashboard after sign-up.
- A "Made with DealPilot" badge on Free-plan proposals (needs the Supabase service-role key set in Vercel to appear).
- Funnel events, a Reddit plan with drafts, and a checklist of open items.

So the job now is **distribution and learning**, not more features.

## 3. Channels, ranked for a solo founder

| Rank | Channel | Why it fits one person | Weekly time | Start |
|---|---|---|---|---|
| 1 | Direct outreach to 10 freelancers a week | Fastest feedback, no audience needed | 2.5 h | Week 1 |
| 2 | Reddit, helpful answers first (see `REDDIT_PLAN.md`) | Free, where the questions are asked | 2 h | Week 1 (no links) |
| 3 | SEO pages already live | Compounds without weekly effort | 1 h (check Search Console, request indexing) | Week 1 |
| 4 | One public "build in public" post a week | Cheap, builds trust and backlinks | 1 h | Week 2 |
| 5 | Directory listings and reviews | One-time work, lasting links | 1.5 h total in month 1 | Week 3 |
| Later | Paid ads, Product Hunt launch, partnerships | Needs a working funnel and some proof first | | After month 2 |

Do not start channel 6 before channels 1 to 3 have run for four weeks.

## 4. The weekly rhythm (8 hours)

| Day | Block | What |
|---|---|---|
| Mon (1 h) | Review | Check the one number, sign-ups by source, replies received. Pick this week's 10 outreach targets. |
| Tue (1.5 h) | Outreach | Send 5 personal messages: reference their work, name the proposal problem, offer to build a proposal for one of their real leads for 15 minutes of feedback. |
| Wed (1 h) | Reddit | 3 to 5 helpful answers. No links in the first weeks. |
| Thu (1.5 h) | Outreach + calls | Send 5 more messages. Do any feedback calls. |
| Fri (1.5 h) | Content | One post: a lesson from a call, a teardown, or a pricing tip. Reuse it on LinkedIn or X. |
| Fri (1.5 h) | Close the loop | Write down what you learned in a running notes file. Fix the one friction point that came up most. |

Outreach rules: personalise the first line, ask for a conversation rather than a sale, and log every "no" with the reason. Don't automate it at this stage.

## 5. Four-week sprint

**Week 1: foundation**
- Confirm `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_APP_URL` in Vercel (items on the checklist).
- Test the badge on a Free-plan proposal link, and the preview on one generator page, with a real brief.
- Build a list of 40 target freelancers (design and web first). Read the rules of 3 subreddits.
- Request indexing for the hub, the roundup and your 10 best generator pages in Search Console.

**Week 2: first conversations**
- Start the weekly rhythm. Aim for 10 outreach messages and 3 conversations.
- Record a 60-second demo (brief to signed proposal). It feeds the home page, outreach and posts.

**Week 3: listings and proof**
- Create real G2, Capterra, SaaSHub and AlternativeTo listings, and ask the first happy users for a review.
- Turn the best conversation into a short case study, with permission.

**Week 4: review and decide**
- Which channel produced real replies and sent proposals? Keep two, pause the rest.
- Decide the next experiment (one only): Product Hunt launch, a comparison page push, or a referral reward.

## 6. What to say (one message)

Positioning for every channel: **"Paste the client's brief, get a proposal draft you can edit, send, get signed, and collect a deposit."** Keep it to that. Avoid feature lists.

## 7. What not to do

- Do not add features to attract users; talk to ten users first.
- Do not spread across more than three channels at once.
- Do not buy followers, upvotes or reviews, and do not post under fake accounts.
- Do not set revenue targets before you have a funnel baseline.
- Do not skip disclosure on Reddit or in posts: say you built it.

## 8. Decision rules

- If outreach gets fewer replies than expected after 30 messages, change the first line and the offer, not the channel.
- If people sign up but never generate a proposal, fix onboarding before sending more traffic. The prefill and the preview were built for this.
- If people generate proposals but never send them, ask them why on a call.
- If you are over time budget two weeks in a row, drop channel 4 first, then 5.

## 9. Open checklist (from `MARKETING_PLAN.md`)

Referral reward (deferred), refund guarantee decision, service-role key and app URL in Vercel, confirm analytics events, demo video, directory listings.
