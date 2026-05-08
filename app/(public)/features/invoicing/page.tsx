"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  DollarOutlined, CheckCircleFilled, CreditCardOutlined,
  FileTextOutlined, SafetyCertificateOutlined, ArrowRightOutlined,
  BankOutlined, AuditOutlined, FundOutlined,
} from "@ant-design/icons";

import LandingHero from "@/components/marketing/LandingHero";
import PricingPreview from "@/components/marketing/PricingPreview";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Milestone Phases ───────────────────────────────────────── */
const MILESTONES = [
  { phase: "Deposit", pct: "25%", amount: "$1,250", status: "Paid", color: "#10b981", desc: "Collected automatically when the proposal is accepted." },
  { phase: "Phase 1", pct: "35%", amount: "$1,750", status: "Due", color: "#f59e0b", desc: "Wireframes and design mockups delivered and approved." },
  { phase: "Phase 2", pct: "25%", amount: "$1,250", status: "Upcoming", color: "#94a3b8", desc: "Development complete with staging site review." },
  { phase: "Final", pct: "15%", amount: "$750", status: "Upcoming", color: "#94a3b8", desc: "Launch, handoff, and final documentation delivered." },
];

/* ── Lifecycle Steps ────────────────────────────────────────── */
const LIFECYCLE = [
  { label: "Proposal", icon: <FileTextOutlined style={{ fontSize: 20, color: "#0ea5e9" }} />, color: "#0ea5e9" },
  { label: "Contract", icon: <AuditOutlined style={{ fontSize: 20, color: "#7c3aed" }} />, color: "#7c3aed" },
  { label: "Invoice", icon: <DollarOutlined style={{ fontSize: 20, color: "#f59e0b" }} />, color: "#f59e0b" },
  { label: "Payment", icon: <CreditCardOutlined style={{ fontSize: 20, color: "#10b981" }} />, color: "#10b981" },
];

