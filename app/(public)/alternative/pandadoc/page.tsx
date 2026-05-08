"use client";

import { Row, Col, Card, Tag, Space, Typography } from "antd";
import {
  ThunderboltFilled,
  CheckCircleFilled,
  UserOutlined,
  RocketOutlined,
  DollarOutlined,
  ToolOutlined,
} from "@ant-design/icons";

import LandingHero from "@/components/marketing/LandingHero";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import SocialProof from "@/components/marketing/SocialProof";
import PricingPreview from "@/components/marketing/PricingPreview";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Data ────────────────────────────────────────────────────── */

const REASONS = [
  {
    icon: <ThunderboltFilled style={{ fontSize: 24, color: "#0ea5e9" }} />,
    title: "AI writes the proposal for you",
    desc: "PandaDoc offers templates and some AI assist features — but it can't generate an entire proposal from scratch. DealPilot's AI reads your project details (or a pasted job post) and writes a polished, personalised proposal in under 60 seconds.",
  },
  {
    icon: <UserOutlined style={{ fontSize: 24, color: "#7c3aed" }} />,
    title: "Built for freelancers, not enterprises",
    desc: "PandaDoc is designed for mid-market sales teams with complex approval workflows. DealPilot strips away the enterprise complexity and gives freelancers exactly what they need — proposals, contracts, invoicing, and a client portal.",
  },
  {
    icon: <DollarOutlined style={{ fontSize: 24, color: "#10b981" }} />,
    title: "Transparent, affordable pricing",
    desc: "PandaDoc's free plan only covers e-signatures. Paid plans start at $35/user/mo (billed annually) and climb quickly for teams. DealPilot starts free with 5 proposals/month, and Pro is $12/mo — not per user.",
  },
  {
    icon: <ToolOutlined style={{ fontSize: 24, color: "#f59e0b" }} />,
    title: "All-in-one from day one",
    desc: "With PandaDoc, you often need add-ons or integrations for invoicing, contracts, and client communication. DealPilot includes proposals, 15 contract types, invoicing, e-signatures, and a branded client portal in a single app.",
  },
  {
    icon: <RocketOutlined style={{ fontSize: 24, color: "#ef4444" }} />,
    title: "60-second setup, zero learning curve",
    desc: "PandaDoc's feature depth comes with a steep learning curve. DealPilot is intentionally simple: sign up, answer 5 questions, and your first proposal is ready. Most freelancers are fully productive in minutes, not days.",
  },
];

const SIDE_BY_SIDE = [
  { label: "Target audience", pandadoc: "Sales teams & enterprises", dealpilot: "Freelancers & solopreneurs" },
  { label: "AI capability", pandadoc: "Template assist only", dealpilot: "Full proposal generation from scratch" },
  { label: "Setup time", pandadoc: "Hours (templates, workflows)", dealpilot: "60 seconds" },
  { label: "Invoicing", pandadoc: "Requires integration", dealpilot: "Built in with Stripe" },
  { label: "Contract generation", pandadoc: "Template-based", dealpilot: "AI-generated, 15 types, 249 jurisdictions" },
  { label: "Client portal", pandadoc: "Not included", dealpilot: "Branded portal included" },
  { label: "Free plan", pandadoc: "E-sign only", dealpilot: "5 proposals + 2 contracts/mo" },
  { label: "Pricing model", pandadoc: "Per user", dealpilot: "Flat rate" },
];

const COMPARISON_FEATURES = [
  { name: "AI proposal generation (from scratch)", values: { PandaDoc: false, DealPilot: true } },
  { name: "Paste job post → auto-fill", values: { PandaDoc: false, DealPilot: true } },
  { name: "Unlimited proposals (paid plan)", values: { PandaDoc: true, DealPilot: true } },
  { name: "Built-in invoicing", values: { PandaDoc: false, DealPilot: true } },
  { name: "AI contract generation (15 types)", values: { PandaDoc: false, DealPilot: true } },
  { name: "Digital e-signatures", values: { PandaDoc: true, DealPilot: true } },
  { name: "Branded client portal", values: { PandaDoc: false, DealPilot: true } },
  { name: "Template library", values: { PandaDoc: true, DealPilot: true } },
  { name: "Proposal analytics", values: { PandaDoc: true, DealPilot: true } },
  { name: "CRM integrations", values: { PandaDoc: true, DealPilot: "Via API (Business)" } },
  { name: "Stripe payment links", values: { PandaDoc: false, DealPilot: true } },
  { name: "Free plan with proposals", values: { PandaDoc: false, DealPilot: true } },
  { name: "Starting price (paid)", values: { PandaDoc: "$35/user/mo", DealPilot: "$12/mo" } },
];

