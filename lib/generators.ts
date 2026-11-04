export type Generator = {
  slug: string;
  name: string;
  tag: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  source: string;
  verticalHref: string;
  verticalLabel: string;
  outcomes: string[];
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
};

export const GENERATORS: Generator[] = [
  {
    slug: "freelance-proposal",
    name: "Freelance proposal generator",
    tag: "Freelance proposals",
    title: "Freelance proposal generator",
    subtitle: "Paste the brief. DealPilot writes a scoped, priced, send-ready freelance proposal in 60 seconds — then you e-sign and attach a payment link.",
    seoTitle: "Freelance Proposal Generator — AI Writer for Freelancers",
    seoDescription: "Generate a freelance proposal from a job post in 60 seconds. Scope, pricing tiers, timeline, and terms — ready to send with e-signature and Stripe.",
    source: "generator-freelance",
    verticalHref: "/ai-proposal-generator",
    verticalLabel: "AI proposal generator",
    outcomes: [
      "A personalised cover note that mirrors the client's language",
      "Scope, deliverables, and a Good / Better / Best pricing table",
      "Timeline, revision terms, and next-step CTA",
      "A branded link you can send — not a 12-page Word doc",
    ],
    sections: [
      {
        heading: "Built for people who sell their own work",
        body: "Most 'proposal generators' dump generic paragraphs into a template. This one is wired to how freelancers actually close: paste a job post or brief, pick a tone, and get a proposal you can send the same night — with contracts and invoices sitting behind it.",
      },
      {
        heading: "What to paste in",
        body: "Upwork posts, email briefs, Notion specs, or a voice note transcript. The more the client wrote, the more the proposal sounds like them. You still edit every line before it goes out.",
      },
    ],
    faqs: [
      { q: "Is this a free freelance proposal generator?", a: "Yes. The free DealPilot plan includes 5 AI proposals a month, templates, and Stripe payment links. No credit card to start." },
      { q: "Can I use it for any freelance niche?", a: "Yes. Start here for a general freelance proposal, or jump to a design, web, consulting, copywriting, or video generator for niche language and deliverables." },
      { q: "Does the client need an account?", a: "No. They open your branded proposal link, review, and can sign. You see opens from your dashboard." },
    ],
  },
  {
    slug: "graphic-design-proposal",
    name: "Graphic design proposal generator",
    tag: "For designers",
    title: "Graphic design proposal generator",
    subtitle: "Turn a messy brand brief into a design proposal with deliverables, revision rounds, and milestone payments — without spending the evening in Docs.",
    seoTitle: "Graphic Design Proposal Generator for Freelancers",
    seoDescription: "Generate a branded graphic design proposal in 60 seconds. Logo, brand, UI, and campaign scopes with revision terms and milestone billing.",
    source: "generator-design",
    verticalHref: "/for/designers",
    verticalLabel: "DealPilot for designers",
    outcomes: [
      "Deliverable lists that match brand, UI, or campaign work",
      "Revision rounds and usage rights called out in plain language",
      "Milestone billing instead of one scary lump sum",
      "A proposal that looks as considered as your portfolio",
    ],
    sections: [
      {
        heading: "Designers lose time in the pitch, not the pixels",
        body: "The brief arrives at 4pm. The client wants 'something premium' and a quote by morning. This generator scopes brand identity, web UI, or campaign design so you are not rewriting the same three paragraphs from last month's Figma file.",
      },
      {
        heading: "Pairs with the designer landing page",
        body: "If you sell brand systems, identity, or digital design, use the designer workflow: paste the brief, generate, send. This page is the search entry; the product does the writing.",
      },
    ],
    faqs: [
      { q: "Does it cover logo and brand identity projects?", a: "Yes. It can scope logo suites, colour and type systems, guidelines, and social assets — then you trim anything that does not belong." },
      { q: "Can I attach moodboards or portfolio work?", a: "You can edit the proposal and point clients to case studies or a portal. The generator gets the commercial document out of the way first." },
      { q: "How do revision rounds show up?", a: "The draft includes revision terms you can keep, tighten, or replace with your studio policy before sending." },
    ],
  },
  {
    slug: "web-design-proposal",
    name: "Web design proposal generator",
    tag: "Web design",
    title: "Web design proposal generator",
    subtitle: "Scope pages, breakpoints, CMS, and launch support in a proposal a non-technical client can actually approve.",
    seoTitle: "Web Design Proposal Generator — AI for Freelancers",
    seoDescription: "Generate a web design proposal with page scope, responsive design, CMS, and launch support. AI-written in 60 seconds, ready to e-sign.",
    source: "generator-web-design",
    verticalHref: "/for/web-developers",
    verticalLabel: "DealPilot for developers",
    outcomes: [
      "Page-by-page scope instead of 'a website'",
      "Responsive, CMS, and content-entry assumptions made explicit",
      "Launch, training, and retainer options as add-ons",
      "Milestones that match design → build → launch",
    ],
    sections: [
      {
        heading: "Stop quoting 'a five-page site'",
        body: "Clients hear 'website' and imagine something else. This generator forces the brief into pages, integrations, and who supplies copy — so change requests have a home later.",
      },
      {
        heading: "Works next to development proposals",
        body: "If the engagement is design-only, stay here. If you also ship code, generate a website development proposal and keep the commercial split clean.",
      },
    ],
    faqs: [
      { q: "Can it include Webflow, WordPress, or Framer?", a: "Yes. Mention the stack in the brief and the draft will speak that language. You still confirm what you actually offer." },
      { q: "Does it handle redesigns vs new sites?", a: "Paste whether this is a rebuild, a redesign, or a new property. The scope and risks in the draft will follow." },
      { q: "Can I add SEO or photography as extras?", a: "Use pricing tiers or add-on lines for SEO, photo, or copy so the core build stays comparable." },
    ],
  },
  {
    slug: "website-development-proposal",
    name: "Website development proposal generator",
    tag: "Development",
    title: "Website development proposal generator",
    subtitle: "SOW-ready web development proposals: stack, milestones, acceptance, and what happens when the client changes the nav on week three.",
    seoTitle: "Website Development Proposal Generator",
    seoDescription: "Generate a website development proposal with stack, milestones, acceptance criteria, and change-request terms. Built for freelance developers.",
    source: "generator-web-dev",
    verticalHref: "/for/web-developers",
    verticalLabel: "DealPilot for developers",
    outcomes: [
      "Stack and hosting assumptions in writing",
      "Milestone billing tied to design, build, and launch",
      "Acceptance criteria instead of endless polish loops",
      "Change-request language you can actually enforce",
    ],
    sections: [
      {
        heading: "Developers do not lose deals on GitHub",
        body: "They lose them on vague quotes. This generator turns a ticket dump or RFP into a proposal a founder can forward to their co-founder without you hopping on a fourth call.",
      },
      {
        heading: "Connects to contracts after they say yes",
        body: "Once the proposal is signed, generate an SOW or development contract in the same workspace. You are not copy-pasting into a second tool.",
      },
    ],
    faqs: [
      { q: "Is this only for marketing sites?", a: "No. Use it for marketing sites, web apps, and rebuilds. Put the product type in the brief so the draft does not underscope." },
      { q: "Can it mention Next.js, Shopify, or WordPress?", a: "Yes. The AI follows the stack you paste. Keep your real constraints in the edit pass." },
      { q: "How are payments handled?", a: "Attach Stripe payment links and milestones from DealPilot so the first invoice is not a separate scavenger hunt." },
    ],
  },
  {
    slug: "consulting-proposal",
    name: "Consulting proposal generator",
    tag: "Consulting",
    title: "Consulting proposal generator",
    subtitle: "Turn discovery notes into a consulting proposal with objectives, workstreams, fees, and a clear 'what good looks like'.",
    seoTitle: "Consulting Proposal Generator for Independents",
    seoDescription: "Generate a consulting proposal from discovery notes in 60 seconds. Objectives, workstreams, fees, and SOW language for independent consultants.",
    source: "generator-consulting",
    verticalHref: "/for/consultants",
    verticalLabel: "DealPilot for consultants",
    outcomes: [
      "Problem, approach, and outcomes in one narrative",
      "Workstreams and cadence instead of a vague retainer paragraph",
      "Fixed, sprint, or monthly fee options",
      "A path from proposal to SOW without rewriting",
    ],
    sections: [
      {
        heading: "Independents should not write like McKinsey decks",
        body: "Your buyer wants to know what you will do in the next 30 days, what you need from them, and how risk is shared. This generator writes that document, not a 40-slide theatre piece.",
      },
      {
        heading: "Use after a discovery call",
        body: "Paste your call notes or transcript. The draft should sound like the conversation you just had — then you cut anything that over-promises.",
      },
    ],
    faqs: [
      { q: "Can I use this for retainers and projects?", a: "Yes. Say which commercial model you want in the brief. You can also present both as tiers." },
      { q: "Does it write a full SOW?", a: "The proposal carries SOW-level scope. When they accept, generate a contract from the same deal so legal language is not improvised in email." },
      { q: "Is it only for management consulting?", a: "No. Operations, brand strategy, fractional leadership, and specialist advisory all work if the brief is specific." },
    ],
  },
  {
    slug: "copywriting-proposal",
    name: "Copywriting proposal generator",
    tag: "Copywriting",
    title: "Copywriting proposal generator",
    subtitle: "Pitch landing pages, emails, and brand voice work with word counts, rounds, and usage rights already in the quote.",
    seoTitle: "Copywriting Proposal Generator — AI for Writers",
    seoDescription: "Generate a copywriting proposal with deliverables, word counts, revision rounds, and usage rights. Send a branded link in 60 seconds.",
    source: "generator-copywriting",
    verticalHref: "/for/copywriters",
    verticalLabel: "DealPilot for copywriters",
    outcomes: [
      "Deliverables listed as pages, emails, or scripts — not 'content'",
      "Revision rounds and stakeholder review baked in",
      "Usage and attribution terms you can keep or cut",
      "A tone that sounds like a writer, not a marketing suite",
    ],
    sections: [
      {
        heading: "Writers should not spend billable hours on the pitch",
        body: "The client already has a Google Doc full of 'just make it punchy'. This generator turns that into a commercial proposal so you can get back to the actual sentences.",
      },
      {
        heading: "Good / Better / Best actually fits copy",
        body: "Core pages vs a full funnel vs voice guidelines on top. Tiers make it easy for a marketing manager to pick a number without another round of 'can you just…'.",
      },
    ],
    faqs: [
      { q: "Does it work for UX writing and ads?", a: "Yes. Name the format in the brief — ads, UX microcopy, emails, or long-form — so counts and rounds stay realistic." },
      { q: "Can I quote per word?", a: "You can. Most writers on DealPilot still quote per project and show the word-count range inside the scope." },
      { q: "Will it steal my voice?", a: "The draft follows your brief and brand kit. You edit before send. Client work is not used to train models." },
    ],
  },
  {
    slug: "marketing-proposal",
    name: "Marketing proposal generator",
    tag: "Marketing",
    title: "Marketing proposal generator",
    subtitle: "Package retainers, campaigns, and channel work into a proposal a founder can approve without a 14-tab spreadsheet.",
    seoTitle: "Marketing Proposal Generator for Freelancers & Agencies",
    seoDescription: "Generate a marketing proposal for retainers and campaigns. Channels, cadence, reporting, and fees — AI-written and ready to send.",
    source: "generator-marketing",
    verticalHref: "/for/marketing-agencies",
    verticalLabel: "DealPilot for agencies",
    outcomes: [
      "Channel mix and monthly cadence in writing",
      "Reporting and meeting rhythm so 'strategy' is not vibes",
      "Retainer vs campaign vs hybrid pricing",
      "Room for ads budget as a pass-through, not a surprise",
    ],
    sections: [
      {
        heading: "Retainers die in vague PDFs",
        body: "This generator asks what you will actually ship each month. If the brief is thin, the draft will look thin — which is the point. You go back and scope before you discount.",
      },
      {
        heading: "Small teams, not enterprise CPQ",
        body: "Built for freelance marketers and tiny agencies. You get a branded link, e-sign, and invoices — not a Salesforce-shaped proposal tool.",
      },
    ],
    faqs: [
      { q: "Can I include paid media budget separately?", a: "Yes. Keep fees and ad spend as separate lines so the client is not comparing your retainer to their Google Ads invoice." },
      { q: "Does it support SEO, social, and lifecycle?", a: "Paste the mix. The draft will list workstreams. Delete channels you do not sell." },
      { q: "Can a two-person agency use this?", a: "That is the default user. Business plan adds seats when you hire; you do not pay per-user tax on day one." },
    ],
  },
  {
    slug: "video-production-proposal",
    name: "Video production proposal generator",
    tag: "Video",
    title: "Video production proposal generator",
    subtitle: "Quote shoots, edits, and usage in a proposal that survives 'can we also get a 15-second cut for ads'.",
    seoTitle: "Video Production Proposal Generator",
    seoDescription: "Generate a video production proposal with shoot days, edit rounds, deliverable formats, and usage terms. Built for freelance video teams.",
    source: "generator-video",
    verticalHref: "/for/video-production",
    verticalLabel: "DealPilot for video",
    outcomes: [
      "Pre-pro, shoot, and post as separate milestones",
      "Deliverable formats and aspect ratios listed",
      "Revision and extra-cut pricing before the rush request",
      "Usage and licensing language you can stand behind",
    ],
    sections: [
      {
        heading: "The expensive part is the reshoot you did not quote",
        body: "Paste the brief, including where it will run. The draft should make extra cuts, extra locations, and extra usage into line items — not favours.",
      },
      {
        heading: "Crews still need a document the client can forward",
        body: "Producers, editors, and one-person shops all send the same branded link. The client does not need five tools to say yes and pay the deposit.",
      },
    ],
    faqs: [
      { q: "Does it handle retainers for always-on content?", a: "Yes. Describe monthly volume and platforms. You can still generate a one-off campaign quote from the same account." },
      { q: "Can I include equipment or licensing costs?", a: "Add them as lines or exclusions so they do not vanish into a day rate." },
      { q: "What about music and stock?", a: "Call out licensed music and stock as client-supplied, included, or extra. Do not leave it implied." },
    ],
  },
  {
    slug: "brand-identity-proposal",
    name: "Brand identity proposal generator",
    tag: "Brand",
    title: "Brand identity proposal generator",
    subtitle: "Scope logos, type, colour, and guidelines in a proposal that sets revision limits before the seventh 'can we try red'.",
    seoTitle: "Brand Identity Proposal Generator for Designers",
    seoDescription: "Generate a brand identity proposal covering logo, palette, type, and guidelines. Revision terms and milestones included.",
    source: "generator-brand",
    verticalHref: "/for/designers",
    verticalLabel: "DealPilot for designers",
    outcomes: [
      "Logo suite vs full identity vs guidelines — chosen up front",
      "Presentation rounds with a cap",
      "What the client must supply (words, legal name, competitors)",
      "A deposit-friendly milestone structure",
    ],
    sections: [
      {
        heading: "Identity work needs a fence",
        body: "Without a proposal, brand projects sprawl. This generator puts the fence on paper: what is in, what is a new project, and when you invoice.",
      },
      {
        heading: "Send it looking like a studio",
        body: "Brand kit colours and logo go on the proposal itself. The first impression of your identity process is the document they open.",
      },
    ],
    faqs: [
      { q: "Can I sell a mini brand kit vs a full system?", a: "Yes. Use tiers: logo-only, core kit, and full guidelines. Clients self-select instead of negotiating you down in email." },
      { q: "Does it mention trademark filing?", a: "Only if you offer it. Most designers exclude legal filing and say so in the draft." },
      { q: "How fast can I send after a discovery call?", a: "Same evening is the point. Paste notes, generate, edit names and fees, send the link." },
    ],
  },
  {
    slug: "retainer-proposal",
    name: "Retainer proposal generator",
    tag: "Retainers",
    title: "Retainer proposal generator",
    subtitle: "Define hours, response times, and what rolls over — so a monthly retainer is not an unlimited Slack plan.",
    seoTitle: "Freelance Retainer Proposal Generator",
    seoDescription: "Generate a freelance retainer proposal with hours, SLA, rollover rules, and monthly fees. Clear scope, ready to e-sign.",
    source: "generator-retainer",
    verticalHref: "/ai-proposal-generator",
    verticalLabel: "AI proposal generator",
    outcomes: [
      "Hours or outcomes per month, written down",
      "Response-time expectations that are not 24/7",
      "Rollover and pause rules",
      "A start date and first invoice attached",
    ],
    sections: [
      {
        heading: "Retainers fail when 'priority' is undefined",
        body: "This generator makes the commercial object obvious: a block of time or a block of outcomes. You choose. The client stops treating you like staff.",
      },
      {
        heading: "Invoice on a rhythm",
        body: "Once accepted, bill monthly from the same client record. You are not rebuilding the relationship every invoice.",
      },
    ],
    faqs: [
      { q: "Can I offer a 3-month minimum?", a: "Yes. Put the term in the brief. Edit the draft so the minimum and notice period match how you actually work." },
      { q: "What if I sell mixed retainers (design + ads)?", a: "List workstreams and a combined fee, or two line items. Do not hide ad spend inside the retainer." },
      { q: "Is a retainer different from a contract?", a: "The proposal wins the yes. Generate a retainer agreement next so IP, payment, and termination are not only in the pitch." },
    ],
  },
];

export function getGenerator(slug: string) {
  return GENERATORS.find((generator) => generator.slug === slug) ?? null;
}
