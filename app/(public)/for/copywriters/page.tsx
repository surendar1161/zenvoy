"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  EditOutlined,
  FileTextOutlined,
  MailOutlined,
  SearchOutlined,
  OrderedListOutlined,
  DollarOutlined,
  AlignLeftOutlined,
  ReadOutlined,
  SoundOutlined,
  BarChartOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Content deliverable scoping ─────────────────────────── */

const DELIVERABLE_TYPES = [
  {
    type: "Blog Posts & Articles",
    color: "#eff6ff",
    border: "#bfdbfe",
    icon: <ReadOutlined style={{ fontSize: 20, color: "#0ea5e9" }} />,
    items: [
      "4 blog posts/month, 1,500-2,500 words each",
      "SEO-optimised: target keyword, meta description, heading structure",
      "1 round of revisions included per article",
      "Publish-ready in WordPress or CMS of choice",
      "Internal linking strategy and CTA placement",
      "Featured image brief for designer (or AI-generated alt text)",
    ],
  },
  {
    type: "Website Copy",
    color: "#f0fdf4",
    border: "#bbf7d0",
    icon: <AlignLeftOutlined style={{ fontSize: 20, color: "#10b981" }} />,
    items: [
      "8 core pages: Home, About, Services (x4), Contact, FAQ",
      "Conversion-focused copy with clear CTAs per page",
      "Tone of voice guide adherence (or creation)",
      "SEO meta titles and descriptions for each page",
      "2 rounds of revisions per page",
      "Wireframe-aligned copy with section annotations",
    ],
  },
  {
    type: "Email Sequences",
    color: "#faf5ff",
    border: "#e9d5ff",
    icon: <MailOutlined style={{ fontSize: 20, color: "#7c3aed" }} />,
    items: [
      "Welcome sequence: 5-7 emails over 14 days",
      "Sales sequence: 4-6 emails with CTA progression",
      "Subject line A/B variants (2 per email)",
      "Personalisation tokens and segmentation notes",
      "Platform-ready: Mailchimp, ConvertKit, ActiveCampaign",
      "1 round of revisions per email",
    ],
  },
  {
    type: "SEO Content Strategy",
    color: "#fffbeb",
    border: "#fde68a",
    icon: <SearchOutlined style={{ fontSize: 20, color: "#f59e0b" }} />,
    items: [
      "Keyword research: 30 target keywords with volume and difficulty",
      "Content gap analysis vs. 3 competitors",
      "3-month editorial calendar with topic clusters",
      "Pillar page + supporting article architecture",
      "Monthly ranking and traffic projections",
      "Quarterly strategy review and adjustment",
    ],
  },
];

/* ── Word count and revision pricing ─────────────────────── */

const PRICING_EXAMPLES = [
  { deliverable: "Blog Post (1,500 words)", base: "$350", revision: "$75/round", turnaround: "5 business days" },
  { deliverable: "Long-Form Article (2,500 words)", base: "$550", revision: "$100/round", turnaround: "7 business days" },
  { deliverable: "Website Page Copy", base: "$400/page", revision: "$75/round", turnaround: "5 business days" },
  { deliverable: "Email Sequence (5 emails)", base: "$750", revision: "$50/email", turnaround: "7 business days" },
  { deliverable: "Landing Page Copy", base: "$500", revision: "$100/round", turnaround: "4 business days" },
  { deliverable: "Product Description (per SKU)", base: "$75", revision: "Included", turnaround: "2 business days" },
];

/* ── Content strategy preview ────────────────────────────── */

