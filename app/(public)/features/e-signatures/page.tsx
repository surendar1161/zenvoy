"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  SafetyCertificateOutlined, CheckCircleFilled, LockOutlined,
  MobileOutlined, DesktopOutlined, TabletOutlined,
  ClockCircleOutlined, EnvironmentOutlined, GlobalOutlined,
  EditOutlined, FileProtectOutlined, AuditOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Sign Flow Steps ────────────────────────────────────────── */
const SIGN_STEPS = [
  {
    step: "1",
    title: "Open the Document",
    desc: "Your client receives a secure link and opens the contract or proposal directly in their browser. No app download, no account creation.",
    icon: <FileProtectOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
    color: "#0ea5e9",
    mockup: (
      <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 20, textAlign: "center" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e2e8f0", marginBottom: 12 }}>
          <Text style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>CONTRACTOR AGREEMENT</Text>
          <Text strong style={{ fontSize: 15, display: "block", margin: "4px 0" }}>Website Redesign Project</Text>
          <Text style={{ fontSize: 12, color: "#64748b" }}>Sent by Your Brand Studio</Text>
        </div>
        <div style={{ background: "#0ea5e9", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, display: "inline-block" }}>
          Review Document
        </div>
      </div>
    ),
  },
  {
    step: "2",
    title: "Sign by Typing or Drawing",
    desc: "Choose between typing your name (auto-styled as a signature) or drawing your signature with a finger or stylus. Works on any device.",
    icon: <EditOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
    color: "#7c3aed",
    mockup: (
      <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, background: "#f5f3ff", border: "2px solid #7c3aed", borderRadius: 10, padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>Type</div>
          <div style={{ flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 12px", textAlign: "center", fontSize: 13, color: "#64748b" }}>Draw</div>
        </div>
        <div style={{ background: "#fff", border: "1.5px dashed #cbd5e1", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
          <Text style={{ fontFamily: "'Brush Script MT', cursive", fontSize: 28, color: "#0f172a" }}>Sarah Johnson</Text>
        </div>
      </div>
    ),
  },
  {
    step: "3",
    title: "Done -- Legally Binding",
    desc: "Timestamp, IP address, and location are recorded automatically. Both parties receive a signed copy. The contract is now legally enforceable.",
    icon: <CheckCircleFilled style={{ fontSize: 28, color: "#10b981" }} />,
    color: "#10b981",
    mockup: (
      <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 16, padding: 20, textAlign: "center" }}>
        <CheckCircleFilled style={{ fontSize: 36, color: "#10b981", display: "block", marginBottom: 8 }} />
        <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>Contract Signed</Text>
        <Text style={{ fontSize: 12, color: "#64748b" }}>Signed copies sent to all parties</Text>
      </div>
    ),
  },
];

/* ── Security Features ──────────────────────────────────────── */
const SECURITY_ITEMS = [
  { icon: <ClockCircleOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />, title: "Timestamp", desc: "Exact date and time recorded in ISO 8601 format with timezone. Proves when the signature was captured.", value: "2026-05-07T14:34:22Z" },
  { icon: <GlobalOutlined style={{ fontSize: 24, color: "#7c3aed" }} />, title: "IP Address", desc: "Signer's IP address logged for each signature event. Creates an audit trail tied to a specific network.", value: "192.168.1.xxx" },
  { icon: <EnvironmentOutlined style={{ fontSize: 24, color: "#10b981" }} />, title: "Geolocation", desc: "City, state, and country recorded via browser geolocation API. Adds physical context to the signature.", value: "New York, NY, US" },
  { icon: <LockOutlined style={{ fontSize: 24, color: "#f59e0b" }} />, title: "Document Hash", desc: "SHA-256 hash of the signed document ensures it has not been tampered with after signing.", value: "a7f3...9e2d" },
];

/* ── Comparison Table ───────────────────────────────────────── */
const COMPARE_ROWS = [
  { feature: "Monthly price", dealpilot: "From $0/mo", docusign: "$10/mo", hellosign: "$15/mo" },
  { feature: "Built into proposals", dealpilot: "Yes", docusign: "No", hellosign: "No" },
  { feature: "Built into contracts", dealpilot: "Yes", docusign: "No", hellosign: "No" },
  { feature: "eIDAS compliant", dealpilot: "Yes", docusign: "Yes", hellosign: "Yes" },
  { feature: "ESIGN Act compliant", dealpilot: "Yes", docusign: "Yes", hellosign: "Yes" },
  { feature: "No separate account needed", dealpilot: "Yes", docusign: "No", hellosign: "No" },
  { feature: "Type or draw signature", dealpilot: "Both", docusign: "Both", hellosign: "Both" },
  { feature: "Accept without signing", dealpilot: "Yes", docusign: "No", hellosign: "No" },
  { feature: "Freelancer-first design", dealpilot: "Yes", docusign: "No", hellosign: "No" },
];

/* ── FAQs ───────────────────────────────────────────────────── */
const FAQS = [
  { q: "Are DealPilot e-signatures legally binding?", a: "Yes. DealPilot e-signatures comply with the US ESIGN Act (2000) and the EU eIDAS Regulation. Electronic signatures carry the same legal weight as handwritten signatures for most business contracts, proposals, and agreements." },
  { q: "What information is recorded with each signature?", a: "Every signature captures the signer's full name, email address, IP address, geolocation (city/state/country), exact timestamp (ISO 8601), and a SHA-256 document hash. This creates a comprehensive audit trail." },
  { q: "Can clients sign on their phone?", a: "Absolutely. The signing experience is fully responsive and works on any device -- desktop, tablet, or mobile. Clients can type their name or draw their signature with a finger on touchscreen devices." },
  { q: "Do I need a separate e-signature tool like DocuSign?", a: "No. E-signatures are built directly into DealPilot's contracts and proposals. There is no need to export documents, pay for a separate tool, or ask clients to create accounts on third-party platforms." },
  { q: "What is the 'Accept without signing' option?", a: "Some agreements do not require a formal signature. The 'Accept without signing' option lets clients accept terms with a single click, while still recording their consent with timestamp and IP address for your records." },
  { q: "Is there a limit on the number of signatures?", a: "On the Pro plan, you get unlimited e-signatures. The Free plan includes e-signatures with your 2 monthly contracts. There is no per-signature fee on any plan." },
];

export default function ESignaturesPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <LandingHero
        tag="E-Signatures for Freelancers"
        title={<>Legally Binding E-Signatures<br />Built Right In</>}
        subtitle="Get contracts and proposals signed in seconds. eIDAS and ESIGN Act compliant. Type or draw. Works on any device. No separate tool needed."
        primaryCTA={{ text: "Start Signing for Free", href: "/sign-up" }}
        secondaryCTA={{ text: "See How It Works", href: "#sign-flow" }}
        footnote="Included with every DealPilot plan -- no per-signature fees"
      />

      {/* ── Legal Compliance ─────────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Legally Compliant Worldwide
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 580, margin: "0 auto" }}>
              DealPilot e-signatures comply with the two major e-signature laws that cover most of the world.
            </p>
          </div>
          <Row gutter={[24, 24]}>
            {/* eIDAS */}
            <Col xs={24} md={12}>
              <Card style={{ borderRadius: 20, border: "2px solid #dbeafe", height: "100%", background: "#fff" }} styles={{ body: { padding: 32 } }}>
                <Space size={14} align="start" style={{ marginBottom: 18 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <GlobalOutlined style={{ fontSize: 24, color: "#0369a1" }} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 20, display: "block" }}>eIDAS Regulation</Text>
                    <Text style={{ fontSize: 13, color: "#64748b" }}>European Union</Text>
                  </div>
                </Space>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 18px" }}>
                  The EU Electronic Identification, Authentication and Trust Services regulation establishes a legal framework for electronic signatures across all 27 EU member states. DealPilot e-signatures qualify as Advanced Electronic Signatures (AdES).
                </p>
                <Space direction="vertical" size={8}>
                  {["Valid across all 27 EU member states", "Qualified for most B2B contracts", "Admissible as evidence in EU courts", "Meets AdES requirements"].map(pt => (
                    <Space key={pt} align="start" size={8}>
                      <CheckCircleFilled style={{ color: "#10b981", fontSize: 14, marginTop: 2 }} />
                      <Text style={{ fontSize: 14 }}>{pt}</Text>
                    </Space>
                  ))}
                </Space>
              </Card>
            </Col>
            {/* ESIGN Act */}
            <Col xs={24} md={12}>
              <Card style={{ borderRadius: 20, border: "2px solid #fde68a", height: "100%", background: "#fff" }} styles={{ body: { padding: 32 } }}>
                <Space size={14} align="start" style={{ marginBottom: 18 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AuditOutlined style={{ fontSize: 24, color: "#d97706" }} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 20, display: "block" }}>ESIGN Act</Text>
                    <Text style={{ fontSize: 13, color: "#64748b" }}>United States</Text>
                  </div>
                </Space>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 18px" }}>
                  The Electronic Signatures in Global and National Commerce Act (2000) gives electronic signatures the same legal standing as handwritten signatures in the United States. DealPilot signatures meet all ESIGN Act requirements.
                </p>
                <Space direction="vertical" size={8}>
                  {["Same legal weight as wet-ink signatures", "Valid in all 50 US states", "Enforceable in federal and state courts", "Satisfies UETA requirements"].map(pt => (
                    <Space key={pt} align="start" size={8}>
                      <CheckCircleFilled style={{ color: "#10b981", fontSize: 14, marginTop: 2 }} />
                      <Text style={{ fontSize: 14 }}>{pt}</Text>
                    </Space>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* ── Sign Flow Mockup (3-Step) ────────────────────── */}
      <section id="sign-flow" style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ marginBottom: 14, borderRadius: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
              3-Step Signing
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Open. Sign. Done.
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Your clients can sign a contract in under 30 seconds. No downloads, no accounts, no friction.
            </p>
          </div>
          <Row gutter={[32, 40]}>
            {SIGN_STEPS.map((s, i) => (
              <Col key={s.step} xs={24} md={8}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 50, background: `${s.color}15`, border: `2px solid ${s.color}40`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Text style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.step}</Text>
                  </div>
                  <Text strong style={{ fontSize: 18, display: "block", marginBottom: 6 }}>{s.title}</Text>
                  <Text style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</Text>
                </div>
                {s.mockup}
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── Security Features ────────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Every Signature Creates an Audit Trail
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Four data points captured with every signature. If a dispute ever arises, you have the evidence.
            </p>
          </div>
          <Row gutter={[20, 20]}>
            {SECURITY_ITEMS.map(s => (
              <Col key={s.title} xs={24} sm={12} md={6}>
                <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%", textAlign: "center" }} styles={{ body: { padding: 24 } }}>
                  <div style={{ marginBottom: 14 }}>{s.icon}</div>
                  <Text strong style={{ fontSize: 16, display: "block", marginBottom: 6 }}>{s.title}</Text>
                  <Text style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, display: "block", marginBottom: 14 }}>{s.desc}</Text>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 12px" }}>
                    <Text style={{ fontFamily: "monospace", fontSize: 12, color: "#475569" }}>{s.value}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── Works on Any Device ──────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Works on Any Device
          </h2>
          <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Your clients sign from wherever they are. Desktop, tablet, or phone -- the signature experience adapts to their screen.
          </p>
          <Row gutter={[24, 24]}>
            {[
              { icon: <DesktopOutlined style={{ fontSize: 36, color: "#0ea5e9" }} />, label: "Desktop", desc: "Full editing view with type or draw options. Mouse or trackpad for drawing." },
              { icon: <TabletOutlined style={{ fontSize: 36, color: "#7c3aed" }} />, label: "Tablet", desc: "Optimised touch interface. Draw with Apple Pencil or finger." },
              { icon: <MobileOutlined style={{ fontSize: 36, color: "#10b981" }} />, label: "Mobile", desc: "Compact signing view. Type name or draw with finger on any phone." },
            ].map(d => (
              <Col key={d.label} xs={24} md={8}>
                <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 28, textAlign: "center" } }}>
                  <div style={{ marginBottom: 16 }}>{d.icon}</div>
                  <Text strong style={{ fontSize: 18, display: "block", marginBottom: 8 }}>{d.label}</Text>
                  <Text style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{d.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── Comparison vs DocuSign / HelloSign ────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Simpler. Cheaper. Built-In.
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Stop paying for a separate e-signature tool. DealPilot includes it with every contract and proposal.
            </p>
          </div>
          <Card style={{ borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "2px solid #e2e8f0" }}>
              <div style={{ padding: "16px 20px", fontWeight: 700, fontSize: 14 }}>Feature</div>
              <div style={{ padding: "16px 20px", fontWeight: 700, fontSize: 14, background: "#eff6ff", color: "#0369a1", textAlign: "center" }}>DealPilot</div>
              <div style={{ padding: "16px 20px", fontWeight: 600, fontSize: 14, color: "#64748b", textAlign: "center" }}>DocuSign</div>
              <div style={{ padding: "16px 20px", fontWeight: 600, fontSize: 14, color: "#64748b", textAlign: "center" }}>HelloSign</div>
            </div>
            {/* Table rows */}
            {COMPARE_ROWS.map((r, i) => (
              <div key={r.feature} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: i < COMPARE_ROWS.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center" }}>
                <div style={{ padding: "13px 20px", fontSize: 14, color: "#334155" }}>{r.feature}</div>
                <div style={{ padding: "13px 20px", fontSize: 14, textAlign: "center", background: "#fafcff", fontWeight: 600, color: r.dealpilot === "Yes" || r.dealpilot === "Both" ? "#10b981" : "#0369a1" }}>
                  {r.dealpilot === "Yes" ? <CheckCircleFilled style={{ color: "#10b981" }} /> : r.dealpilot}
                </div>
                <div style={{ padding: "13px 20px", fontSize: 14, textAlign: "center", color: r.docusign === "No" ? "#ef4444" : "#64748b" }}>
                  {r.docusign === "No" ? "---" : r.docusign === "Yes" ? <CheckCircleFilled style={{ color: "#10b981" }} /> : r.docusign}
                </div>
                <div style={{ padding: "13px 20px", fontSize: 14, textAlign: "center", color: r.hellosign === "No" ? "#ef4444" : "#64748b" }}>
                  {r.hellosign === "No" ? "---" : r.hellosign === "Yes" ? <CheckCircleFilled style={{ color: "#10b981" }} /> : r.hellosign}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <FAQSection
        title="E-Signature FAQs"
        subtitle="Everything you need to know about signing with DealPilot."
        faqs={FAQS}
      />

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection
        emoji="✍️"
        title="Get Your Next Contract Signed in 30 Seconds"
        subtitle="Legally binding e-signatures built into every contract and proposal. No separate tool. No extra cost. No friction for your clients."
        buttonText="Start Signing for Free"
        buttonHref="/sign-up"
        footnote="Free forever plan -- Unlimited signatures on Pro -- No credit card"
      />
    </>
  );
}
