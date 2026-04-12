import type { ProposalFormData } from "./types";

export interface FreelancerTypeTemplate {
  id: string;
  type: string;
  icon: string;
  tagline: string;
  accent: string;        // tailwind bg color class
  tone: ProposalFormData["tone"];
  sampleSections: string[];
  defaults: Partial<ProposalFormData>;
}

export const FREELANCER_TEMPLATES: FreelancerTypeTemplate[] = [
  {
    id: "designer",
    type: "Designer",
    icon: "🎨",
    tagline: "Portfolio-led · Visual hierarchy · Friendly",
    accent: "bg-purple-600",
    tone: "friendly",
    sampleSections: ["Creative Brief", "Visual Concept", "Design Process", "Deliverables", "Revision Policy"],
    defaults: {
      projectType: "Branding & Identity",
      projectDescription: "Create a distinctive visual identity that reflects the client's brand personality and resonates deeply with their target audience. The design will span digital and print touchpoints, ensuring consistency across every customer interaction.",
      deliverables:
        "• Primary logo + 3 logo variations (horizontal, stacked, icon-only)\n• Brand colour palette (primary, secondary, neutral — with HEX/CMYK codes)\n• Typography system (heading + body with usage guidelines)\n• Brand pattern / texture\n• Business card, letterhead, email signature\n• Social media templates (Instagram, LinkedIn cover)\n• Brand guidelines PDF (30+ pages)\n• All files in AI, EPS, SVG, PNG, PDF formats",
      timeline: "5 weeks",
      totalBudget: 5500,
      depositPercent: 50,
      tone: "friendly",
    },
  },
  {
    id: "developer",
    type: "Developer",
    icon: "💻",
    tagline: "Scope-precise · Technical clarity · Professional",
    accent: "bg-brand-600",
    tone: "professional",
    sampleSections: ["Technical Scope", "Architecture", "Deliverables", "Tech Stack", "Deployment", "Handoff"],
    defaults: {
      projectType: "Web Design & Development",
      projectDescription: "Build a performant, scalable web application using modern technologies. The solution will be production-ready, fully tested, and documented — with clean code and a seamless deployment pipeline so the client's team can take ownership immediately.",
      deliverables:
        "• Full-stack Next.js application (TypeScript, Tailwind CSS)\n• PostgreSQL database with schema design and migrations\n• User authentication (email + OAuth)\n• REST API with OpenAPI documentation\n• Unit and integration test suite (80%+ coverage)\n• CI/CD pipeline (GitHub Actions → Vercel/Railway)\n• Staging and production environments\n• Technical documentation and developer handoff\n• 30-day post-launch bug-fix warranty",
      timeline: "8 weeks",
      totalBudget: 18000,
      depositPercent: 40,
      tone: "professional",
    },
  },
  {
    id: "copywriter",
    type: "Copywriter",
    icon: "✍️",
    tagline: "Story-driven · Words-first · Warm",
    accent: "bg-amber-600",
    tone: "friendly",
    sampleSections: ["The Story I'll Tell", "Voice & Tone", "Deliverables", "Process", "Revisions"],
    defaults: {
      projectType: "Copywriting",
      projectDescription: "Write compelling, conversion-optimised copy that captures the client's unique voice and speaks directly to their ideal customer. Every word will be crafted to build trust, address objections, and drive the reader toward a clear action.",
      deliverables:
        "• Brand voice and tone document\n• Homepage copy (hero, features, social proof, FAQ, CTA)\n• About page (origin story + team)\n• Services / Products page\n• 3 x case studies / success stories\n• Email welcome sequence (5 emails)\n• Meta descriptions for all pages\n• 2 rounds of revisions per deliverable\n• Final copy delivered in Google Docs (editable)",
      timeline: "3 weeks",
      totalBudget: 3800,
      depositPercent: 50,
      tone: "friendly",
    },
  },
  {
    id: "consultant",
    type: "Consultant",
    icon: "📊",
    tagline: "Executive-ready · ROI-focused · Bold",
    accent: "bg-slate-700",
    tone: "bold",
    sampleSections: ["Executive Summary", "Situation Analysis", "Strategic Recommendations", "Roadmap", "Engagement Model", "ROI Projection"],
    defaults: {
      projectType: "Consulting",
      projectDescription: "Lead a structured strategy engagement to diagnose the client's core challenges, identify high-value growth opportunities, and deliver a clear 90-day execution roadmap. The engagement combines rigorous analysis with pragmatic recommendations that the leadership team can act on immediately.",
      deliverables:
        "• Pre-engagement questionnaire and document review\n• 2 × strategy workshops with leadership team\n• Competitor and market landscape analysis\n• SWOT and capability gap assessment\n• 3 strategic initiatives with prioritisation matrix\n• 90-day execution roadmap with OKRs\n• Executive presentation deck (40+ slides)\n• Written strategy report (20–30 pages)\n• 2 × follow-up advisory calls (post-delivery)\n• 30-day Slack access for questions",
      timeline: "6 weeks",
      totalBudget: 15000,
      depositPercent: 50,
      tone: "bold",
    },
  },
  {
    id: "marketing",
    type: "Marketing",
    icon: "📈",
    tagline: "Metrics-driven · Growth-focused · Results-first",
    accent: "bg-green-600",
    tone: "bold",
    sampleSections: ["Growth Opportunity", "Strategy", "Channels & Tactics", "KPIs & Targets", "Timeline", "Reporting"],
    defaults: {
      projectType: "SEO & Content Marketing",
      projectDescription: "Design and execute a multi-channel growth marketing strategy that drives measurable results — increased traffic, qualified leads, and revenue. Every tactic is grounded in data, tested against real metrics, and optimised relentlessly for ROI.",
      deliverables:
        "• Marketing audit (analytics, SEO, paid, social, email)\n• 3-month growth strategy document\n• SEO keyword research and content calendar (50 topics)\n• 6 × long-form SEO articles (1,500+ words)\n• Google Ads and Meta Ads setup + management\n• Email marketing flows (welcome, nurture, re-engagement)\n• Monthly performance dashboard (traffic, leads, CAC, ROAS)\n• A/B testing framework\n• Competitor tracking report (monthly)\n• End-of-quarter strategy review and next-quarter plan",
      timeline: "3 months",
      totalBudget: 9000,
      depositPercent: 30,
      tone: "bold",
    },
  },
];