const STRATEGY_SECTIONS = [
  { label: "Brand Voice & Tone", desc: "Formal vs. conversational, jargon level, personality traits, competitor differentiation", icon: <SoundOutlined style={{ fontSize: 22, color: "#7c3aed" }} /> },
  { label: "Audience Personas", desc: "Demographics, pain points, reading habits, preferred content formats", icon: <ProfileOutlined style={{ fontSize: 22, color: "#0ea5e9" }} /> },
  { label: "Content Calendar", desc: "Weekly topics, keyword targets, funnel stage mapping, seasonal hooks", icon: <OrderedListOutlined style={{ fontSize: 22, color: "#10b981" }} /> },
  { label: "Deliverable Scope", desc: "Word counts, formats, revision rounds, turnaround times, file types", icon: <FileTextOutlined style={{ fontSize: 22, color: "#f59e0b" }} /> },
  { label: "SEO Strategy", desc: "Keyword clusters, pillar pages, internal linking, meta tag approach", icon: <SearchOutlined style={{ fontSize: 22, color: "#ef4444" }} /> },
  { label: "Investment & Timeline", desc: "Per-piece pricing, retainer packages, payment milestones, project timeline", icon: <DollarOutlined style={{ fontSize: 22, color: "#0369a1" }} /> },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function CopywritersPage() {
  return (
    <>
      {/* 1 · Hero */}
      <LandingHero
        tag="Copywriting Proposal Templates"
        title={
          <>
            Win more writing clients with
            <br />
            proposals that <span style={{ color: "#7dd3fc" }}>sell your words</span>
          </>
        }
        subtitle="Stop underselling your writing in a plain email. DealPilot generates copywriting proposals with content deliverables, word count pricing, revision terms, and tone of voice briefs — in 60 seconds."
        primaryCTA={{ text: "Create a Writing Proposal", href: "/sign-up" }}
        secondaryCTA={{ text: "Preview a Template", href: "/templates" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 · Content deliverable scoping */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ background: "#eff6ff", color: "#0369a1", border: "1px solid #bfdbfe", borderRadius: 20, fontWeight: 700, fontSize: 13, padding: "4px 14px", marginBottom: 14 }}>
              Built for writers
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Scope content deliverables like a pro
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 620, margin: "0 auto" }}>
              Blog posts, website copy, email sequences, SEO strategy — each deliverable type gets its own section with word counts, revision rounds, and turnaround times.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {DELIVERABLE_TYPES.map((section) => (
              <Card key={section.type} style={{ borderRadius: 20, border: `1.5px solid ${section.border}`, background: section.color }} styles={{ body: { padding: 32 } }}>
                <Space align="center" size={10} style={{ marginBottom: 16 }}>
                  {section.icon}
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{section.type}</h3>
                </Space>
                <Row gutter={[16, 10]}>
                  {section.items.map((item) => (
                    <Col xs={24} md={12} key={item}>
                      <Space align="start" size={8}>
                        <CheckCircleFilled style={{ color: "#10b981", fontSize: 14, marginTop: 3, flexShrink: 0 }} />
                        <Text style={{ fontSize: 15, color: "#334155" }}>{item}</Text>
                      </Space>
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Word count and revision pricing */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Transparent pricing by deliverable
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Per-piece pricing with word counts, revision costs, and turnaround times. No ambiguity — clients know exactly what they're paying for.
            </p>
          </div>

          <Card style={{ borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", gap: 16 }}>
              {["Deliverable", "Base Price", "Revisions", "Turnaround"].map((h) => (
                <Text key={h} strong style={{ fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</Text>
              ))}
            </div>
            {/* Table rows */}
            {PRICING_EXAMPLES.map((row, i) => (
              <div
                key={row.deliverable}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  padding: "16px 24px",
                  borderBottom: i < PRICING_EXAMPLES.length - 1 ? "1px solid #f1f5f9" : "none",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <Text strong style={{ fontSize: 15 }}>{row.deliverable}</Text>
                <Text style={{ fontSize: 15, color: "#0369a1", fontWeight: 700 }}>{row.base}</Text>
                <Text style={{ fontSize: 14, color: "#64748b" }}>{row.revision}</Text>
                <Text style={{ fontSize: 14, color: "#64748b" }}>{row.turnaround}</Text>
              </div>
            ))}
          </Card>

          <p style={{ textAlign: "center", fontSize: 14, color: "#94a3b8", marginTop: 16 }}>
            Example pricing — fully customisable per proposal. Set your own rates, word counts, and revision policies.
          </p>
        </div>
      </section>

      {/* 4 · Content strategy proposal preview */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              What your writing proposal includes
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Every section is AI-generated from your project details. Customize anything, regenerate sections, export to PDF.
            </p>
          </div>

          <Row gutter={[20, 20]}>
            {STRATEGY_SECTIONS.map((item) => (
              <Col xs={24} md={12} key={item.label}>
                <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 24 } }}>
                  <Space align="start" size={14}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>{item.label}</Text>
                      <Text style={{ fontSize: 14, color: "#64748b" }}>{item.desc}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 5 · Key features for copywriters */}
      <FeatureShowcase
        sectionTitle="Features writers actually need"
        sectionSubtitle="Tone of voice, word counts, revision rounds — not project management jargon."
        features={[
          {
            icon: <EditOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
            title: "Revision Round Pricing",
            desc: "Define included revisions per deliverable and price extras clearly. Clients know upfront: 1 round is included, additional rounds are $75 each. No awkward scope creep conversations.",
            points: [
              "Set revision rounds per deliverable type",
              "Price additional revisions per round or per hour",
              "Revision policy auto-included in contract terms",
              "Clear sign-off process for final approval",
            ],
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            icon: <SoundOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
            title: "Tone of Voice Brief",
            desc: "Include a tone of voice section in every proposal. Define personality traits, formality level, jargon policy, and brand voice examples — so the client knows what they're getting before you write a word.",
            points: [
              "Tone descriptors: professional, witty, conversational, bold",
              "Do's and don'ts for brand voice",
              "Competitor voice comparison",
              "Sample sentences in the proposed tone",
            ],
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
          {
            icon: <BarChartOutlined style={{ fontSize: 28, color: "#10b981" }} />,
            title: "Retainer Packages",
            desc: "Present monthly retainer options with defined content volume: 4 blogs/month, 2 emails/week, 1 landing page/quarter. Clients pick a package, Stripe handles recurring billing.",
            points: [
              "Good / Better / Best content retainer tiers",
              "Monthly content volume clearly defined",
              "Auto-recurring Stripe billing",
              "Quarterly content performance reviews",
            ],
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
        ]}
      />

      {/* 6 · Social Proof */}
      <SocialProof
        title="What copywriters say"
        subtitle="Join writers who win more clients with proposals that prove their value."
        testimonials={[
          {
            quote: "I was pitching $5K content retainers over email with no structure. Now I send a branded proposal with deliverables, word counts, revision terms, and payment links. My average project value went up 60% because clients take me seriously.",
            name: "Hannah R.",
            role: "Content Strategist & Copywriter",
          },
          {
            quote: "The tone of voice brief section is brilliant. Clients see exactly what their brand will sound like before I write a single word. It eliminates the 'this doesn't feel right' feedback loop.",
            name: "Alex M.",
            role: "Brand Copywriter, Freelance",
          },
          {
            quote: "I used to dread writing proposals more than writing the actual content. Now it takes me 10 minutes. The AI nails the scope, pricing, and terms. I just tweak a few lines and send.",
            name: "Priya S.",
            role: "SEO Content Writer",
          },
        ]}
      />

      {/* 7 · FAQ */}
      <FAQSection
        title="Copywriting proposal FAQs"
        subtitle="Questions from freelance writers, content strategists, and SEO copywriters."
        faqs={[
          {
            q: "Can I price by word count, per piece, or on retainer?",
            a: "Yes, all three. Set per-word rates (e.g., $0.25/word), per-piece pricing (e.g., $350/blog post), or monthly retainer packages with defined content volume. Mix and match within the same proposal.",
          },
          {
            q: "How do I handle revision rounds in the proposal?",
            a: "You define how many revisions are included per deliverable (e.g., 1 round for blog posts, 2 for website copy). Additional revisions are priced per round. The revision policy is auto-included in the contract terms the client signs.",
          },
          {
            q: "Can I include a tone of voice or brand voice brief?",
            a: "Yes. The proposal includes a tone of voice section where you define personality traits, formality level, jargon policy, and sample sentences. Clients approve the voice direction before you start writing.",
          },
          {
            q: "Does it support SEO content strategy proposals?",
            a: "Absolutely. Include keyword research, content gap analysis, editorial calendars, topic clusters, and ranking projections. The AI generates these sections based on your project description.",
          },
          {
            q: "Can I present multiple content packages?",
            a: "Yes. Use Good / Better / Best pricing tiers — for example: 4 blogs/month ($1,400), 8 blogs + email sequence ($2,800), full content retainer with strategy ($4,500). Clients pick the package that fits.",
          },
          {
            q: "How do clients approve and pay?",
            a: "Clients receive a single link to your branded portal. They review the proposal, e-sign the contract, and pay the deposit via Stripe — all in one place, no account creation required.",
          },
        ]}
      />

      {/* 8 · CTA */}
      <CTASection
        title="Stop pitching writing projects over email"
        subtitle="Generate a copywriting proposal with content deliverables, word count pricing, revision terms, and tone of voice briefs — in 60 seconds. Free forever."
        buttonText="Create Your Writing Proposal"
        buttonHref="/sign-up"
      />
    </>
  );
}
