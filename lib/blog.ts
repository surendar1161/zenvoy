export type BlogPost = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  dateIso: string;
  readTime: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-ai-proposal-generators",
    tag: "Roundup",
    title: "11 Best AI Proposal Generators in 2026",
    excerpt: "Eleven DealPilot generators for the briefs freelancers actually get — design, web, SEO, video, consulting — each with its own generator URL.",
    date: "November 9, 2026",
    dateIso: "2026-11-09",
    readTime: "8 min read",
  },
  {
    slug: "best-ai-proposal-writers",
    tag: "Roundup",
    title: "13 Best AI Proposal Writers in 2026",
    excerpt: "Looking for the best AI proposal writer? We compared 13 tools — DealPilot, ChatGPT, Jasper, Proposify, Qwilr, Better Proposals, Hubflo, Piktochart, and more.",
    date: "November 4, 2026",
    dateIso: "2026-11-04",
    readTime: "11 min read",
  },
  {
    slug: "how-to-write-a-freelance-proposal",
    tag: "Guide",
    title: "How to Write a Freelance Proposal That Wins",
    excerpt: "A step-by-step guide to writing proposals that close deals — covering structure, tone, pricing, and the psychology behind why clients say yes.",
    date: "May 7, 2026",
    dateIso: "2026-05-07",
    readTime: "12 min read",
  },
  {
    slug: "how-to-price-freelance-projects",
    tag: "Pricing",
    title: "How to Price Freelance Projects (Without Undercharging)",
    excerpt: "The complete pricing guide for freelancers — hourly vs project-based, value pricing, rate calculators, and how to present pricing that clients respect.",
    date: "May 7, 2026",
    dateIso: "2026-05-07",
    readTime: "14 min read",
  },
  {
    slug: "how-to-follow-up-on-a-proposal",
    tag: "Sales",
    title: "How to Follow Up on a Proposal Without Being Annoying",
    excerpt: "The exact timing, templates, and strategy for following up on proposals — including what to do when clients go silent.",
    date: "May 7, 2026",
    dateIso: "2026-05-07",
    readTime: "9 min read",
  },
  {
    slug: "freelance-proposal-examples",
    tag: "Examples",
    title: "7 Freelance Proposal Examples That Actually Won Clients",
    excerpt: "Real-world proposal breakdowns across web development, design, copywriting, consulting, and more — with annotations on what made each one work.",
    date: "May 7, 2026",
    dateIso: "2026-05-07",
    readTime: "15 min read",
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}