export default function InvoicingPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <LandingHero
        tag="Freelance Invoice Software"
        title={<>Send Invoices. Get Paid.<br />No Chasing.</>}
        subtitle="Create professional invoices with Stripe Pay Now buttons. Set up milestone billing. Collect deposits automatically. Get paid faster without the awkward follow-ups."
        primaryCTA={{ text: "Create Your First Invoice", href: "/sign-up" }}
        secondaryCTA={{ text: "See Milestone Billing", href: "#milestones" }}
        footnote="Free plan includes invoicing -- no credit card required"
      />

      {/* ── Invoice + Pay Now Mockup ──────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Professional Invoices, One-Click Payments
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Your clients see a clean invoice with a big Pay Now button. They click, they pay, you get notified. That simple.
            </p>
          </div>
          <Card style={{ borderRadius: 24, border: "2px solid #e2e8f0", boxShadow: "0 16px 48px rgba(0,0,0,0.07)", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
            {/* Invoice header */}
            <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1)", padding: "28px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>INVOICE</Text>
                <Text style={{ color: "#fff", fontSize: 22, fontWeight: 800, display: "block", marginTop: 4 }}>#INV-1042</Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, display: "block" }}>Issued: May 7, 2026</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, display: "block" }}>Due: May 21, 2026</Text>
              </div>
            </div>
            {/* Invoice body */}
            <div style={{ padding: "28px 36px" }}>
              <Row gutter={[24, 16]} style={{ marginBottom: 28 }}>
                <Col xs={24} md={12}>
                  <Text style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 6 }}>From</Text>
                  <Text strong style={{ display: "block", fontSize: 15 }}>Your Brand Studio</Text>
                  <Text style={{ fontSize: 13, color: "#64748b", display: "block" }}>hello@yourbrand.com</Text>
                </Col>
                <Col xs={24} md={12}>
                  <Text style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 6 }}>Bill To</Text>
                  <Text strong style={{ display: "block", fontSize: 15 }}>Acme Corporation</Text>
                  <Text style={{ fontSize: 13, color: "#64748b", display: "block" }}>billing@acme.com</Text>
                </Col>
              </Row>
              {/* Line items */}
              <div style={{ borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "10px 18px" }}>
                  {["Description", "Qty", "Rate", "Amount"].map(h => (
                    <Text key={h} style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", textAlign: h !== "Description" ? "right" : "left" }}>{h}</Text>
                  ))}
                </div>
                {[
                  { desc: "Website Redesign - Phase 1", qty: "1", rate: "$3,500", amount: "$3,500" },
                  { desc: "Brand Identity Package", qty: "1", rate: "$800", amount: "$800" },
                  { desc: "SEO Audit & Implementation", qty: "1", rate: "$200", amount: "$200" },
                ].map((item, i) => (
                  <div key={item.desc} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "12px 18px", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                    <Text style={{ fontSize: 14 }}>{item.desc}</Text>
                    <Text style={{ fontSize: 14, textAlign: "right", color: "#64748b" }}>{item.qty}</Text>
                    <Text style={{ fontSize: 14, textAlign: "right", color: "#64748b" }}>{item.rate}</Text>
                    <Text strong style={{ fontSize: 14, textAlign: "right" }}>{item.amount}</Text>
                  </div>
                ))}
              </div>
              {/* Total + Pay Now */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <Text style={{ fontSize: 13, color: "#94a3b8", display: "block" }}>Total Due</Text>
                  <Text style={{ fontSize: 36, fontWeight: 900, color: "#0f172a" }}>$4,500.00</Text>
                </div>
                <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", borderRadius: 14, padding: "16px 36px", fontSize: 18, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 20px rgba(16,185,129,0.3)", display: "flex", alignItems: "center", gap: 10 }}>
                  <CreditCardOutlined style={{ fontSize: 20 }} />
                  Pay Now with Stripe
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Milestone Billing ────────────────────────────── */}
      <section id="milestones" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <Tag style={{ marginBottom: 14, borderRadius: 20, background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
              Milestone Billing
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Break Projects Into Paid Milestones
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 580, margin: "0 auto" }}>
              Split any project into 2--4 billing phases. Each milestone gets its own invoice and Pay Now button. Never do all the work before getting paid.
            </p>
          </div>
          {/* Milestone visual */}
          <Card style={{ borderRadius: 24, border: "1.5px solid #e2e8f0", background: "#fafafa" }} styles={{ body: { padding: "32px 28px" } }}>
            <Text style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Website Redesign Project
            </Text>
            <Text strong style={{ fontSize: 22, display: "block", marginBottom: 24 }}>Total: $5,000</Text>
            {/* Progress bar */}
            <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 12, marginBottom: 32 }}>
              <div style={{ width: "25%", background: "#10b981" }} />
              <div style={{ width: "35%", background: "#f59e0b" }} />
              <div style={{ width: "25%", background: "#e2e8f0" }} />
              <div style={{ width: "15%", background: "#e2e8f0" }} />
            </div>
            {/* Phase cards */}
            <Row gutter={[16, 16]}>
              {MILESTONES.map((m, i) => (
                <Col key={m.phase} xs={24} sm={12} md={6}>
                  <Card
                    style={{
                      borderRadius: 16,
                      border: `2px solid ${m.color}30`,
                      height: "100%",
                      background: m.status === "Paid" ? "#f0fdf4" : "#fff",
                    }}
                    styles={{ body: { padding: 18 } }}
                  >
                    <Tag style={{ borderRadius: 8, background: `${m.color}15`, border: `1px solid ${m.color}40`, color: m.color, fontSize: 11, fontWeight: 700, padding: "2px 10px", marginBottom: 10 }}>
                      {m.status}
                    </Tag>
                    <Text strong style={{ fontSize: 16, display: "block", marginBottom: 2 }}>{m.phase}</Text>
                    <Text style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", display: "block", marginBottom: 4 }}>{m.amount}</Text>
                    <Text style={{ fontSize: 11, color: "#94a3b8" }}>{m.pct} of total</Text>
                    <div style={{ marginTop: 10, borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                      <Text style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{m.desc}</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      </section>

      {/* ── Auto-Deposit Collection ──────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Row gutter={[48, 40]} align="middle">
            <Col xs={24} md={12}>
              <Tag style={{ marginBottom: 14, borderRadius: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
                Auto-Deposit
              </Tag>
              <h2 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
                Get Paid Before You Start
              </h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, margin: "0 0 24px" }}>
                Set a deposit percentage on any proposal. When your client accepts, they are immediately prompted to pay the deposit via Stripe. No chasing, no awkward conversations, no starting work unpaid.
              </p>
              <Space direction="vertical" size={12}>
                {[
                  "Set deposit amount as % or fixed amount",
                  "Payment collected at proposal acceptance",
                  "Stripe processes the payment securely",
                  "Automatic receipt sent to client",
                  "Remaining balance split across milestones",
                ].map(pt => (
                  <Space key={pt} align="start" size={10}>
                    <CheckCircleFilled style={{ color: "#10b981", fontSize: 15, marginTop: 2 }} />
                    <Text style={{ fontSize: 15 }}>{pt}</Text>
                  </Space>
                ))}
              </Space>
            </Col>
            <Col xs={24} md={12}>
              {/* Auto-deposit mockup */}
              <Card style={{ borderRadius: 20, border: "2px solid #bbf7d0", boxShadow: "0 8px 32px rgba(16,185,129,0.1)" }} styles={{ body: { padding: 28 } }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <CheckCircleFilled style={{ fontSize: 36, color: "#10b981" }} />
                  <Text strong style={{ display: "block", fontSize: 18, marginTop: 8 }}>Proposal Accepted!</Text>
                  <Text style={{ fontSize: 13, color: "#64748b" }}>Deposit payment required to begin</Text>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 14, padding: "20px 18px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <Text style={{ fontSize: 14, color: "#64748b" }}>Project total</Text>
                    <Text style={{ fontSize: 14 }}>$5,000.00</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <Text style={{ fontSize: 14, color: "#64748b" }}>Deposit (25%)</Text>
                    <Text strong style={{ fontSize: 14, color: "#10b981" }}>$1,250.00</Text>
                  </div>
                  <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 14, color: "#64748b" }}>Remaining balance</Text>
                    <Text style={{ fontSize: 14 }}>$3,750.00</Text>
                  </div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", borderRadius: 12, padding: "14px 20px", textAlign: "center", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                  <CreditCardOutlined style={{ marginRight: 8 }} />
                  Pay $1,250.00 Deposit
                </div>
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <Space size={6} align="center">
                    <LockIcon />
                    <Text style={{ fontSize: 11, color: "#94a3b8" }}>Secured by Stripe</Text>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* ── Stripe Integration ──────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Powered by Stripe
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Enterprise-grade payment processing trusted by millions of businesses. Connect your Stripe account in 60 seconds.
            </p>
          </div>
          <Row gutter={[20, 20]}>
            {[
              { icon: <CreditCardOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />, title: "Card Payments", desc: "Accept Visa, Mastercard, Amex, and more. Clients pay directly from the invoice.", bg: "#eff6ff", border: "#bfdbfe" },
              { icon: <BankOutlined style={{ fontSize: 24, color: "#7c3aed" }} />, title: "Bank Transfers", desc: "ACH and SEPA direct debit for larger invoices with lower processing fees.", bg: "#f5f3ff", border: "#ddd6fe" },
              { icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: "#10b981" }} />, title: "PCI Compliant", desc: "Stripe handles all sensitive card data. DealPilot never sees or stores card numbers.", bg: "#f0fdf4", border: "#bbf7d0" },
              { icon: <FundOutlined style={{ fontSize: 24, color: "#f59e0b" }} />, title: "Real-Time Tracking", desc: "See payment status instantly. Get notified when a client pays. Track outstanding balances.", bg: "#fffbeb", border: "#fde68a" },
            ].map(f => (
              <Col key={f.title} xs={24} sm={12} md={6}>
                <Card style={{ borderRadius: 18, border: `1.5px solid ${f.border}`, height: "100%" }} styles={{ body: { padding: 24, textAlign: "center" } }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
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

      {/* ── Full Deal Lifecycle ──────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Part of the Full Deal Lifecycle
          </h2>
          <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Invoicing is not a standalone tool. It is connected to your proposals, contracts, and payments -- one seamless flow from pitch to paid.
          </p>
          {/* Lifecycle flow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
            {LIFECYCLE.map((l, i) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: `${l.color}12`, border: `2px solid ${l.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {l.icon}
                  </div>
                  <Text style={{ fontSize: 13, fontWeight: 700, color: l.color }}>{l.label}</Text>
                </div>
                {i < LIFECYCLE.length - 1 && (
                  <ArrowRightOutlined style={{ fontSize: 18, color: "#cbd5e1", margin: "0 4px", marginBottom: 24 }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <Row gutter={[16, 16]}>
              {[
                "Proposal accepted? Contract auto-generates.",
                "Contract signed? First invoice auto-sends.",
                "Invoice paid? Milestone status updates in real time.",
              ].map(t => (
                <Col key={t} xs={24} md={8}>
                  <Space align="start" size={8}>
                    <CheckCircleFilled style={{ color: "#10b981", fontSize: 15, marginTop: 2, flexShrink: 0 }} />
                    <Text style={{ fontSize: 14, textAlign: "left" }}>{t}</Text>
                  </Space>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <PricingPreview />

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection
        emoji="💰"
        title="Send Your First Invoice in 60 Seconds"
        subtitle="Professional invoices with Stripe Pay Now buttons. Milestone billing. Auto-deposits. Get paid faster without chasing clients."
        buttonText="Start Invoicing for Free"
        buttonHref="/sign-up"
        footnote="Free forever plan -- Stripe integration included -- No credit card"
      />
    </>
  );
}

/* ── Tiny lock icon helper ──────────────────────────────────── */
function LockIcon() {
  return <SafetyCertificateOutlined style={{ fontSize: 12, color: "#94a3b8" }} />;
}
