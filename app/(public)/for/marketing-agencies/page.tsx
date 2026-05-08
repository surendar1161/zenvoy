"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  FundOutlined,
  ShareAltOutlined,
  SearchOutlined,
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Multi-service proposal sections ─────────────────────── */

const SERVICE_SECTIONS = [
  {
    service: "SEO & Organic Search",
    color: "#eff6ff",
    border: "#bfdbfe",
    icon: <SearchOutlined style={{ fontSize: 20, color: "#0ea5e9" }} />,
    items: [
      "Technical SEO audit (site speed, crawlability, schema markup)",
      "Keyword research: 50 target keywords with volume and difficulty",
      "On-page optimisation: title tags, meta descriptions, heading structure",
      "Content calendar: 8 SEO-optimised blog posts/month",
      "Monthly ranking report with Google Search Console data",
      "Link building: 10 high-DA backlinks/month via outreach",
    ],
  },
  {
    service: "Paid Media (PPC / Social Ads)",
    color: "#fff7ed",
    border: "#fed7aa",
    icon: <FundOutlined style={{ fontSize: 20, color: "#f59e0b" }} />,
    items: [
      "Google Ads: search, display, and remarketing campaigns",
      "Meta Ads: Facebook + Instagram (prospecting + retargeting)",
      "Ad creative: 5 static + 2 video ads per platform per month",
      "Landing page optimisation and A/B testing",
      "Weekly budget pacing and bid adjustments",
      "Monthly performance report: ROAS, CPA, CTR, conversions",
    ],
  },
  {
    service: "Social Media Management",
    color: "#f0fdf4",
    border: "#bbf7d0",
    icon: <ShareAltOutlined style={{ fontSize: 20, color: "#10b981" }} />,
    items: [
      "Content strategy aligned with brand voice and business goals",
      "12 posts/month across 3 platforms (Instagram, LinkedIn, TikTok)",
      "Community management: respond to comments/DMs within 4 hours",
      "Monthly content calendar with approval workflow",
      "Stories and Reels: 8 pieces/month with on-brand design",
      "Monthly analytics report: engagement, reach, follower growth",
    ],
  },
  {
    service: "Content Marketing",
    color: "#faf5ff",
    border: "#e9d5ff",
    icon: <FileTextOutlined style={{ fontSize: 20, color: "#7c3aed" }} />,
    items: [
      "Content strategy: audience personas, funnel mapping, editorial calendar",
      "4 long-form articles/month (1,500-2,500 words, SEO-optimised)",
      "2 lead magnets/quarter (ebook, whitepaper, or checklist)",
      "Email newsletter: weekly send with segmented lists",
      "Content repurposing: blog → social → email → video script",
      "Quarterly content performance review and strategy adjustment",
    ],
  },
];

/* ── Retainer tiers ──────────────────────────────────────── */

