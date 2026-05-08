"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  ThunderboltFilled, FileTextOutlined, SendOutlined,
  ClockCircleOutlined, CheckCircleFilled, EditOutlined,
  BulbOutlined, AppstoreOutlined, SyncOutlined,
  RocketOutlined, BarChartOutlined, StarFilled,
} from "@ant-design/icons";
import Link from "next/link";

import LandingHero from "@/components/marketing/LandingHero";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── How-It-Works Steps ──────────────────────────────────────── */
const STEPS = [
  {
    num: "1",
    icon: <FileTextOutlined style={{ fontSize: 32, color: "#0ea5e9" }} />,
    title: "Paste the Job Post",
    desc: "Copy-paste a job description from Upwork, LinkedIn, or any platform. DealPilot's AI reads every line, extracts scope, budget signals, timeline, and client language.",
    color: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    num: "2",
    icon: <ThunderboltFilled style={{ fontSize: 32, color: "#7c3aed" }} />,
    title: "AI Writes Your Proposal",
    desc: "Claude Opus 4.6 generates a fully personalised proposal with scope of work, deliverables, pricing tiers, timeline, and terms and conditions -- all in your brand voice.",
    color: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    num: "3",
    icon: <SendOutlined style={{ fontSize: 32, color: "#10b981" }} />,
    title: "Review, Tweak & Send",
    desc: "Fine-tune any section with one click. Regenerate individual paragraphs, adjust your tone, and send a branded proposal link or download a polished PDF.",
    color: "#f0fdf4",
    border: "#bbf7d0",
  },
];

/* ── Before vs After ─────────────────────────────────────────── */
const BEFORE_ITEMS = [
  { label: "Time per proposal", value: "45-90 min" },
  { label: "Personalisation", value: "Copy-paste boilerplate" },
  { label: "Pricing presentation", value: "Single flat rate" },
  { label: "Follow-up timing", value: "Guesswork" },
  { label: "Brand consistency", value: "Inconsistent every time" },
  { label: "Close rate", value: "~15-20%" },
];

const AFTER_ITEMS = [
  { label: "Time per proposal", value: "Under 60 seconds" },
  { label: "Personalisation", value: "Mirrors client language" },
  { label: "Pricing presentation", value: "Good / Better / Best tiers" },
  { label: "Follow-up timing", value: "Real-time open alerts" },
  { label: "Brand consistency", value: "Locked brand kit" },
  { label: "Close rate", value: "~43% higher*" },
];

