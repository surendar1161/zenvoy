export type Guide = {
  slug: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  date: string;
  dateIso: string;
  readTime: string;
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-generate-a-proposal",
    title: "How to generate a proposal in DealPilot",
    subtitle: "Paste a brief, pick a tone, and get a send-ready draft in about a minute. This is the path from empty dashboard to first proposal.",
    seoTitle: "How to Generate a Proposal with AI (DealPilot)",
    seoDescription: "Step-by-step: generate a freelance proposal in DealPilot. Paste a job post, review scope and pricing, and send a branded link.",
    date: "November 4, 2026",
    dateIso: "2026-11-04",
    readTime: "6 min read",
    steps: [
      {
        title: "Create a free account",
        body: "Go to Sign up, use email or Google, and skip the credit card. The free plan includes 5 AI proposals a month — enough to test on a live lead, not a dummy.",
      },
      {
        title: "Open Generate and paste the brief",
        body: "Use the full job post, email, or your discovery notes. Include budget hints, deadline, and industry. Thin input produces a thin draft; that is expected.",
      },
      {
        title: "Pick tone and template",
        body: "Match how you actually speak on calls. Designers often want calm and specific. Consultants often want direct. You can regenerate a section without throwing the rest away.",
      },
      {
        title: "Edit fees, names, and anything you would not say out loud",
        body: "The AI is a first draft. Fix the number, cut claims you cannot defend, and add a line only you would know from the call.",
      },
      {
        title: "Send the branded link",
        body: "Do not export to Word unless the client requires a PDF. The link is the product: they open, you see it, you follow up with facts instead of anxiety.",
      },
    ],
    faqs: [
      { q: "Do I need Pro to generate?", a: "No. Free includes 5 proposals a month. Upgrade when you are sending more than that, or when you want analytics and white-label." },
      { q: "Can I start from a template instead of a brief?", a: "Yes. Templates are the fallback when the client gave you three sentences. A real brief still wins." },
    ],
  },
  {
    slug: "how-to-send-a-proposal",
    title: "How to send a proposal clients actually open",
    subtitle: "The document is half the job. The other half is getting it in front of the buyer without it dying in a 22-message email thread.",
    seoTitle: "How to Send a Freelance Proposal (DealPilot)",
    seoDescription: "How to send a DealPilot proposal: branded link, short cover note, who to cc, and what to do in the first 24 hours after send.",
    date: "November 4, 2026",
    dateIso: "2026-11-04",
    readTime: "5 min read",
    steps: [
      {
        title: "Send a link, not an attachment first",
        body: "Attachments get trapped in spam, version hell, and 'I will look on the laptop'. A DealPilot link is one tap on a phone. Attach a PDF only if procurement demands it.",
      },
      {
        title: "Write a six-line cover note",
        body: "Restate the goal in their words, name the fee or range, and tell them the link is the proposal. Do not paste the whole scope into the email.",
      },
      {
        title: "Cc the economic buyer if you already met them",
        body: "If you only have the intern, ask who else needs to see it before you send. One extra name now beats a week of silence.",
      },
      {
        title: "Watch the open, then wait with a plan",
        body: "If they open and go quiet, follow the follow-up cadence — not a same-day 'just checking in' pile-on. See the follow-up guide on the blog.",
      },
    ],
    faqs: [
      { q: "Should I also send a PDF?", a: "Keep the live link as the source of truth. Export PDF when a client or procurement team asks. Do not maintain two versions." },
      { q: "What if they want edits on a call?", a: "Take notes, edit the same proposal, and resend the same link. New file names are how deals stall." },
    ],
  },
  {
    slug: "how-to-get-a-proposal-signed",
    title: "How to get a proposal signed without chasing",
    subtitle: "Signature is a moment, not a personality test. Reduce friction, name the next step, and collect the deposit in the same motion.",
    seoTitle: "How to Get a Proposal Signed (DealPilot)",
    seoDescription: "Get freelance proposals signed faster: e-signature, deposit payment links, and what to do when a client stalls after opening.",
    date: "November 4, 2026",
    dateIso: "2026-11-04",
    readTime: "5 min read",
    steps: [
      {
        title: "Turn on e-signature before you send",
        body: "If they have to print, scan, or 'send it to legal' with no signature box, you added a week. DealPilot collects a type-or-draw signature on the same page.",
      },
      {
        title: "Put the first payment next to the yes",
        body: "A signed proposal with no deposit is a maybe. Attach a Stripe payment link for the kickoff invoice so approval and payment happen together.",
      },
      {
        title: "Say what happens the morning after they sign",
        body: "Kickoff call, access you need, and when work starts. People delay signatures when the next step is fog.",
      },
      {
        title: "If they stall, ask a closed question",
        body: "'Is this a no, a not-now, or a waiting-on-finance?' is kinder than a third 'friendly bump'. Then follow the sales guide for timing.",
      },
    ],
    faqs: [
      { q: "Is DealPilot e-sign legally enough?", a: "It is built for freelance agreements and proposals. For high-stakes enterprise paper, your lawyer still leads. Most independent deals close on the built-in signature." },
      { q: "Can they sign on mobile?", a: "Yes. That is the default. If a client forwards the link, the signer does not need a DealPilot account." },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}
