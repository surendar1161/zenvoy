"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  UserOutlined, TeamOutlined, DollarOutlined,
  CheckCircleFilled, FileTextOutlined, FundOutlined,
  TagsOutlined, MailOutlined,
  PhoneOutlined, LinkOutlined, GlobalOutlined,
  AuditOutlined, SafetyCertificateOutlined,
} from "@ant-design/icons";

import LandingHero from "@/components/marketing/LandingHero";
import PricingPreview from "@/components/marketing/PricingPreview";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Pipeline Stages ────────────────────────────────────────── */
const PIPELINE_STAGES = [
  { label: "Lead", count: 8, color: "#0ea5e9", bg: "#eff6ff", desc: "New prospects you are in talks with" },
  { label: "Active", count: 12, color: "#10b981", bg: "#f0fdf4", desc: "Clients with ongoing projects" },
  { label: "Inactive", count: 5, color: "#f59e0b", bg: "#fffbeb", desc: "Past clients with no current work" },
  { label: "Churned", count: 3, color: "#ef4444", bg: "#fef2f2", desc: "Clients who moved on" },
];

/* ── Sample Client Data ─────────────────────────────────────── */
const SAMPLE_CLIENT = {
  name: "Acme Corporation",
  contact: "Sarah Johnson",
  email: "sarah@acme.com",
  phone: "+1 (555) 123-4567",
  website: "acme.com",
  status: "Active",
  totalRevenue: "$24,500",
  deals: 4,
  avgDeal: "$6,125",
  tags: ["Enterprise", "Recurring", "Priority"],
  notes: [
    { date: "May 5, 2026", text: "Discussed Phase 2 expansion. Client wants to add mobile app to scope." },
    { date: "Apr 28, 2026", text: "Invoice #1038 paid. Project on track for May delivery." },
    { date: "Apr 15, 2026", text: "Contract signed for website redesign. Deposit collected via Stripe." },
  ],
};

/* ── All-in-One Features ────────────────────────────────────── */
const ALLINONE_FEATURES = [
  { icon: <FileTextOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />, title: "Proposals", desc: "AI-generated proposals tied to each client. Track which proposals were sent, viewed, and accepted.", color: "#0ea5e9" },
  { icon: <AuditOutlined style={{ fontSize: 24, color: "#7c3aed" }} />, title: "Contracts", desc: "Generate and sign contracts linked to client records. Every agreement in context.", color: "#7c3aed" },
  { icon: <LinkOutlined style={{ fontSize: 24, color: "#0369a1" }} />, title: "Client Portals", desc: "One-click portal creation for any client. Files, invoices, and messages in one branded space.", color: "#0369a1" },
  { icon: <DollarOutlined style={{ fontSize: 24, color: "#f59e0b" }} />, title: "Invoicing", desc: "Send invoices and track payments per client. See lifetime revenue and outstanding balances.", color: "#f59e0b" },
  { icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: "#10b981" }} />, title: "E-Signatures", desc: "Get documents signed without leaving the platform. Every signature tied to the client profile.", color: "#10b981" },
  { icon: <FundOutlined style={{ fontSize: 24, color: "#ef4444" }} />, title: "Analytics", desc: "Track win rates, response times, and revenue per client. Make data-driven decisions.", color: "#ef4444" },
];

