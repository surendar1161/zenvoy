"use client";

import { Card, Col, Row, Space, Tag, Typography, Button } from "antd";
import {
  ThunderboltFilled, CheckCircleFilled, AppstoreOutlined,
  FileTextOutlined, OrderedListOutlined, DollarOutlined,
  ClockCircleOutlined, SafetyCertificateOutlined,
  RocketOutlined, ArrowRightOutlined, StarFilled,
  BulbOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import LandingHero from "@/components/marketing/LandingHero";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import SocialProof from "@/components/marketing/SocialProof";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Template Gallery ─────────────────────────────────────────── */
const TEMPLATES = [
  { name: "Web Development", icon: "🖥️", desc: "Scope, tech stack, sprints, hosting, and maintenance terms" },
  { name: "Graphic Design", icon: "🎨", desc: "Brand identity, deliverables, revision rounds, file formats" },
  { name: "Copywriting", icon: "✍️", desc: "Content strategy, word counts, SEO scope, revision policy" },
  { name: "Video Production", icon: "🎬", desc: "Pre-production, shoot days, editing rounds, licensing" },
  { name: "Photography", icon: "📸", desc: "Session details, deliverables, usage rights, retouching" },
  { name: "Social Media", icon: "📱", desc: "Platform strategy, posting cadence, analytics, content calendar" },
  { name: "SEO & SEM", icon: "🔍", desc: "Audit scope, keyword targets, reporting frequency, timeline" },
  { name: "Consulting", icon: "💼", desc: "Engagement scope, methodology, deliverables, retainer options" },
  { name: "Mobile App Dev", icon: "📲", desc: "Platform, features, milestones, testing, app store submission" },
  { name: "UI/UX Design", icon: "🎯", desc: "Research, wireframes, prototypes, user testing, handoff" },
  { name: "Email Marketing", icon: "📧", desc: "Campaign strategy, sequence design, A/B testing, reporting" },
  { name: "Illustration", icon: "🖌️", desc: "Style, quantity, revision rounds, licensing, file delivery" },
  { name: "Data Analytics", icon: "📊", desc: "Data sources, analysis scope, dashboard design, reporting" },
  { name: "Content Strategy", icon: "📝", desc: "Audit, content pillars, editorial calendar, KPIs" },
  { name: "E-commerce", icon: "🛒", desc: "Platform setup, product listings, payment, shipping config" },
  { name: "PR & Comms", icon: "📰", desc: "Media outreach, press releases, event coordination, reporting" },
  { name: "Virtual Assistant", icon: "⌨️", desc: "Task scope, availability, tools, communication protocols" },
  { name: "Podcast Production", icon: "🎙️", desc: "Recording, editing, show notes, distribution, monetisation" },
  { name: "Translation", icon: "🌐", desc: "Language pairs, word count, turnaround, specialisation areas" },
];

/* ── Template Sections Breakdown ──────────────────────────────── */
const TEMPLATE_SECTIONS = [
  {
    icon: <FileTextOutlined style={{ fontSize: 26, color: "#0ea5e9" }} />,
    title: "Scope of Work",
    desc: "A detailed breakdown of what you will deliver, written to set clear expectations and prevent scope creep.",
    color: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: <OrderedListOutlined style={{ fontSize: 26, color: "#7c3aed" }} />,
    title: "Deliverables & Milestones",
    desc: "Specific, numbered deliverables with milestone checkpoints so clients know exactly what they are getting and when.",
    color: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: <DollarOutlined style={{ fontSize: 26, color: "#10b981" }} />,
    title: "Pricing & Payment Terms",
    desc: "Good / Better / Best pricing tiers, optional add-ons checklist, deposit requirements, and milestone-based billing schedule.",
    color: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: <ClockCircleOutlined style={{ fontSize: 26, color: "#f59e0b" }} />,
    title: "Timeline & Schedule",
    desc: "Phase-by-phase timeline with start and end dates for each milestone, keeping projects on track from day one.",
    color: "#fffbeb",
    border: "#fde68a",
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 26, color: "#ef4444" }} />,
    title: "Terms & Conditions",
    desc: "Professional T&Cs covering intellectual property, revisions, cancellation, confidentiality, and payment terms.",
    color: "#fef2f2",
    border: "#fecaca",
  },
  {
    icon: <BulbOutlined style={{ fontSize: 26, color: "#6366f1" }} />,
    title: "About You / Why Me",
    desc: "A persuasive section showcasing your experience, process, and what makes you the right choice for this project.",
    color: "#eef2ff",
    border: "#c7d2fe",
  },
];

