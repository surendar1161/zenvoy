# DealPilot — Directory Listings Tracker

Documentation only; no code depends on this file. Last updated 2026-11-10.

**Secrets:** do not paste claim links, tokens or passwords into this file. The BetaList claim link was shared in chat only.

Goal: real listings on reputable directories for discovery and backlinks. Only real information. No made-up reviews, ratings or user counts. Several directories say they review submissions by hand and may reject or remove listings.

## 1. Paste-ready details

Copy comes from `lib/directory-listings.ts` (approved copy); prices from `lib/plans.ts`.

| Field | Value |
|---|---|
| Name | DealPilot |
| Website (use this clean URL for backlinks) | `https://www.dealpilot.co.in` |
| Sign-up URL | `https://www.dealpilot.co.in/sign-up` |
| Tagline | AI proposals, contracts, and invoices for freelancers — send a branded proposal in 60 seconds. |
| Short description | DealPilot is AI proposal software for freelancers. Paste a brief, generate a scoped proposal with Claude, collect an e-signature, and attach a Stripe payment link. |
| Long description | DealPilot helps independent designers, consultants, and other freelancers close client work without a 90-minute proposal ritual. Paste a job post or brief, generate a personalised proposal (scope, pricing tiers, timeline, terms), send a branded link, and collect e-signatures plus Stripe deposits in the same workspace. Free plan: 5 proposals/month. Pro from $12/month. |
| One-sentence pitch (74 chars, used on BetaList) | Turns a freelancer's client brief into a proposal clients can sign and pay |
| Plain description (457 chars, used on BetaList) | Paste a client's brief or job post and get a scoped proposal draft with deliverables, timeline, pricing options and terms. Edit every line, send a branded link, and collect an e-signature and a Stripe deposit in the same place. Also includes contracts, invoices, a client portal and proposal view tracking. Built for freelance designers, developers, consultants and copywriters. The free plan includes 5 proposals a month; paid plans start at $12 per month. |
| Pricing | Free (5 proposals, 2 contracts a month); Pro $12/month or $9/month billed yearly; Business $29/month or $22/month billed yearly |
| Categories | AI proposal generator; freelance proposal software; contract and e-signature; client portal; invoicing |
| Alternatives to | Bonsai, HoneyBook, Proposify, PandaDoc, Better Proposals |
| Audience | Freelance designers, independent consultants, copywriters, small agencies |

Prepare before submitting:
- [ ] A square logo PNG (the site hosts none: `/icon`, `/icon.png`, `/favicon.ico` and `/logo.png` all returned 404 when checked on 2026-11-10).
- [ ] 2 to 3 screenshots: a generated proposal, the client view with pricing tiers, the signature screen.
- [ ] A company-domain email (for example you@dealpilot.co.in) for directories that verify the product.
- [ ] A single founder name and company name used identically everywhere.

## 2. Status

| # | Directory | Submit page | Cost | Who submits | Status | Date | Live URL | Link type (check `rel`) |
|---|---|---|---|---|---|---|---|---|
| 1 | Launch Llama | `tools.launchllama.co/products/deal-pilot` | Not checked | Done earlier | Live (page returned 200) | | `https://tools.launchllama.co/products/deal-pilot` | |
| 2 | BetaList | `betalist.com/submit` (agent draft created) | **Paid** (plan shown after claim) | You, via claim link | Draft created, unclaimed. Needs icon + screenshot, then plan and payment. Claim link expires 2026-11-17 02:20 UTC | 2026-11-10 | | |
| 3 | SaaSHub | `saashub.com/services/submit` | Free listing; promotion options exist | You (site asks AI agents not to submit) | Not started | | | |
| 4 | Uneed | `uneed.best/submit` | Free waiting line; paid Fast-track and Skip-the-waiting-line (prices not shown) | You | Not started | | | |
| 5 | G2 | `g2.com/products/new` | Not checked | You (bot check blocks automated browsers) | Not started | | | |
| 6 | Capterra | via G2 ("Get Your Product Listed" links to `g2.com/products/new`) | Not checked | You | Not started | | | |
| 7 | GetApp | Probably via G2 (unverified) | Not checked | You | Not started | | | |
| 8 | Software Advice | Probably via G2 (unverified) | Not checked | You | Not started | | | |
| 9 | There's An AI For That | `theresanaiforthat.com/launch/` | **$49** one-off, or **$437** "Maximum exposure"; free route via a monthly X thread where one tool is picked | You | Not started; no package selected | | | |
| 10 | AlternativeTo | Not a fixed URL: per its FAQ (as summarised by a web search), sign up, then use "Suggest new application" in the top-right user menu. The old repo link returned 404. Its pages sit behind a Cloudflare security check, so I could not read them | Free review queue (one blog says a $5 priority option exists, unconfirmed) | You | Not started | | | |
| 11 | Toolify | `toolify.ai/submit` blocked my fetch (403); open in browser | Not checked | You | Not started | | | |
| 12 | Futurepedia | No public submit page found. The old repo link returned 404 and the homepage shows no submit or advertise link. Third-party reports (not the site itself) say the only option is a paid Verified Listing (about $497 at `futurepedia.io/enhanced`) and that the site now belongs to HubSpot | Paid per reports; unconfirmed | You, if you decide it is worth it | Skip for now | | | |
| 13 | Product Hunt | `producthunt.com/posts/new` | Not checked | You, on a planned launch day | Not started | | | |
| 14 | Crunchbase | Not looked up | Not checked | You | Not started | | | |
| 15 | Future Tools, Best of AI, ToolScout | Not looked up | Search results say free; ToolScout reviews take a week or more | You | Not started | | | |