export default function FreelanceCRMPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <LandingHero
        tag="Freelance CRM"
        title={<>A CRM Built for Freelancers,<br />Not Sales Teams</>}
        subtitle="Track clients, deals, and revenue without the enterprise bloat. A simple, powerful CRM that connects to your proposals, contracts, portals, and invoices -- all in one place."
        primaryCTA={{ text: "Start Tracking Clients Free", href: "/sign-up" }}
        secondaryCTA={{ text: "See the Pipeline", href: "#pipeline" }}
        footnote="Free forever -- no credit card -- no per-contact fees"
      />

      {/* ── Pipeline Mockup ──────────────────────────────── */}
      <section id="pipeline" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <Tag style={{ marginBottom: 14, borderRadius: 20, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#0369a1", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
              Visual Pipeline
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              See Every Client at a Glance
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Four clear stages. No confusing funnels, no 12-step pipelines. Just Lead, Active, Inactive, and Churned.
            </p>
          </div>
          {/* Pipeline columns */}
          <Row gutter={[16, 16]}>
            {PIPELINE_STAGES.map(stage => (
              <Col key={stage.label} xs={24} sm={12} md={6}>
                <Card style={{ borderRadius: 18, border: `2px solid ${stage.color}25`, height: "100%", background: "#fff" }} styles={{ body: { padding: 0 } }}>
                  {/* Column header */}
                  <div style={{ padding: "16px 20px", borderBottom: `2px solid ${stage.color}25`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text strong style={{ fontSize: 16, color: stage.color }}>{stage.label}</Text>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: stage.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 13, fontWeight: 800, color: stage.color }}>{stage.count}</Text>
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <Text style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 12 }}>{stage.desc}</Text>
                    {/* Sample client cards */}
                    {(stage.label === "Lead" ? [
                      { name: "TechStart Inc.", value: "$3,200" },
                      { name: "GreenLeaf Co.", value: "$1,800" },
                      { name: "Nova Labs", value: "$5,500" },
                    ] : stage.label === "Active" ? [
                      { name: "Acme Corp", value: "$6,125" },
                      { name: "BlueSky Ltd.", value: "$4,200" },
                      { name: "Meridian AG", value: "$8,900" },
                    ] : stage.label === "Inactive" ? [
                      { name: "OldClient Co.", value: "$2,400" },
                      { name: "Past Project", value: "$1,500" },
                    ] : [
                      { name: "Former Client", value: "$800" },
                    ]).map(c => (
                      <div key={c.name} style={{ background: "#fafafa", borderRadius: 10, padding: "10px 12px", marginBottom: 8, border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Space size={8}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: stage.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <UserOutlined style={{ fontSize: 12, color: stage.color }} />
                            </div>
                            <Text style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</Text>
                          </Space>
                          <Text style={{ fontSize: 12, color: "#64748b" }}>{c.value}</Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── Client Profile Card Mockup ──────────────────── */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Rich Client Profiles
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Everything you need to know about a client -- contact info, revenue, deal history, notes, and tags -- on one page.
            </p>
          </div>
          <Card style={{ borderRadius: 24, border: "2px solid #e2e8f0", boxShadow: "0 12px 40px rgba(0,0,0,0.06)", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
            {/* Profile header */}
            <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1)", padding: "28px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <Space size={16} align="center">
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>AC</Text>
                </div>
                <div>
                  <Text style={{ color: "#fff", fontSize: 22, fontWeight: 800, display: "block" }}>{SAMPLE_CLIENT.name}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{SAMPLE_CLIENT.contact} -- {SAMPLE_CLIENT.email}</Text>
                </div>
              </Space>
              <Tag style={{ borderRadius: 20, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#6ee7b7", fontSize: 13, fontWeight: 700, padding: "4px 16px" }}>
                {SAMPLE_CLIENT.status}
              </Tag>
            </div>
            {/* Profile body */}
            <div style={{ padding: "28px 36px" }}>
              <Row gutter={[24, 24]}>
                {/* Contact info */}
                <Col xs={24} md={8}>
                  <Text style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 14 }}>Contact Info</Text>
                  <Space direction="vertical" size={10} style={{ width: "100%" }}>
                    {[
                      { icon: <MailOutlined style={{ color: "#0ea5e9" }} />, value: SAMPLE_CLIENT.email },
                      { icon: <PhoneOutlined style={{ color: "#0ea5e9" }} />, value: SAMPLE_CLIENT.phone },
                      { icon: <GlobalOutlined style={{ color: "#0ea5e9" }} />, value: SAMPLE_CLIENT.website },
                    ].map(c => (
                      <Space key={c.value} size={10}>
                        {c.icon}
                        <Text style={{ fontSize: 14 }}>{c.value}</Text>
                      </Space>
                    ))}
                  </Space>
                  {/* Tags */}
                  <div style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Tags</Text>
                    <Space wrap size={6}>
                      {SAMPLE_CLIENT.tags.map(t => (
                        <Tag key={t} style={{ borderRadius: 8, fontSize: 12, padding: "2px 10px" }}>{t}</Tag>
                      ))}
                    </Space>
                  </div>
                </Col>
                {/* Revenue stats */}
                <Col xs={24} md={8}>
                  <Text style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 14 }}>Revenue</Text>
                  <div style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>Total Revenue</Text>
                    <Text style={{ fontSize: 32, fontWeight: 900, color: "#0f172a" }}>{SAMPLE_CLIENT.totalRevenue}</Text>
                  </div>
                  <Row gutter={[12, 12]}>
                    <Col span={12}>
                      <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px" }}>
                        <Text style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>Deals</Text>
                        <Text strong style={{ fontSize: 20 }}>{SAMPLE_CLIENT.deals}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px" }}>
                        <Text style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>Avg Deal</Text>
                        <Text strong style={{ fontSize: 20 }}>{SAMPLE_CLIENT.avgDeal}</Text>
                      </div>
                    </Col>
                  </Row>
                </Col>
                {/* Notes / Activity */}
                <Col xs={24} md={8}>
                  <Text style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 14 }}>Activity Timeline</Text>
                  <Space direction="vertical" size={0} style={{ width: "100%" }}>
                    {SAMPLE_CLIENT.notes.map((n, i) => (
                      <div key={n.date} style={{ display: "flex", gap: 12, paddingBottom: i < SAMPLE_CLIENT.notes.length - 1 ? 14 : 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: "#0ea5e9", marginTop: 6 }} />
                          {i < SAMPLE_CLIENT.notes.length - 1 && <div style={{ width: 1, flex: 1, background: "#e2e8f0", marginTop: 4 }} />}
                        </div>
                        <div>
                          <Text style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>{n.date}</Text>
                          <Text style={{ fontSize: 13, lineHeight: 1.5 }}>{n.text}</Text>
                        </div>
                      </div>
                    ))}
                  </Space>
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Revenue Tracking ─────────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Know Your Numbers
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              See revenue per client, total pipeline value, and deal counts at a glance. No spreadsheets needed.
            </p>
          </div>
          {/* Revenue dashboard mockup */}
          <Card style={{ borderRadius: 24, border: "1.5px solid #e2e8f0", background: "#fff" }} styles={{ body: { padding: "32px 28px" } }}>
            {/* Top stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
              {[
                { label: "Total Revenue", value: "$87,400", change: "+23%", color: "#10b981", icon: <DollarOutlined style={{ fontSize: 20, color: "#10b981" }} /> },
                { label: "Active Clients", value: "12", change: "+3", color: "#0ea5e9", icon: <TeamOutlined style={{ fontSize: 20, color: "#0ea5e9" }} /> },
                { label: "Pipeline Value", value: "$34,200", change: "+$8.5K", color: "#7c3aed", icon: <FundOutlined style={{ fontSize: 20, color: "#7c3aed" }} /> },
                { label: "Avg Deal Size", value: "$5,100", change: "+12%", color: "#f59e0b", icon: <TagsOutlined style={{ fontSize: 20, color: "#f59e0b" }} /> },
              ].map(s => (
                <Col key={s.label} xs={12} md={6}>
                  <div style={{ background: "#fafafa", borderRadius: 16, padding: "20px 18px", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      {s.icon}
                      <Tag style={{ borderRadius: 8, background: `${s.color}10`, border: "none", color: s.color, fontSize: 11, fontWeight: 700, padding: "2px 8px" }}>{s.change}</Tag>
                    </div>
                    <Text style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>{s.label}</Text>
                    <Text style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>{s.value}</Text>
                  </div>
                </Col>
              ))}
            </Row>
            {/* Revenue by client bar chart mockup */}
            <Text strong style={{ fontSize: 14, display: "block", marginBottom: 16 }}>Revenue by Client (This Year)</Text>
            <Space direction="vertical" size={10} style={{ width: "100%" }}>
              {[
                { name: "Acme Corp", revenue: "$24,500", pct: 100 },
                { name: "BlueSky Ltd.", revenue: "$18,200", pct: 74 },
                { name: "Meridian AG", revenue: "$15,800", pct: 64 },
                { name: "TechStart Inc.", revenue: "$12,400", pct: 51 },
                { name: "Nova Labs", revenue: "$9,200", pct: 38 },
                { name: "GreenLeaf Co.", revenue: "$7,300", pct: 30 },
              ].map(c => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Text style={{ fontSize: 13, width: 110, flexShrink: 0, textAlign: "right", color: "#64748b" }}>{c.name}</Text>
                  <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 6, height: 24, overflow: "hidden" }}>
                    <div style={{ width: `${c.pct}%`, height: "100%", background: "linear-gradient(90deg, #0ea5e9, #0369a1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                      <Text style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{c.revenue}</Text>
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </div>
      </section>

      {/* ── Not Just a CRM ──────────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ marginBottom: 14, borderRadius: 20, background: "#f5f3ff", border: "1px solid #ddd6fe", color: "#7c3aed", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
              All-in-One Platform
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Not Just a CRM
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 580, margin: "0 auto" }}>
              Every tool a freelancer needs -- proposals, contracts, portals, invoices, e-signatures, and analytics -- connected to your client records.
            </p>
          </div>
          <Row gutter={[20, 20]}>
            {ALLINONE_FEATURES.map(f => (
              <Col key={f.title} xs={24} sm={12} md={8}>
                <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 24 } }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    {f.icon}
                  </div>
                  <Text strong style={{ fontSize: 16, display: "block", marginBottom: 6 }}>{f.title}</Text>
                  <Text style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── All-in-One Value Prop ─────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Stop Juggling 5 Different Tools
          </h2>
          <p style={{ color: "#64748b", fontSize: 17, maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Most freelancers cobble together a CRM, a proposal tool, a contract tool, an invoicing tool, and an e-signature service. DealPilot replaces all five.
          </p>
          <Card style={{ borderRadius: 24, border: "2px solid #e2e8f0", textAlign: "left" }} styles={{ body: { padding: "32px 36px" } }}>
            <Row gutter={[40, 24]}>
              {/* Before */}
              <Col xs={24} md={12}>
                <Text style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>Before DealPilot</Text>
                <Space direction="vertical" size={10}>
                  {[
                    { tool: "HubSpot / Notion", purpose: "CRM", cost: "$0-50/mo" },
                    { tool: "Proposify / PandaDoc", purpose: "Proposals", cost: "$19-49/mo" },
                    { tool: "HelloSign / DocuSign", purpose: "E-Signatures", cost: "$10-25/mo" },
                    { tool: "FreshBooks / Wave", purpose: "Invoicing", cost: "$0-25/mo" },
                    { tool: "Custom / None", purpose: "Client Portal", cost: "N/A" },
                  ].map(t => (
                    <div key={t.tool} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>
                      <div>
                        <Text style={{ fontSize: 14, fontWeight: 600 }}>{t.tool}</Text>
                        <Text style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>{t.purpose}</Text>
                      </div>
                      <Text style={{ fontSize: 13, color: "#ef4444", fontWeight: 600 }}>{t.cost}</Text>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderTop: "2px solid #fecaca", marginTop: 4 }}>
                    <Text strong style={{ fontSize: 15 }}>Total</Text>
                    <Text strong style={{ fontSize: 15, color: "#ef4444" }}>$29-149/mo</Text>
                  </div>
                </Space>
              </Col>
              {/* After */}
              <Col xs={24} md={12}>
                <Text style={{ fontSize: 13, fontWeight: 700, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>With DealPilot</Text>
                <Space direction="vertical" size={10}>
                  {[
                    "Freelance CRM with pipeline",
                    "AI proposal generator",
                    "Contract generator (15 types)",
                    "E-signatures (eIDAS + ESIGN)",
                    "Invoicing with Stripe",
                    "Branded client portals",
                    "Analytics and tracking",
                  ].map(f => (
                    <Space key={f} align="center" size={10} style={{ padding: "8px 12px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0", width: "100%" }}>
                      <CheckCircleFilled style={{ color: "#10b981", fontSize: 15 }} />
                      <Text style={{ fontSize: 14 }}>{f}</Text>
                    </Space>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderTop: "2px solid #bbf7d0", marginTop: 4 }}>
                    <Text strong style={{ fontSize: 15 }}>Total</Text>
                    <Text strong style={{ fontSize: 15, color: "#10b981" }}>From $0/mo</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <PricingPreview />

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection
        emoji="📇"
        title="Start Managing Clients Like a Pro"
        subtitle="A CRM that actually fits how freelancers work. Track clients, revenue, and deals -- connected to proposals, contracts, and invoices."
        buttonText="Start for Free"
        buttonHref="/sign-up"
        footnote="Free forever plan -- No per-contact fees -- No credit card"
      />
    </>
  );
}
