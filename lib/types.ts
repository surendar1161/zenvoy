export interface ProposalFormData {
  // Freelancer info
  freelancerName: string;
  freelancerTitle: string;
  freelancerEmail: string;

  // Client info
  clientName: string;
  clientCompany: string;

  // Project details
  projectType: string;
  projectDescription: string;
  deliverables: string;
  timeline: string;

  // Financials
  totalBudget: number;
  depositPercent: number;
  currency: string;

  // Tone
  tone: "professional" | "friendly" | "bold";
}

export interface ProposalResult {
  proposal: string;
  paymentLink: string | null;
  depositAmount: number;
  currency: string;
}

// F06 — Standard section library
export interface ProposalSection {
  id: string;
  title: string;
  included: boolean;
  content: string;
  locked?: boolean; // core sections can't be removed
}

export const DEFAULT_SECTIONS: ProposalSection[] = [
  { id: "executive-summary",  title: "Executive Summary",  included: true,  content: "", locked: true },
  { id: "about-me",           title: "About Me",           included: true,  content: "" },
  { id: "understanding",      title: "Understanding Your Project", included: true, content: "" },
  { id: "scope-of-work",      title: "Scope of Work",      included: true,  content: "", locked: true },
  { id: "deliverables",       title: "Deliverables",       included: true,  content: "", locked: true },
  { id: "timeline",           title: "Timeline & Milestones", included: true, content: "", locked: true },
  { id: "pricing",            title: "Investment",         included: true,  content: "", locked: true },
  { id: "why-me",             title: "Why Work With Me",   included: true,  content: "" },
  { id: "terms",              title: "Terms & Conditions", included: false, content: "Payment terms: [X]% deposit due before work begins. Remaining balance due upon project completion. Client owns all final deliverables upon receipt of full payment. Revisions beyond the agreed rounds will be billed at my hourly rate. Either party may terminate this agreement with 14 days written notice." },
  { id: "next-steps",         title: "Next Steps",         included: true,  content: "", locked: true },
];

// F07 — Interactive pricing tiers (Good / Better / Best)
export interface PricingTier {
  id: string;
  name: string;       // e.g. "Starter", "Professional", "Enterprise"
  tagline: string;
  price: number;
  depositPercent: number;
  features: string[];
  recommended: boolean;
  paymentLink?: string;
}

export const DEFAULT_TIERS: PricingTier[] = [
  {
    id: "good",
    name: "Starter",
    tagline: "Everything you need to get going",
    price: 0,
    depositPercent: 50,
    features: ["Core deliverables", "2 revision rounds", "Email support", "14-day delivery"],
    recommended: false,
  },
  {
    id: "better",
    name: "Professional",
    tagline: "The most popular choice",
    price: 0,
    depositPercent: 50,
    features: ["All Starter features", "Unlimited revisions", "Priority support", "Source files included", "10-day delivery"],
    recommended: true,
  },
  {
    id: "best",
    name: "Premium",
    tagline: "Full-service, white-glove delivery",
    price: 0,
    depositPercent: 50,
    features: ["All Professional features", "Dedicated Slack channel", "1-month post-launch support", "7-day delivery", "Quarterly check-in call"],
    recommended: false,
  },
];

// F08 — Optional add-ons checklist
export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const DEFAULT_ADDONS: AddOn[] = [
  { id: "rush",       name: "Rush Delivery",         price: 500,  description: "Cut timeline in half" },
  { id: "revision",   name: "Extra Revision Round",  price: 150,  description: "Additional round of edits" },
  { id: "maintenance",name: "Monthly Maintenance",   price: 300,  description: "Ongoing support retainer" },
];

// F09 — Milestone / payment schedule
export interface Milestone {
  id: string;
  name: string;
  description: string;
  percentage: number;   // % of total project value
  dueLabel: string;     // e.g. "Project kick-off", "Week 3 — First draft"
  paymentLink?: string;
}

export const DEFAULT_MILESTONES: Milestone[] = [
  { id: "m1", name: "Project Kick-off",    description: "Deposit to begin work",        percentage: 50, dueLabel: "Day 1 — Before work begins" },
  { id: "m2", name: "Final Delivery",      description: "Balance on project completion", percentage: 50, dueLabel: "On final delivery" },
];
