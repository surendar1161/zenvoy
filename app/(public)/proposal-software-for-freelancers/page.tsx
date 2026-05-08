"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  ThunderboltFilled, FrownOutlined, DollarOutlined,
  CloseCircleOutlined, ToolOutlined, CheckCircleFilled,
  HeartFilled, SafetyCertificateOutlined, EditOutlined,
  GlobalOutlined, CreditCardOutlined, BarChartOutlined,
  BgColorsOutlined, TeamOutlined, SmileOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import LandingHero from "@/components/marketing/LandingHero";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import PricingPreview from "@/components/marketing/PricingPreview";
import SocialProof from "@/components/marketing/SocialProof";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Pain Points ──────────────────────────────────────────────── */
const PAIN_POINTS = [
  {
    icon: <DollarOutlined style={{ fontSize: 28, color: "#ef4444" }} />,
    title: "Expensive Per-Seat Pricing",
    desc: "Proposify charges $49/user/month. PandaDoc starts at $35/user/month. You're a solo freelancer -- why pay enterprise rates for one seat?",
    color: "#fef2f2",
    border: "#fecaca",
  },
  {
    icon: <ToolOutlined style={{ fontSize: 28, color: "#f59e0b" }} />,
    title: "Complex Enterprise Features",
    desc: "CRM integrations, team permissions, approval workflows -- features built for sales teams of 20, not a one-person business sending 5 proposals a week.",
    color: "#fffbeb",
    border: "#fde68a",
  },
  {
    icon: <CloseCircleOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
    title: "No AI, No Automation",
    desc: "Most tools give you a blank editor and templates. You still write everything from scratch. Copy-paste the same scope of work for the hundredth time.",
    color: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: <FrownOutlined style={{ fontSize: 28, color: "#0369a1" }} />,
    title: "Proposals Are Just One Piece",
    desc: "After the proposal, you need contracts, e-signatures, invoices, a client portal, and payment links. That means 4 more subscriptions.",
    color: "#f0f9ff",
    border: "#bae6fd",
  },
];

/* ── Built Different ──────────────────────────────────────────── */
const DIFFERENTIATORS = [
  {
    icon: <SmileOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />,
    title: "Solo-Friendly Pricing",
    desc: "Start free. Upgrade to Pro for $12/mo -- less than a single Proposify seat. No per-user fees, no hidden costs.",
  },
  {
    icon: <ThunderboltFilled style={{ fontSize: 24, color: "#7c3aed" }} />,
    title: "AI Writes For You",
    desc: "Paste a job post and Claude AI generates a complete proposal in 60 seconds. Tone control, section regeneration, and job post parsing built in.",
  },
  {
    icon: <RocketOutlined style={{ fontSize: 24, color: "#10b981" }} />,
    title: "All-in-One Platform",
    desc: "Proposals, contracts, e-signatures, client portals, payments, analytics, and a brand kit -- all included. Replace 4-5 separate subscriptions.",
  },
];

