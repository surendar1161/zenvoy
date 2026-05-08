"use client";

import { Row, Col, Card, Tag, Space, Typography } from "antd";
import {
  CheckCircleFilled,
  WarningOutlined,
  DollarOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import LandingHero from "@/components/marketing/LandingHero";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import SocialProof from "@/components/marketing/SocialProof";
import PricingPreview from "@/components/marketing/PricingPreview";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Data ────────────────────────────────────────────────────── */

const BASIC_MISSING = [
  {
    icon: <FileTextOutlined style={{ fontSize: 22, color: "#ef4444" }} />,
    title: "No proposals",
    desc: "Bonsai's $9/month Starter plan does not include proposal creation. You need the $19+ Professional plan to send proposals to clients.",
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: "#ef4444" }} />,
    title: "No contracts",
    desc: "Contract templates are locked behind the Professional plan. The Starter plan only includes basic task management and time tracking.",
  },
  {
    icon: <DollarOutlined style={{ fontSize: 22, color: "#ef4444" }} />,
    title: "No invoicing",
    desc: "Automated invoicing and payment collection require the Professional plan or higher. The Starter plan only offers basic expense tracking.",
  },
  {
    icon: <WarningOutlined style={{ fontSize: 22, color: "#ef4444" }} />,
    title: "Per-user pricing",
    desc: "Bonsai charges per user per month. Adding a collaborator or VA doubles your bill. DealPilot's Business plan includes 5 team members for a flat $29/mo.",
  },
];

const COMPARISON_FEATURES = [
  { name: "AI proposal generation (from scratch)", values: { Bonsai: false, HoneyBook: false, DealPilot: true } },
  { name: "Paste job post → auto-fill", values: { Bonsai: false, HoneyBook: false, DealPilot: true } },
  { name: "Proposals on cheapest plan", values: { Bonsai: false, HoneyBook: true, DealPilot: true } },
  { name: "Contracts on cheapest plan", values: { Bonsai: false, HoneyBook: true, DealPilot: true } },
  { name: "Invoicing on cheapest plan", values: { Bonsai: false, HoneyBook: true, DealPilot: true } },
  { name: "AI contract generation (15 types)", values: { Bonsai: false, HoneyBook: false, DealPilot: true } },
  { name: "Digital e-signatures", values: { Bonsai: true, HoneyBook: true, DealPilot: true } },
  { name: "Branded client portal", values: { Bonsai: false, HoneyBook: true, DealPilot: true } },
  { name: "Proposal analytics & tracking", values: { Bonsai: false, HoneyBook: false, DealPilot: true } },
  { name: "Stripe payment links", values: { Bonsai: false, HoneyBook: false, DealPilot: true } },
  { name: "Milestone-based billing", values: { Bonsai: false, HoneyBook: false, DealPilot: true } },
  { name: "Available worldwide", values: { Bonsai: true, HoneyBook: "US & Canada", DealPilot: true } },
  { name: "Free plan available", values: { Bonsai: false, HoneyBook: false, DealPilot: true } },
  { name: "Starting price", values: { Bonsai: "$9/user/mo", HoneyBook: "$29/mo", DealPilot: "$0 (Free)" } },
];

const AI_POINTS = [
  {
    label: "AI-first",
    title: "DealPilot",
    desc: "Answer 5 questions and AI generates a complete, personalised proposal from scratch. Paste a job post and the AI reads it, mirrors the client's language, and auto-fills your wizard. Choose from Professional, Friendly, or Bold tone. Regenerate any section with 3 alternatives.",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    label: "Template-first",
    title: "Bonsai & HoneyBook",
    desc: "Both Bonsai and HoneyBook rely on pre-built templates that you fill in manually. HoneyBook offers some AI-assisted editing, but neither can generate a proposal from scratch. You start with a blank template and do the writing yourself.",
    color: "#64748b",
    bg: "#f8fafc",
  },
];

const TESTIMONIALS = [
  {
    quote: "I signed up for Bonsai's $9 plan thinking I'd get proposals and contracts. Nope — those are on the $19 plan. DealPilot's free tier gives me more than Bonsai's paid Starter.",
    name: "Ryan P.",
    role: "Freelance Developer",
  },
  {
    quote: "Bonsai tries to do everything — time tracking, accounting, taxes — but proposals feel like an afterthought. DealPilot is focused and the AI is genuinely impressive.",
    name: "Camille D.",
    role: "Graphic Designer",
  },
  {
    quote: "I compared Bonsai, HoneyBook, and DealPilot for a week. DealPilot was the only one where I could paste a job post and have a proposal ready in a minute. Sold.",
    name: "Tobias N.",
    role: "Content Strategist",
  },
];

