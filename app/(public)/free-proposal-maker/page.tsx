"use client";

import { Card, Col, Row, Space, Tag, Typography, Button } from "antd";
import {
  ThunderboltFilled, CheckCircleFilled, GiftOutlined,
  FileTextOutlined, SendOutlined, CrownOutlined,
  BgColorsOutlined, CreditCardOutlined, AppstoreOutlined,
  SafetyCertificateOutlined, RocketOutlined, StarFilled,
  ArrowRightOutlined, CloseOutlined, CheckOutlined,
  BulbOutlined, BarChartOutlined, EditOutlined, GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import LandingHero from "@/components/marketing/LandingHero";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── What's Free ──────────────────────────────────────────────── */
const FREE_FEATURES = [
  { icon: <ThunderboltFilled style={{ fontSize: 22, color: "#0ea5e9" }} />, label: "5 AI proposals per month", included: true },
  { icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: "#7c3aed" }} />, label: "2 AI contracts per month", included: true },
  { icon: <AppstoreOutlined style={{ fontSize: 22, color: "#10b981" }} />, label: "All 19+ industry templates", included: true },
  { icon: <BgColorsOutlined style={{ fontSize: 22, color: "#ec4899" }} />, label: "Full brand kit (logo, colours)", included: true },
  { icon: <CreditCardOutlined style={{ fontSize: 22, color: "#f59e0b" }} />, label: "Stripe payment links", included: true },
  { icon: <FileTextOutlined style={{ fontSize: 22, color: "#6366f1" }} />, label: "All 15 contract types", included: true },
];

/* ── Template Preview ─────────────────────────────────────────── */
const TEMPLATES = [
  { name: "Web Development", icon: "🖥️", desc: "Full-stack, frontend, backend, and WordPress proposals" },
  { name: "Graphic Design", icon: "🎨", desc: "Brand identity, logos, print, and packaging" },
  { name: "Copywriting", icon: "✍️", desc: "Blog posts, website copy, email sequences" },
  { name: "Video Production", icon: "🎬", desc: "Explainers, commercials, social media video" },
  { name: "Social Media", icon: "📱", desc: "Management, strategy, content calendars" },
  { name: "Consulting", icon: "💼", desc: "Business, IT, management, and HR consulting" },
  { name: "Photography", icon: "📸", desc: "Event, product, portrait, and real estate" },
  { name: "SEO & Marketing", icon: "📊", desc: "SEO audits, PPC campaigns, email marketing" },
];

/* ── How It Works ─────────────────────────────────────────────── */
const STEPS = [
  {
    num: "1",
    icon: <GiftOutlined style={{ fontSize: 32, color: "#0ea5e9" }} />,
    title: "Sign Up Free",
    desc: "Create your account in 60 seconds. No credit card, no trial expiry, no strings attached. Your free plan never expires.",
    color: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    num: "2",
    icon: <ThunderboltFilled style={{ fontSize: 32, color: "#7c3aed" }} />,
    title: "Choose a Template or Paste a Job Post",
    desc: "Pick from 19+ industry templates, or paste a job listing and let the AI extract everything automatically. Answer 5 quick questions to personalise.",
    color: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    num: "3",
    icon: <SendOutlined style={{ fontSize: 32, color: "#10b981" }} />,
    title: "Send Your Professional Proposal",
    desc: "Review the AI-generated proposal, tweak anything you want, and send via a branded link or download as a polished PDF.",
    color: "#f0fdf4",
    border: "#bbf7d0",
  },
];

/* ── Pro Upgrade Comparison ──────────────────────────────────── */
const PLAN_COMPARISON = [
  { feature: "AI proposals", free: "5/month", pro: "Unlimited" },
  { feature: "AI contracts", free: "2/month", pro: "Unlimited" },
  { feature: "Templates", free: "All 19+", pro: "All 19+" },
  { feature: "Brand kit", free: true, pro: true },
  { feature: "Stripe payment links", free: true, pro: true },
  { feature: "Digital e-signatures", free: false, pro: true },
  { feature: "Proposal analytics", free: false, pro: true },
  { feature: "Client portals", free: false, pro: true },
  { feature: "Content library", free: false, pro: true },
  { feature: "White-label branding", free: false, pro: true },
];