/* ── Full Feature Set ─────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <ThunderboltFilled style={{ fontSize: 28, color: "#0ea5e9" }} />,
    title: "AI Proposal Generation",
    desc: "Answer 5 questions and Claude Opus 4.6 writes a complete, personalised proposal. Paste a job post for auto-fill. Choose from Professional, Friendly, or Bold tones.",
    points: ["60-second generation", "Job post parsing and auto-fill", "3 tone styles", "Section-level regeneration"],
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
    title: "AI Contract Generation",
    desc: "Generate legally sound contracts for any engagement -- NDA, employment, retainer, SLA, and 11 more types. Jurisdiction-aware across 249 countries.",
    points: ["15 contract types", "249 country jurisdiction support", "Compliance notes auto-applied", "Google Docs-style editor"],
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: <EditOutlined style={{ fontSize: 28, color: "#10b981" }} />,
    title: "Digital E-Signatures",
    desc: "Legally binding e-signatures compliant with eIDAS and ESIGN Act. Clients sign by typing or drawing on any device -- no app download required.",
    points: ["Type or draw signature", "eIDAS and ESIGN Act compliant", "IP and timestamp recorded", "Accept-without-signing option"],
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: <GlobalOutlined style={{ fontSize: 28, color: "#0369a1" }} />,
    title: "Branded Client Portal",
    desc: "One link gives clients access to files, invoices, contracts, and a real-time chat -- all branded with your logo, colours, and domain.",
    points: ["File sharing and uploads", "Invoice tracking with Stripe", "Real-time messaging", "Custom branding"],
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    icon: <CreditCardOutlined style={{ fontSize: 28, color: "#f59e0b" }} />,
    title: "Stripe Payments",
    desc: "Every proposal includes a Stripe payment link for the deposit. Set up Good/Better/Best pricing tiers and milestone-based billing automatically.",
    points: ["Auto-generated payment links", "Tiered pricing (3 packages)", "Optional add-ons checklist", "Milestone payment splits"],
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    icon: <BarChartOutlined style={{ fontSize: 28, color: "#ef4444" }} />,
    title: "Proposal Analytics",
    desc: "Know when clients open your proposal, how long they spend on each section, and get notified in real time so you follow up at the perfect moment.",
    points: ["Real-time open tracking", "Section-by-section heatmap", "Instant email notifications", "Conversion rate dashboard"],
    bg: "#fef2f2",
    border: "#fecaca",
  },
  {
    icon: <BgColorsOutlined style={{ fontSize: 28, color: "#ec4899" }} />,
    title: "Brand Kit",
    desc: "Upload your logo, set brand colours, and lock in your business details. Every proposal and contract uses your branding automatically.",
    points: ["Logo, colours, and fonts", "Business name and tagline", "Consistent across all documents", "One-time setup"],
    bg: "#fdf2f8",
    border: "#fbcfe8",
  },
  {
    icon: <TeamOutlined style={{ fontSize: 28, color: "#6366f1" }} />,
    title: "Client CRM",
    desc: "Organise clients with contact info, project history, proposal status, and total revenue -- all in one place. No separate CRM needed.",
    points: ["Contact management", "Proposal and contract history", "Revenue tracking per client", "Quick-access client profiles"],
    bg: "#eef2ff",
    border: "#c7d2fe",
  },
];

/* ── Comparison Table ─────────────────────────────────────────── */
const COMPETITORS = [
  { name: "DealPilot", highlight: true },
  { name: "Proposify" },
  { name: "PandaDoc" },
  { name: "HoneyBook" },
];

const COMPARISON_FEATURES = [
  { name: "AI proposal generation", values: { DealPilot: true, Proposify: false, PandaDoc: false, HoneyBook: false } },
  { name: "Free plan", values: { DealPilot: "5 proposals/mo", Proposify: false, PandaDoc: "Viewer only", HoneyBook: false } },
  { name: "Starting price (paid)", values: { DealPilot: "$12/mo", Proposify: "$49/user/mo", PandaDoc: "$35/user/mo", HoneyBook: "$19/mo" } },
  { name: "AI contract generation", values: { DealPilot: "15 types", Proposify: false, PandaDoc: false, HoneyBook: false } },
  { name: "E-signatures", values: { DealPilot: true, Proposify: true, PandaDoc: true, HoneyBook: true } },
  { name: "Client portal", values: { DealPilot: true, Proposify: false, PandaDoc: false, HoneyBook: true } },
  { name: "Stripe payment links", values: { DealPilot: true, Proposify: false, PandaDoc: false, HoneyBook: true } },
  { name: "Proposal analytics", values: { DealPilot: true, Proposify: true, PandaDoc: true, HoneyBook: false } },
  { name: "Brand kit", values: { DealPilot: true, Proposify: true, PandaDoc: true, HoneyBook: true } },
  { name: "Built for solo freelancers", values: { DealPilot: true, Proposify: false, PandaDoc: false, HoneyBook: "Partial" } },
];

