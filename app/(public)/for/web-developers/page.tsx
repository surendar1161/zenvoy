"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  CodeOutlined,
  CloudServerOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  MobileOutlined,
  DollarOutlined,
  FileTextOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Proposal section data ───────────────────────────────── */

const PROPOSAL_SECTIONS = [
  {
    title: "Project Scope & Tech Stack",
    color: "#eff6ff",
    border: "#bfdbfe",
    items: [
      "Front-end: Next.js 14, React 18, TypeScript, Tailwind CSS",
      "Back-end: Node.js API routes, PostgreSQL via Prisma ORM",
      "CMS: Headless Sanity CMS with live preview",
      "Hosting: Vercel (production) + staging environment",
      "Third-party integrations: Stripe, SendGrid, Google Analytics 4",
    ],
  },
  {
    title: "Sprint Milestones & Timeline",
    color: "#f0fdf4",
    border: "#bbf7d0",
    items: [
      "Sprint 1 (Weeks 1-2): Discovery, wireframes, architecture design",
      "Sprint 2 (Weeks 3-4): Core front-end build, responsive layouts",
      "Sprint 3 (Weeks 5-6): CMS integration, API development, e-commerce",
      "Sprint 4 (Week 7): QA testing, cross-browser, performance audit",
      "Sprint 5 (Week 8): Launch, DNS migration, post-launch support",
    ],
  },
  {
    title: "Hosting & Maintenance Retainer",
    color: "#fffbeb",
    border: "#fde68a",
    items: [
      "Monthly hosting management: uptime monitoring, SSL renewals",
      "4 hours/month dev support for bug fixes and minor updates",
      "Quarterly security patches and dependency updates",
      "Performance monitoring: Core Web Vitals reporting",
      "Priority response: 4-hour SLA for critical issues",
    ],
  },
];