/* ── Comparison: Templates-only vs DealPilot ──────────────────── */
const COMPARISON_COMPETITORS = [
  { name: "DealPilot", highlight: true },
  { name: "Static Templates" },
];

const COMPARISON_FEATURES = [
  { name: "Template availability", values: { DealPilot: "19+ templates", "Static Templates": "Varies" } },
  { name: "Content generation", values: { DealPilot: "AI writes every section", "Static Templates": "You write everything" } },
  { name: "Client personalisation", values: { DealPilot: "AI mirrors client language", "Static Templates": "Manual find-and-replace" } },
  { name: "Job post parsing", values: { DealPilot: true, "Static Templates": false } },
  { name: "Tone control", values: { DealPilot: "3 tone styles", "Static Templates": false } },
  { name: "Section regeneration", values: { DealPilot: "3 AI alternatives", "Static Templates": false } },
  { name: "Pricing tiers", values: { DealPilot: "Good/Better/Best auto-formatted", "Static Templates": "Manual tables" } },
  { name: "E-signatures", values: { DealPilot: true, "Static Templates": false } },
  { name: "Proposal analytics", values: { DealPilot: "Real-time tracking", "Static Templates": false } },
  { name: "Client portal", values: { DealPilot: true, "Static Templates": false } },
  { name: "Payment links", values: { DealPilot: "Stripe auto-generated", "Static Templates": false } },
  { name: "Brand kit", values: { DealPilot: "Logo, colours, fonts", "Static Templates": "Manual branding" } },
];

