"use client";

import { Row, Col, Card, Tag, Space, Typography } from "antd";
import {
  CheckCircleFilled,
  TrophyOutlined,
  DollarOutlined,
  RobotOutlined,
  AppstoreOutlined,
  CrownOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import LandingHero from "@/components/marketing/LandingHero";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import PricingPreview from "@/components/marketing/PricingPreview";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Data ────────────────────────────────────────────────────── */

const CRITERIA = [
  {
    icon: <RobotOutlined style={{ fontSize: 26, color: "#0ea5e9" }} />,
    title: "AI generation",
    desc: "Can the tool write a complete proposal from scratch, or does it just offer templates? In 2026, AI-first tools save freelancers hours per week.",
  },
  {
    icon: <DollarOutlined style={{ fontSize: 26, color: "#10b981" }} />,
    title: "Pricing & value",
    desc: "Per-user pricing punishes growth. Look for flat-rate plans with generous free tiers — freelancers shouldn't pay enterprise prices for basic features.",
  },
  {
    icon: <AppstoreOutlined style={{ fontSize: 26, color: "#7c3aed" }} />,
    title: "Feature depth",
    desc: "Proposals alone aren't enough. The best tools include contracts, invoicing, e-signatures, and client portals so you can run your entire client workflow in one place.",
  },
  {
    icon: <SmileOutlined style={{ fontSize: 26, color: "#f59e0b" }} />,
    title: "Ease of use",
    desc: "Enterprise-grade tools come with enterprise-grade complexity. Freelancers need something they can set up in minutes and master in a day, not a week-long onboarding.",
  },
];

const COMPARISON_FEATURES = [
  {
    name: "AI proposal generation",
    values: {
      DealPilot: true,
      Proposify: false,
      PandaDoc: false,
      "Better Proposals": false,
      HoneyBook: "Assist only",
      Bonsai: false,
      Qwilr: false,
      Dubsado: false,
    },
  },
  {
    name: "AI contract generation",
    values: {
      DealPilot: true,
      Proposify: false,
      PandaDoc: false,
      "Better Proposals": false,
      HoneyBook: false,
      Bonsai: false,
      Qwilr: false,
      Dubsado: false,
    },
  },
  {
    name: "Free plan with proposals",
    values: {
      DealPilot: true,
      Proposify: false,
      PandaDoc: false,
      "Better Proposals": false,
      HoneyBook: false,
      Bonsai: false,
      Qwilr: false,
      Dubsado: false,
    },
  },
  {
    name: "Digital e-signatures",
    values: {
      DealPilot: true,
      Proposify: true,
      PandaDoc: true,
      "Better Proposals": true,
      HoneyBook: true,
      Bonsai: true,
      Qwilr: true,
      Dubsado: true,
    },
  },
  {
    name: "Built-in invoicing",
    values: {
      DealPilot: true,
      Proposify: false,
      PandaDoc: false,
      "Better Proposals": false,
      HoneyBook: true,
      Bonsai: "Paid plans",
      Qwilr: false,
      Dubsado: true,
    },
  },
  {
    name: "Branded client portal",
    values: {
      DealPilot: true,
      Proposify: false,
      PandaDoc: false,
      "Better Proposals": false,
      HoneyBook: true,
      Bonsai: false,
      Qwilr: false,
      Dubsado: true,
    },
  },
  {
    name: "Stripe payment links",
    values: {
      DealPilot: true,
      Proposify: false,
      PandaDoc: false,
      "Better Proposals": false,
      HoneyBook: false,
      Bonsai: false,
      Qwilr: true,
      Dubsado: false,
    },
  },
  {
    name: "Proposal analytics",
    values: {
      DealPilot: true,
      Proposify: true,
      PandaDoc: true,
      "Better Proposals": true,
      HoneyBook: false,
      Bonsai: false,
      Qwilr: true,
      Dubsado: false,
    },
  },
  {
    name: "Milestone billing",
    values: {
      DealPilot: true,
      Proposify: false,
      PandaDoc: false,
      "Better Proposals": false,
      HoneyBook: false,
      Bonsai: false,
      Qwilr: false,
      Dubsado: false,
    },
  },
  {
    name: "Available worldwide",
    values: {
      DealPilot: true,
      Proposify: true,
      PandaDoc: true,
      "Better Proposals": true,
      HoneyBook: "US & Canada",
      Bonsai: true,
      Qwilr: true,
      Dubsado: true,
    },
  },
  {
    name: "No per-user pricing",
    values: {
      DealPilot: true,
      Proposify: false,
      PandaDoc: false,
      "Better Proposals": false,
      HoneyBook: true,
      Bonsai: false,
      Qwilr: false,
      Dubsado: true,
    },
  },
  {
    name: "Starting price",
    values: {
      DealPilot: "$0 (Free)",
      Proposify: "$19/user/mo",
      PandaDoc: "$35/user/mo",
      "Better Proposals": "$19/user/mo",
      HoneyBook: "$29/mo",
      Bonsai: "$9/user/mo",
      Qwilr: "$35/user/mo",
      Dubsado: "$20/mo",
    },
  },
];

const CATEGORY_WINNERS = [
  {
    icon: <RobotOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
    category: "Best for AI",
    winner: "DealPilot",
    reason: "The only tool that generates complete proposals and contracts from scratch using AI. No other platform comes close on AI capability.",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    icon: <DollarOutlined style={{ fontSize: 28, color: "#10b981" }} />,
    category: "Best Free Plan",
    winner: "DealPilot",
    reason: "5 proposals/month, 2 contracts, all 15 contract types, 19+ templates, and Stripe payment links — all free. No other tool offers proposals on a free plan.",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: <AppstoreOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
    category: "Best All-in-One",
    winner: "DealPilot / HoneyBook (tie)",
    reason: "Both combine proposals, contracts, invoicing, and client communication. DealPilot wins on AI and pricing; HoneyBook wins on scheduling and workflows.",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: <CrownOutlined style={{ fontSize: 28, color: "#f59e0b" }} />,
    category: "Best Value",
    winner: "DealPilot",
    reason: "Free plan with real features + Pro at $12/mo for unlimited everything. No per-user pricing. Best cost-to-feature ratio for freelancers by a wide margin.",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

export default function ProposalSoftwareComparisonPage() {
  return (
    <>
      {/* 1 — Hero */}
      <LandingHero
        tag="2026 Comparison Guide"
        title={
          <>
            Best Proposal Software
            <br />
            <span style={{ color: "#bae6fd" }}>for Freelancers (2026)</span>
          </>
        }
        subtitle="We compared 8 proposal tools on AI, pricing, features, and ease of use. Here's what we found."
        primaryCTA={{ text: "Try the #1 Pick Free", href: "/sign-up" }}
        secondaryCTA={{ text: "Skip to Comparison Table", href: "#comparison" }}
        footnote="Last updated: May 2026"
      />

      {/* 2 — What to look for */}
      <section
        aria-label="Evaluation criteria"
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
              Buying Guide
            </Tag>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              What to look for in proposal software
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Before comparing tools, understand the four criteria that matter
              most for freelancers.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {CRITERIA.map((c) => (
              <Col key={c.title} xs={24} sm={12}>
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
                    {c.icon}
                    <Text strong style={{ fontSize: 17 }}>
                      {c.title}
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: "#475569",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {c.desc}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 3 — Large comparison table */}
      <section
        id="comparison"
        aria-label="8-tool comparison"
        style={{
          background: "#f8fafc",
          padding: "80px 24px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              textAlign: "center",
              margin: "0 0 12px",
            }}
          >
            8 Proposal Tools Compared
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            DealPilot, Proposify, PandaDoc, Better Proposals, HoneyBook,
            Bonsai, Qwilr, and Dubsado — side by side.
          </p>
          <ComparisonTable
            competitors={[
              { name: "DealPilot", highlight: true },
              { name: "Proposify" },
              { name: "PandaDoc" },
              { name: "Better Proposals" },
              { name: "HoneyBook" },
              { name: "Bonsai" },
              { name: "Qwilr" },
              { name: "Dubsado" },
            ]}
            features={COMPARISON_FEATURES}
          />
        </div>
      </section>

      {/* 4 — Category winners */}
      <section
        aria-label="Category winners"
        style={{ background: "#fff", padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <TrophyOutlined
              style={{
                fontSize: 36,
                color: "#f59e0b",
                marginBottom: 12,
                display: "block",
              }}
            />
            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              Category winners
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              No single tool is perfect for everyone. Here are our picks by
              category.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {CATEGORY_WINNERS.map((cw) => (
              <Col key={cw.category} xs={24} sm={12}>
                <Card
                  style={{
                    borderRadius: 18,
                    border: `1px solid ${cw.border}`,
                    background: cw.bg,
                    height: "100%",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  {cw.icon}
                  <Text
                    type="secondary"
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginTop: 12,
                      marginBottom: 6,
                    }}
                  >
                    {cw.category}
                  </Text>
                  <Text
                    strong
                    style={{
                      fontSize: 20,
                      display: "block",
                      marginBottom: 10,
                    }}
                  >
                    {cw.winner}
                  </Text>
                  <Text
                    style={{
                      color: "#475569",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {cw.reason}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 5 — Our pick: DealPilot */}
      <section
        aria-label="Our recommendation"
        style={{
          background: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)",
          padding: "80px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Tag
            style={{
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              padding: "5px 16px",
              marginBottom: 20,
            }}
          >
            Our Pick for 2026
          </Tag>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 18px",
              letterSpacing: "-1px",
              lineHeight: 1.15,
            }}
          >
            Our recommendation: DealPilot
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.75,
              maxWidth: 640,
              margin: "0 auto 20px",
            }}
          >
            DealPilot is the only proposal tool that combines genuine AI
            generation, built-in invoicing, e-signatures, contracts, and a
            branded client portal — with a free plan that actually lets you
            work. For freelancers who want to send better proposals faster
            without paying enterprise prices, it is the clear winner in 2026.
          </p>
          <Space direction="vertical" size={10} style={{ marginBottom: 24 }}>
            {[
              "AI writes complete proposals in 60 seconds",
              "Free plan with 5 proposals/month + 2 contracts",
              "Pro at $12/mo — unlimited proposals, contracts, and e-signatures",
              "No per-user pricing, no send limits, no surprises",
            ].map((point) => (
              <div key={point} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <CheckCircleFilled style={{ color: "#34d399", fontSize: 16, flexShrink: 0 }} />
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}>
                  {point}
                </Text>
              </div>
            ))}
          </Space>
        </div>
      </section>

      {/* 6 — Pricing */}
      <PricingPreview />

      {/* 7 — CTA */}
      <CTASection
        title="Start with the best proposal tool of 2026"
        subtitle="Join thousands of freelancers using AI to win more clients. Free forever plan, 60-second setup."
        buttonText="Try DealPilot Free"
        buttonHref="/sign-up"
        footnote="Free forever plan · No credit card · Instant access"
      />
    </>
  );
}
