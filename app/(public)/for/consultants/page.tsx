"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  FundProjectionScreenOutlined,
  SolutionOutlined,
  AuditOutlined,
  FieldTimeOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Proposal breakdown data ─────────────────────────────── */

const PROPOSAL_BREAKDOWN = [
  {
    step: "01",
    title: "Discovery & Diagnosis",
    color: "#eff6ff",
    border: "#bfdbfe",
    items: [
      "Stakeholder interviews (up to 8 participants)",
      "Current-state process mapping and gap analysis",
      "Competitive landscape review (3 direct, 2 adjacent)",
      "Data audit: existing KPIs, reporting, and systems",
      "Discovery summary report with key findings",
    ],
  },
  {
    step: "02",
    title: "Methodology & Approach",
    color: "#f5f3ff",
    border: "#ddd6fe",
    items: [
      "Proprietary framework: Diagnose → Design → Deliver → Measure",
      "Weekly strategic working sessions (90 min, virtual)",
      "Bi-weekly stakeholder alignment check-ins",
      "Change management plan with risk mitigation matrix",
      "Knowledge transfer workshops for internal team",
    ],
  },
  {
    step: "03",
    title: "Deliverables & Outcomes",
    color: "#f0fdf4",
    border: "#bbf7d0",
    items: [
      "Strategic roadmap: 30-60-90 day action plan",
      "Process redesign documentation with RACI matrix",
      "Financial model with 3-year ROI projections",
      "Implementation playbook for internal team",
      "Executive summary presentation (board-ready)",
    ],
  },
  {
    step: "04",
    title: "Timeline & Phases",
    color: "#fff7ed",
    border: "#fed7aa",
    items: [
      "Phase 1 (Weeks 1-3): Discovery and current-state assessment",
      "Phase 2 (Weeks 4-6): Strategy development and validation",
      "Phase 3 (Weeks 7-10): Implementation support and coaching",
      "Phase 4 (Weeks 11-12): Measurement, handoff, and close-out",
      "Optional: Ongoing advisory retainer (10 hrs/month)",
    ],
  },
  {
    step: "05",
    title: "Investment & Terms",
    color: "#fffbeb",
    border: "#fde68a",
    items: [
      "Project fee: $24,000 (or 3 monthly instalments of $8,500)",
      "Good / Better / Best packages with tiered scope",
      "Optional add-ons: executive coaching, board presentation, audit",
      "Travel and expenses billed at cost with prior approval",
      "Net-15 payment terms with Stripe payment links",
    ],
  },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function ConsultantsPage() {
  return (
    <>
      {/* 1 · Hero */}
      <LandingHero
        tag="Consulting Proposal Software"
        title={
          <>
            Win more engagements with
            <br />
            proposals that prove <span style={{ color: "#7dd3fc" }}>ROI</span>
          </>
        }
        subtitle="Stop spending half a day on every proposal. DealPilot generates consulting proposals with methodology breakdowns, ROI projections, and tiered pricing — in 60 seconds."
        primaryCTA={{ text: "Create Your First Proposal", href: "/sign-up" }}
        secondaryCTA={{ text: "See Consulting Templates", href: "/templates" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 · Win more engagements */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe", borderRadius: 20, fontWeight: 700, fontSize: 13, padding: "4px 14px", marginBottom: 14 }}>
              Built for consultants
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Win more consulting engagements
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 620, margin: "0 auto" }}>
              Your expertise is in strategy — not in formatting proposals in Word. Let AI handle the document while you focus on the diagnosis.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {[
              { icon: <FundProjectionScreenOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />, title: "ROI Projections", desc: "Auto-generate 3-year ROI models based on your engagement scope. Clients see the financial case for hiring you, not just the cost." },
              { icon: <SolutionOutlined style={{ fontSize: 28, color: "#7c3aed" }} />, title: "Methodology Framework", desc: "Showcase your proprietary process. Whether it's Lean Six Sigma, design thinking, or your own framework — present it professionally." },
              { icon: <AuditOutlined style={{ fontSize: 28, color: "#10b981" }} />, title: "Structured Deliverables", desc: "List every output: roadmaps, RACI matrices, playbooks, presentations. Clients know exactly what they're paying for." },
              { icon: <FieldTimeOutlined style={{ fontSize: 28, color: "#f59e0b" }} />, title: "Phase-Based Timeline", desc: "Break engagements into discovery, strategy, implementation, and measurement phases with clear milestones." },
              { icon: <DollarOutlined style={{ fontSize: 28, color: "#ef4444" }} />, title: "Flexible Pricing Models", desc: "Project-based, retainer, or hourly — with Good / Better / Best tiers. Let clients self-select the scope that fits their budget." },
              { icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: "#0369a1" }} />, title: "Professional Credibility", desc: "Branded PDFs, e-signatures, and a client portal that makes you look like a firm — even if you're a solo consultant." },
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

      {/* 3 · Consulting proposal breakdown */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Anatomy of a winning consulting proposal
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 580, margin: "0 auto" }}>
              Every section is generated by AI based on your engagement details. Edit anything, regenerate sections, export to PDF.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {PROPOSAL_BREAKDOWN.map((section) => (
              <Card key={section.title} style={{ borderRadius: 20, border: `1.5px solid ${section.border}`, background: section.color }} styles={{ body: { padding: 32 } }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em" }}>{section.step}</span>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{section.title}</h3>
                </div>
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

      {/* 4 · Retainer & hourly billing features */}
      <FeatureShowcase
        sectionTitle="Retainer and hourly billing, built in"
        sectionSubtitle="Whether you bill by the hour, the month, or the project — DealPilot handles it."
        features={[
          {
            icon: <FieldTimeOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
            title: "Retainer Agreements",
            desc: "Create monthly retainer proposals with defined hours, scope, and auto-recurring Stripe billing. Clients sign once and payments recur — no monthly invoice chasing.",
            points: [
              "Monthly retainer with defined hour bank",
              "Auto-recurring Stripe billing",
              "Scope boundaries clearly documented",
              "Rollover or use-it-or-lose-it hour policies",
            ],
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            icon: <DollarOutlined style={{ fontSize: 28, color: "#10b981" }} />,
            title: "Tiered Pricing Packages",
            desc: "Present Good / Better / Best packages so clients self-select scope and budget. Each tier is clearly differentiated — discovery only, strategy + implementation, or full transformation.",
            points: [
              "3 pricing tiers with clear scope differences",
              "Optional add-ons: executive coaching, workshops, audits",
              "Client selects package and pays deposit instantly",
              "Auto-generated Stripe payment links per tier",
            ],
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            icon: <RiseOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
            title: "ROI-Driven Proposals",
            desc: "Frame your fees as an investment, not a cost. Include projected savings, revenue impact, and payback period — so the CFO sees the business case, not just the line item.",
            points: [
              "3-year ROI projection section",
              "Break-even analysis and payback period",
              "Cost of inaction vs. engagement cost comparison",
              "Customisable financial model assumptions",
            ],
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
        ]}
      />

      {/* 5 · Professional credibility */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Look like a firm, even if you're solo
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Professional credibility isn't about headcount — it's about how you present.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {[
              { icon: <SafetyCertificateOutlined style={{ fontSize: 32, color: "#0ea5e9" }} />, title: "E-Signatures & Contracts", desc: "Legally binding e-signatures compliant with eIDAS and ESIGN Act. Clients sign by typing or drawing — no app download, no friction.", color: "#eff6ff", border: "#bfdbfe" },
              { icon: <TeamOutlined style={{ fontSize: 32, color: "#7c3aed" }} />, title: "Branded Client Portal", desc: "One link with your logo, colours, and domain. Clients access proposals, contracts, invoices, and files — all white-labelled.", color: "#f5f3ff", border: "#ddd6fe" },
              { icon: <AuditOutlined style={{ fontSize: 32, color: "#10b981" }} />, title: "Proposal Analytics", desc: "Know when your prospect opens the proposal, which sections they read, and how long they spent. Follow up at the perfect moment.", color: "#f0fdf4", border: "#bbf7d0" },
            ].map((item) => (
              <Col xs={24} md={8} key={item.title}>
                <Card style={{ borderRadius: 20, border: `1.5px solid ${item.border}`, background: item.color, height: "100%" }} styles={{ body: { padding: 32, textAlign: "center" } }}>
                  <div style={{ marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>{item.title}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 6 · Social Proof */}
      <SocialProof
        title="What consultants say"
        subtitle="Join consultants who close more engagements with less admin."
        testimonials={[
          {
            quote: "I was spending half a day on every proposal. Now I answer a few questions about the engagement and get a polished document with methodology, deliverables, and pricing tiers. My close rate went up 30%.",
            name: "Elena V.",
            role: "Management Consultant, Independent",
          },
          {
            quote: "The tiered pricing feature changed my business. Clients pick the package that fits their budget, and I stopped discounting because the scope differences are crystal clear.",
            name: "David C.",
            role: "Strategy Consultant",
          },
          {
            quote: "My proposals now look better than what McKinsey sends for RFPs. Branded portal, e-signatures, Stripe payments — clients think I have a team of 20 behind me.",
            name: "Sarah M.",
            role: "HR & Org Design Consultant",
          },
        ]}
      />

      {/* 7 · FAQ */}
      <FAQSection
        title="Consulting proposal FAQs"
        subtitle="Common questions from independent consultants and boutique firms."
        faqs={[
          {
            q: "Can I present my own methodology or framework in the proposal?",
            a: "Yes. The AI generates a methodology section based on your description. Whether you use Lean Six Sigma, Jobs-to-be-Done, or a proprietary framework — describe it in the wizard and the AI structures it into a professional methodology section with phases and deliverables.",
          },
          {
            q: "How do I price consulting engagements with DealPilot?",
            a: "You can set project-based fees, hourly rates, or monthly retainers. The Good / Better / Best pricing feature lets you present 3 packages with different scope levels. Optional add-ons (workshops, coaching, audits) are listed separately so clients can customise.",
          },
          {
            q: "Can I include ROI projections in my proposal?",
            a: "Yes. The proposal includes a section for projected ROI, payback period, and cost-of-inaction comparison. You input the assumptions and the AI frames the financial case for your engagement.",
          },
          {
            q: "Does it support retainer agreements for ongoing advisory work?",
            a: "Yes. Create standalone retainer proposals with defined monthly hours, scope, SLA, and auto-recurring Stripe billing. Clients sign once, payments recur automatically.",
          },
          {
            q: "Can I white-label everything so clients don't see DealPilot?",
            a: "Absolutely. Upload your logo, set your brand colours and font, and clients never see DealPilot branding. Proposals, contracts, portals, and emails all carry your brand.",
          },
          {
            q: "How do proposals get delivered to clients?",
            a: "You send a single link to your branded client portal. The client sees the proposal, contract, and payment link in one place. They can review, e-sign, and pay the deposit — all without creating an account.",
          },
        ]}
      />

      {/* 8 · CTA */}
      <CTASection
        title="Close your next engagement faster"
        subtitle="Generate a consulting proposal with methodology, deliverables, ROI projections, and tiered pricing — in 60 seconds. Free forever."
        buttonText="Create Your Proposal"
        buttonHref="/sign-up"
      />
    </>
  );
}
