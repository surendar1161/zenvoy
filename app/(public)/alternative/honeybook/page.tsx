"use client";

import { Row, Col, Card, Tag, Space, Typography } from "antd";
import {
  CheckCircleFilled,
  GlobalOutlined,
} from "@ant-design/icons";

import LandingHero from "@/components/marketing/LandingHero";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Data ────────────────────────────────────────────────────── */

const AI_DIFFERENCES = [
  {
    label: "What it does",
    honeybook: "AI assists with writing and suggests edits to existing templates",
    dealpilot: "AI generates a complete, personalised proposal from scratch in 60 seconds",
  },
  {
    label: "Input required",
    honeybook: "Select a template, then manually customize every section",
    dealpilot: "Answer 5 questions (or paste a job post) and the AI does the rest",
  },
  {
    label: "Tone & style",
    honeybook: "Limited customisation of AI suggestions",
    dealpilot: "Choose Professional, Friendly, or Bold — AI adapts the entire proposal",
  },
  {
    label: "Regeneration",
    honeybook: "Not available",
    dealpilot: "Regenerate any section with 3 AI alternatives instantly",
  },
  {
    label: "Contract generation",
    honeybook: "Template-based contracts",
    dealpilot: "AI generates 15 contract types, jurisdiction-aware for 249 countries",
  },
];

const COMPARISON_FEATURES = [
  { name: "AI proposal generation (from scratch)", values: { HoneyBook: false, DealPilot: true } },
  { name: "AI contract generation (15 types)", values: { HoneyBook: false, DealPilot: true } },
  { name: "Paste job post → auto-fill", values: { HoneyBook: false, DealPilot: true } },
  { name: "Available worldwide", values: { HoneyBook: "US & Canada only", DealPilot: true } },
  { name: "Built-in invoicing", values: { HoneyBook: true, DealPilot: true } },
  { name: "Digital e-signatures", values: { HoneyBook: true, DealPilot: true } },
  { name: "Branded client portal", values: { HoneyBook: true, DealPilot: true } },
  { name: "Proposal analytics & tracking", values: { HoneyBook: false, DealPilot: true } },
  { name: "Stripe payment links", values: { HoneyBook: false, DealPilot: true } },
  { name: "Milestone-based billing", values: { HoneyBook: false, DealPilot: true } },
  { name: "Free plan available", values: { HoneyBook: false, DealPilot: true } },
  { name: "Starting price", values: { HoneyBook: "$29/mo", DealPilot: "$0 (Free)" } },
];

const PRICING_TIERS = [
  {
    tool: "HoneyBook",
    plans: [
      { name: "Starter", price: "$29/mo", note: "Limited features" },
      { name: "Essentials", price: "$49/mo", note: "Most popular" },
      { name: "Premium", price: "$109/mo", note: "Full feature set" },
    ],
    color: "#334155",
  },
  {
    tool: "DealPilot",
    plans: [
      { name: "Free", price: "$0/mo", note: "5 proposals + 2 contracts" },
      { name: "Pro", price: "$12/mo", note: "Unlimited everything" },
      { name: "Business", price: "$29/mo", note: "Teams + API + custom domain" },
    ],
    color: "#0ea5e9",
    highlight: true,
  },
];

const TESTIMONIALS = [
  {
    quote: "I loved HoneyBook's portal but I'm based in the UK. DealPilot works worldwide, and the AI proposals save me hours every week.",
    name: "Olivia W.",
    role: "Freelance Photographer, London",
  },
  {
    quote: "HoneyBook's $49 Essentials plan was the minimum I needed. DealPilot Pro gives me even more features for $12 a month. The math was easy.",
    name: "James C.",
    role: "Wedding Videographer",
  },
  {
    quote: "The AI difference is real. HoneyBook helps you tweak templates. DealPilot writes the whole proposal. It's a completely different experience.",
    name: "Maria S.",
    role: "Social Media Consultant",
  },
];

const FAQS = [
  {
    q: "How is DealPilot's AI different from HoneyBook's AI?",
    a: "HoneyBook's AI assists with writing and suggests edits within existing templates. DealPilot's AI generates complete proposals from scratch — answer 5 questions (or paste a job post) and get a polished, personalised proposal in under 60 seconds. You can also regenerate any section with 3 AI alternatives.",
  },
  {
    q: "Can I use DealPilot outside the US and Canada?",
    a: "Yes. DealPilot works worldwide — no geographic restrictions. Contracts are jurisdiction-aware for 249 countries and all US states. HoneyBook is currently available only in the US and Canada.",
  },
  {
    q: "Does DealPilot have scheduling and workflows like HoneyBook?",
    a: "DealPilot focuses on proposals, contracts, invoicing, and client portals. If you need appointment scheduling, calendar sync, or complex automation workflows, HoneyBook may still be a good complement. Many freelancers use DealPilot alongside a simple scheduling tool like Calendly.",
  },
  {
    q: "Is DealPilot cheaper than HoneyBook?",
    a: "Significantly. HoneyBook plans range from $29 to $109/month. DealPilot starts free and Pro is $12/month. Even the Business plan at $29/month includes team seats, API access, and a custom domain — equivalent to HoneyBook's Premium tier at $109/month.",
  },
  {
    q: "Can I send invoices with DealPilot like I can with HoneyBook?",
    a: "Yes. DealPilot includes built-in invoicing with Stripe payment links. You can also set up milestone-based billing that auto-generates payment links for each project phase — something HoneyBook doesn't offer.",
  },
  {
    q: "Does DealPilot have a client portal?",
    a: "Yes. DealPilot includes a branded client portal where clients can view files, invoices, contracts, and message you directly. No login required for clients. The portal features your logo, colours, and branding.",
  },
];

