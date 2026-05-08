"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  LinkOutlined, CloudUploadOutlined, DollarOutlined,
  MessageOutlined, BgColorsOutlined, CheckCircleFilled,
  FileTextOutlined, EyeOutlined, SendOutlined,
  FolderOpenOutlined, CreditCardOutlined,
} from "@ant-design/icons";

import LandingHero from "@/components/marketing/LandingHero";
import SocialProof from "@/components/marketing/SocialProof";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Portal Feature Cards ───────────────────────────────────── */
const PORTAL_FEATURES = [
  {
    icon: <CloudUploadOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
    title: "File Sharing",
    desc: "Upload and share documents, deliverables, and assets. Your client downloads from one organised place -- no more email attachments.",
    points: ["Drag-and-drop upload", "Organised file list with timestamps", "Direct download for clients"],
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: <DollarOutlined style={{ fontSize: 28, color: "#f59e0b" }} />,
    title: "Invoices with Pay Now",
    desc: "Invoices appear right in the portal with Stripe-powered Pay Now buttons. Clients pay instantly without leaving the page.",
    points: ["Stripe Pay Now integration", "Invoice status tracking", "Payment confirmation receipts"],
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    icon: <MessageOutlined style={{ fontSize: 28, color: "#10b981" }} />,
    title: "Real-Time Chat",
    desc: "Built-in messaging replaces endless email threads. Discuss deliverables, request revisions, and share updates in context.",
    points: ["No email back-and-forth", "Message history preserved", "Instant notifications"],
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: <BgColorsOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
    title: "Fully Branded",
    desc: "Add your logo, brand colours, and business name. Every portal feels like an extension of your brand, not a third-party tool.",
    points: ["Custom logo upload", "Brand colour theming", "Professional domain feel"],
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
];

/* ── Testimonials ───────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: "My clients love the portal. They can see their proposal, download files, and pay invoices all from one link. It makes me look incredibly professional.", name: "Rachel K.", role: "Brand Strategist" },
  { quote: "Before DealPilot, I was sending files through Google Drive, invoices through Stripe, and updates over email. Now it's all in one place.", name: "Marcus T.", role: "Web Developer" },
  { quote: "The no-login requirement is genius. I send one link and my clients can do everything. No passwords, no friction, no support tickets.", name: "Priya M.", role: "UX Consultant" },
];

export default function ClientPortalPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <LandingHero
        tag="Client Portal for Freelancers"
        title={<>A Branded Client Portal<br />for Every Client</>}
        subtitle="Give each client their own portal with files, invoices, messages, and proposal status. One link. No login required. Fully branded with your logo and colours."
        primaryCTA={{ text: "Create Your First Portal", href: "/sign-up" }}
        secondaryCTA={{ text: "See How It Works", href: "#portal-demo" }}
        footnote="Included free on Pro plan -- no extra charge per portal"
      />

      {/* ── Portal Mockup / Demo ─────────────────────────── */}
      <section id="portal-demo" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              What Your Clients See
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              A clean, professional portal that makes you look like an agency -- even if you are a solo freelancer.
            </p>
          </div>
          <Card style={{ borderRadius: 24, border: "2px solid #e2e8f0", boxShadow: "0 16px 48px rgba(0,0,0,0.07)", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
            {/* Portal header */}
            <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1)", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Space size={14} align="center">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>YB</Text>
                </div>
                <div>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: 700, display: "block" }}>Your Brand Studio</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Client Portal for Acme Corp</Text>
                </div>
              </Space>
              <Tag style={{ borderRadius: 20, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#6ee7b7", fontSize: 12, fontWeight: 600, padding: "3px 12px" }}>
                Active
              </Tag>
            </div>
            {/* Tab navigation */}
            <div style={{ borderBottom: "1px solid #e2e8f0", display: "flex", gap: 0 }}>
              {[
                { label: "Overview", icon: <EyeOutlined />, active: true },
                { label: "Files", icon: <FolderOpenOutlined />, active: false, badge: 3 },
                { label: "Invoices", icon: <CreditCardOutlined />, active: false, badge: 1 },
                { label: "Messages", icon: <MessageOutlined />, active: false, badge: 2 },
              ].map(tab => (
                <div key={tab.label} style={{
                  padding: "14px 24px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  borderBottom: tab.active ? "2px solid #0ea5e9" : "2px solid transparent",
                  color: tab.active ? "#0ea5e9" : "#64748b", fontWeight: tab.active ? 700 : 500, fontSize: 14,
                }}>
                  {tab.icon}
                  {tab.label}
                  {tab.badge && (
                    <span style={{ background: tab.active ? "#0ea5e9" : "#94a3b8", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "2px 7px", marginLeft: 4 }}>
                      {tab.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Portal content - Overview */}
            <div style={{ padding: "28px 32px 36px" }}>
              {/* Stat cards */}
              <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
                {[
                  { label: "Proposal", value: "Accepted", color: "#10b981", icon: <CheckCircleFilled /> },
                  { label: "Contract", value: "Signed", color: "#7c3aed", icon: <FileTextOutlined /> },
                  { label: "Invoice", value: "$4,500 Due", color: "#f59e0b", icon: <DollarOutlined /> },
                  { label: "Messages", value: "2 New", color: "#0ea5e9", icon: <MessageOutlined /> },
                ].map(s => (
                  <Col key={s.label} xs={12} md={6}>
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 18px", textAlign: "center" }}>
                      <div style={{ color: s.color, fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                      <Text style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>{s.label}</Text>
                      <Text strong style={{ fontSize: 15, color: s.color }}>{s.value}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
              {/* Recent activity */}
              <Text strong style={{ fontSize: 14, display: "block", marginBottom: 12 }}>Recent Activity</Text>
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                {[
                  { action: "Invoice #1042 sent", time: "2 hours ago", icon: <DollarOutlined style={{ color: "#f59e0b" }} /> },
                  { action: "Contract signed by both parties", time: "Yesterday", icon: <CheckCircleFilled style={{ color: "#10b981" }} /> },
                  { action: "3 files uploaded to portal", time: "2 days ago", icon: <CloudUploadOutlined style={{ color: "#0ea5e9" }} /> },
                  { action: "Proposal accepted by client", time: "3 days ago", icon: <FileTextOutlined style={{ color: "#7c3aed" }} /> },
                ].map(a => (
                  <div key={a.action} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fafafa", borderRadius: 10 }}>
                    <div style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14 }}>{a.action}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>{a.time}</Text>
                  </div>
                ))}
              </Space>
            </div>
          </Card>
        </div>
      </section>

      {/* ── One Link. No Login. ──────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <LinkOutlined style={{ fontSize: 32, color: "#0ea5e9" }} />
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            One Link. No Login Required.
          </h2>
          <p style={{ color: "#64748b", fontSize: 17, maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Share a single secure link with your client. They get instant access to their portal -- no account creation, no passwords, no friction. Just send the link and they are in.
          </p>
          {/* Link mockup */}
          <Card style={{ borderRadius: 18, border: "2px solid #e2e8f0", display: "inline-block", maxWidth: 520, width: "100%" }} styles={{ body: { padding: "18px 24px" } }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontFamily: "monospace", fontSize: 13, color: "#475569", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                https://dealpilot.app/portal/acme-corp-a7x9k
              </div>
              <div style={{ background: "#0ea5e9", color: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                Copy Link
              </div>
            </div>
          </Card>
          <Row gutter={[24, 16]} style={{ marginTop: 40, textAlign: "left" }}>
            {[
              { icon: <CheckCircleFilled style={{ color: "#10b981", fontSize: 18 }} />, text: "No account creation -- clients click and they are in" },
              { icon: <CheckCircleFilled style={{ color: "#10b981", fontSize: 18 }} />, text: "Secure token-based access with automatic expiration" },
              { icon: <CheckCircleFilled style={{ color: "#10b981", fontSize: 18 }} />, text: "Works on any device -- desktop, tablet, or mobile" },
            ].map(p => (
              <Col key={p.text} xs={24} md={8}>
                <Space align="start" size={10}>
                  {p.icon}
                  <Text style={{ fontSize: 14, lineHeight: 1.5 }}>{p.text}</Text>
                </Space>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── Feature Breakdown (4 Cards) ──────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Everything Your Client Needs, In One Place
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Files. Invoices. Messages. Branding. Four pillars of a professional client experience.
            </p>
          </div>
          <Row gutter={[24, 24]}>
            {PORTAL_FEATURES.map(f => (
              <Col key={f.title} xs={24} md={12}>
                <Card style={{ borderRadius: 20, border: `1.5px solid ${f.border}`, height: "100%", background: "#fff" }} styles={{ body: { padding: 32 } }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    {f.icon}
                  </div>
                  <Text strong style={{ fontSize: 20, display: "block", marginBottom: 8 }}>{f.title}</Text>
                  <Text style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, display: "block", marginBottom: 18 }}>{f.desc}</Text>
                  <Space direction="vertical" size={8}>
                    {f.points.map(pt => (
                      <Space key={pt} align="start" size={8}>
                        <CheckCircleFilled style={{ color: "#10b981", fontSize: 14, marginTop: 2 }} />
                        <Text style={{ fontSize: 14 }}>{pt}</Text>
                      </Space>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── How It Looks to Your Client (Flow) ──────────── */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              How It Looks to Your Client
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              From receiving the link to paying the invoice -- here is the client experience, step by step.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { step: "1", title: "Client Gets a Link", desc: "You share a single portal URL via email, Slack, or any messenger. No signup forms, no passwords.", icon: <SendOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />, color: "#0ea5e9" },
              { step: "2", title: "Client Opens Their Portal", desc: "They see their branded portal with proposal status, documents, invoices, and a chat thread -- all in one place.", icon: <EyeOutlined style={{ fontSize: 24, color: "#7c3aed" }} />, color: "#7c3aed" },
              { step: "3", title: "Client Reviews & Approves", desc: "They review the proposal, accept terms, sign the contract electronically, and approve milestones.", icon: <CheckCircleFilled style={{ fontSize: 24, color: "#10b981" }} />, color: "#10b981" },
              { step: "4", title: "Client Pays Instantly", desc: "They click the Pay Now button on their invoice and complete payment via Stripe. You get paid, they get a receipt.", icon: <DollarOutlined style={{ fontSize: 24, color: "#f59e0b" }} />, color: "#f59e0b" },
            ].map((s, i, arr) => (
              <div key={s.step}>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: `${s.color}15`, border: `2px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {s.icon}
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width: 2, height: 48, background: "#e2e8f0", margin: "8px 0" }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 6, paddingBottom: i < arr.length - 1 ? 24 : 0 }}>
                    <Text style={{ fontSize: 12, color: s.color, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Step {s.step}</Text>
                    <Text strong style={{ fontSize: 20, display: "block", margin: "4px 0 6px" }}>{s.title}</Text>
                    <Text style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>{s.desc}</Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ─────────────────────────────────── */}
      <SocialProof
        title="Freelancers Love Their Portals"
        subtitle="See why client portals are the most loved DealPilot feature."
        testimonials={TESTIMONIALS}
      />

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection
        emoji="🌐"
        title="Give Every Client a Premium Experience"
        subtitle="Create branded client portals with files, invoices, and chat -- all from one shareable link. No login required."
        buttonText="Start for Free"
        buttonHref="/sign-up"
        footnote="Free forever plan -- No credit card -- Pro portals from $12/mo"
      />
    </>
  );
}
