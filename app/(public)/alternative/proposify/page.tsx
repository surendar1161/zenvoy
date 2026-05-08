"use client";

import { Row, Col, Card, Tag, Space, Typography } from "antd";
import {
  ThunderboltFilled,
  CheckCircleFilled,
  DollarOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── metadata helpers ────────────────────────────────────────── */

const REASONS = [
  {
    num: 1,
    icon: <ThunderboltFilled style={{ fontSize: 26, color: "#0ea5e9" }} />,
    title: "AI generates proposals from scratch",
    desc: "Proposify relies on templates you fill in manually. DealPilot asks 5 questions, then Claude Opus 4.6 writes a complete, personalised proposal in under 60 seconds.",
  },
  {
    num: 2,
    icon: <FileTextOutlined style={{ fontSize: 26, color: "#7c3aed" }} />,
    title: "No send limits — ever",
    desc: "Proposify caps how many proposals you can send on lower tiers. DealPilot's Pro plan is unlimited proposals and contracts — no throttles, no surprises.",
  },
  {
    num: 3,
    icon: <DollarOutlined style={{ fontSize: 26, color: "#10b981" }} />,
    title: "Invoicing is built in",
    desc: "Proposify doesn't include invoicing — you need a separate tool. DealPilot lets you create invoices with Stripe payment links directly from the dashboard.",
  },
  {
    num: 4,
    icon: <SafetyCertificateOutlined style={{ fontSize: 26, color: "#f59e0b" }} />,
    title: "Contracts included at every tier",
    desc: "Generate 15 types of legally-aware contracts — NDAs, retainers, SLAs, and more — without bolting on another product. Jurisdiction-aware for 249 countries.",
  },
  {
    num: 5,
    icon: <TeamOutlined style={{ fontSize: 26, color: "#ef4444" }} />,
    title: "Freelancer-friendly pricing",
    desc: "Proposify charges $19-49 per user per month. DealPilot starts free, and Pro is just $12/mo — built specifically for solopreneurs and small teams.",
  },
];

const COMPARISON_FEATURES = [
  { name: "AI proposal generation (from scratch)", values: { Proposify: false, DealPilot: true } },
  { name: "Paste job post → auto-fill", values: { Proposify: false, DealPilot: true } },
  { name: "Unlimited proposals (Pro plan)", values: { Proposify: false, DealPilot: true } },
  { name: "Built-in invoicing", values: { Proposify: false, DealPilot: true } },
  { name: "AI contract generation (15 types)", values: { Proposify: false, DealPilot: true } },
  { name: "Digital e-signatures", values: { Proposify: true, DealPilot: true } },
  { name: "Branded client portal", values: { Proposify: false, DealPilot: true } },
  { name: "Template library", values: { Proposify: true, DealPilot: true } },
  { name: "Proposal analytics & tracking", values: { Proposify: true, DealPilot: true } },
  { name: "Stripe payment integration", values: { Proposify: false, DealPilot: true } },
  { name: "Free plan available", values: { Proposify: false, DealPilot: true } },
  { name: "Starting price (paid tier)", values: { Proposify: "$19/user/mo", DealPilot: "$12/mo" } },
];

const TESTIMONIALS = [
  {
    quote: "I switched from Proposify because I was spending 40 minutes on every proposal. DealPilot's AI generates a better draft in 60 seconds. I just tweak the tone and hit send.",
    name: "Sarah M.",
    role: "Freelance Copywriter",
  },
  {
    quote: "The send limits on Proposify were killing me during busy months. DealPilot Pro gives me unlimited everything for a fraction of what I was paying.",
    name: "Daniel K.",
    role: "Web Developer",
  },
  {
    quote: "Having proposals, contracts, invoices, and a client portal in one place saved me from juggling four different subscriptions.",
    name: "Priya R.",
    role: "Brand Consultant",
  },
];

const FAQS = [
  {
    q: "Can I import my Proposify templates into DealPilot?",
    a: "DealPilot uses AI to generate proposals from scratch, so you don't need to migrate templates. Just describe your project in 5 quick fields and the AI writes a fully personalised proposal. You can also save your own reusable sections in the content library.",
  },
  {
    q: "Does DealPilot have e-signatures like Proposify?",
    a: "Yes. DealPilot includes legally binding digital e-signatures on the Pro plan — compliant with eIDAS (EU) and ESIGN Act (US). Clients can sign by typing or drawing on any device, no download required.",
  },
  {
    q: "Is DealPilot really free?",
    a: "Yes. The free plan includes 5 proposals and 2 contracts per month, all 15 contract types, 19+ templates, and Stripe payment links. No credit card required. Upgrade to Pro ($12/mo) for unlimited proposals, e-signatures, analytics, and client portals.",
  },
  {
    q: "What if I need CRM integrations like Proposify offers?",
    a: "DealPilot's Business plan includes API access so you can connect to any CRM or tool via Zapier, Make, or direct integration. For most freelancers, the built-in client portal and analytics remove the need for a separate CRM entirely.",
  },
  {
    q: "How long does it take to set up DealPilot?",
    a: "About 60 seconds. Sign up, connect your Stripe account (optional), and generate your first proposal. There's no lengthy onboarding or template setup required — the AI handles it.",
  },
  {
    q: "Is Proposify better for larger teams?",
    a: "Proposify was built for sales teams and enterprise use cases. If you're a freelancer or small agency, DealPilot is purpose-built for your workflow — simpler, faster, and far more affordable.",
  },
];

export default function ProposifyAlternativePage() {
  return (
    <>
      {/* 1 — Hero */}
      <LandingHero
        tag="Proposify Alternative"
        title={
          <>
            Looking for a{" "}
            <span style={{ color: "#bae6fd" }}>Proposify Alternative</span>?
          </>
        }
        subtitle="DealPilot offers AI-generated proposals, built-in invoicing, and no send limits — at a fraction of the cost."
        primaryCTA={{ text: "Try DealPilot Free", href: "/sign-up" }}
        secondaryCTA={{ text: "See How It Works", href: "/#features" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 — Why freelancers switch */}
      <section
        aria-label="Why freelancers switch"
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
              Why freelancers switch from Proposify
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Proposify is a solid tool for sales teams — but freelancers need
              something faster, simpler, and more affordable.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {REASONS.map((r) => (
              <Col key={r.num} xs={24} md={12} lg={8}>
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
                      gap: 14,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#f0f9ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 900,
                        color: "#0369a1",
                      }}
                    >
                      {r.num}
                    </div>
                    {r.icon}
                  </div>
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {r.title}
                  </Text>
                  <Text
                    style={{ color: "#475569", fontSize: 14, lineHeight: 1.65 }}
                  >
                    {r.desc}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 3 — Comparison table */}
      <section
        aria-label="Feature comparison"
        style={{
          background: "#f8fafc",
          padding: "80px 24px",
          borderTop: "1px solid #e2e8f0",
        }}
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
            Proposify vs DealPilot — Feature Comparison
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            A side-by-side look at what each platform offers freelancers.
          </p>
          <ComparisonTable
            competitors={[
              { name: "Proposify" },
              { name: "DealPilot", highlight: true },
            ]}
            features={COMPARISON_FEATURES}
          />
        </div>
      </section>

      {/* 4 — Pricing comparison */}
      <section
        aria-label="Pricing comparison"
        style={{ background: "#fff", padding: "80px 24px" }}
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
            Save up to 75% compared to Proposify
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Proposify charges per user with send limits. DealPilot gives you
            more features for less.
          </p>
          <Row gutter={[28, 28]} justify="center">
            {/* Proposify card */}
            <Col xs={24} md={11}>
              <Card
                style={{
                  borderRadius: 20,
                  border: "2px solid #e2e8f0",
                  height: "100%",
                }}
                styles={{ body: { padding: 32 } }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 20,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Proposify
                </Text>
                <div style={{ marginBottom: 20 }}>
                  <span
                    style={{
                      fontSize: 40,
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    $19 – $49
                  </span>
                  <span style={{ color: "#94a3b8" }}>/user/mo</span>
                </div>
                <Space direction="vertical" size={8}>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    Template-based proposals
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    E-signatures
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    Analytics & CRM integrations
                  </Text>
                  <Text style={{ color: "#ef4444", fontSize: 14 }}>
                    No AI generation
                  </Text>
                  <Text style={{ color: "#ef4444", fontSize: 14 }}>
                    No invoicing
                  </Text>
                  <Text style={{ color: "#ef4444", fontSize: 14 }}>
                    Send limits on lower plans
                  </Text>
                  <Text style={{ color: "#ef4444", fontSize: 14 }}>
                    No contracts
                  </Text>
                  <Text style={{ color: "#ef4444", fontSize: 14 }}>
                    No free plan
                  </Text>
                </Space>
              </Card>
            </Col>

            {/* DealPilot card */}
            <Col xs={24} md={11}>
              <Card
                style={{
                  borderRadius: 20,
                  border: "2px solid #0ea5e9",
                  height: "100%",
                  boxShadow: "0 12px 40px rgba(14,165,233,0.12)",
                }}
                styles={{ body: { padding: 32 } }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <Text strong style={{ fontSize: 20 }}>
                    DealPilot
                  </Text>
                  <Tag
                    color="blue"
                    style={{ borderRadius: 20, fontSize: 11, fontWeight: 700 }}
                  >
                    Best Value
                  </Tag>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <span
                    style={{
                      fontSize: 40,
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    $0 – $29
                  </span>
                  <span style={{ color: "#94a3b8" }}>/mo</span>
                </div>
                <Space direction="vertical" size={8}>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    AI-generated proposals (60 seconds)
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    Unlimited proposals & contracts (Pro)
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    E-signatures included
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    Built-in invoicing + Stripe
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    15 AI contract types
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    Branded client portal
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    Free plan available
                  </Text>
                  <Text style={{ color: "#475569", fontSize: 14 }}>
                    <CheckCircleFilled
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                    No per-user pricing
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 5 — Social proof */}
      <SocialProof
        title="Why freelancers choose DealPilot"
        subtitle="Real feedback from freelancers who made the switch."
        testimonials={TESTIMONIALS}
      />

      {/* 6 — FAQ */}
      <FAQSection
        title="Proposify vs DealPilot — FAQ"
        subtitle="Common questions from freelancers considering the switch."
        faqs={FAQS}
      />

      {/* 7 — CTA */}
      <CTASection
        title="Ready to ditch the send limits?"
        subtitle="Generate your first AI-powered proposal in 60 seconds. No credit card, no templates to set up, no per-user fees."
        buttonText="Start Free — 60-Second Setup"
        buttonHref="/sign-up"
      />
    </>
  );
}