export default function HoneyBookAlternativePage() {
  return (
    <>
      {/* 1 — Hero */}
      <LandingHero
        tag="HoneyBook Alternative"
        title={
          <>
            A Smarter{" "}
            <span style={{ color: "#bae6fd" }}>HoneyBook Alternative</span>
          </>
        }
        subtitle="HoneyBook assists with proposals. DealPilot generates them from scratch with AI — and works worldwide, not just the US and Canada."
        primaryCTA={{ text: "Try DealPilot Free", href: "/sign-up" }}
        secondaryCTA={{ text: "See Comparison", href: "#comparison" }}
        footnote="Free forever plan · No credit card required · Works worldwide"
      />

      {/* 2 — AI differentiator */}
      <section
        aria-label="AI comparison"
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
              The AI Gap
            </Tag>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              HoneyBook assists. DealPilot generates.
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 620,
                margin: "0 auto",
              }}
            >
              Both platforms use AI — but the depth and capability are
              fundamentally different.
            </p>
          </div>

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
                      HoneyBook
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
                  {AI_DIFFERENCES.map((row, i) => (
                    <tr
                      key={row.label}
                      style={{
                        borderBottom:
                          i < AI_DIFFERENCES.length - 1
                            ? "1px solid #f1f5f9"
                            : undefined,
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 14,
                          color: "#475569",
                          fontWeight: 600,
                        }}
                      >
                        {row.label}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          textAlign: "center",
                          fontSize: 13,
                          color: "#475569",
                        }}
                      >
                        {row.honeybook}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
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

      {/* 3 — Available worldwide */}
      <section
        aria-label="Global availability"
        style={{
          background: "#f8fafc",
          padding: "80px 24px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <GlobalOutlined
            style={{ fontSize: 48, color: "#0ea5e9", marginBottom: 20 }}
          />
          <h2
            style={{
              fontSize: 34,
              fontWeight: 900,
              margin: "0 0 14px",
              letterSpacing: "-0.5px",
            }}
          >
            Available worldwide
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 17,
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            HoneyBook is available only in the United States and Canada. If
            you&apos;re a freelancer in Europe, Asia, Australia, Latin America,
            Africa, or anywhere else — DealPilot is ready for you today.
          </p>
          <Row gutter={[20, 20]} justify="center">
            {[
              { label: "Countries supported", value: "249", sub: "jurisdiction-aware contracts" },
              { label: "Languages", value: "Any", sub: "AI generates in your language" },
              { label: "Currency support", value: "135+", sub: "via Stripe" },
            ].map((stat) => (
              <Col key={stat.label} xs={24} sm={8}>
                <Card
                  style={{
                    borderRadius: 18,
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                  }}
                  styles={{ body: { padding: 24 } }}
                >
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: "#0369a1",
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <Text
                    strong
                    style={{
                      display: "block",
                      fontSize: 14,
                      marginTop: 6,
                    }}
                  >
                    {stat.label}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12 }}
                  >
                    {stat.sub}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
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
            HoneyBook vs DealPilot — Feature Comparison
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            A side-by-side look at the features freelancers care about most.
          </p>
          <ComparisonTable
            competitors={[
              { name: "HoneyBook" },
              { name: "DealPilot", highlight: true },
            ]}
            features={COMPARISON_FEATURES}
          />
        </div>
      </section>

      {/* 5 — Pricing comparison */}
      <section
        aria-label="Pricing comparison"
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
            Simpler pricing, no compromises
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            HoneyBook&apos;s most popular plan is $49/month. DealPilot Pro
            gives you more proposal features for $12/month.
          </p>
          <Row gutter={[28, 28]} justify="center">
            {PRICING_TIERS.map((tier) => (
              <Col key={tier.tool} xs={24} md={12}>
                <Card
                  style={{
                    borderRadius: 20,
                    border: `2px solid ${tier.highlight ? "#0ea5e9" : "#e2e8f0"}`,
                    height: "100%",
                    boxShadow: tier.highlight
                      ? "0 12px 40px rgba(14,165,233,0.12)"
                      : undefined,
                  }}
                  styles={{ body: { padding: 32 } }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 24,
                    }}
                  >
                    <Text strong style={{ fontSize: 20 }}>
                      {tier.tool}
                    </Text>
                    {tier.highlight && (
                      <Tag
                        color="blue"
                        style={{
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Best Value
                      </Tag>
                    )}
                  </div>
                  <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    {tier.plans.map((plan) => (
                      <div
                        key={plan.name}
                        style={{
                          padding: "14px 18px",
                          background: tier.highlight ? "#f0f9ff" : "#f8fafc",
                          borderRadius: 12,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text strong style={{ fontSize: 15 }}>
                            {plan.name}
                          </Text>
                          <br />
                          <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                          >
                            {plan.note}
                          </Text>
                        </div>
                        <Text
                          strong
                          style={{
                            fontSize: 18,
                            color: tier.highlight ? "#0369a1" : "#334155",
                          }}
                        >
                          {plan.price}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 6 — Social proof */}
      <SocialProof
        title="Freelancers love the switch"
        subtitle="Hear from freelancers who moved from HoneyBook to DealPilot."
        testimonials={TESTIMONIALS}
      />

      {/* 7 — FAQ */}
      <FAQSection
        title="HoneyBook vs DealPilot — FAQ"
        subtitle="Common questions from freelancers considering the switch."
        faqs={FAQS}
      />

      {/* 8 — CTA */}
      <CTASection
        title="Ready for AI-generated proposals?"
        subtitle="Stop tweaking templates and start generating. Your first proposal is 60 seconds away — and it works from anywhere in the world."
        buttonText="Start Free — Works Worldwide"
        buttonHref="/sign-up"
      />
    </>
  );
}
