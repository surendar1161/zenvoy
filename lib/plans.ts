export type Plan = "free" | "pro" | "business";
export type BillingPeriod = "monthly" | "yearly";

export interface PlanConfig {
  id: Plan;
  name: string;
  tagline: string;
  monthlyPrice: number;     // USD per month (monthly billing)
  yearlyPrice: number;      // USD per month (annual billing, shown as /mo)
  yearlyTotal: number;      // Total billed yearly
  color: string;
  popular?: boolean;
  limits: {
    proposals: number | "unlimited";
    contracts: number | "unlimited";
    teamMembers: number | "unlimited";
  };
  features: string[];
  notIncluded?: string[];
}

export const PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Get started with AI proposals",
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyTotal: 0,
    color: "#64748b",
    limits: { proposals: 5, contracts: 2, teamMembers: 1 },
    features: [
      "5 proposals / month",
      "2 contracts / month",
      "All 15 contract types",
      "19+ industry templates",
      "AI proposal generation",
      "Stripe payment links",
      "Web proposal links",
      "Google Docs-style editor",
      "Brand kit (logo, colours, font)",
      "Cover page & web view",
    ],
    notIncluded: [
      "Digital e-signatures",
      "Proposal analytics & tracking",
      "Password protection",
      "Document expiry dates",
      "Content Library",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Everything you need to close deals",
    monthlyPrice: 19,
    yearlyPrice: 15,    // $15/mo billed as $180/yr
    yearlyTotal: 180,
    color: "#0ea5e9",
    popular: true,
    limits: { proposals: "unlimited", contracts: "unlimited", teamMembers: 1 },
    features: [
      "Unlimited proposals",
      "Unlimited contracts",
      "All 15 contract types",
      "19+ industry templates (+ 5 by freelancer type)",
      "AI generation — Claude Opus 4.6",
      "Digital e-signatures (type & draw)",
      "Accept without signing",
      "Proposal open tracking & notifications",
      "Password protection on proposals",
      "Document expiry dates",
      "Content Library (save & reuse sections)",
      "Analytics dashboard",
      "Section-level AI regeneration",
      "Good / Better / Best pricing tiers",
      "Milestone payment schedule",
      "White-label (no Zenvoy branding)",
      "Priority support (< 4h response)",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For agencies and growing teams",
    monthlyPrice: 49,
    yearlyPrice: 39,    // $39/mo billed as $468/yr
    yearlyTotal: 468,
    color: "#7c3aed",
    limits: { proposals: "unlimited", contracts: "unlimited", teamMembers: 5 },
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Team analytics & reporting",
      "Manager approval workflows",
      "Content locking (T&Cs, legal)",
      "API access",
      "Custom domain for proposals",
      "Priority support (< 1h response)",
      "Dedicated onboarding call",
    ],
  },
];

export const PLAN_MAP: Record<Plan, PlanConfig> = Object.fromEntries(
  PLANS.map(p => [p.id, p])
) as Record<Plan, PlanConfig>;

export function getPlan(plan: Plan): PlanConfig {
  return PLAN_MAP[plan] ?? PLAN_MAP.free;
}

export function canCreateProposal(plan: Plan, currentCount: number): boolean {
  const limit = getPlan(plan).limits.proposals;
  return limit === "unlimited" || currentCount < limit;
}

// Stripe price IDs — set these after creating products in Stripe dashboard
// or they'll be created inline via price_data
export const STRIPE_PRICES = {
  pro_monthly:      process.env.STRIPE_PRICE_PRO_MONTHLY      ?? "",
  pro_yearly:       process.env.STRIPE_PRICE_PRO_YEARLY        ?? "",
  business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY  ?? "",
  business_yearly:  process.env.STRIPE_PRICE_BUSINESS_YEARLY   ?? "",
};
