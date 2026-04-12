import type { ProposalFormData } from "./types";

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  industry: string;
  defaults: Partial<ProposalFormData>;
}

export interface IndustryGroup {
  industry: string;
  icon: string;
  templates: Template[];
}

export const industryGroups: IndustryGroup[] = [
  {
    industry: "Web Development",
    icon: "🌐",
    templates: [
      {
        id: "web-business",
        name: "Business Website",
        description: "5–10 page responsive site with CMS",
        icon: "🏢",
        industry: "Web Development",
        defaults: {
          projectType: "Web Design & Development",
          projectDescription:
            "Design and develop a professional, responsive business website that clearly communicates the client's brand, services, and value proposition. The site must be fast, mobile-first, and optimised for search engines.",
          deliverables:
            "• Up to 8 custom-designed responsive pages (Home, About, Services, Team, Blog, Contact, Privacy, Terms)\n• CMS integration (WordPress or Webflow) so the client can update content independently\n• Contact form with email notifications\n• Basic SEO setup (meta tags, sitemap, Google Search Console)\n• Google Analytics integration\n• 3 rounds of design revisions\n• 30-day post-launch support",
          timeline: "6 weeks",
          totalBudget: 6500,
          depositPercent: 50,
          tone: "professional",
        },
      },
      {
        id: "web-ecommerce",
        name: "E-Commerce Store",
        description: "Full online store with payments & inventory",
        icon: "🛒",
        industry: "Web Development",
        defaults: {
          projectType: "Web Design & Development",
          projectDescription:
            "Build a fully-featured e-commerce store that drives sales and delivers a seamless shopping experience. The store will support the client's full product catalogue with secure checkout, inventory management, and order tracking.",
          deliverables:
            "• Custom-designed Shopify or WooCommerce store\n• Up to 3 product collection pages + individual product pages\n• Payment gateway integration (Stripe/PayPal)\n• Inventory and order management setup\n• Abandoned cart recovery\n• Mobile-optimised checkout\n• Email confirmation flows (order, shipping, refund)\n• Basic SEO + speed optimisation\n• Staff training session (1 hour)\n• 60-day post-launch support",
          timeline: "8 weeks",
          totalBudget: 12000,
          depositPercent: 40,
          tone: "professional",
        },
      },
      {
        id: "web-saas",
        name: "SaaS / Web App",
        description: "Full-stack application with auth & dashboard",
        icon: "⚙️",
        industry: "Web Development",
        defaults: {
          projectType: "Web Design & Development",
          projectDescription:
            "Architect and build a production-ready SaaS web application from scratch, including user authentication, subscription billing, an admin dashboard, and a scalable API backend.",
          deliverables:
            "• Next.js / React frontend with Tailwind CSS\n• Node.js / Python REST API backend\n• PostgreSQL database with schema design\n• User authentication (email, Google OAuth)\n• Stripe subscription billing (monthly/annual plans)\n• User dashboard with key metrics\n• Admin panel for user management\n• CI/CD pipeline (GitHub Actions)\n• Deployed to AWS / Vercel + Railway\n• Technical documentation\n• 90-day post-launch support",
          timeline: "12 weeks",
          totalBudget: 28000,
          depositPercent: 40,
          tone: "professional",
        },
      },
      {
        id: "web-landing",
        name: "Landing Page",
        description: "High-converting single-page campaign site",
        icon: "🎯",
        industry: "Web Development",
        defaults: {
          projectType: "Web Design & Development",
          projectDescription:
            "Design and build a high-converting landing page for a product launch or marketing campaign, with a clear value proposition, social proof, and a compelling call-to-action.",
          deliverables:
            "• Single-page responsive design (hero, features, testimonials, pricing, FAQ, CTA)\n• A/B test-ready structure\n• Lead capture form + email tool integration (Mailchimp / ConvertKit)\n• Page speed optimisation (90+ Lighthouse score)\n• Analytics tracking (GA4 + Meta Pixel)\n• 2 rounds of revisions\n• 14-day post-launch support",
          timeline: "2 weeks",
          totalBudget: 2800,
          depositPercent: 50,
          tone: "bold",
        },
      },
    ],
  },
  {
    industry: "Branding & Design",
    icon: "🎨",
    templates: [
      {
        id: "brand-identity",
        name: "Brand Identity",
        description: "Logo, colour palette, typography & guidelines",
        icon: "✏️",
        industry: "Branding & Design",
        defaults: {
          projectType: "Branding & Identity",
          projectDescription:
            "Create a complete, distinctive brand identity that captures the client's personality, resonates with their target audience, and can be applied consistently across all touchpoints — digital and print.",
          deliverables:
            "• Brand strategy brief (positioning, values, audience)\n• Primary logo + 2 alternate variations\n• Colour palette (primary + secondary, with hex/CMYK/Pantone codes)\n• Typography system (heading + body fonts with usage rules)\n• Icon / favicon\n• Business card design\n• Letterhead and email signature template\n• Social media profile & cover templates\n• Brand guidelines PDF (20–30 pages)\n• All files in AI, EPS, SVG, PNG, PDF formats\n• 3 initial concepts, 3 rounds of revisions",
          timeline: "5 weeks",
          totalBudget: 5500,
          depositPercent: 50,
          tone: "professional",
        },
      },
      {
        id: "brand-uiux",
        name: "UI/UX Design",
        description: "User research, wireframes & hi-fi Figma designs",
        icon: "📐",
        industry: "Branding & Design",
        defaults: {
          projectType: "UI/UX Design",
          projectDescription:
            "Lead the end-to-end UX design process for a digital product — from user research and information architecture through to pixel-perfect high-fidelity designs and an interactive prototype ready for development handoff.",
          deliverables:
            "• User research (interviews, surveys, competitive analysis)\n• User personas and journey maps\n• Information architecture and site map\n• Low-fidelity wireframes for all key screens\n• High-fidelity Figma designs (desktop + mobile)\n• Interactive clickable prototype\n• Figma Design System / component library\n• Developer handoff annotations\n• Usability testing report\n• 3 rounds of revisions",
          timeline: "6 weeks",
          totalBudget: 9000,
          depositPercent: 40,
          tone: "professional",
        },
      },
      {
        id: "brand-print",
        name: "Print & Collateral",
        description: "Brochures, business cards, and marketing materials",
        icon: "🖨️",
        industry: "Branding & Design",
        defaults: {
          projectType: "Branding & Identity",
          projectDescription:
            "Design a cohesive suite of print and marketing materials that align with the client's brand identity and make a strong impression at events, in-store, and through direct mail.",
          deliverables:
            "• Tri-fold brochure (A4, print-ready)\n• Business cards (front + back)\n• Flyer / one-pager design\n• Pull-up banner / roller banner\n• Presentation deck template (10 slides)\n• All files in print-ready PDF + editable source formats\n• 2 rounds of revisions",
          timeline: "3 weeks",
          totalBudget: 3200,
          depositPercent: 50,
          tone: "friendly",
        },
      },
    ],
  },
  {
    industry: "Digital Marketing",
    icon: "📈",
    templates: [
      {
        id: "marketing-seo",
        name: "SEO Campaign",
        description: "3-month organic growth strategy & execution",
        icon: "🔍",
        industry: "Digital Marketing",
        defaults: {
          projectType: "SEO & Content Marketing",
          projectDescription:
            "Execute a comprehensive 3-month SEO campaign to increase the client's organic search visibility, drive qualified traffic, and establish topical authority in their niche.",
          deliverables:
            "• Full SEO audit (technical, on-page, off-page)\n• Keyword research report (200+ keywords prioritised by opportunity)\n• Technical SEO fixes (site speed, Core Web Vitals, schema)\n• On-page optimisation for top 20 pages\n• 6 SEO-optimised blog articles (1,500+ words each)\n• Link-building outreach (8 quality backlinks/month)\n• Monthly performance report (rankings, traffic, conversions)\n• Google Search Console + GA4 setup\n• End-of-campaign strategy handoff",
          timeline: "3 months",
          totalBudget: 7500,
          depositPercent: 30,
          tone: "professional",
        },
      },
      {
        id: "marketing-social",
        name: "Social Media Management",
        description: "Monthly content creation and community management",
        icon: "📱",
        industry: "Digital Marketing",
        defaults: {
          projectType: "Social Media Management",
          projectDescription:
            "Manage the client's social media presence across key platforms to build brand awareness, grow a loyal following, and drive meaningful engagement with their target audience.",
          deliverables:
            "• Social media strategy document\n• 20 custom-designed posts/month (Instagram, LinkedIn, Facebook)\n• 8 Instagram Stories/month\n• Caption writing and hashtag research\n• Community management (responding to comments/DMs within 24h)\n• Monthly content calendar (approved 1 week in advance)\n• Monthly analytics report with insights and recommendations\n• Competitor benchmarking (quarterly)",
          timeline: "Ongoing — first 3 months",
          totalBudget: 3500,
          depositPercent: 50,
          tone: "friendly",
        },
      },
      {
        id: "marketing-ppc",
        name: "PPC / Paid Ads",
        description: "Google & Meta ads setup, management & optimisation",
        icon: "💰",
        industry: "Digital Marketing",
        defaults: {
          projectType: "SEO & Content Marketing",
          projectDescription:
            "Set up, launch, and manage high-ROI paid advertising campaigns on Google and Meta to drive targeted traffic and measurable conversions within the client's budget.",
          deliverables:
            "• Audience research and campaign strategy\n• Google Ads setup (Search + Display campaigns)\n• Meta Ads setup (Facebook + Instagram)\n• Ad creative design (5 static + 2 video/animated ads)\n• Conversion tracking setup (GA4, Meta Pixel, GTM)\n• A/B testing framework\n• Weekly optimisation and bid adjustments\n• Monthly performance report (ROAS, CPA, CTR)\n• Ad spend: managed separately by client (recommended £2,000+/month)",
          timeline: "3 months",
          totalBudget: 4500,
          depositPercent: 40,
          tone: "bold",
        },
      },
    ],
  },
  {
    industry: "Content & Copywriting",
    icon: "✍️",
    templates: [
      {
        id: "copy-website",
        name: "Website Copywriting",
        description: "Conversion-focused copy for all key pages",
        icon: "📄",
        industry: "Content & Copywriting",
        defaults: {
          projectType: "Copywriting",
          projectDescription:
            "Write compelling, SEO-optimised website copy that clearly communicates the client's value proposition, speaks directly to their ideal customer, and drives conversions.",
          deliverables:
            "• Discovery questionnaire + competitor analysis\n• Homepage copy (hero, features, social proof, CTA sections)\n• About page\n• Services/Products page (up to 5 services)\n• 2 x case study / testimonial page\n• Contact page\n• Email nurture sequence (5 emails)\n• 2 rounds of revisions per page\n• Delivered in Google Docs with SEO notes",
          timeline: "3 weeks",
          totalBudget: 3800,
          depositPercent: 50,
          tone: "friendly",
        },
      },
      {
        id: "copy-content",
        name: "Content Strategy & Blog",
        description: "Editorial strategy + monthly blog articles",
        icon: "📰",
        industry: "Content & Copywriting",
        defaults: {
          projectType: "Copywriting",
          projectDescription:
            "Develop a data-driven content strategy and produce high-quality long-form articles that establish the client as a thought leader, attract organic search traffic, and nurture leads.",
          deliverables:
            "• Content audit of existing material\n• 3-month editorial calendar (topics, keywords, formats)\n• 4 x long-form articles/month (1,500–2,500 words, SEO-optimised)\n• Custom images / infographic for each article\n• Internal linking strategy\n• Distribution plan (email, social, syndication)\n• Monthly content performance report",
          timeline: "3 months",
          totalBudget: 4200,
          depositPercent: 30,
          tone: "professional",
        },
      },
    ],
  },
  {
    industry: "Video Production",
    icon: "🎬",
    templates: [
      {
        id: "video-promo",
        name: "Promotional Video",
        description: "60–90 second brand or product video",
        icon: "🎥",
        industry: "Video Production",
        defaults: {
          projectType: "Video Production",
          projectDescription:
            "Produce a polished 60–90 second promotional video that tells the client's brand story, showcases their product or service, and compels viewers to take action.",
          deliverables:
            "• Pre-production: concept development, script, storyboard, shot list\n• 1 full day of filming (location or studio)\n• Professional voiceover\n• Motion graphics and lower thirds\n• Licensed background music\n• Colour grading and audio mastering\n• Final edit in 16:9 (YouTube/web) + 9:16 (Reels/TikTok) + 1:1 (Instagram)\n• 2 rounds of edit revisions\n• Delivered in MP4 (1080p + 4K) + raw footage",
          timeline: "4 weeks",
          totalBudget: 8500,
          depositPercent: 50,
          tone: "bold",
        },
      },
      {
        id: "video-youtube",
        name: "YouTube Content Package",
        description: "Monthly video production for YouTube channel",
        icon: "▶️",
        industry: "Video Production",
        defaults: {
          projectType: "Video Production",
          projectDescription:
            "Produce a consistent monthly package of YouTube videos to grow the client's channel, build audience trust, and drive traffic back to their business.",
          deliverables:
            "• 4 x YouTube videos/month (8–15 min each)\n• Script writing and on-camera coaching\n• Filming (remote screen-record or in-person)\n• Editing, colour grading, audio cleaning\n• Custom thumbnails for each video\n• YouTube SEO (title, description, tags, chapters)\n• End screen and cards setup\n• Monthly channel analytics review",
          timeline: "3 months",
          totalBudget: 6000,
          depositPercent: 30,
          tone: "friendly",
        },
      },
    ],
  },
  {
    industry: "Consulting",
    icon: "💼",
    templates: [
      {
        id: "consulting-strategy",
        name: "Business Strategy",
        description: "Growth audit, strategy workshop & 90-day roadmap",
        icon: "📊",
        industry: "Consulting",
        defaults: {
          projectType: "Consulting",
          projectDescription:
            "Conduct a deep-dive business audit and facilitate a structured strategy engagement to identify growth opportunities, eliminate inefficiencies, and build a clear 90-day execution roadmap.",
          deliverables:
            "• Pre-engagement questionnaire + document review\n• 2 x half-day strategy workshops with leadership team\n• Business health assessment (financials, ops, marketing, people)\n• SWOT and competitive landscape analysis\n• 3 strategic growth initiatives with prioritisation framework\n• 90-day action plan with OKRs\n• Executive summary presentation (30 slides)\n• 2 x 60-minute follow-up calls (post-delivery)\n• Email support for 30 days",
          timeline: "6 weeks",
          totalBudget: 15000,
          depositPercent: 50,
          tone: "professional",
        },
      },
      {
        id: "consulting-tech",
        name: "Tech / CTO Advisory",
        description: "Technology audit, architecture review & hiring plan",
        icon: "🔧",
        industry: "Consulting",
        defaults: {
          projectType: "Consulting",
          projectDescription:
            "Provide expert fractional CTO advisory to assess the client's technology stack, engineering processes, and team structure — then deliver a clear roadmap to scale their tech capability.",
          deliverables:
            "• Tech stack and infrastructure audit\n• Code quality review (sample codebase)\n• Security and compliance assessment\n• Engineering team structure review\n• Build vs buy vs partner recommendations\n• Scalability and DevOps roadmap\n• Engineering hiring plan and job description templates\n• Monthly 4-hour advisory retainer (ongoing)\n• Slack access for async questions",
          timeline: "4 weeks (initial audit) + monthly retainer",
          totalBudget: 9500,
          depositPercent: 50,
          tone: "professional",
        },
      },
      {
        id: "consulting-hr",
        name: "HR & People Ops",
        description: "Hiring process, culture framework & HR toolkit",
        icon: "👥",
        industry: "Consulting",
        defaults: {
          projectType: "Consulting",
          projectDescription:
            "Design and implement a scalable people operations foundation — including hiring processes, onboarding, performance frameworks, and culture documentation — to support the client's growth from startup to scale-up.",
          deliverables:
            "• People ops audit and gap analysis\n• Hiring process design (sourcing, screening, interviewing, offer)\n• Job description templates (5 core roles)\n• Onboarding programme (30/60/90 day plan)\n• Performance review framework and templates\n• Employee handbook (values, policies, benefits)\n• Culture and values workshop (half day)\n• HR tool recommendations and setup guide",
          timeline: "8 weeks",
          totalBudget: 11000,
          depositPercent: 40,
          tone: "friendly",
        },
      },
    ],
  },
  {
    industry: "Mobile App",
    icon: "📱",
    templates: [
      {
        id: "mobile-mvp",
        name: "MVP App",
        description: "React Native MVP for iOS & Android",
        icon: "🚀",
        industry: "Mobile App",
        defaults: {
          projectType: "Mobile App Development",
          projectDescription:
            "Design and develop a cross-platform React Native MVP app for iOS and Android that validates the client's core product hypothesis with real users — fast, focused, and built to iterate.",
          deliverables:
            "• Product requirements document and feature scoping\n• UI/UX wireframes and hi-fi Figma designs\n• React Native codebase (iOS + Android)\n• User authentication (email + Google/Apple Sign-In)\n• Core feature set (up to 5 main screens/flows)\n• REST API backend (Node.js + PostgreSQL)\n• Push notifications\n• App Store and Google Play submission\n• Basic analytics integration\n• 30-day post-launch bug fixes",
          timeline: "10 weeks",
          totalBudget: 22000,
          depositPercent: 40,
          tone: "bold",
        },
      },
      {
        id: "mobile-native",
        name: "Native iOS App",
        description: "Swift iOS app with full App Store submission",
        icon: "🍎",
        industry: "Mobile App",
        defaults: {
          projectType: "Mobile App Development",
          projectDescription:
            "Build a polished native iOS application in Swift that delivers a premium user experience, integrates deeply with iOS capabilities, and passes App Store review on first submission.",
          deliverables:
            "• UI/UX design (Figma, iOS Human Interface Guidelines compliant)\n• Swift / SwiftUI native iOS app\n• Core Data or CloudKit integration\n• Push notifications (APNs)\n• In-app purchases or subscription (StoreKit)\n• App Store Connect setup and submission\n• TestFlight beta testing coordination\n• Crash reporting (Sentry/Firebase Crashlytics)\n• 60-day post-launch support",
          timeline: "12 weeks",
          totalBudget: 30000,
          depositPercent: 40,
          tone: "professional",
        },
      },
    ],
  },
];

export function getTemplateById(id: string): Template | undefined {
  return industryGroups
    .flatMap((g) => g.templates)
    .find((t) => t.id === id);
}