const TESTIMONIALS = [
  {
    quote: "PandaDoc felt like it was built for a 50-person sales team. I'm a freelance designer — I just need proposals that look great and go out fast. DealPilot nailed it.",
    name: "Alex T.",
    role: "Freelance UI/UX Designer",
  },
  {
    quote: "I tried PandaDoc's free plan but it was e-sign only. DealPilot's free tier actually lets me create proposals and contracts. The upgrade to Pro was a no-brainer at $12.",
    name: "Jessica H.",
    role: "Marketing Consultant",
  },
  {
    quote: "The AI is what sold me. I paste in a client's job posting, DealPilot reads it, and a personalised proposal appears. Nothing else I've tried does this.",
    name: "Marcus L.",
    role: "Full-Stack Developer",
  },
];

export default function PandaDocAlternativePage() {
  return (
    <>
      {/* 1 — Hero */}
      <LandingHero
        tag="PandaDoc Alternative"
        title={
          <>
            The Best{" "}
            <span style={{ color: "#bae6fd" }}>PandaDoc Alternative</span>
            {" "}for Freelancers
          </>
        }
        subtitle="PandaDoc is built for enterprise sales teams. DealPilot is built for freelancers — AI-generated proposals, built-in invoicing, and a fraction of the cost."
        primaryCTA={{ text: "Try DealPilot Free", href: "/sign-up" }}
        secondaryCTA={{ text: "See Full Comparison", href: "#comparison" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 — 5 Reasons */}
      <section
        aria-label="Why freelancers choose DealPilot"
        style={{ background: "#fff", padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Tag
              color="blue"
              style={{
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                padding: "4px 16px",
                marginBottom: 16,
              }}
            >
              Why Switch?
            </Tag>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              5 Reasons Freelancers Choose DealPilot Over PandaDoc
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 620,
                margin: "0 auto",
              }}
            >
              PandaDoc is a powerful document platform — but its power comes
              with enterprise complexity and enterprise pricing.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {REASONS.map((r) => (
              <Col key={r.title} xs={24} md={12}>
                <Card
                  style={{
                    borderRadius: 18,
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    {r.icon}
                    <Text strong style={{ fontSize: 16 }}>
                      {r.title}
                    </Text>
                  </div>
                  <Text
                    style={{ color: "#475569", fontSize: 14, lineHeight: 1.7 }}
                  >
                    {r.desc}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 3 — Side-by-side: Enterprise vs Freelancer */}
      <section
        aria-label="Enterprise vs freelancer"
        style={{
          background: "#f8fafc",
          padding: "80px 24px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              textAlign: "center",
              margin: "0 0 12px",
            }}
          >
            PandaDoc is built for enterprise.
            <br />
            DealPilot is built for you.
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            A quick snapshot of how the two platforms compare for freelancers.
          </p>

          <Card
            style={{
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 540,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#334155",
                      }}
                    />
                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#334155",
                      }}
                    >
                      PandaDoc
                    </th>
                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#0369a1",
                        background: "#f0f9ff",
                      }}
                    >
                      DealPilot
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SIDE_BY_SIDE.map((row, i) => (
                    <tr
                      key={row.label}
                      style={{
                        borderBottom:
                          i < SIDE_BY_SIDE.length - 1
                            ? "1px solid #f1f5f9"
                            : undefined,
                      }}
                    >
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: 14,
                          color: "#475569",
                          fontWeight: 600,
                        }}
                      >
                        {row.label}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          textAlign: "center",
                          fontSize: 13,
                          color: "#475569",
                        }}
                      >
                        {row.pandadoc}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          textAlign: "center",
                          fontSize: 13,
                          color: "#0369a1",
                          fontWeight: 600,
                          background: "#f0f9ff",
                        }}
                      >
                        {row.dealpilot}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* 4 — Comparison table */}
      <section
        id="comparison"
        aria-label="Feature comparison"
        style={{ background: "#fff", padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              textAlign: "center",
              margin: "0 0 12px",
            }}
          >
            PandaDoc vs DealPilot — Full Comparison
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Every feature that matters for freelancers, compared side-by-side.
          </p>
          <ComparisonTable
            competitors={[
              { name: "PandaDoc" },
              { name: "DealPilot", highlight: true },
            ]}
            features={COMPARISON_FEATURES}
          />
        </div>
      </section>

      {/* 5 — Pricing */}
      <PricingPreview />

      {/* 6 — Social proof */}
      <SocialProof
        title="What freelancers say about switching"
        subtitle="Real stories from freelancers who moved from PandaDoc to DealPilot."
        testimonials={TESTIMONIALS}
      />

      {/* 7 — CTA */}
      <CTASection
        title="Skip the enterprise complexity"
        subtitle="Generate your first AI-powered proposal in 60 seconds. Built for freelancers, priced for freelancers."
        buttonText="Start Free — No Credit Card"
        buttonHref="/sign-up"
      />
    </>
  );
}
