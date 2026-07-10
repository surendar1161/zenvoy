import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealpilot.co.in";
const APP_NAME = "DealPilot";

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export const SEO_PAGES: SeoPage[] = [
  // Core
  { path: "/", title: "AI Proposal Software for Freelancers", description: "Generate professional freelance proposals in seconds with Claude AI. E-signatures, Stripe payments, client portals, and contracts. Free to start.", keywords: ["freelance proposal software", "AI proposal generator"], changeFrequency: "weekly", priority: 1.0 },
  { path: "/pricing", title: "Pricing — Free, Pro & Business Plans", description: "Simple pricing for freelancers. Free plan with 5 proposals/month. Pro from $12/mo. Business from $29/mo. No per-user fees.", changeFrequency: "monthly", priority: 0.9 },
  { path: "/sign-up", title: "Sign Up Free", description: "Create your free DealPilot account. Generate AI proposals, contracts, and payment links in minutes. No credit card required.", changeFrequency: "monthly", priority: 0.7 },
  { path: "/sign-in", title: "Sign In", description: "Sign in to your DealPilot account to manage proposals, contracts, clients, and invoices.", changeFrequency: "monthly", priority: 0.4 },

  // Product landing pages
  { path: "/ai-proposal-generator", title: "AI Proposal Generator for Freelancers", description: "Generate complete freelance proposals with Claude AI in 60 seconds. Paste a job post, pick a tone, and send a polished proposal.", keywords: ["AI proposal generator", "automated proposal writing"], changeFrequency: "monthly", priority: 0.9 },
  { path: "/free-proposal-maker", title: "Free Proposal Maker", description: "Create professional freelance proposals for free. 5 proposals per month, templates, AI generation, and Stripe payment links.", changeFrequency: "monthly", priority: 0.85 },
  { path: "/proposal-software-for-freelancers", title: "Proposal Software for Freelancers", description: "All-in-one proposal software built for solo freelancers — AI generation, e-signatures, invoicing, and client portals.", changeFrequency: "monthly", priority: 0.9 },
  { path: "/proposal-templates", title: "Freelance Proposal Templates", description: "19+ industry proposal templates for designers, developers, consultants, and agencies. Customize with AI.", changeFrequency: "monthly", priority: 0.8 },
  { path: "/freelance-crm", title: "Freelance CRM — Clients, Proposals & Invoices", description: "Lightweight CRM for freelancers. Track clients, proposals, contracts, invoices, and project pipeline in one place.", changeFrequency: "monthly", priority: 0.8 },
  { path: "/compare/proposal-software", title: "Best Proposal Software Compared (2026)", description: "Compare DealPilot vs Proposify, PandaDoc, HoneyBook, Bonsai, Better Proposals, Qwilr, and Dubsado.", keywords: ["proposal software comparison", "best proposal software"], changeFrequency: "monthly", priority: 0.9 },

  // Competitor alternatives
  { path: "/alternative/proposify", title: "Proposify Alternative for Freelancers", description: "DealPilot vs Proposify — AI-generated proposals, unlimited sends, and $12/mo instead of $49/user/mo.", keywords: ["proposify alternative"], changeFrequency: "monthly", priority: 0.85 },
  { path: "/alternative/pandadoc", title: "PandaDoc Alternative for Freelancers", description: "DealPilot vs PandaDoc — built for freelancers, not enterprise sales teams. AI proposals from $12/mo.", keywords: ["pandadoc alternative"], changeFrequency: "monthly", priority: 0.85 },
  { path: "/alternative/honeybook", title: "HoneyBook Alternative with AI Proposals", description: "DealPilot vs HoneyBook — AI-first proposals, contracts, and client portals for freelancers.", keywords: ["honeybook alternative"], changeFrequency: "monthly", priority: 0.85 },
  { path: "/alternative/bonsai", title: "Bonsai Alternative for Freelancers", description: "DealPilot vs Bonsai vs HoneyBook — AI proposal generation, e-signatures, and flat-rate pricing.", keywords: ["bonsai alternative"], changeFrequency: "monthly", priority: 0.85 },

  // Features
  { path: "/features/e-signatures", title: "E-Signatures for Freelancers", description: "Built-in digital e-signatures for proposals and contracts. No DocuSign needed. Type or draw signatures.", changeFrequency: "monthly", priority: 0.75 },
  { path: "/features/contracts", title: "AI Contract Generator", description: "Generate 15 types of freelance contracts with AI. NDAs, SOWs, retainer agreements, and more.", changeFrequency: "monthly", priority: 0.75 },
  { path: "/features/client-portal", title: "Client Portal for Freelancers", description: "Branded client portals with files, invoices, chat, and project updates. White-label on Pro.", changeFrequency: "monthly", priority: 0.75 },
  { path: "/features/invoicing", title: "Freelance Invoicing Software", description: "Create invoices, recurring billing, and Stripe payment links. Connected to your proposals and clients.", changeFrequency: "monthly", priority: 0.75 },

  // Vertical landing pages
  { path: "/for/designers", title: "Proposal Software for Designers", description: "AI proposals, contracts, and client portals built for freelance designers and creative professionals.", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for/web-developers", title: "Proposal Software for Web Developers", description: "Win more dev projects with AI-generated proposals, milestone billing, and scope-of-work contracts.", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for/consultants", title: "Proposal Software for Consultants", description: "Professional proposals and SOWs for independent consultants. AI-generated, e-sign ready.", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for/copywriters", title: "Proposal Software for Copywriters", description: "Pitch faster with AI proposals tailored for copywriters, content strategists, and writers.", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for/marketing-agencies", title: "Proposal Software for Marketing Agencies", description: "Proposals, contracts, and client portals for small marketing agencies and freelancers.", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for/video-production", title: "Proposal Software for Video Production", description: "AI proposals with milestone schedules for videographers and production freelancers.", changeFrequency: "monthly", priority: 0.7 },

  // Blog
  { path: "/blog", title: "Freelance Business Blog", description: "Guides on writing proposals, pricing projects, following up with clients, and closing more freelance deals.", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog/how-to-write-a-freelance-proposal", title: "How to Write a Freelance Proposal That Wins", description: "Step-by-step guide to writing proposals that close deals — structure, tone, pricing, and psychology.", changeFrequency: "monthly", priority: 0.75 },
  { path: "/blog/how-to-price-freelance-projects", title: "How to Price Freelance Projects", description: "Hourly vs project-based vs value pricing. How to present rates clients respect.", changeFrequency: "monthly", priority: 0.75 },
  { path: "/blog/how-to-follow-up-on-a-proposal", title: "How to Follow Up on a Proposal", description: "Timing, templates, and strategy for following up without being annoying.", changeFrequency: "monthly", priority: 0.75 },
  { path: "/blog/freelance-proposal-examples", title: "7 Freelance Proposal Examples", description: "Real proposal breakdowns for web dev, design, copywriting, and consulting — with annotations.", changeFrequency: "monthly", priority: 0.75 },
];

const SEO_BY_PATH = Object.fromEntries(SEO_PAGES.map((p) => [p.path, p]));

export function getPageMetadata(path: string): Metadata {
  const page = SEO_BY_PATH[path];
  if (!page) {
    return { title: APP_NAME };
  }

  const url = `${APP_URL}${page.path === "/" ? "" : page.path}`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${page.title} | ${APP_NAME}`,
      description: page.description,
      siteName: APP_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | ${APP_NAME}`,
      description: page.description,
    },
  };
}

export function getSitemapEntries() {
  const now = new Date();
  return SEO_PAGES.map((page) => ({
    url: `${APP_URL}${page.path === "/" ? "" : page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency ?? "monthly",
    priority: page.priority ?? 0.5,
  }));
}