/* ── Testimonials ─────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: "I used to spend 20 minutes customising a Google Docs template for every proposal. Now I pick a template, paste the job post, and the AI handles the rest in a minute.", name: "Chris W.", role: "Freelance Web Developer" },
  { quote: "The templates include sections I never thought to add -- like milestone breakdowns and T&Cs. They make me look way more professional than my old Word documents.", name: "Nina R.", role: "Graphic Designer" },
  { quote: "I love that the templates have industry-specific language. The copywriting template talks about tone, brand voice, and word counts -- things a generic template would never include.", name: "Tyler M.", role: "Content Strategist" },
];

export default function ProposalTemplatesPage() {
  return (
    <>
      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <LandingHero
        tag="Free for All Plans"
        title={
          <>
            19+ Professional Proposal Templates{" "}
            <span style={{ color: "#bae6fd" }}>for Every Industry</span>
          </>
        }
        subtitle="Start from an industry-specific template with pre-built sections for scope, deliverables, pricing, timeline, and terms. Then let AI personalise every word to your client and project."
        primaryCTA={{ text: "Browse Templates Free", href: "/sign-up" }}
        secondaryCTA={{ text: "See All Templates", href: "#template-gallery" }}
        footnote="All templates free -- No credit card -- AI-powered personalisation"
      />

      {/* ── 2. Template Gallery ────────────────────────────────── */}
      <section id="template-gallery" aria-label="Proposal template gallery" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Freelance Proposal Templates for Every Niche
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 600, margin: "0 auto" }}>
              Each template is tailored with industry-specific sections, language, and pricing structures. Pick one and the AI fills in the rest.
            </p>
          </div>

          <Row gutter={[16, 16]}>
            {TEMPLATES.map((t) => (
              <Col key={t.name} xs={12} sm={8} md={6}>
                <Card
                  hoverable
                  style={{ borderRadius: 16, border: "1.5px solid #e2e8f0", height: "100%", textAlign: "center", cursor: "default" }}
                  styles={{ body: { padding: 20 } }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: "#0f172a" }}>{t.name}</h4>
                  <Text style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{t.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/sign-up">
              <Button type="primary" size="large" icon={<AppstoreOutlined />}
                style={{ height: 52, paddingInline: 36, fontSize: 16, fontWeight: 700, borderRadius: 14, background: "#0ea5e9", borderColor: "#0ea5e9" }}>
                Start With Any Template Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. What's in Each Template ─────────────────────────── */}
      <section aria-label="What is in each proposal template" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Tag color="blue" style={{ borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14, padding: "4px 16px" }}>
              Template Structure
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              What's Inside Every Proposal Template
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Six professional sections that cover everything a client needs to see before saying yes.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {TEMPLATE_SECTIONS.map((s) => (
              <Col key={s.title} xs={24} sm={12} md={8}>
                <Card
                  style={{ borderRadius: 20, border: `1.5px solid ${s.border}`, background: s.color, height: "100%" }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div style={{ marginBottom: 16 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── 4. Templates Are Just the Start ────────────────────── */}
      <section aria-label="Templates plus AI" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Row gutter={[48, 40]} align="middle">
            <Col xs={24} md={12}>
              <Card
                style={{ borderRadius: 24, border: "1.5px solid #bfdbfe", background: "#eff6ff" }}
                styles={{ body: { padding: 36 } }}
              >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: "#0369a1", lineHeight: 1 }}>Template</div>
                  <div style={{ fontSize: 40, margin: "12px 0", color: "#0ea5e9" }}>+</div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: "#0369a1", lineHeight: 1 }}>AI</div>
                  <div style={{ fontSize: 40, margin: "12px 0", color: "#0ea5e9" }}>=</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#0c4a6e" }}>Winning Proposal</div>
                </div>
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  {[
                    "Structure from industry-specific templates",
                    "Content personalised by Claude AI",
                    "Client language mirrored from job post",
                    "Section-level AI regeneration",
                    "3 tone styles to match every client",
                  ].map((point) => (
                    <Space key={point} align="start" size={8}>
                      <CheckCircleFilled style={{ color: "#10b981", fontSize: 15, marginTop: 3, flexShrink: 0 }} />
                      <Text style={{ fontSize: 14 }}>{point}</Text>
                    </Space>
                  ))}
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Tag color="purple" style={{ borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14, padding: "4px 16px" }}>
                Beyond Static Templates
              </Tag>
              <h2 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
                Templates Are Just the Starting Point
              </h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>
                A template gives you structure. But you still have to write every word, customise every section, and tailor the proposal to each client manually. That takes 30-60 minutes per proposal.
              </p>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>
                DealPilot's AI reads your client's job post, understands the project requirements, and generates personalised content for every section -- using your template as the foundation. The result is a proposal that sounds hand-written but takes 60 seconds to create.
              </p>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 24px" }}>
                Don't settle for fill-in-the-blank. Get proposals that are both structured and intelligent.
              </p>
              <Link href="/sign-up">
                <Button type="primary" size="large" icon={<ThunderboltFilled />}
                  style={{ height: 50, paddingInline: 32, fontSize: 16, fontWeight: 700, borderRadius: 14, background: "#0ea5e9", borderColor: "#0ea5e9" }}>
                  Try AI + Templates Free
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      </section>

      {/* ── 5. Comparison Table ───────────────────────────────── */}
      <section aria-label="Templates vs DealPilot comparison" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Static Templates vs. DealPilot
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              See why combining templates with AI gives you proposals that win more clients.
            </p>
          </div>
          <ComparisonTable competitors={COMPARISON_COMPETITORS} features={COMPARISON_FEATURES} />
        </div>
      </section>

      {/* ── 6. Social Proof ───────────────────────────────────── */}
      <SocialProof
        title="Freelancers Love These Templates"
        subtitle="Real feedback from freelancers who upgraded from Google Docs templates to DealPilot."
        testimonials={TESTIMONIALS}
      />

      {/* ── 7. CTA ────────────────────────────────────────────── */}
      <CTASection
        emoji="📄"
        tagline="Template + AI = Done"
        title="Start with a Template, Finish with AI"
        subtitle="Pick from 19+ industry-specific proposal templates. Let Claude AI personalise every section to your client. Send a winning proposal in 60 seconds."
        buttonText="Browse Templates Free"
        buttonHref="/sign-up"
        footnote="All templates free -- No credit card -- AI personalisation included"
      />
    </>
  );
}