/* ── FAQs ─────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Is the free plan really free forever?", a: "Yes. There is no trial period. Your free plan includes 5 AI proposals per month, 2 AI contracts per month, all 19+ templates, a full brand kit, and Stripe payment links. It never expires and we never ask for a credit card to start." },
  { q: "What happens when I hit the free plan limit?", a: "When you use all 5 proposals or 2 contracts in a month, you can wait for the next month (limits reset on the 1st) or upgrade to Pro for $12/month for unlimited usage. Your existing proposals and contracts remain accessible." },
  { q: "Do free proposals have a watermark?", a: "No. Free-plan proposals look identical to paid-plan proposals -- fully branded with your logo and colours, no DealPilot watermark or branding. Your clients will never know you're on the free plan." },
  { q: "Can I download proposals as PDF on the free plan?", a: "Yes. You can send proposals via a branded link or download them as a professionally formatted PDF on every plan, including free." },
  { q: "What's included in the brand kit?", a: "The brand kit lets you upload your logo, set brand colours, add your business name and tagline, and configure your contact information. Once set, every proposal and contract uses your branding automatically." },
  { q: "Do I need to enter payment information?", a: "No. The free plan requires only an email address to start. We never ask for a credit card, and you can use the free plan indefinitely." },
  { q: "Can I use my own Stripe account?", a: "Yes. Connect your own Stripe account to generate payment links in your proposals. Clients pay you directly -- DealPilot never touches your funds." },
];

export default function FreeProposalMakerPage() {
  return (
    <>
      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <LandingHero
        tag="100% Free -- No Credit Card Required"
        title={
          <>
            Create Professional Proposals —{" "}
            <span style={{ color: "#bae6fd" }}>Free, Forever</span>
          </>
        }
        subtitle="DealPilot's free proposal maker gives you AI-powered proposals, 19+ industry templates, a brand kit, and Stripe payment links -- all without ever entering a credit card. No trial. No watermarks. No catch."
        primaryCTA={{ text: "Sign Up Free -- 60 Seconds", href: "/sign-up" }}
        secondaryCTA={{ text: "See What's Included", href: "#whats-free" }}
        footnote="No credit card -- No watermarks -- No trial period"
      />

      {/* ── 2. What's Free ─────────────────────────────────────── */}
      <section id="whats-free" aria-label="What is included for free" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Tag color="green" style={{ borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14, padding: "4px 16px" }}>
              Free Forever
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Everything You Get on the Free Plan
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 540, margin: "0 auto" }}>
              No credit card. No trial countdown. These features are yours forever.
            </p>
          </div>

          <Card
            style={{ borderRadius: 24, border: "2px solid #bbf7d0", background: "#f0fdf4" }}
            styles={{ body: { padding: "40px 36px" } }}
          >
            <Row gutter={[24, 20]}>
              {FREE_FEATURES.map((f) => (
                <Col key={f.label} xs={24} sm={12}>
                  <Space size={12} align="start">
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 15, display: "block" }}>{f.label}</Text>
                      <Text style={{ fontSize: 13, color: "#10b981" }}>Included free</Text>
                    </div>
                  </Space>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link href="/sign-up">
                <Button type="primary" size="large" icon={<GiftOutlined />}
                  style={{ height: 52, paddingInline: 36, fontSize: 16, fontWeight: 800, borderRadius: 14, background: "#10b981", borderColor: "#10b981" }}>
                  Start Free -- No Credit Card
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ── 3. Template Preview Grid ──────────────────────────── */}
      <section aria-label="Free proposal templates" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              19+ Free Proposal Templates for Every Industry
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Start from a professionally designed template tailored to your industry. Every template is free.
            </p>
          </div>

          <Row gutter={[20, 20]}>
            {TEMPLATES.map((t) => (
              <Col key={t.name} xs={12} sm={8} md={6}>
                <Card
                  style={{ borderRadius: 18, border: "1.5px solid #e2e8f0", height: "100%", textAlign: "center", cursor: "default" }}
                  styles={{ body: { padding: 24 } }}
                  hoverable
                >
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{t.icon}</div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>{t.name}</h4>
                  <Text style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{t.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── 4. How It Works ────────────────────────────────────── */}
      <section aria-label="How it works" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Tag color="blue" style={{ borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14, padding: "4px 16px" }}>
              3-Step Process
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Create a Free Proposal in 3 Steps
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>
              From sign-up to sent proposal in under 2 minutes.
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

      {/* ── 5. Why Templates Aren't Enough ─────────────────────── */}
      <section aria-label="Why templates are not enough" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Row gutter={[48, 40]} align="middle">
            <Col xs={24} md={12}>
              <Tag color="purple" style={{ borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14, padding: "4px 16px" }}>
                Beyond Templates
              </Tag>
              <h2 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
                Why Templates Alone Aren't Enough
              </h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 20px" }}>
                Templates give you a starting structure, but you still have to write every word yourself. They can't read a job post, match the client's language, or personalise the scope of work. The result? Hours of manual editing and proposals that still sound generic.
              </p>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 24px" }}>
                DealPilot's free plan combines templates with AI -- so you get structure and personalised, client-specific content. Paste a job post, and the AI fills every section with language that mirrors what the client asked for.
              </p>
              <Link href="/sign-up">
                <Button type="primary" size="large" icon={<ThunderboltFilled />}
                  style={{ height: 50, paddingInline: 32, fontSize: 16, fontWeight: 700, borderRadius: 14, background: "#0ea5e9", borderColor: "#0ea5e9" }}>
                  Try AI Proposals Free
                </Button>
              </Link>
            </Col>
            <Col xs={24} md={12}>
              <Card
                style={{ borderRadius: 22, border: "1.5px solid #ddd6fe", background: "#f5f3ff" }}
                styles={{ body: { padding: 28 } }}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  {[
                    { icon: <BulbOutlined style={{ color: "#7c3aed" }} />, text: "AI reads the job post and auto-fills scope, deliverables, and timeline" },
                    { icon: <EditOutlined style={{ color: "#7c3aed" }} />, text: "Section-level regeneration -- get 3 alternatives for any paragraph" },
                    { icon: <StarFilled style={{ color: "#7c3aed" }} />, text: "Tone control: Professional, Friendly, or Bold" },
                    { icon: <BarChartOutlined style={{ color: "#7c3aed" }} />, text: "Upgrade to Pro for analytics, e-sigs, and portals when ready" },
                  ].map((item) => (
                    <Space key={item.text} align="start" size={12}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <Text style={{ fontSize: 15, lineHeight: 1.6 }}>{item.text}</Text>
                    </Space>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* ── 6. Free vs Pro Comparison ──────────────────────────── */}
      <section aria-label="Free vs Pro comparison" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Upgrade When You're Ready
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>
              The free plan is powerful on its own. Pro unlocks unlimited usage and advanced features.
            </p>
          </div>

          <Card style={{ borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 14, fontWeight: 700, color: "#334155" }}>Feature</th>
                    <th style={{ padding: "16px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#334155" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <GiftOutlined style={{ fontSize: 16, color: "#10b981" }} />
                        <span>Free</span>
                        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>$0/mo</span>
                      </div>
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "center", fontSize: 14, fontWeight: 800, color: "#0369a1", background: "#f0f9ff" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <CrownOutlined style={{ fontSize: 16, color: "#0ea5e9" }} />
                        <span>Pro</span>
                        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>$12/mo</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PLAN_COMPARISON.map((row, i) => (
                    <tr key={row.feature} style={{ borderBottom: i < PLAN_COMPARISON.length - 1 ? "1px solid #f1f5f9" : undefined }}>
                      <td style={{ padding: "13px 20px", fontSize: 14, color: "#475569" }}>{row.feature}</td>
                      <td style={{ padding: "13px 20px", textAlign: "center" }}>
                        {row.free === true ? (
                          <CheckCircleFilled style={{ color: "#10b981", fontSize: 18 }} />
                        ) : row.free === false ? (
                          <CloseOutlined style={{ color: "#e2e8f0", fontSize: 16 }} />
                        ) : (
                          <Text style={{ fontSize: 13, color: "#475569" }}>{row.free}</Text>
                        )}
                      </td>
                      <td style={{ padding: "13px 20px", textAlign: "center", background: "#f0f9ff" }}>
                        {row.pro === true ? (
                          <CheckCircleFilled style={{ color: "#10b981", fontSize: 18 }} />
                        ) : (
                          <Text style={{ fontSize: 13, color: "#0369a1", fontWeight: 600 }}>{row.pro}</Text>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Space size={16}>
              <Link href="/sign-up">
                <Button type="primary" size="large" icon={<GiftOutlined />}
                  style={{ height: 50, paddingInline: 32, fontSize: 16, fontWeight: 700, borderRadius: 14, background: "#10b981", borderColor: "#10b981" }}>
                  Start Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="large"
                  style={{ height: 50, paddingInline: 28, fontSize: 15, borderRadius: 14 }}>
                  View Full Pricing
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ────────────────────────────────────────────── */}
      <FAQSection
        title="Free Proposal Maker FAQ"
        subtitle="Common questions about DealPilot's free plan."
        faqs={FAQS}
      />

      {/* ── 8. CTA ────────────────────────────────────────────── */}
      <CTASection
        emoji="🎁"
        title="Start Making Proposals -- Free, Forever"
        subtitle="5 AI proposals, 19+ templates, a brand kit, and Stripe payment links. No credit card. No trial. No catch."
        buttonText="Sign Up Free -- 60 Seconds"
        buttonHref="/sign-up"
        footnote="Free forever -- No credit card -- No watermarks"
      />
    </>
  );
}