const TEMPLATES = [
  { name: "Full-Stack Web Application", desc: "React/Next.js + API + database — sprint-based delivery" },
  { name: "E-Commerce Store", desc: "Shopify or custom — product catalog, checkout, payments" },
  { name: "WordPress / CMS Website", desc: "Custom theme, plugins, content migration, training" },
  { name: "Landing Page & Marketing Site", desc: "Conversion-optimised, responsive, A/B test ready" },
  { name: "Web App MVP", desc: "Lean build with auth, dashboard, core feature, deploy" },
  { name: "Maintenance Retainer", desc: "Monthly dev hours, hosting, security, performance" },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function WebDevelopersPage() {
  return (
    <>
      {/* 1 · Hero */}
      <LandingHero
        tag="Web Developer Proposal Templates"
        title={
          <>
            Ship proposals as fast
            <br />
            as you ship <span style={{ color: "#7dd3fc" }}>code</span>
          </>
        }
        subtitle="Stop copying project scope docs into Google Docs. DealPilot generates technical proposals with sprint milestones, tech stack breakdowns, and milestone billing — in 60 seconds."
        primaryCTA={{ text: "Build Your First Proposal", href: "/sign-up" }}
        secondaryCTA={{ text: "See a Sample Proposal", href: "/templates" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 · What a web dev proposal needs */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ background: "#eff6ff", color: "#0369a1", border: "1px solid #bfdbfe", borderRadius: 20, fontWeight: 700, fontSize: 13, padding: "4px 14px", marginBottom: 14 }}>
              Built for developers
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              What a web dev proposal actually needs
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 600, margin: "0 auto" }}>
              Clients don't care about your Webpack config. They care about what they're getting, when they're getting it, and how much it costs.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {[
              { icon: <CodeOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />, title: "Tech Stack Breakdown", desc: "List every framework, library, and service so the client knows exactly what's powering their product. No black boxes." },
              { icon: <ClockCircleOutlined style={{ fontSize: 28, color: "#10b981" }} />, title: "Sprint-Based Timeline", desc: "Two-week sprints with clear deliverables. Clients see progress, you avoid scope creep. Everyone wins." },
              { icon: <MobileOutlined style={{ fontSize: 28, color: "#7c3aed" }} />, title: "Responsive Design Specs", desc: "Breakpoints, device targets, and browser support — documented upfront so there are no surprises at QA." },
              { icon: <CloudServerOutlined style={{ fontSize: 28, color: "#f59e0b" }} />, title: "Hosting & Infrastructure", desc: "Server costs, CDN setup, CI/CD pipeline, staging environments — the stuff clients forget to budget for." },
              { icon: <ToolOutlined style={{ fontSize: 28, color: "#ef4444" }} />, title: "Maintenance & Support", desc: "Post-launch retainer: monthly hours, response SLA, dependency updates. Recurring revenue, locked in." },
              { icon: <DollarOutlined style={{ fontSize: 28, color: "#0369a1" }} />, title: "Milestone Billing", desc: "Split payments across sprints. Client pays as you deliver. No chasing invoices six weeks after launch." },
            ].map((item) => (
              <Col xs={24} md={8} key={item.title}>
                <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 28 } }}>
                  <div style={{ marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>{item.title}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 3 · Sample proposal sections preview */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Sample proposal sections — auto-generated
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              These sections are written by AI based on your project details. Edit anything, regenerate any section, export to PDF.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {PROPOSAL_SECTIONS.map((section) => (
              <Card key={section.title} style={{ borderRadius: 20, border: `1.5px solid ${section.border}`, background: section.color }} styles={{ body: { padding: 32 } }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 16px" }}>{section.title}</h3>
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  {section.items.map((item) => (
                    <Space key={item} align="start" size={8}>
                      <CheckCircleFilled style={{ color: "#10b981", fontSize: 14, marginTop: 3, flexShrink: 0 }} />
                      <Text style={{ fontSize: 15, color: "#334155" }}>{item}</Text>
                    </Space>
                  ))}
                </Space>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Key features */}
      <FeatureShowcase
        sectionTitle="Built for how developers work"
        sectionSubtitle="Technical proposals shouldn't feel like writing a term paper."
        features={[
          {
            icon: <DollarOutlined style={{ fontSize: 28, color: "#10b981" }} />,
            title: "Milestone Billing",
            desc: "Split project cost across 2-4 sprint milestones. Each milestone generates its own Stripe payment link. Clients pay as you deliver — no 100% upfront, no net-60 nightmares.",
            points: [
              "Auto-generate Stripe links per milestone",
              "Payment triggers next sprint kickoff",
              "Good / Better / Best pricing tiers",
              "Optional add-ons: rush delivery, extra revisions, SEO audit",
            ],
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            icon: <CodeOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
            title: "Code-Friendly Editor",
            desc: "The proposal editor supports markdown, code blocks, and technical formatting. Paste a tech stack list, API endpoint table, or architecture diagram link — it just works.",
            points: [
              "Markdown and rich text side by side",
              "Code block formatting for tech specs",
              "Table support for feature matrices",
              "Section-level AI regeneration (3 alternatives)",
            ],
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            icon: <ApiOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
            title: "Reusable Tech Components",
            desc: "Save common tech stacks, hosting configs, and maintenance terms as reusable blocks. Drag them into any proposal — never re-type your Node.js + PostgreSQL boilerplate again.",
            points: [
              "Save tech stack blocks as templates",
              "Reuse hosting and SLA terms across proposals",
              "Clone and customise previous proposals",
              "Auto-apply your brand kit to every export",
            ],
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
        ]}
      />

      {/* 5 · Industry-specific template list */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Web development proposal templates
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>
              Start from a template built for your project type. Customize everything.
            </p>
          </div>
          <Row gutter={[20, 20]}>
            {TEMPLATES.map((t) => (
              <Col xs={24} md={12} key={t.name}>
                <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 24 } }}>
                  <Space align="start" size={12}>
                    <FileTextOutlined style={{ fontSize: 22, color: "#0ea5e9", marginTop: 2 }} />
                    <div>
                      <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>{t.name}</Text>
                      <Text style={{ fontSize: 14, color: "#64748b" }}>{t.desc}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 6 · Social Proof */}
      <SocialProof
        title="What web developers say"
        subtitle="Join developers who spend less time writing proposals and more time writing code."
        testimonials={[
          {
            quote: "I used to spend 3 hours scoping a project in a Google Doc. Now I answer 5 questions and get a proposal with sprint milestones, tech stack, and Stripe payment links. It's absurd how fast it is.",
            name: "Marcus R.",
            role: "Full-Stack Developer, Freelance",
          },
          {
            quote: "The milestone billing feature alone is worth it. Clients pay per sprint, I don't chase invoices, and the Stripe links are auto-generated. My cash flow has never been this predictable.",
            name: "Priya K.",
            role: "Front-End Developer & Consultant",
          },
          {
            quote: "My proposals look way more professional than what agencies send. Clients comment on it. The branded PDF with tech specs and a clear timeline closes deals faster than any email pitch.",
            name: "Jake T.",
            role: "WordPress Developer",
          },
        ]}
      />

      {/* 7 · FAQ */}
      <FAQSection
        title="Web developer proposal FAQs"
        subtitle="Common questions about using DealPilot for web development proposals."
        faqs={[
          {
            q: "Can I include technical specs like tech stack and architecture diagrams?",
            a: "Yes. The editor supports markdown, code blocks, tables, and links — so you can include tech stack breakdowns, API endpoint tables, architecture diagram links, and any technical detail your client needs to see.",
          },
          {
            q: "How does milestone billing work for web projects?",
            a: "You split your project into 2-4 milestones (e.g., discovery, front-end build, back-end, launch). Each milestone gets its own Stripe payment link. When the client approves a milestone, they pay — and the next sprint begins.",
          },
          {
            q: "Can I reuse proposals for similar web projects?",
            a: "Absolutely. Clone any previous proposal and customise it for the new client. You can also save common sections (tech stacks, hosting terms, maintenance retainers) as reusable blocks.",
          },
          {
            q: "Does it support retainer and maintenance agreements?",
            a: "Yes. You can create standalone retainer proposals with monthly hours, response SLAs, and auto-recurring Stripe billing. Or include a maintenance retainer as an add-on to any project proposal.",
          },
          {
            q: "Can clients sign the proposal and pay the deposit in the same link?",
            a: "Yes. The client portal shows the proposal, contract, and Stripe payment link in one place. The client can review, e-sign, and pay — all without creating an account or downloading an app.",
          },
          {
            q: "Is there a free plan for solo developers?",
            a: "Yes. The Free plan lets you create unlimited proposals, contracts, and client portals. You get the AI proposal generator, e-signatures, Stripe payment links, and brand kit — no credit card required.",
          },
        ]}
      />

      {/* 8 · CTA */}
      <CTASection
        title="Stop scoping projects in Google Docs"
        subtitle="Generate a technical proposal with sprint milestones, payment links, and e-signatures — in 60 seconds. Free forever."
        buttonText="Start Building Proposals"
        buttonHref="/sign-up"
      />
    </>
  );
}
