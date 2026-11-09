/**
 * Copy kit for human directory submissions.
 * These sites require an account + CAPTCHA. There is no supported API
 * to publish a new listing on your behalf.
 */
export type DirectoryListing = {
  id: string;
  name: string;
  home: string;
  submitUrl: string;
  notes: string;
  source: string;
};

export const DIRECTORY_LISTINGS: DirectoryListing[] = [
  {
    id: "alternativeto",
    name: "AlternativeTo",
    home: "https://alternativeto.net/",
    submitUrl: "https://alternativeto.net/manage/add-item/",
    notes: "Log in, add DealPilot, then add 'alternatives to' Bonsai, HoneyBook, Proposify, and PandaDoc.",
    source: "alternativeto",
  },
  {
    id: "taaft",
    name: "There's An AI For That",
    home: "https://theresanaiforthat.com/",
    submitUrl: "https://theresanaiforthat.com/submit/",
    notes: "Category: proposals / sales / freelance. Use the short tagline below.",
    source: "taaft",
  },
  {
    id: "futurepedia",
    name: "Futurepedia",
    home: "https://www.futurepedia.io/",
    submitUrl: "https://www.futurepedia.io/submit-tool",
    notes: "AI tool directory. Attach a screenshot of a generated proposal, not the marketing hero only.",
    source: "futurepedia",
  },
  {
    id: "toolify",
    name: "Toolify",
    home: "https://www.toolify.ai/",
    submitUrl: "https://www.toolify.ai/submit",
    notes: "Often indexes fast. Same short description as TAAFT.",
    source: "toolify",
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    home: "https://www.producthunt.com/",
    submitUrl: "https://www.producthunt.com/posts/new",
    notes: "Launch when you can be in comments for a full day. Not a drive-by submit.",
    source: "producthunt",
  },
  {
    id: "betalist",
    name: "BetaList",
    home: "https://betalist.com/",
    submitUrl: "https://betalist.com/submit",
    notes: "Early-stage audience. Use the designer-focused first comment.",
    source: "betalist",
  },
  {
    id: "uneed",
    name: "Uneed",
    home: "https://www.uneed.best/",
    submitUrl: "https://www.uneed.best/submit",
    notes: "Indie directory. Short tagline + screenshot.",
    source: "uneed",
  },
  {
    id: "saashub",
    name: "SaaSHub",
    home: "https://www.saashub.com/",
    submitUrl: "https://www.saashub.com/submit",
    notes: "Add competitors (Bonsai, HoneyBook, Proposify) so comparison pages can pick you up.",
    source: "saashub",
  },
  {
    id: "g2",
    name: "G2",
    home: "https://www.g2.com/",
    submitUrl: "https://sell.g2.com/",
    notes: "Vendor listing. Do not invent reviews. Add the public G2 URL to SAME_AS in lib/seo.ts once live.",
    source: "g2",
  },
  {
    id: "capterra",
    name: "Capterra",
    home: "https://www.capterra.com/",
    submitUrl: "https://www.capterra.com/vendors/",
    notes: "Same as G2: real listing only. Add the URL to SAME_AS after it exists.",
    source: "capterra",
  },
];

export const LISTING_COPY = {
  name: "DealPilot",
  website: "https://www.dealpilot.co.in",
  signup: "https://www.dealpilot.co.in/sign-up",
  tagline: "AI proposals, contracts, and invoices for freelancers — send a branded proposal in 60 seconds.",
  short:
    "DealPilot is AI proposal software for freelancers. Paste a brief, generate a scoped proposal with Claude, collect an e-signature, and attach a Stripe payment link.",
  long:
    "DealPilot helps independent designers, consultants, and other freelancers close client work without a 90-minute proposal ritual. Paste a job post or brief, generate a personalised proposal (scope, pricing tiers, timeline, terms), send a branded link, and collect e-signatures plus Stripe deposits in the same workspace. Free plan: 5 proposals/month. Pro from $12/month.",
  categories: [
    "AI proposal generator",
    "Freelance proposal software",
    "Contract and e-signature",
    "Client portal",
    "Invoicing",
  ],
  alternativesTo: ["Bonsai", "HoneyBook", "Proposify", "PandaDoc", "Better Proposals"],
  audiences: ["Freelance designers", "Independent consultants", "Copywriters", "Small agencies"],
};

/**
 * Organization.sameAs — only URLs that are this product.
 * Do not add G2, Capterra, Product Hunt, YouTube, or Reddit until a listing
 * for dealpilot.co.in exists. The Product Hunt "Deal Pilot" page is a
 * different cold-email product. Launch Llama is a real listing of this site.
 */
export const SAME_AS: string[] = [
  "https://tools.launchllama.co/products/deal-pilot",
];
