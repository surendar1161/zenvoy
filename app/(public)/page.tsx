"use client";

import { useState } from "react";
import {
  Badge, Button, Card, Col, Collapse, Divider, Row, Space,
  Switch, Tag, Typography,
} from "antd";
import {
  CheckCircleFilled, ThunderboltFilled, ArrowRightOutlined,
  StarFilled, SafetyCertificateOutlined, GlobalOutlined,
  FileTextOutlined, CreditCardOutlined, TeamOutlined,
  BarChartOutlined, BgColorsOutlined, EditOutlined, MessageOutlined,
  DollarOutlined, LockOutlined, CalendarOutlined, AppstoreOutlined,
  CheckOutlined, CloseOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

// ── Data ─────────────────────────────────────────────────────

const STATS = [
  { value: "60s", label: "Average proposal generation time" },
  { value: "19+", label: "Industry templates" },
  { value: "15",  label: "Contract types" },
  { value: "43%", label: "Higher close rate with personalised proposals*" },
];

const PAIN_POINTS = [
  { quote: "Managing contracts, payments, and files is messy. I use Google Drive, email, and Wave and it looks so unprofessional.", author: "r/freelance", pain: "86/100" },
  { quote: "I hate chasing invoices for each phase. Automated milestone billing would save me hours every month.", author: "r/freelance", pain: "79/100" },
  { quote: "I just want to answer a few questions and have a branded PDF appear. That's the magic moment.", author: "r/freelance", pain: "91/100" },
];

const FEATURES = [
  {
    icon: <ThunderboltFilled style={{ fontSize: 28, color: "#0ea5e9" }} />,
    title: "AI Proposal Generation",
    desc: "Answer 5 questions and Claude Opus 4.6 writes a fully personalised, professional proposal in under 60 seconds. Paste a job post and the AI reads it, mirrors the client's language, and auto-fills your form.",
    points: ["5-question quick wizard", "Paste job post → auto-fill", "Professional · Friendly · Bold tone selector", "Section-level AI regeneration (3 alternatives)"],
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
    title: "15 AI Contract Types",
    desc: "Generate legally sound contracts for every engagement — from NDAs to franchise agreements. Jurisdiction-aware: applies the correct law for 249 countries and all US states automatically.",
    points: ["NDA, employment, SLA, retainer, sales, lease, loan, release & more", "Global jurisdiction (249 countries + US state-specific law)", "DTSA, FLSA, UCC, FTC compliance notes auto-applied", "Google Docs–style editor with auto-save"],
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: <EditOutlined style={{ fontSize: 28, color: "#10b981" }} />,
    title: "Digital E-Signatures",
    desc: "Legally binding e-signatures compliant with eIDAS (EU) and ESIGN Act (US). Clients can sign by typing their name or drawing on any device — no app download required. Timestamp, date, and IP address recorded for every signature.",
    points: ["Sign by typing or drawing on any device", "eIDAS & ESIGN Act compliant", "Timestamp, IP address, and location recorded", "Accept without signing option"],
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: <GlobalOutlined style={{ fontSize: 28, color: "#0369a1" }} />,
    title: "Branded Client Portal",
    desc: "One link. Everything in one place. Send clients a branded portal with your logo, colours, and domain — they access files, invoices, contracts, and can message you directly. No login required.",
    points: ["Files: upload and share documents, designs, contracts", "Invoices: create and track with Stripe Pay Now buttons", "Real-time chat — no email threads", "Fully branded with your logo and colours"],
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    icon: <CreditCardOutlined style={{ fontSize: 28, color: "#f59e0b" }} />,
    title: "Stripe Payment Links",
    desc: "Every proposal includes a Stripe payment link for the deposit — generated automatically. Set up Good / Better / Best pricing tiers and clients choose their package. Milestone-based billing splits payment across project phases.",
    points: ["Stripe deposit link auto-generated", "Good / Better / Best pricing tiers", "Optional add-ons checklist (total auto-updates)", "2–4 milestone payment links, each triggered automatically"],
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    icon: <BarChartOutlined style={{ fontSize: 28, color: "#ef4444" }} />,
    title: "Proposal Analytics & Tracking",
    desc: "Know exactly when your client opens a proposal, how long they spent on each section, and when they sign. Get notified instantly so you can follow up at the perfect moment.",
    points: ["Open tracking with real-time notifications", "Time spent per section", "View count and last-seen timestamp", "Sent · Viewed · Accepted · Signed pipeline"],
    bg: "#fff1f2",
    border: "#fecdd3",
  },
  {
    icon: <BgColorsOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
    title: "White-Label Brand Kit",
    desc: "Upload your logo, pick your brand colours, and choose your font. Every proposal, contract, and client portal auto-applies your brand. Clients never see DealPilot. Set up multiple brand profiles for different studios or clients.",
    points: ["Logo, colours, and font applied everywhere", "Cover page with client name auto-inserted", "5 professional Google Fonts included", "No DealPilot branding anywhere"],
    bg: "#faf5ff",
    border: "#e9d5ff",
  },
  {
    icon: <TeamOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
    title: "Client Management (CRM)",
    desc: "Track every client, their proposals, contracts, revenue, and activity in one place. Lightweight CRM built for freelancers — no complex setup, no sales funnel jargon.",
    points: ["Client profiles with contact info and status", "Lead · Active · Inactive · Churned pipeline", "Revenue and deal count per client", "Notes, tags, and activity timeline"],
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
];

const PROPOSAL_TYPES = [
  "Web Development", "Mobile App", "Branding & Identity", "UI/UX Design",
  "SEO & Marketing", "Copywriting", "Video Production", "Consulting",
  "Social Media", "Data Analysis",
];

const CONTRACT_TYPES = [
  { name: "NDA", hot: true }, { name: "Contractor Agreement", hot: true },
  { name: "Employment Contract", hot: false }, { name: "Service-Level Agreement", hot: false },
  { name: "Retainer Agreement", hot: false }, { name: "Sales Agreement", hot: false },
  { name: "Lease Agreement", hot: false }, { name: "Loan Agreement", hot: false },
  { name: "Partnership Agreement", hot: false }, { name: "Franchise Agreement", hot: false },
  { name: "Purchase Order", hot: false }, { name: "Release of Liability", hot: false },
];

const PLANS = [
  {
    name: "Free",
    monthlyPrice: 0, yearlyPrice: 0,
    color: "#64748b",
    features: ["5 proposals/month", "2 contracts/month", "All 15 contract types", "19+ templates", "Brand kit", "Stripe payment links", "Web proposal links"],
    missing: ["E-signatures", "Analytics", "Client portals", "Content library"],
  },
  {
    name: "Pro",
    monthlyPrice: 12, yearlyPrice: 9,
    color: "#0ea5e9",
    popular: true,
    features: ["Unlimited proposals & contracts", "Digital e-signatures", "Proposal analytics", "Client portals (files + invoices + chat)", "Content library", "Password protection & expiry", "White-label (no branding)", "Priority support"],
    missing: [],
  },
  {
    name: "Business",
    monthlyPrice: 29, yearlyPrice: 22,
    color: "#7c3aed",
    features: ["Everything in Pro", "5 team members", "Manager approvals", "Content locking", "API access", "Custom domain", "Dedicated onboarding call"],
    missing: [],
  },
];

const FAQ = [
  { q: "How does the AI generate proposals?", a: "DealPilot uses Claude Opus 4.6 — Anthropic's most capable model. You answer 5 questions (or paste a job post), and Claude writes a fully tailored proposal in under 60 seconds, mirroring the client's language and addressing their specific pain points." },
  { q: "Are the contracts legally binding?", a: "The AI-generated contracts follow correct legal frameworks (UCC for goods, ESIGN Act for e-signatures, state-specific non-compete law, etc.) and are reviewed against jurisdiction-specific requirements. However, we always recommend having any contract reviewed by a licensed attorney before signing — especially for high-value or complex engagements." },
  { q: "Do clients need to create an account to view my proposal?", a: "No. Clients access proposals and client portals via a unique link — no login, no app download, no friction. They can sign, pay, message you, and download files directly from the link." },
  { q: "Which payment providers are supported?", a: "Stripe for payment links on proposals and invoices. Chargebee for subscription billing (your own subscription to DealPilot). We plan to add PayPal and GoCardless." },
  { q: "Can I use my own branding?", a: "Yes — fully. Upload your logo, set your brand colours, and choose your font. Every proposal, contract, client portal, and cover page uses your brand. Clients never see DealPilot. Pro and Business plans include white-labelling." },
  { q: "What's the difference between a proposal and a contract?", a: "A proposal outlines your scope, pricing, and value proposition — it's a sales document. A contract is a legally binding agreement once signed. DealPilot generates both, and the e-signature flow can be applied to either." },
  { q: "Is there a free trial?", a: "The Free plan is permanently free — no credit card required. You get 5 proposals and 2 contracts per month. Upgrade to Pro ($12/mo) when you're ready for unlimited everything." },
  { q: "How does the client portal work?", a: "When you create a client portal, DealPilot generates a unique branded URL. Share it with your client. They see a dashboard with all shared files, invoices (with Pay Now buttons), signed contracts, and a live chat window to message you. Everything in one place, fully branded as your studio." },
];

const TESTIMONIALS = [
  { quote: "I used to spend 2 hours writing every proposal. Now I answer a few questions and it's done in 60 seconds. My win rate actually went up because the proposals are better than what I was writing.", name: "Marcus R.", role: "UX Designer, London" },
  { quote: "The client portal is a game changer. My clients used to email me for everything. Now they go to their portal and find the file themselves. I look so much more professional.", name: "Priya S.", role: "Freelance Copywriter, Bangalore" },
  { quote: "The milestone payment links are genius. I set it up once and the client pays each phase automatically. No more awkward payment chasing conversations.", name: "James T.", role: "Full-Stack Developer, Toronto" },
];

// ── Component ─────────────────────────────────────────────────

export default function LandingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <main>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        style={{ background: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)", padding: "90px 24px 120px", textAlign: "center", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} aria-hidden />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          {/* Brand name + tagline */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 700, color: "#7dd3fc", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              DEALPILOT
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 62px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 18px", letterSpacing: "-1.5px" }}>
            Your AI envoy.<br />
            <span style={{ color: "#7dd3fc" }}>Every client, every deal.</span>
          </h1>

          {/* Brand manifesto — one-liner */}
          <p style={{ fontSize: "clamp(16px, 2.2vw, 20px)", color: "rgba(255,255,255,0.95)", maxWidth: 660, margin: "0 auto 16px", lineHeight: 1.6, fontStyle: "italic", fontWeight: 400 }}>
            "DealPilot is your calm, intelligent representative — sent to every client on your behalf, closing deals while you focus on your craft."
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 }}>
            AI proposals in 60 seconds. Legally sound contracts. Branded client portals. Stripe payment links. All in one place.
          </p>

          <Space size={12} wrap style={{ justifyContent: "center" }}>
            <Link href="/sign-up">
              <Button type="primary" size="large" icon={<ThunderboltFilled />}
                style={{ height: 54, paddingInline: 36, fontSize: 17, fontWeight: 800, background: "#fff", color: "#0369a1", border: "none", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.22)" }}>
                Start Free — No Card Required
              </Button>
            </Link>
            <Link href="#features">
              <Button size="large"
                style={{ height: 54, paddingInline: 28, fontSize: 15, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", borderRadius: 14 }}>
                See All Features
              </Button>
            </Link>
          </Space>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 18 }}>Free plan: 5 proposals + 2 contracts / month. No credit card.</p>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section aria-label="Key stats" style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "28px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: "#0ea5e9", lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 4, maxWidth: 160 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEALPILOT MANIFESTO ───────────────────────────────── */}
      <section aria-label="What is DealPilot" style={{ background: "#fff", padding: "80px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Row gutter={[64, 48]} align="middle">
            <Col xs={24} md={12}>
              {/* Left: word breakdown */}
              <Tag style={{ marginBottom: 18, borderRadius: 20, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#0369a1", fontSize: 13, fontWeight: 700, padding: "4px 16px" }}>
                The name, explained
              </Tag>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: "0 0 28px", letterSpacing: "-0.8px", lineHeight: 1.15 }}>
                What does <span style={{ color: "#0ea5e9" }}>DealPilot</span> mean?
              </h2>

              {/* Deal block */}
              <div style={{ display: "flex", gap: 18, marginBottom: 24, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 26, color: "#fff" }}>🤝</span>
                </div>
                <div>
                  <Text strong style={{ fontSize: 18, display: "block", marginBottom: 4, color: "#0369a1" }}>Deal</Text>
                  <Text style={{ fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                    Every client engagement is a deal — a proposal to write, a contract to sign, a payment to collect. DealPilot is built around the entire deal lifecycle, from first pitch to final signature.
                  </Text>
                </div>
              </div>

              {/* Pilot block */}
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 24 }}>✈️</span>
                </div>
                <div>
                  <Text strong style={{ fontSize: 18, display: "block", marginBottom: 4, color: "#0369a1" }}>Pilot</Text>
                  <Text style={{ fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                    A pilot navigates complexity and lands safely — every time. Your AI co-pilot handles the proposals, contracts, and follow-ups while you stay in control of your craft and your clients.
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              {/* Right: manifesto card */}
              <div style={{
                background: "linear-gradient(145deg, #0c4a6e 0%, #0369a1 60%, #0ea5e9 100%)",
                borderRadius: 24,
                padding: "44px 40px",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Background pattern */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: 52, color: "rgba(255,255,255,0.3)", lineHeight: 1, marginBottom: 8, fontFamily: "Georgia, serif" }}>"</div>
                  <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", color: "#fff", fontWeight: 600, lineHeight: 1.6, margin: "0 0 28px", letterSpacing: "-0.2px" }}>
                    DealPilot is your AI co-pilot for closing deals — it writes the proposals, sends the contracts, and chases the signatures while you focus on your craft.
                  </p>
                  <div style={{ width: 48, height: 2, background: "rgba(255,255,255,0.4)", marginBottom: 20 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ThunderboltFilled style={{ color: "#fff", fontSize: 18 }} />
                    </div>
                    <div>
                      <Text style={{ color: "#fff", fontWeight: 700, fontSize: 15, display: "block" }}>DealPilot</Text>
                      <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>Your AI co-pilot. Every proposal, every close.</Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three pillars below card */}
              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                {[
                  { emoji: "🧘", title: "Zen", desc: "No more proposal anxiety" },
                  { emoji: "📨", title: "Envoy", desc: "Represents you professionally" },
                  { emoji: "🤝", title: "Close", desc: "Deals signed & paid, fast" },
                ].map(p => (
                  <Col key={p.title} span={8}>
                    <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 12px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{p.emoji}</div>
                      <Text strong style={{ fontSize: 13, display: "block" }}>{p.title}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>{p.desc}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </section>

      {/* ── PAIN POINTS ────────────────────────────────────── */}
      <section aria-label="Freelancer pain points" style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Tag color="red" style={{ borderRadius: 20, marginBottom: 14, fontSize: 13, padding: "3px 14px" }}>Real freelancer frustrations</Tag>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.5px" }}>Sound familiar?</h2>
            <p style={{ color: "#64748b", fontSize: 17 }}>Thousands of freelancers deal with this every week. DealPilot fixes all of it.</p>
          </div>
          <Row gutter={[24, 24]}>
            {PAIN_POINTS.map(p => (
              <Col key={p.author} xs={24} md={8}>
                <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 28 } }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontSize: 24, color: "#e2e8f0" }}>"</div>
                    <Tag color="red" style={{ borderRadius: 20, fontSize: 11 }}>Pain {p.pain}</Tag>
                  </div>
                  <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.65, margin: "0 0 16px", fontStyle: "italic" }}>{p.quote}</p>
                  <Text type="secondary" style={{ fontSize: 13 }}>— {p.author}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" aria-label="Product features" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>Everything a freelancer needs</h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 540, margin: "0 auto" }}>
              One platform replaces Google Drive, Wave, Docusign, Typeform, and half your email inbox.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
            {FEATURES.map((f, i) => (
              <Row key={f.title} gutter={[60, 40]} align="middle" style={{ flexDirection: i % 2 !== 0 ? "row-reverse" : "row" }}>
                <Col xs={24} md={12}>
                  <div style={{ background: f.bg, border: `1.5px solid ${f.border}`, borderRadius: 24, padding: "40px", height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ marginBottom: 16 }}>{f.icon}</div>
                      <div style={{ fontSize: 40, fontWeight: 900, color: "#0f172a" }}>{f.title}</div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <h3 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.3px" }}>{f.title}</h3>
                  <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, margin: "0 0 20px" }}>{f.desc}</p>
                  <Space direction="vertical" size={10} style={{ width: "100%" }}>
                    {f.points.map(pt => (
                      <Space key={pt} align="start" size={8}>
                        <CheckCircleFilled style={{ color: "#10b981", fontSize: 15, marginTop: 2, flexShrink: 0 }} />
                        <Text style={{ fontSize: 15 }}>{pt}</Text>
                      </Space>
                    ))}
                  </Space>
                </Col>
              </Row>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPOSAL TYPES ─────────────────────────────────── */}
      <section aria-label="Supported proposal types" style={{ background: "#f8fafc", padding: "80px 24px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px" }}>Works for every type of freelance work</h2>
          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 36 }}>19+ industry templates pre-filled with the right scope, deliverables, pricing, and tone for your profession.</p>
          <Space wrap style={{ justifyContent: "center" }}>
            {PROPOSAL_TYPES.map(t => (
              <Tag key={t} style={{ borderRadius: 24, padding: "7px 18px", fontSize: 14, fontWeight: 500, background: "#fff", border: "1.5px solid #e2e8f0" }}>{t}</Tag>
            ))}
          </Space>
        </div>
      </section>

      {/* ── CONTRACTS ──────────────────────────────────────── */}
      <section aria-label="Contract types" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>15 AI-generated contract types</h2>
              <p style={{ color: "#64748b", fontSize: 16, margin: 0 }}>Jurisdiction-aware. Compliance notes auto-applied. E-signature ready.</p>
            </div>
            <Link href="/sign-up"><Button type="primary" style={{ borderRadius: 10, fontWeight: 600 }}>Generate a Contract</Button></Link>
          </div>
          <Row gutter={[12, 12]}>
            {CONTRACT_TYPES.map(c => (
              <Col key={c.name} xs={12} sm={8} md={6}>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</Text>
                  {c.hot && <Tag color="red" style={{ borderRadius: 20, fontSize: 10, padding: "0 6px", margin: 0 }}>Hot</Tag>}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── CLIENT PORTAL CALLOUT ──────────────────────────── */}
      <section aria-label="Client portal feature" style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1)", padding: "90px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Row gutter={[60, 40]} align="middle">
            <Col xs={24} md={12}>
              <Tag style={{ marginBottom: 18, borderRadius: 20, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 13, padding: "4px 14px" }}>
                New Feature
              </Tag>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
                Your clients deserve a better experience
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.82)", lineHeight: 1.7, margin: "0 0 28px" }}>
                Send one link. Your client gets a branded portal with everything — files, invoices, contracts, and a direct message window. No email attachments, no confusing Google Drive folders, no hunting for that PDF.
              </p>
              <Space direction="vertical" size={12} style={{ marginBottom: 32 }}>
                {[
                  "Branded with your logo and colours",
                  "Files: upload, categorise, and share instantly",
                  "Invoices with Stripe Pay Now buttons",
                  "Real-time chat — no email threads",
                  "No client login required",
                ].map(pt => (
                  <Space key={pt} size={8}>
                    <CheckCircleFilled style={{ color: "#4ade80", fontSize: 16, flexShrink: 0 }} />
                    <Text style={{ color: "#fff", fontSize: 15 }}>{pt}</Text>
                  </Space>
                ))}
              </Space>
              <Link href="/sign-up">
                <Button size="large" icon={<ArrowRightOutlined />}
                  style={{ height: 52, paddingInline: 32, fontSize: 16, fontWeight: 700, background: "#fff", color: "#0369a1", border: "none", borderRadius: 12 }}>
                  Create Your First Portal
                </Button>
              </Link>
            </Col>
            <Col xs={24} md={12}>
              {/* Portal preview mockup */}
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}>
                <div style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)", padding: "20px 24px 0" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>A</div>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Acme Corp</div>
                      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Website Redesign — Project Hub</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {["Overview","Files","Invoices","Messages"].map(tab => (
                      <div key={tab} style={{ padding: "8px 14px", background: tab === "Overview" ? "#fff" : "rgba(255,255,255,0.15)", borderRadius: "8px 8px 0 0", fontSize: 12, fontWeight: 600, color: tab === "Overview" ? "#0369a1" : "rgba(255,255,255,0.85)" }}>{tab}</div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                    {[{ icon: "📎", label: "3 Files" }, { icon: "💰", label: "2 Invoices" }, { icon: "💬", label: "4 Messages" }, { icon: "✅", label: "1 Signed" }].map(s => (
                      <div key={s.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{s.icon}</span>
                        <Text style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</Text>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>⚠️ Outstanding Invoice</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ fontSize: 12 }}>Phase 2 — Design</Text>
                      <Button size="small" type="primary" style={{ background: "#0ea5e9", borderColor: "#0ea5e9", borderRadius: 6, fontSize: 11, height: 24 }}>Pay $2,500</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section aria-label="Customer testimonials" style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", margin: "0 0 12px" }}>Freelancers who switched</h2>
          <p style={{ color: "#64748b", fontSize: 16, textAlign: "center", marginBottom: 48 }}>From proposal stress to client confidence.</p>
          <Row gutter={[24, 24]}>
            {TESTIMONIALS.map(t => (
              <Col key={t.name} xs={24} md={8}>
                <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 28 } }}>
                  <Space style={{ marginBottom: 16 }}>
                    {[1,2,3,4,5].map(n => <StarFilled key={n} style={{ color: "#f59e0b", fontSize: 14 }} />)}
                  </Space>
                  <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>"{t.quote}"</p>
                  <Divider style={{ margin: "0 0 16px" }} />
                  <Text strong style={{ display: "block" }}>{t.name}</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>{t.role}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section id="pricing" aria-label="Pricing plans" style={{ background: "#fff", padding: "90px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.5px" }}>Simple, transparent pricing</h2>
            <p style={{ color: "#64748b", fontSize: 16, marginBottom: 28 }}>Start free. Upgrade when you're ready. No hidden fees.</p>
            <Space align="center" size={12}>
              <Text style={{ fontWeight: yearly ? 400 : 700 }}>Monthly</Text>
              <Switch checked={yearly} onChange={setYearly} style={{ background: yearly ? "#0ea5e9" : "#94a3b8" }} />
              <Text style={{ fontWeight: yearly ? 700 : 400 }}>
                Yearly
                <Tag color="green" style={{ marginLeft: 8, borderRadius: 20, fontSize: 11 }}>Save 25%</Tag>
              </Text>
            </Space>
          </div>
          <Row gutter={[20, 20]}>
            {PLANS.map(plan => {
              const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <Col key={plan.name} xs={24} md={8}>
                  <Card
                    style={{
                      borderRadius: 20,
                      border: `2px solid ${plan.popular ? plan.color : "#e2e8f0"}`,
                      height: "100%",
                      boxShadow: plan.popular ? `0 12px 40px ${plan.color}20` : undefined,
                    }}
                    styles={{ body: { padding: 28 } }}
                  >
                    {plan.popular && (
                      <div style={{ background: plan.color, color: "#fff", textAlign: "center", fontSize: 12, fontWeight: 700, padding: "4px 0", margin: "-28px -28px 20px", borderRadius: "18px 18px 0 0" }}>
                        ⭐ Most Popular
                      </div>
                    )}
                    <Text strong style={{ fontSize: 18, display: "block", marginBottom: 4 }}>{plan.name}</Text>
                    <div style={{ marginBottom: 20 }}>
                      <span style={{ fontSize: 48, fontWeight: 900, color: "#0f172a" }}>${price}</span>
                      <span style={{ color: "#94a3b8" }}>/mo</span>
                      {yearly && price > 0 && <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Billed ${price * 12}/year</Text>}
                    </div>
                    <Link href={`/sign-up?plan=${plan.name.toLowerCase()}&period=${yearly ? "yearly" : "monthly"}`}>
                      <Button type={plan.popular ? "primary" : "default"} block size="large"
                        style={{ borderRadius: 12, height: 46, fontWeight: 700, marginBottom: 24, ...(plan.popular ? { background: plan.color, borderColor: plan.color } : {}) }}>
                        {plan.name === "Free" ? "Start Free" : `Get ${plan.name}`}
                      </Button>
                    </Link>
                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                      {plan.features.map(f => (
                        <Space key={f} size={7}>
                          <CheckOutlined style={{ color: "#10b981", fontSize: 13, flexShrink: 0 }} />
                          <Text style={{ fontSize: 13 }}>{f}</Text>
                        </Space>
                      ))}
                      {plan.missing.map(f => (
                        <Space key={f} size={7}>
                          <CloseOutlined style={{ color: "#e2e8f0", fontSize: 13, flexShrink: 0 }} />
                          <Text type="secondary" style={{ fontSize: 13 }}>{f}</Text>
                        </Space>
                      ))}
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Cancel anytime · No hidden fees · All plans include Claude Opus 4.6
            </Text>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section aria-label="Frequently asked questions" style={{ background: "#f8fafc", padding: "80px 24px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>Frequently Asked Questions</h2>
          <p style={{ color: "#64748b", fontSize: 16, textAlign: "center", marginBottom: 40 }}>Everything you need to know before signing up.</p>
          <Collapse
            accordion
            bordered={false}
            style={{ background: "transparent" }}
            items={FAQ.map((item, i) => ({
              key: String(i),
              label: <Text strong style={{ fontSize: 15 }}>{item.q}</Text>,
              children: <Paragraph style={{ color: "#475569", margin: 0, lineHeight: 1.7 }}>{item.a}</Paragraph>,
              style: { marginBottom: 10, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" },
            }))}
          />
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section aria-label="Call to action" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Card
            style={{ borderRadius: 28, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", border: "none", boxShadow: "0 24px 80px rgba(14,165,233,0.3)" }}
            styles={{ body: { padding: "60px 48px" } }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📨</div>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
              Your AI envoy. Every client, every deal.
            </Text>
            <h2 style={{ color: "#fff", fontSize: 34, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
              Close your next deal with DealPilot.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 17, lineHeight: 1.65, margin: "0 0 36px" }}>
              Generate your first AI proposal in 60 seconds. No credit card, no setup, no commitment. Join 1,200+ freelancers who let DealPilot do the pitching.
            </p>
            <Link href="/sign-up">
              <Button size="large" icon={<ArrowRightOutlined />}
                style={{ height: 56, paddingInline: 42, fontSize: 17, fontWeight: 800, background: "#fff", color: "#0369a1", border: "none", borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                Start for Free — 60-second setup
              </Button>
            </Link>
            <div style={{ marginTop: 20, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
              Free forever plan · No credit card · Instant access
            </div>
          </Card>
        </div>
      </section>

      {/* Footnote */}
      <div style={{ textAlign: "center", padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <Text type="secondary" style={{ fontSize: 12 }}>*Proposify 2025 data: personalised proposals close 43% more deals. AI generation time based on average of 1,200 real proposals.</Text>
      </div>
    </main>
  );
}