/* ── AI Features ─────────────────────────────────────────────── */
const AI_FEATURES = [
  {
    icon: <BulbOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />,
    title: "Intelligent Tone Control",
    desc: "Choose Professional, Friendly, or Bold -- the AI adapts vocabulary, sentence length, and persuasion style to match.",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: <AppstoreOutlined style={{ fontSize: 24, color: "#7c3aed" }} />,
    title: "19+ Industry Templates",
    desc: "Start from a template for web development, design, marketing, copywriting, consulting, photography, and more. Each includes industry-specific sections.",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: <SyncOutlined style={{ fontSize: 24, color: "#10b981" }} />,
    title: "Section-Level Regeneration",
    desc: "Unhappy with the scope section? Hit regenerate and get 3 AI-written alternatives without redoing the whole proposal.",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: <EditOutlined style={{ fontSize: 24, color: "#f59e0b" }} />,
    title: "Job Post Parsing",
    desc: "Paste a job listing and the AI extracts project requirements, budget signals, timeline, and deliverables -- then auto-fills your proposal form.",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

/* ── Stats ────────────────────────────────────────────────────── */
const STATS = [
  { value: "60s", label: "Average AI generation time", icon: <ClockCircleOutlined style={{ fontSize: 22, color: "#0ea5e9" }} /> },
  { value: "19+", label: "Industry-specific templates", icon: <AppstoreOutlined style={{ fontSize: 22, color: "#7c3aed" }} /> },
  { value: "43%", label: "Higher close rate*", icon: <BarChartOutlined style={{ fontSize: 22, color: "#10b981" }} /> },
  { value: "5", label: "Questions to a full proposal", icon: <RocketOutlined style={{ fontSize: 22, color: "#f59e0b" }} /> },
];

/* ── Testimonials ─────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: "I used to spend an hour per proposal. Now I paste the job post and DealPilot writes something better than I ever could in under a minute.", name: "Marcus T.", role: "Freelance Web Developer" },
  { quote: "The tone control is a game-changer. I sound professional for corporate clients and casual for startups -- without rewriting a thing.", name: "Priya S.", role: "UX Design Consultant" },
  { quote: "My close rate went from 18% to 31% in the first month. The AI personalisation makes every proposal feel hand-crafted.", name: "Jordan L.", role: "Marketing Freelancer" },
];

/* ── FAQs ─────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Which AI model does DealPilot use?", a: "DealPilot uses Anthropic's Claude Opus 4.6, one of the most capable language models available. It excels at following instructions, matching tone, and producing well-structured professional writing -- perfect for client-facing proposals." },
  { q: "Will the AI-generated proposal sound generic?", a: "No. The AI mirrors the client's own language from the job post you paste, uses your brand kit (colors, logo, tone), and adapts to your chosen tone style. Every proposal reads as uniquely written for that specific opportunity." },
  { q: "Can I edit what the AI writes?", a: "Absolutely. You can edit any text directly, regenerate individual sections with 3 alternative versions, change the tone, and adjust pricing -- all before sending. The AI gives you a strong first draft; you have full control over the final product." },
  { q: "How many proposals can I generate for free?", a: "The free plan includes 5 AI-generated proposals per month, plus access to all 19+ templates, a brand kit, and Stripe payment links. No credit card required to start." },
  { q: "Does the AI handle different industries?", a: "Yes. DealPilot includes 19+ industry-specific templates covering web development, graphic design, copywriting, video production, consulting, photography, social media management, and more. The AI adapts its language, deliverables, and pricing structure to each industry." },
  { q: "Is my data safe?", a: "Your data is encrypted in transit and at rest using Supabase with row-level security. We never use your proposals or client data to train AI models. Your content remains yours." },
];

export default function AIProposalGeneratorPage() {
  return (
    <>
      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <LandingHero
        tag="AI-Powered Proposal Writer"
        title={
          <>
            Generate Winning Proposals{" "}
            <span style={{ color: "#bae6fd" }}>in 60 Seconds</span> with AI
          </>
        }
        subtitle="Paste a job post. Answer 5 questions. Claude AI writes a fully personalised, professionally formatted proposal -- complete with scope, pricing tiers, timeline, and terms. Ready to send in under a minute."
        primaryCTA={{ text: "Generate Your First Proposal Free", href: "/sign-up" }}
        secondaryCTA={{ text: "See How It Works", href: "#how-it-works" }}
        footnote="Free forever plan -- No credit card required -- 60-second setup"
      />

      {/* ── 2. How It Works ────────────────────────────────────── */}
      <section id="how-it-works" aria-label="How it works" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Tag color="blue" style={{ borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14, padding: "4px 16px" }}>
              3-Step Process
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              How the AI Proposal Generator Works
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              From job post to polished proposal in three simple steps. No writing, no formatting, no stress.
            </p>
          </div>

          <Row gutter={[32, 32]}>
            {STEPS.map((step) => (
              <Col key={step.num} xs={24} md={8}>
                <Card
                  style={{ borderRadius: 22, border: `1.5px solid ${step.border}`, background: step.color, height: "100%", position: "relative", overflow: "hidden" }}
                  styles={{ body: { padding: 32 } }}
                >
                  <div style={{ position: "absolute", top: 16, right: 20, fontSize: 72, fontWeight: 900, color: step.border, opacity: 0.4, lineHeight: 1 }}>
                    {step.num}
                  </div>
                  <div style={{ marginBottom: 20 }}>{step.icon}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 10px" }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── 3. Before vs After ─────────────────────────────────── */}
      <section aria-label="Before and after comparison" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Before DealPilot vs. After DealPilot
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>
              See how AI proposal generation transforms your freelance workflow.
            </p>
          </div>

          <Row gutter={[32, 32]}>
            {/* Before Card */}
            <Col xs={24} md={12}>
              <Card
                style={{ borderRadius: 22, border: "2px solid #fecaca", background: "#fef2f2", height: "100%" }}
                styles={{ body: { padding: 32 } }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ClockCircleOutlined style={{ color: "#fff", fontSize: 18 }} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#991b1b" }}>Before</h3>
                </div>
                <Space direction="vertical" size={14} style={{ width: "100%" }}>
                  {BEFORE_ITEMS.map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #fecaca" }}>
                      <Text style={{ color: "#7f1d1d", fontSize: 14 }}>{item.label}</Text>
                      <Text strong style={{ color: "#991b1b", fontSize: 14 }}>{item.value}</Text>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>

            {/* After Card */}
            <Col xs={24} md={12}>
              <Card
                style={{ borderRadius: 22, border: "2px solid #bbf7d0", background: "#f0fdf4", height: "100%" }}
                styles={{ body: { padding: 32 } }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ThunderboltFilled style={{ color: "#fff", fontSize: 18 }} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#065f46" }}>After</h3>
                </div>
                <Space direction="vertical" size={14} style={{ width: "100%" }}>
                  {AFTER_ITEMS.map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #bbf7d0" }}>
                      <Text style={{ color: "#064e3b", fontSize: 14 }}>{item.label}</Text>
                      <Text strong style={{ color: "#065f46", fontSize: 14 }}>{item.value}</Text>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* ── 4. AI Features ─────────────────────────────────────── */}
      <section aria-label="AI proposal features" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              AI Proposal Generator Features
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Every feature is designed to help you write better proposals, faster.
            </p>
          </div>

          <Row gutter={[28, 28]}>
            {AI_FEATURES.map((feat) => (
              <Col key={feat.title} xs={24} sm={12}>
                <Card
                  style={{ borderRadius: 20, border: `1.5px solid ${feat.border}`, background: feat.bg, height: "100%" }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div style={{ marginBottom: 16 }}>{feat.icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>{feat.title}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{feat.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── 5. Stats Section ──────────────────────────────────── */}
      <section aria-label="Statistics" style={{ padding: "80px 24px", background: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Row gutter={[24, 32]}>
            {STATS.map((stat) => (
              <Col key={stat.label} xs={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: 10 }}>{stat.icon}</div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{stat.value}</div>
                  <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 6, display: "block" }}>{stat.label}</Text>
                </div>
              </Col>
            ))}
          </Row>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 32, marginBottom: 0 }}>
            *Based on industry benchmarks comparing personalised vs. generic proposals.
          </p>
        </div>
      </section>

      {/* ── 6. Social Proof ───────────────────────────────────── */}
      <SocialProof
        title="Freelancers Love the AI Proposal Generator"
        subtitle="Join thousands of freelancers who write proposals in seconds, not hours."
        testimonials={TESTIMONIALS}
      />

      {/* ── 7. FAQ ────────────────────────────────────────────── */}
      <FAQSection
        title="AI Proposal Generator FAQ"
        subtitle="Everything you need to know about generating proposals with AI."
        faqs={FAQS}
      />

      {/* ── 8. CTA ────────────────────────────────────────────── */}
      <CTASection
        title="Write Your Next Proposal in 60 Seconds"
        subtitle="Paste a job post, answer 5 questions, and let Claude AI generate a personalised, professional proposal. Free forever -- no credit card required."
        buttonText="Generate Your First Proposal Free"
        buttonHref="/sign-up"
      />
    </>
  );
}
