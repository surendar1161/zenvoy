export type ProposalNiche = {
  slug: string;
  name: string;
  who: string;
  work: string;
  includes: string[];
};

export type ProposalFormat = {
  id: "proposal" | "quote" | "estimate" | "retainer";
  noun: string;
  use: string;
};

export type ProposalTool = {
  slug: string;
  niche: string;
  format: ProposalFormat["id"];
  name: string;
  noun: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  who: string;
  work: string;
  includes: string[];
  use: string;
  path: string;
  faqs: { q: string; a: string }[];
};

const FORMATS: ProposalFormat[] = [
  {
    id: "proposal",
    noun: "proposal",
    use: "a client has a brief and needs scope, fee, and timeline before they say yes",
  },
  {
    id: "quote",
    noun: "quote",
    use: "the buyer asked for a number and you still need the assumptions written down",
  },
  {
    id: "estimate",
    noun: "estimate",
    use: "the scope is still moving and you need a range, not a fake-precise total",
  },
  {
    id: "retainer",
    noun: "retainer proposal",
    use: "the work repeats every month and 'unlimited Slack' is how retainers die",
  },
];

export const PROPOSAL_NICHES: ProposalNiche[] = [
  { slug: "freelance", name: "freelance", who: "freelancers", work: "scoped client projects", includes: ["Outcome the client is buying", "In-scope and out-of-scope work", "Fee, deposit, and payment schedule", "Timeline and revision rounds"] },
  { slug: "graphic-design", name: "graphic design", who: "graphic designers", work: "campaigns, layouts, and visual systems", includes: ["Deliverables and file formats", "Revision rounds", "Usage rights", "Milestone payments"] },
  { slug: "logo-design", name: "logo design", who: "logo designers", work: "a logo suite and the files to use it", includes: ["Concepts included", "File types (SVG, PNG, PDF)", "Revision cap", "What a new concept costs"] },
  { slug: "brand-identity", name: "brand identity", who: "brand designers", work: "logo, colour, type, and guidelines", includes: ["Identity vs logo-only scope", "Guidelines length", "Presentation rounds", "Deposit before concepts"] },
  { slug: "web-design", name: "web design", who: "web designers", work: "page design, responsive layouts, and handoff", includes: ["Pages in scope", "Breakpoints", "CMS assumptions", "Who supplies copy"] },
  { slug: "website-development", name: "website development", who: "web developers", work: "a site or web app that ships", includes: ["Stack and hosting", "Milestones", "Acceptance criteria", "Change-request terms"] },
  { slug: "ui-ux", name: "UI/UX", who: "product designers", work: "flows, wireframes, and interface design", includes: ["Screens and flows", "Research included or not", "Prototype fidelity", "Developer handoff"] },
  { slug: "wordpress", name: "WordPress", who: "WordPress freelancers", work: "a WordPress site the client can edit", includes: ["Theme vs custom", "Plugins", "Training", "Launch checklist"] },
  { slug: "shopify", name: "Shopify", who: "Shopify freelancers", work: "a store that can take orders", includes: ["Theme and apps", "Product setup limits", "Checkout and payments", "Post-launch support"] },
  { slug: "ecommerce", name: "e-commerce", who: "e-commerce freelancers", work: "an online store and the path to checkout", includes: ["Catalogue size", "Payments and tax", "Shipping rules", "What a new product type costs"] },
  { slug: "landing-page", name: "landing page", who: "landing-page designers", work: "one page built to convert", includes: ["Sections and offer", "Mobile layout", "Form or checkout", "Analytics events"] },
  { slug: "saas", name: "SaaS", who: "SaaS freelancers", work: "product UI, marketing site, or a feature slice", includes: ["Feature boundary", "Auth and billing assumptions", "Environments", "What is a later phase"] },
  { slug: "mobile-app", name: "mobile app", who: "app freelancers", work: "an iOS, Android, or cross-platform app", includes: ["Platforms", "Core flows", "Store submission", "Bug-fix window"] },
  { slug: "copywriting", name: "copywriting", who: "copywriters", work: "pages, emails, or ads in the client's voice", includes: ["Deliverables and word counts", "Revision rounds", "Stakeholders", "Usage rights"] },
  { slug: "content-marketing", name: "content marketing", who: "content marketers", work: "an editorial plan and the pieces that ship", includes: ["Volume per month", "Formats", "SEO research", "Approval cadence"] },
  { slug: "seo", name: "SEO", who: "SEO freelancers", work: "technical fixes, content, and reporting", includes: ["Audit vs ongoing", "Pages in scope", "What you will not promise", "Reporting rhythm"] },
  { slug: "social-media", name: "social media", who: "social media freelancers", work: "a posting cadence and the assets behind it", includes: ["Platforms", "Posts per month", "Who films or writes", "Community management hours"] },
  { slug: "paid-ads", name: "paid ads", who: "paid media freelancers", work: "campaign setup, creative, and optimisation", includes: ["Channels", "Management fee vs ad spend", "Creative count", "Reporting"] },
  { slug: "email-marketing", name: "email marketing", who: "email marketers", work: "flows, campaigns, and the list that receives them", includes: ["Platform", "Flows vs broadcasts", "Design included or not", "List size assumptions"] },
  { slug: "consulting", name: "consulting", who: "independent consultants", work: "a defined advisory engagement", includes: ["Problem and outcome", "Workstreams", "Meetings included", "Fee model"] },
  { slug: "business-strategy", name: "business strategy", who: "strategy consultants", work: "a diagnosis and a 90-day plan", includes: ["Workshops", "Deliverable format", "Who must attend", "Follow-up calls"] },
  { slug: "fractional-cmo", name: "fractional CMO", who: "fractional CMOs", work: "senior marketing leadership on a part-time contract", includes: ["Days per month", "Channels you own", "Team you direct", "Notice period"] },
  { slug: "video-production", name: "video production", who: "video producers", work: "a shoot, an edit, and the cuts the client will actually post", includes: ["Shoot days", "Deliverable ratios", "Revision rounds", "Usage and licensing"] },
  { slug: "photography", name: "photography", who: "photographers", work: "a shoot and a delivered image set", includes: ["Hours and location", "Image count", "Retouching", "Usage license"] },
  { slug: "animation", name: "animation", who: "animators", work: "motion pieces with a locked runtime", includes: ["Runtime", "Style frames", "Revisions", "Source files"] },
  { slug: "podcast", name: "podcast", who: "podcast producers", work: "episodes edited and published on a cadence", includes: ["Episodes per month", "Edit level", "Show notes", "Publishing"] },
  { slug: "illustration", name: "illustration", who: "illustrators", work: "a set of illustrations for a defined use", includes: ["Count and style", "Rounds", "File formats", "Where the art may run"] },
  { slug: "packaging-design", name: "packaging design", who: "packaging designers", work: "a pack that can go to print", includes: ["SKUs", "Dielines", "Print-ready files", "Printer rounds"] },
  { slug: "interior-design", name: "interior design", who: "interior designers", work: "a scheme, drawings, and a buying list", includes: ["Rooms", "Concept vs procurement", "Site visits", "FF&E exclusions"] },
  { slug: "architecture", name: "architecture", who: "architects", work: "design stages up to an agreed drawing set", includes: ["Stage of work", "Drawings included", "Authority submissions", "Site visits"] },
  { slug: "event-planning", name: "event planning", who: "event planners", work: "a run-of-show and the vendors behind it", includes: ["Guest count", "Venue assumptions", "Vendor management", "Day-of hours"] },
  { slug: "coaching", name: "coaching", who: "coaches", work: "a defined number of sessions and the outcome they support", includes: ["Session count", "Length", "Prep between calls", "Cancellation rules"] },
  { slug: "accounting", name: "accounting", who: "accountants", work: "books, reports, or a cleanup", includes: ["Entities", "Period covered", "Software", "What stays with the client"] },
  { slug: "bookkeeping", name: "bookkeeping", who: "bookkeepers", work: "monthly books that close on time", includes: ["Transaction volume", "Software", "Close date", "Catch-up fees"] },
  { slug: "virtual-assistant", name: "virtual assistant", who: "virtual assistants", work: "a weekly block of defined tasks", includes: ["Hours", "Tools", "Response time", "What is out of scope"] },
  { slug: "translation", name: "translation", who: "translators", work: "a word count in a named language pair", includes: ["Language pair", "Word count", "Subject matter", "Review rounds"] },
  { slug: "pr", name: "PR", who: "PR freelancers", work: "a media list, pitches, and reporting", includes: ["Markets", "Pitch volume", "Spokesperson prep", "What coverage is not guaranteed"] },
  { slug: "market-research", name: "market research", who: "researchers", work: "interviews or a desk study with a written readout", includes: ["Method", "Sample size", "Deliverable", "Recruitment assumptions"] },
  { slug: "product-design", name: "product design", who: "product designers", work: "a product slice from problem to interface", includes: ["Problem statement", "Flows", "Usability checks", "Handoff"] },
  { slug: "pitch-deck", name: "pitch deck", who: "pitch-deck designers", work: "a deck a founder can present", includes: ["Slide count", "Narrative workshop", "Chart styling", "Revision rounds"] },
  { slug: "wedding-photography", name: "wedding photography", who: "wedding photographers", work: "coverage of a wedding day", includes: ["Hours", "Second shooter", "Gallery size", "Delivery date"] },
  { slug: "real-estate", name: "real estate marketing", who: "real-estate marketers", work: "listing creative and the campaign around it", includes: ["Assets", "Channels", "Listing count", "Ad spend separate"] },
  { slug: "recruitment", name: "recruitment", who: "recruiters", work: "a search for a named role", includes: ["Role", "Retained vs success fee", "Shortlist size", "Guarantee window"] },
  { slug: "hr-consulting", name: "HR consulting", who: "HR consultants", work: "hiring, handbook, or people-process design", includes: ["Deliverables", "Workshops", "Templates", "Legal review excluded"] },
  { slug: "cybersecurity", name: "cybersecurity", who: "security freelancers", work: "an assessment and a remediation plan", includes: ["Scope of systems", "Test type", "Report", "Retest"] },
  { slug: "data-analytics", name: "data analytics", who: "analysts", work: "a dashboard or an analysis with a decision attached", includes: ["Sources", "Metrics", "Dashboard tool", "Refresh owner"] },
  { slug: "devops", name: "DevOps", who: "DevOps freelancers", work: "pipelines, environments, and a handover", includes: ["Cloud", "Environments", "CI/CD", "On-call or not"] },
  { slug: "automation", name: "automation", who: "automation freelancers", work: "a workflow that replaces a repeated manual job", includes: ["Tools", "Triggers", "Error handling", "Documentation"] },
  { slug: "grant-writing", name: "grant writing", who: "grant writers", work: "a submission for a named funder", includes: ["Funder", "Narrative", "Budget help", "Submission owner"] },
  { slug: "course-creation", name: "course creation", who: "course creators", work: "a curriculum and the lessons inside it", includes: ["Modules", "Video vs text", "Platform", "Review rounds"] },
  { slug: "newsletter", name: "newsletter", who: "newsletter writers", work: "a recurring letter with a defined voice", includes: ["Issues per month", "Length", "Research", "Platform"] },
  { slug: "motion-design", name: "motion design", who: "motion designers", work: "titles, explainers, or social motion", includes: ["Runtime", "Style", "Revisions", "Exports"] },
  { slug: "print-design", name: "print design", who: "print designers", work: "pieces that go to a printer", includes: ["Formats", "Print specs", "Proofs", "Vendor liaison"] },
  { slug: "notion", name: "Notion systems", who: "Notion consultants", work: "a workspace the team will actually use", includes: ["Databases", "Templates", "Training", "Migration limits"] },
  { slug: "branding", name: "branding", who: "brand studios", work: "verbal and visual brand in one engagement", includes: ["Strategy vs visuals", "Applications", "Workshops", "Guidelines"] },
];

function titleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildTool(niche: ProposalNiche, format: ProposalFormat): ProposalTool {
  const slug = format.id === "retainer" ? `${niche.slug}-retainer` : `${niche.slug}-${format.id}`;
  const name = `${niche.name} ${format.noun}`;
  const titled = titleCase(name);
  return {
    slug,
    niche: niche.slug,
    format: format.id,
    name,
    noun: format.noun,
    title: `${titled} generator`,
    subtitle: `Turn a ${niche.name} brief into a ${format.noun} covering ${niche.work}. Built for ${niche.who} who need to send something tonight.`,
    seoTitle: `${titled} Generator`,
    seoDescription: `Generate a ${name}. Scope, fees, and timeline for ${niche.who}. Free to start, edit every line before you send.`,
    who: niche.who,
    work: niche.work,
    includes: niche.includes,
    use: format.use,
    path: `/generate/proposal/${slug}`,
    faqs: [
      {
        q: `What is a ${name}?`,
        a: `A ${name} is the document ${niche.who} send before work starts. It spells out ${niche.work}, the fee, the timeline, and what changes cost extra.`,
      },
      {
        q: `Why use a ${name} generator?`,
        a: `Use one when ${format.use}. Writing it from a blank page takes the evening. DealPilot drafts the ${format.noun} from the brief so you edit, price, and send a branded link the same day.`,
      },
      {
        q: `What should a ${name} include?`,
        a: niche.includes.join(". ") + ".",
      },
      {
        q: `Is the ${name} generator free?`,
        a: "The free DealPilot plan includes 5 AI proposals a month, templates, and Stripe payment links. No credit card to start. You edit every line before it goes to the client.",
      },
    ],
  };
}

export const PROPOSAL_TOOLS: ProposalTool[] = PROPOSAL_NICHES.flatMap((niche) =>
  FORMATS.map((format) => buildTool(niche, format)),
);

const BY_SLUG = new Map(PROPOSAL_TOOLS.map((tool) => [tool.slug, tool]));

export function getProposalTool(slug: string) {
  return BY_SLUG.get(slug) ?? null;
}

export const FEATURED_PROPOSAL_TOOLS = [
  "freelance-proposal",
  "graphic-design-proposal",
  "web-design-proposal",
  "website-development-proposal",
  "brand-identity-proposal",
  "ui-ux-proposal",
  "copywriting-proposal",
  "seo-proposal",
  "social-media-proposal",
  "video-production-proposal",
  "consulting-proposal",
].map((slug) => {
  const tool = getProposalTool(slug);
  if (!tool) throw new Error(`Missing featured generator: ${slug}`);
  return tool;
});
