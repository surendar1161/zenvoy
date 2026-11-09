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
  {
    slug: "how-to-edit-a-proposal",
    title: "How to edit a proposal after it is generated",
    subtitle: "The AI draft is a starting point. Here is how to change the scope, fees, and wording before the client sees it.",
    seoTitle: "How to Edit a Proposal in DealPilot",
    seoDescription: "Edit a generated proposal in DealPilot: change sections, regenerate one with AI, fix fees, and preview before you send.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "5 min read",
    steps: [
      { title: "Open the proposal in the editor", body: "From Proposals, open the draft. The editor works like a document: click into any section and type." },
      { title: "Rewrite one section, not the whole thing", body: "Regenerate a single section when the tone is off. Your edits elsewhere stay where they are." },
      { title: "Fix the numbers first", body: "Check fees, deposit, and dates before you polish prose. Wrong numbers are the edits clients remember." },
      { title: "Cut claims you cannot defend", body: "Delete anything you would not say on a call. A shorter honest proposal beats a long confident one." },
      { title: "Preview as the client", body: "Open the client view before sending so you see what they will see, including your brand colours and cover." },
    ],
    faqs: [
      { q: "Can I edit after sending?", a: "Yes, but DealPilot tracks late edits so you know the client may have seen an earlier version. Tell them when scope or price changes." },
      { q: "Can I undo a regenerate?", a: "Regenerate replaces that section's text, so copy the old text somewhere first if you might want it back." },
    ],
  },
  {
    slug: "how-to-edit-the-why-us-section",
    title: "How to edit the Why Us section",
    subtitle: "Why Us is where generic proposals lose. Replace boilerplate with the two or three reasons this client should pick you.",
    seoTitle: "How to Edit the Why Us Section of a Proposal",
    seoDescription: "Rewrite the Why Us section of your proposal so it names proof, relevance, and risk reduction instead of generic claims.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "4 min read",
    steps: [
      { title: "Find the section", body: "In the editor, scroll to the Why Us section, or insert one from the section library if your draft does not have it." },
      { title: "Lead with relevance, not history", body: "Open with the one past project closest to this client's problem. Years in business come second." },
      { title: "Add one piece of proof", body: "A number, a named result, or a short client quote. One specific proof point beats five adjectives." },
      { title: "Name how you reduce their risk", body: "Fixed scope, milestone payments, a revision cap. Clients buy certainty." },
      { title: "Keep it under 120 words", body: "Long Why Us sections read as insecurity. Trim until each sentence earns its place." },
    ],
    faqs: [
      { q: "Can I save a Why Us block for reuse?", a: "Yes. Save it to your content library and insert it into new proposals, then change the first line per client." },
      { q: "Should Why Us name competitors?", a: "No. Describe your strengths and let the client compare." },
    ],
  },
  {
    slug: "how-to-set-up-your-brand-kit",
    title: "How to set up your brand kit",
    subtitle: "Add your logo, colours, and font once so every proposal looks like yours.",
    seoTitle: "How to Set Up Your Brand Kit (DealPilot)",
    seoDescription: "Set your logo, colours, and font in DealPilot so proposals, covers, and client links match your brand.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "4 min read",
    steps: [
      { title: "Open Brand", body: "In the dashboard, go to Brand. This is where logo, colours, and font live." },
      { title: "Upload your logo", body: "Use a clean PNG with a transparent background so the cover stays crisp." },
      { title: "Pick primary and secondary colours", body: "Use your real brand hex values. Headings, buttons, and accents follow them." },
      { title: "Choose a font", body: "Pick the supported font closest to your brand voice." },
      { title: "Preview on a real proposal", body: "Open any proposal in client view to confirm contrast and the cover page look right." },
    ],
    faqs: [
      { q: "Is white-label available?", a: "Showing your company name instead of DealPilot is a paid-plan feature. Check the pricing page for the current plans." },
      { q: "Is the brand kit saved across devices?", a: "Preview a proposal on a second device after setting it up to confirm it carried over before you send." },
    ],
  },
  {
    slug: "how-to-create-a-contract",
    title: "How to create a contract from a proposal",
    subtitle: "Turn an accepted scope into a contract without retyping it.",
    seoTitle: "How to Create a Freelance Contract (DealPilot)",
    seoDescription: "Generate a freelance contract in DealPilot from 15 contract types, edit the clauses, and send it for e-signature.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "5 min read",
    steps: [
      { title: "Open Contracts and choose a type", body: "DealPilot includes 15 contract types, including service agreements, NDAs, and retainers." },
      { title: "Fill in the parties and scope", body: "Paste the agreed scope from the proposal so the contract matches what the client said yes to." },
      { title: "Review payment and termination clauses", body: "Confirm deposit, due dates, late fees, and how either side can end the work." },
      { title: "Edit anything the AI guessed", body: "Treat the draft as a starting point. Have a lawyer review high-value or unusual work." },
      { title: "Send for signature", body: "Send the link. Once signed, the contract is locked from edits." },
    ],
    faqs: [
      { q: "Is the contract legal advice?", a: "No. It is a drafting aid. For high-stakes work, have a lawyer review it." },
      { q: "Can I edit a signed contract?", a: "No. Signed contracts are locked. If terms change, create a new contract or an amendment." },
    ],
  },
  {
    slug: "how-to-add-a-payment-link",
    title: "How to add a payment link to a proposal",
    subtitle: "Collect the deposit in the same moment the client says yes.",
    seoTitle: "How to Add a Stripe Payment Link to a Proposal",
    seoDescription: "Attach a Stripe payment link or milestone payments to your DealPilot proposal so the deposit arrives with approval.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "4 min read",
    steps: [
      { title: "Set up Stripe once", body: "In Settings, follow the Stripe Payment Setup steps and add your own Stripe account. Payments go straight to you." },
      { title: "Set the deposit amount", body: "Decide the percentage or fixed amount due at acceptance. 30 to 50 percent is common for project work." },
      { title: "Create the payment link", body: "Add the link from the proposal, or create milestone links for staged payments." },
      { title: "Put it next to the signature", body: "Approval and payment should be one motion. State the amount in the text above the button." },
      { title: "Check it as the client", body: "Open the client view and walk through the payment yourself before sending." },
    ],
    faqs: [
      { q: "Does DealPilot hold my money?", a: "No. DealPilot uses your own Stripe account, so payments go directly to you." },
      { q: "Can I split into milestones?", a: "Yes. Milestone links let you bill stages of the project separately." },
    ],
  },
  {
    slug: "how-to-track-proposal-views",
    title: "How to see when a client opens your proposal",
    subtitle: "Know when to follow up by seeing opens, instead of guessing.",
    seoTitle: "How to Track Proposal Views (DealPilot)",
    seoDescription: "Track when clients open and read your proposal in DealPilot, and use those signals to time your follow-up.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "4 min read",
    steps: [
      { title: "Send the proposal as a link", body: "Tracking works on the web link, not on a PDF attachment." },
      { title: "Open the proposal analytics", body: "On paid plans, analytics show opens and activity for each proposal." },
      { title: "Read the pattern", body: "One quick open often means a forward. Several opens over days means they are weighing it." },
      { title: "Follow up on the signal", body: "If it was opened twice and went quiet, send a specific question rather than a nudge." },
      { title: "Keep it human", body: "Do not quote exact open times to the client. Say you wanted to check whether they had questions." },
    ],
    faqs: [
      { q: "Is tracking on the free plan?", a: "Proposal analytics and tracking are paid-plan features. Check pricing for the current split." },
      { q: "Can clients tell they are tracked?", a: "A view is recorded when they open the link. Write your follow-up so it does not read as surveillance." },
    ],
  },
  {
    slug: "how-to-follow-up-on-a-sent-proposal",
    title: "How to follow up on a sent proposal in DealPilot",
    subtitle: "Set automatic follow-ups so a quiet client does not mean a dead deal.",
    seoTitle: "How to Follow Up on a Proposal (DealPilot)",
    seoDescription: "Use DealPilot follow-up automation to remind clients about an unanswered proposal without writing every email by hand.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "5 min read",
    steps: [
      { title: "Decide your cadence", body: "A common pattern is day 2, day 5, and day 10 after sending." },
      { title: "Turn on proposal follow-ups", body: "DealPilot runs a daily job that sends reminders for proposals still waiting for an answer." },
      { title: "Edit the wording", body: "Keep each reminder short and give a reason to reply: a question, a deadline, or new information." },
      { title: "Stop when they answer", body: "Mark the proposal accepted or declined so reminders stop." },
      { title: "Make the last message easy to say no to", body: "A clear no frees you to move on. Ask for it kindly." },
    ],
    faqs: [
      { q: "Will clients know it is automated?", a: "Write the messages so they read fine either way, and sign them as yourself." },
      { q: "Where is the full playbook?", a: "See the blog post on how to follow up on a proposal for timing and templates." },
    ],
  },
  {
    slug: "how-to-use-the-client-portal",
    title: "How to use the client portal",
    subtitle: "Give each client one place for files, invoices, and project updates.",
    seoTitle: "How to Use the Client Portal (DealPilot)",
    seoDescription: "Set up a DealPilot client portal for files, invoices, messages, and project updates, and share it with a private link.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "5 min read",
    steps: [
      { title: "Create a portal for the client", body: "From Portals, add a new portal and link it to the client and project." },
      { title: "Add what they need", body: "Share files, invoices, and project updates in one place." },
      { title: "Share the private link", body: "Send the portal URL to the client. The link is specific to their portal." },
      { title: "Use messages instead of email threads", body: "Keep project questions in one place so decisions are easy to find later." },
      { title: "Review before final delivery", body: "Check that files and invoices are current before you hand over the finished work." },
    ],
    faqs: [
      { q: "Can clients see other clients' data?", a: "No. Each portal is scoped to its own client." },
      { q: "Is the portal white-label?", a: "Branding options depend on your plan. See pricing for details." },
    ],
  },
  {
    slug: "how-to-send-an-invoice",
    title: "How to send an invoice from a proposal or time entries",
    subtitle: "Bill for the work you agreed to, or the hours you logged, in a couple of clicks.",
    seoTitle: "How to Send an Invoice (DealPilot)",
    seoDescription: "Create and send an invoice in DealPilot from an accepted proposal or logged time entries, with a payment link attached.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "4 min read",
    steps: [
      { title: "Open Invoices and create a new one", body: "Pick the client and the project the invoice belongs to." },
      { title: "Pull in the line items", body: "Use the agreed fees or import logged time entries so you do not retype hours." },
      { title: "Check due date and terms", body: "Confirm the due date and any late-fee wording before sending." },
      { title: "Attach a payment link", body: "Add a Stripe link so the client can pay from the invoice." },
      { title: "Send and follow the status", body: "Send the invoice link and watch for payment. Use recurring invoices for retainers." },
    ],
    faqs: [
      { q: "Can I set up recurring invoices?", a: "Yes. Recurring invoices run on a schedule for retainer work." },
      { q: "Can I invoice by the hour?", a: "Yes. Log time in Time Tracking and create an invoice from the time entries." },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}