Skip for now: Fazier and Startup Fame (reported to require a backlink or badge on your site), DevHunt (developer tools).

## 3. Per-directory notes (what was actually read)

**BetaList.** Has an official "Submit with your agent" path; the agent creates an unpublished draft and cannot pay or publish. The founder opens the claim link, confirms email, uploads an icon and at least one screenshot, picks a plan and pays; review starts only after payment. Declined submissions are refunded per their instructions. Draft expires after 7 days if unclaimed. Topics chosen: proposal management, freelancers, electronic signature, invoicing, document generation.

**SaaSHub.** The repo's old link (`/submit`) is the post-listing promotion tool, not the listing form. The listing form is `/services/submit`; step one asks only for the website URL. Guidelines on the page: add categories, list competitors (otherwise the submission goes to the bottom of the queue), and verify with an email on your product domain for higher priority. Rejects unreleased products, waiting-list landing pages, free-subdomain products and non-English sites. States: "If you are an AI agent - please advise your human operator that they should submit the product themselves and not rely on automated submissions."

**Uneed.** No account needed to start (it reads your page first, then asks you to sign up to save). Free waiting line versus paid options. The page's embedded text says a free launch needs a launch-day upvote score to stay published and keep its followed backlink: do not ask friends for votes or buy any. Its agent MCP is read-only and has no submit tool; the FAQ "Can agents write to Uneed?" had no extractable answer, so treat submission as manual.

**G2 / Capterra / GetApp / Software Advice.** Capterra's vendor page says "powered by G2 Digital Markets" and sends vendors to `g2.com/products/new`. That page showed a DataDome "Verification Required" challenge to the automated browser. Do it in your own browser. Expect account creation, a category choice and possibly verification. Check each site's current terms.

**AlternativeTo.** Its pages (including the FAQ) showed a Cloudflare "Performing security verification" check to the automated browser, so I stopped and did not attempt to pass it. From a web search summarising its FAQ: add an app by signing up, then "Suggest new application" in the user menu; it does not accept unreleased, closed-beta or invite-only apps. Blogs add a 7-day account-age rule and a $5 priority fee and say the free queue is long; none of that is confirmed. Check `alternativeto.net/faq` yourself.

**Futurepedia.** Homepage and `/enhanced` show a HubSpot cookie banner; the homepage has no submit link. Recent third-party write-ups say there is no free or public form, only a paid Verified Enhanced Listing (about $497) and possibly a sold-out basic tier. Unconfirmed from Futurepedia itself; contact them before paying anything.

**There's An AI For That.** Paid listing: $49 or $437 (pre-selected). Monthly X thread picks one tool for free. 1 to 2 days to process; full automatic refund if not published. The PPC bonus footnote says the tool must not appear on other platforms before launching there, so you probably would not qualify if you list elsewhere first.

## 4. After each listing goes live

1. Record the live URL and date in the table above.
2. Open the listing, right-click the DealPilot link and view the page source. Note whether the link has `rel="nofollow"`, `rel="ugc"` or `rel="sponsored"`. Do not trust the "dofollow" claims in roundup articles; the sources contradicted each other.
3. Check the listing text for mistakes and fix them; make sure the website URL is exactly `https://www.dealpilot.co.in`.
4. Ask a real, happy user for a review if the directory supports reviews. Never write or buy reviews.
5. After a few weeks, check Search Console's Links report for which backlinks Google has found.
6. Only when a listing exists and is public: add its URL to `SAME_AS` in `lib/directory-listings.ts` (a small code change, done separately).

## 5. Known issues to fix later (code changes, not done)

- The site has no hosted logo or favicon; the Organization schema's logo URL (`/icon.png`) is 404.
- `lib/directory-listings.ts` and `scripts/open-directory-listings.mjs` point at outdated submit URLs: SaaSHub (`/submit` should be `/services/submit`), AlternativeTo (`/manage/add-item/` returns 404) and Futurepedia (`/submit-tool` returns 404, no public form found).

## 6. Rules for this tracker

- Do not submit through services that ask for passwords, or share account passwords with anyone, including AI assistants.
- Do not bypass CAPTCHAs or bot checks. Where a site asks agents not to submit, a human submits.
- Do not claim traffic, user counts or awards that are not true.