/* ── Testimonials ─────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: "I cancelled Proposify, HelloSign, and my invoicing app the same week I found DealPilot. Everything I need is in one place for a fraction of the cost.", name: "Aisha K.", role: "Brand Strategist" },
  { quote: "As a solo developer, I don't need team features or approval workflows. DealPilot gets that. It's fast, simple, and the AI saves me hours every week.", name: "Daniel R.", role: "Full-Stack Developer" },
  { quote: "The client portal alone is worth it. My clients love having one link for files, invoices, and contracts. It looks so professional.", name: "Sophie M.", role: "Interior Design Consultant" },
];

export default function ProposalSoftwareForFreelancersPage() {
  return (
    <>
      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <LandingHero
        tag="Built for Freelancers, Not Enterprises"
        title={
          <>
            The Only Proposal Software{" "}
            <span style={{ color: "#bae6fd" }}>Built for Freelancers</span>
          </>
        }
        subtitle="Stop overpaying for enterprise proposal tools you don't need. DealPilot combines AI proposals, contracts, e-signatures, client portals, and payments in one platform -- starting free."
        primaryCTA={{ text: "Start Free -- No Credit Card", href: "/sign-up" }}
        secondaryCTA={{ text: "Compare Plans", href: "/pricing" }}
        footnote="Free forever plan -- 5 proposals/mo -- No per-seat pricing"
      />

      {/* ── 2. Pain Points ─────────────────────────────────────── */}
      <section aria-label="Why generic tools fail freelancers" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Tag color="red" style={{ borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14, padding: "4px 16px" }}>
              The Problem
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Why Generic Proposal Software Fails Freelancers
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 600, margin: "0 auto" }}>
              Enterprise tools are built for sales teams. You need something different.
            </p>
          </div>

          <Row gutter={[28, 28]}>
            {PAIN_POINTS.map((point) => (
              <Col key={point.title} xs={24} sm={12}>
                <Card
                  style={{ borderRadius: 20, border: `1.5px solid ${point.border}`, background: point.color, height: "100%" }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div style={{ marginBottom: 16 }}>{point.icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>{point.title}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{point.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── 3. Built Different ─────────────────────────────────── */}
      <section aria-label="What makes DealPilot different" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Tag color="green" style={{ borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14, padding: "4px 16px" }}>
              The Solution
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              DealPilot Is Built Different
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 540, margin: "0 auto" }}>
              Freelancer-first means no bloat, no per-seat fees, and AI that does the writing for you.
            </p>
          </div>

          <Row gutter={[32, 32]}>
            {DIFFERENTIATORS.map((d) => (
              <Col key={d.title} xs={24} md={8}>
                <Card
                  style={{ borderRadius: 22, border: "1.5px solid #e2e8f0", height: "100%", textAlign: "center" }}
                  styles={{ body: { padding: 36 } }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f0f9ff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    {d.icon}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>{d.title}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── 4. Full Feature Showcase ──────────────────────────── */}
      <FeatureShowcase
        sectionTitle="Everything a Freelancer Needs -- Nothing You Don't"
        sectionSubtitle="Eight powerful features that replace your entire tool stack."
        features={FEATURES}
      />

      {/* ── 5. Comparison Table ───────────────────────────────── */}
      <section aria-label="Comparison" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              DealPilot vs. Proposify vs. PandaDoc vs. HoneyBook
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 580, margin: "0 auto" }}>
              See how the only freelancer-first proposal software compares to enterprise alternatives.
            </p>
          </div>
          <ComparisonTable competitors={COMPETITORS} features={COMPARISON_FEATURES} />
        </div>
      </section>

      {/* ── 6. Pricing ────────────────────────────────────────── */}
      <PricingPreview />

      {/* ── 7. Social Proof ───────────────────────────────────── */}
      <SocialProof
        title="Freelancers Who Switched Never Look Back"
        subtitle="Real feedback from freelancers who replaced expensive enterprise tools with DealPilot."
        testimonials={TESTIMONIALS}
      />

      {/* ── 8. CTA ────────────────────────────────────────────── */}
      <CTASection
        title="Your Proposal Software Shouldn't Cost More Than Your Coffee"
        subtitle="AI proposals, contracts, e-signatures, client portals, and payments -- all in one platform built for solo freelancers. Start free today."
        buttonText="Start Free -- 60-Second Setup"
        buttonHref="/sign-up"
        footnote="Free forever -- No credit card -- No per-seat fees"
      />
    </>
  );
}