const RETAINER_TIERS = [
  {
    name: "Growth",
    price: "$3,500/mo",
    services: ["SEO (technical audit + 4 blogs/mo)", "Social media (8 posts/mo, 2 platforms)", "Monthly reporting"],
    color: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    name: "Scale",
    price: "$7,500/mo",
    services: ["Everything in Growth", "Paid media management (up to $10K ad spend)", "Content marketing (8 blogs + 1 lead magnet/quarter)", "Bi-weekly strategy calls"],
    color: "#f0fdf4",
    border: "#bbf7d0",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$15,000/mo",
    services: ["Everything in Scale", "Dedicated account manager", "Paid media (up to $50K ad spend)", "Full social media management (3 platforms)", "Quarterly business reviews"],
    color: "#faf5ff",
    border: "#e9d5ff",
  },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function MarketingAgenciesPage() {
  return (
    <>
      {/* 1 · Hero */}
      <LandingHero
        tag="Marketing Agency Proposal Tool"
        title={
          <>
            Win more agency clients with
            <br />
            proposals that <span style={{ color: "#7dd3fc" }}>sell results</span>
          </>
        }
        subtitle="Stop rebuilding proposal decks from scratch. DealPilot generates multi-service marketing proposals with retainer pricing, campaign deliverables, and team features — in 60 seconds."
        primaryCTA={{ text: "Build Your Agency Proposal", href: "/sign-up" }}
        secondaryCTA={{ text: "See Agency Templates", href: "/templates" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 · Win more agency clients */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa", borderRadius: 20, fontWeight: 700, fontSize: 13, padding: "4px 14px", marginBottom: 14 }}>
              Built for agencies
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Multi-service proposals in minutes, not days
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 620, margin: "0 auto" }}>
              Marketing agencies juggle SEO, paid media, social, and content in a single proposal. DealPilot handles multi-service scoping so you can focus on strategy.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {[
              { icon: <SearchOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />, title: "SEO Proposal Sections", desc: "Technical audits, keyword research, content calendars, link building — structured into clear monthly deliverables with KPIs." },
              { icon: <FundOutlined style={{ fontSize: 28, color: "#f59e0b" }} />, title: "Paid Media Campaigns", desc: "Google Ads, Meta Ads, programmatic — with ad spend management, creative deliverables, and ROAS projections." },
              { icon: <ShareAltOutlined style={{ fontSize: 28, color: "#10b981" }} />, title: "Social Media Packages", desc: "Post cadence, platform strategy, community management, content calendars — all with approval workflows." },
              { icon: <MailOutlined style={{ fontSize: 28, color: "#7c3aed" }} />, title: "Content Marketing", desc: "Blog posts, lead magnets, email sequences, content repurposing — scoped by word count, frequency, and funnel stage." },
              { icon: <DollarOutlined style={{ fontSize: 28, color: "#ef4444" }} />, title: "Retainer Pricing Tables", desc: "Good / Better / Best retainer tiers with clear service differentials. Clients self-select scope without back-and-forth." },
              { icon: <TeamOutlined style={{ fontSize: 28, color: "#0369a1" }} />, title: "Team Collaboration", desc: "Business plan: multiple team members, role-based access, shared templates, and unified client management." },
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

      {/* 3 · Multi-service proposal sections */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Every service, one proposal
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 580, margin: "0 auto" }}>
              AI generates dedicated sections for each service line. Clients see exactly what they're getting across SEO, paid, social, and content.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {SERVICE_SECTIONS.map((section) => (
              <Card key={section.service} style={{ borderRadius: 20, border: `1.5px solid ${section.border}`, background: section.color }} styles={{ body: { padding: 32 } }}>
                <Space align="center" size={10} style={{ marginBottom: 16 }}>
                  {section.icon}
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{section.service}</h3>
                </Space>
                <Row gutter={[16, 10]}>
                  {section.items.map((item) => (
                    <Col xs={24} md={12} key={item}>
                      <Space align="start" size={8}>
                        <CheckCircleFilled style={{ color: "#10b981", fontSize: 14, marginTop: 3, flexShrink: 0 }} />
                        <Text style={{ fontSize: 15, color: "#334155" }}>{item}</Text>
                      </Space>
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Retainer pricing tables */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Retainer pricing, pre-structured
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Present tiered retainer packages so clients choose their level of service. Each tier generates its own Stripe payment link.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {RETAINER_TIERS.map((tier) => (
              <Col xs={24} md={8} key={tier.name}>
                <Card
                  style={{
                    borderRadius: 20,
                    border: tier.highlighted ? `2px solid #0ea5e9` : `1.5px solid ${tier.border}`,
                    background: tier.color,
                    height: "100%",
                    boxShadow: tier.highlighted ? "0 8px 32px rgba(14,165,233,0.15)" : "none",
                  }}
                  styles={{ body: { padding: 32 } }}
                >
                  {tier.highlighted && (
                    <Tag style={{ background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 20, fontWeight: 700, fontSize: 12, marginBottom: 12 }}>
                      Most Popular
                    </Tag>
                  )}
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>{tier.name}</h3>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#0369a1", marginBottom: 20 }}>{tier.price}</div>
                  <Space direction="vertical" size={10} style={{ width: "100%" }}>
                    {tier.services.map((service) => (
                      <Space key={service} align="start" size={8}>
                        <CheckCircleFilled style={{ color: "#10b981", fontSize: 14, marginTop: 3, flexShrink: 0 }} />
                        <Text style={{ fontSize: 14, color: "#334155" }}>{service}</Text>
                      </Space>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 5 · Team features */}
      <FeatureShowcase
        sectionTitle="Team features for growing agencies"
        sectionSubtitle="When you're not a solo freelancer — you need team workflows."
        features={[
          {
            icon: <TeamOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
            title: "Team Workspaces",
            desc: "Business plan gives your entire agency access. Account managers create proposals, strategists review, and leadership approves — all in one workspace with role-based permissions.",
            points: [
              "Unlimited team members on Business plan",
              "Role-based access: create, review, approve",
              "Shared template library across the agency",
              "Activity log: see who edited what, when",
            ],
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            icon: <GlobalOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
            title: "Multi-Client Management",
            desc: "Manage all client proposals, contracts, and portals from one dashboard. Filter by client, status, or team member. Built-in CRM tracks every touchpoint.",
            points: [
              "Client dashboard with proposal pipeline",
              "Filter: Sent, Viewed, Accepted, Signed",
              "Revenue and deal count per client",
              "Notes, tags, and activity timeline per client",
            ],
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
          {
            icon: <BarChartOutlined style={{ fontSize: 28, color: "#10b981" }} />,
            title: "Campaign Deliverable Tracking",
            desc: "Embed monthly deliverable checklists directly in the proposal. Clients see what's included in their retainer — SEO audits, blog posts, ad creatives, reports — with no ambiguity.",
            points: [
              "Monthly deliverable checklists per service",
              "Link to reporting dashboards",
              "Quarterly review milestones with payment triggers",
              "Scope change documentation built in",
            ],
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
        ]}
      />

      {/* 6 · Social Proof */}
      <SocialProof
        title="What agency owners say"
        subtitle="Join agencies that spend less time on proposals and more time on campaigns."
        testimonials={[
          {
            quote: "We were spending 6-8 hours per proposal — customising decks, pricing retainers, listing deliverables. Now the whole team uses DealPilot templates and we're down to 45 minutes. We pitch 3x more per month.",
            name: "Rachel K.",
            role: "Founder, Digital Marketing Agency",
          },
          {
            quote: "The retainer pricing tiers are brilliant. Clients pick Growth, Scale, or Enterprise — no back-and-forth on scope. Our average contract value went up 40% because clients see the clear value in upgrading.",
            name: "Tom W.",
            role: "Managing Director, SEO Agency",
          },
          {
            quote: "We onboarded our whole team in a day. Account managers create proposals, I review and approve, and the client gets a branded portal with everything. It looks like we built our own proposal platform.",
            name: "Jasmine L.",
            role: "Co-Founder, Content Agency",
          },
        ]}
      />

      {/* 7 · FAQ */}
      <FAQSection
        title="Marketing agency proposal FAQs"
        subtitle="Common questions from agency founders, account managers, and marketing directors."
        faqs={[
          {
            q: "Can I include multiple service lines in one proposal?",
            a: "Yes. DealPilot generates dedicated sections for each service (SEO, paid media, social, content). Each section has its own deliverables, timeline, and pricing — all in one unified proposal document.",
          },
          {
            q: "How do retainer pricing tiers work?",
            a: "You set up Good / Better / Best retainer packages with different service levels and pricing. Each tier generates its own Stripe payment link. Clients choose the tier that fits — no negotiation loops.",
          },
          {
            q: "Does it support team collaboration?",
            a: "Yes. The Business plan includes unlimited team members with role-based access. Account managers create proposals, strategists add service sections, and leadership reviews before sending. Shared template library across the agency.",
          },
          {
            q: "Can I create SEO-specific proposals?",
            a: "Absolutely. The SEO proposal template includes sections for technical audit findings, keyword research, content calendar, link building strategy, and monthly reporting — all with measurable KPIs.",
          },
          {
            q: "How do I handle scope changes mid-retainer?",
            a: "The proposal editor lets you create scope change addendums linked to the original agreement. Changes are documented, priced, and e-signed — so there's a clear record of what was added and when.",
          },
          {
            q: "Can clients see campaign deliverables and status?",
            a: "Yes. The branded client portal shows the proposal, contract, invoices, and deliverable checklists. You can link to external reporting dashboards (Google Data Studio, Agency Analytics) directly from the portal.",
          },
        ]}
      />

      {/* 8 · CTA */}
      <CTASection
        title="Stop rebuilding proposal decks from scratch"
        subtitle="Generate a multi-service marketing proposal with retainer pricing, campaign deliverables, and team workflows — in 60 seconds. Free forever."
        buttonText="Build Your Agency Proposal"
        buttonHref="/sign-up"
      />
    </>
  );
}