export default function BonsaiAlternativePage() {
  return (
    <>
      {/* 1 — Hero */}
      <LandingHero
        tag="Bonsai Alternative"
        title={
          <>
            The Best{" "}
            <span style={{ color: "#bae6fd" }}>Bonsai Alternative</span>
            {" "}for Freelancers
          </>
        }
        subtitle="Bonsai's cheapest plan doesn't include proposals, contracts, or invoicing. DealPilot's free plan includes all three — plus AI-powered generation."
        primaryCTA={{ text: "Try DealPilot Free", href: "/sign-up" }}
        secondaryCTA={{ text: "See the 3-Way Comparison", href: "#comparison" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 — What Bonsai's Basic plan is missing */}
      <section
        aria-label="Bonsai basic plan gaps"
        style={{ background: "#fff", padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Tag
              color="red"
              style={{
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                padding: "4px 16px",
                marginBottom: 16,
              }}
            >
              Read the Fine Print
            </Tag>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              What Bonsai&apos;s Starter plan is missing
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 620,
                margin: "0 auto",
              }}
            >
              Bonsai advertises a $9/month plan — but the features most
              freelancers need are locked behind higher tiers.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {BASIC_MISSING.map((item) => (
              <Col key={item.title} xs={24} sm={12}>
                <Card
                  style={{
                    borderRadius: 18,
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                    height: "100%",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    {item.icon}
                    <Text
                      strong
                      style={{ fontSize: 16, color: "#991b1b" }}
                    >
                      {item.title}
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: "#7f1d1d",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {item.desc}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>

          <div
            style={{
              textAlign: "center",
              marginTop: 40,
              padding: "20px 28px",
              background: "#f0f9ff",
              borderRadius: 14,
              border: "1px solid #bae6fd",
            }}
          >
            <Text style={{ fontSize: 15, color: "#0369a1" }}>
              <CheckCircleFilled style={{ marginRight: 8 }} />
              <strong>DealPilot&apos;s Free plan</strong> includes 5
              proposals/month, 2 contracts/month, all 15 contract types, 19+
              templates, and Stripe payment links —{" "}
              <strong>at $0/month</strong>.
            </Text>
          </div>
        </div>
      </section>

      {/* 3 — Three-way comparison table */}
      <section
        id="comparison"
        aria-label="Three-way comparison"
        style={{
          background: "#f8fafc",
          padding: "80px 24px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              textAlign: "center",
              margin: "0 0 12px",
            }}
          >
            Bonsai vs HoneyBook vs DealPilot
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            A three-way comparison of the features freelancers care about most.
          </p>
          <ComparisonTable
            competitors={[
              { name: "Bonsai" },
              { name: "HoneyBook" },
              { name: "DealPilot", highlight: true },
            ]}
            features={COMPARISON_FEATURES}
          />
        </div>
      </section>

      {/* 4 — AI-first vs template-first */}
      <section
        aria-label="AI-first differentiation"
        style={{ background: "#fff", padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
              The AI Advantage
            </Tag>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              AI-first vs template-first
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 620,
                margin: "0 auto",
              }}
            >
              Bonsai and HoneyBook give you templates to fill in. DealPilot
              generates the entire proposal with AI.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {AI_POINTS.map((point) => (
              <Col key={point.label} xs={24} md={12}>
                <Card
                  style={{
                    borderRadius: 18,
                    border: `2px solid ${point.color}33`,
                    background: point.bg,
                    height: "100%",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  <Tag
                    style={{
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      background: point.color,
                      color: "#fff",
                      border: "none",
                      marginBottom: 14,
                    }}
                  >
                    {point.label}
                  </Tag>
                  <Text
                    strong
                    style={{
                      fontSize: 20,
                      display: "block",
                      marginBottom: 10,
                    }}
                  >
                    {point.title}
                  </Text>
                  <Text
                    style={{
                      color: "#475569",
                      fontSize: 14,
                      lineHeight: 1.75,
                    }}
                  >
                    {point.desc}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 5 — Pricing */}
      <PricingPreview />

      {/* 6 — Social proof */}
      <SocialProof
        title="Freelancers who made the switch"
        subtitle="Real feedback from freelancers who compared Bonsai and chose DealPilot."
        testimonials={TESTIMONIALS}
      />

      {/* 7 — CTA */}
      <CTASection
        title="Get more for $0 than Bonsai's $9 plan"
        subtitle="DealPilot's free plan includes proposals, contracts, invoicing, and AI generation. Start in 60 seconds."
        buttonText="Start Free — No Credit Card"
        buttonHref="/sign-up"
      />
    </>
  );
}
