"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  FileProtectOutlined, SafetyCertificateOutlined, GlobalOutlined,
  EditOutlined, CheckCircleFilled, LockOutlined, TeamOutlined,
  AuditOutlined, ShopOutlined, BankOutlined, SolutionOutlined,
  FileDoneOutlined, ReconciliationOutlined, InsuranceOutlined,
  ContainerOutlined, DollarOutlined, CarOutlined, SnippetsOutlined,
  ThunderboltFilled, FileTextOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import PricingPreview from "@/components/marketing/PricingPreview";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── 15 Contract Types ──────────────────────────────────────── */
const CONTRACT_TYPES = [
  { name: "NDA", desc: "Protect confidential info before sharing sensitive details with clients or collaborators.", icon: <LockOutlined style={{ fontSize: 24, color: "#7c3aed" }} /> },
  { name: "Contractor Agreement", desc: "Define scope, payment, IP rights, and termination terms for freelance engagements.", icon: <SolutionOutlined style={{ fontSize: 24, color: "#7c3aed" }} /> },
  { name: "Employment Contract", desc: "Full-time or part-time employment terms with compensation, benefits, and obligations.", icon: <TeamOutlined style={{ fontSize: 24, color: "#7c3aed" }} /> },
  { name: "Service Level Agreement", desc: "Set performance benchmarks, uptime guarantees, and remedies for service-based work.", icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: "#7c3aed" }} /> },
  { name: "Retainer Agreement", desc: "Lock in recurring monthly hours at an agreed rate with rollover and scope terms.", icon: <ReconciliationOutlined style={{ fontSize: 24, color: "#7c3aed" }} /> },
  { name: "Sales Agreement", desc: "Terms for selling goods or services including pricing, delivery, and warranties.", icon: <ShopOutlined style={{ fontSize: 24, color: "#7c3aed" }} /> },
  { name: "Lease Agreement", desc: "Equipment, office, or asset lease terms with duration, payment, and liability clauses.", icon: <CarOutlined style={{ fontSize: 24, color: "#7c3aed" }} /> },
  { name: "Loan Agreement", desc: "Document lending terms: principal, interest, repayment schedule, and default conditions.", icon: <BankOutlined style={{ fontSize: 24, color: "#7c3aed" }} /> },
  { name: "Partnership Agreement", desc: "Define roles, profit splits, decision-making, and exit terms for business partnerships.", icon: <TeamOutlined style={{ fontSize: 24, color: "#0ea5e9" }} /> },
  { name: "Franchise Agreement", desc: "Franchise rights, territory, fees, brand standards, and operational requirements.", icon: <AuditOutlined style={{ fontSize: 24, color: "#0ea5e9" }} /> },
  { name: "Purchase Order", desc: "Standardised order document with item details, quantities, pricing, and delivery dates.", icon: <ContainerOutlined style={{ fontSize: 24, color: "#0ea5e9" }} /> },
  { name: "Distribution Agreement", desc: "Distribution rights, territory exclusivity, pricing, and minimum order obligations.", icon: <SnippetsOutlined style={{ fontSize: 24, color: "#0ea5e9" }} /> },
  { name: "Confidentiality Agreement", desc: "Broader confidentiality protection beyond NDAs for multi-party or ongoing engagements.", icon: <InsuranceOutlined style={{ fontSize: 24, color: "#0ea5e9" }} /> },
  { name: "Release of Liability", desc: "Waiver of claims for activities, events, or services where risk is inherent.", icon: <FileDoneOutlined style={{ fontSize: 24, color: "#0ea5e9" }} /> },
  { name: "Licensing Agreement", desc: "Grant usage rights to intellectual property with scope, duration, and royalty terms.", icon: <FileProtectOutlined style={{ fontSize: 24, color: "#0ea5e9" }} /> },
];

/* ── Compliance Badges ──────────────────────────────────────── */
const COMPLIANCE = [
  { code: "DTSA", full: "Defend Trade Secrets Act", desc: "Federal trade-secret protection automatically included in NDAs and confidentiality agreements.", color: "#7c3aed" },
  { code: "FLSA", full: "Fair Labor Standards Act", desc: "Wage, hour, and overtime compliance built into employment and contractor agreements.", color: "#0ea5e9" },
  { code: "UCC", full: "Uniform Commercial Code", desc: "Sales and purchase order contracts follow UCC Article 2 for goods transactions.", color: "#0369a1" },
  { code: "FTC", full: "FTC Compliance", desc: "Advertising, endorsement, and disclosure requirements in sales and distribution agreements.", color: "#10b981" },
  { code: "eIDAS", full: "EU Electronic Signatures", desc: "Qualified electronic signatures valid across all 27 EU member states.", color: "#f59e0b" },
  { code: "ESIGN", full: "US ESIGN Act", desc: "Electronic signatures carry the same legal weight as handwritten signatures in the US.", color: "#ef4444" },
];

/* ── Editor Features ────────────────────────────────────────── */
const EDITOR_FEATURES = [
  { title: "Google Docs-Style Editor", desc: "Familiar rich-text editing with formatting toolbar, headings, lists, and tables.", icon: <EditOutlined style={{ fontSize: 22, color: "#0ea5e9" }} /> },
  { title: "Auto-Save", desc: "Every keystroke is saved automatically. Never lose a draft, even if you close the tab.", icon: <CheckCircleFilled style={{ fontSize: 22, color: "#10b981" }} /> },
  { title: "AI Clause Suggestions", desc: "Get contextual clause recommendations based on your contract type and jurisdiction.", icon: <ThunderboltFilled style={{ fontSize: 22, color: "#7c3aed" }} /> },
  { title: "Version History", desc: "Track every change with timestamped versions. Revert to any previous draft instantly.", icon: <FileTextOutlined style={{ fontSize: 22, color: "#f59e0b" }} /> },
];

export default function ContractsPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <LandingHero
        tag="AI Contract Generator"
        title={<>AI Contract Generator<br />for Freelancers</>}
        subtitle="Generate legally sound contracts in 60 seconds. 15 contract types. 249 countries. Auto-applied compliance. Edit like Google Docs. Get it signed -- all inside DealPilot."
        primaryCTA={{ text: "Create Your First Contract", href: "/sign-up" }}
        secondaryCTA={{ text: "See All Contract Types", href: "#contract-types" }}
        footnote="Free plan includes 2 contracts/month -- no credit card required"
      />

      {/* ── 15 Contract Types Grid ────────────────────────── */}
      <section id="contract-types" style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ marginBottom: 14, borderRadius: 20, background: "#f5f3ff", border: "1px solid #ddd6fe", color: "#7c3aed", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
              15 Contract Types
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Every Contract a Freelancer Needs
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 600, margin: "0 auto" }}>
              From NDAs to distribution agreements -- AI generates the right contract for your situation, pre-filled with your project details.
            </p>
          </div>
          <Row gutter={[16, 16]}>
            {CONTRACT_TYPES.map((ct) => (
              <Col key={ct.name} xs={24} sm={12} md={8}>
                <Card
                  style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%", transition: "box-shadow 0.2s" }}
                  styles={{ body: { padding: 24 } }}
                  hoverable
                >
                  <div style={{ marginBottom: 12 }}>{ct.icon}</div>
                  <Text strong style={{ fontSize: 16, display: "block", marginBottom: 6 }}>{ct.name}</Text>
                  <Text style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{ct.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── Jurisdiction Selector Mockup ──────────────────── */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <Tag style={{ marginBottom: 14, borderRadius: 20, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#0369a1", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
              Jurisdiction-Aware
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Contracts That Know the Law
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Select any country or US state. DealPilot applies the correct legal framework, governing law clauses, and compliance requirements automatically.
            </p>
          </div>
          {/* Mockup UI */}
          <Card style={{ borderRadius: 24, border: "2px solid #e2e8f0", boxShadow: "0 12px 40px rgba(0,0,0,0.06)", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
            {/* Header bar */}
            <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1)", padding: "20px 32px", display: "flex", alignItems: "center", gap: 12 }}>
              <GlobalOutlined style={{ fontSize: 20, color: "#fff" }} />
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Jurisdiction Settings</Text>
            </div>
            <div style={{ padding: "32px 32px 40px" }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Country</Text>
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Space size={10}>
                      <span style={{ fontSize: 20 }}>🇺🇸</span>
                      <Text style={{ fontSize: 15 }}>United States</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>249 countries</Text>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: "block", marginBottom: 8, fontSize: 14 }}>State / Province</Text>
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Space size={10}>
                      <span style={{ fontSize: 20 }}>📍</span>
                      <Text style={{ fontSize: 15 }}>California</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>All 50 states</Text>
                  </div>
                </Col>
              </Row>
              {/* Auto-detected clauses */}
              <div style={{ marginTop: 28, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "20px 24px" }}>
                <Text strong style={{ display: "block", marginBottom: 12, color: "#166534", fontSize: 14 }}>
                  <CheckCircleFilled style={{ color: "#10b981", marginRight: 8 }} />
                  Auto-Applied for California, US
                </Text>
                <Space wrap size={8}>
                  {["California Labor Code", "DTSA (Federal)", "CCPA Data Privacy", "At-Will Employment Doctrine", "Non-Compete Void (CA Bus. & Prof. Code 16600)"].map(c => (
                    <Tag key={c} style={{ borderRadius: 8, background: "#fff", border: "1px solid #bbf7d0", color: "#166534", fontSize: 12, padding: "3px 10px" }}>{c}</Tag>
                  ))}
                </Space>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Legal Compliance Badges ──────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Built-In Legal Compliance
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              DealPilot automatically applies the right legal frameworks so your contracts are enforceable and compliant.
            </p>
          </div>
          <Row gutter={[20, 20]}>
            {COMPLIANCE.map((c) => (
              <Col key={c.code} xs={24} sm={12} md={8}>
                <Card style={{ borderRadius: 18, border: `2px solid ${c.color}20`, height: "100%" }} styles={{ body: { padding: 28 } }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: 900, color: c.color }}>{c.code}</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>{c.full}</Text>
                  <Text style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{c.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── Editor Features ──────────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Edit Contracts Like Google Docs
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              A familiar, powerful editor that saves every keystroke and suggests clauses as you write.
            </p>
          </div>
          {/* Editor Mockup */}
          <Card style={{ borderRadius: 20, border: "2px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
            {/* Toolbar */}
            <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <Space size={4}>
                {["B", "I", "U"].map(b => (
                  <div key={b} style={{ width: 32, height: 32, borderRadius: 6, background: b === "B" ? "#e2e8f0" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: b === "B" ? 800 : 400, fontStyle: b === "I" ? "italic" : "normal", textDecoration: b === "U" ? "underline" : "none", cursor: "pointer", color: "#475569" }}>
                    {b}
                  </div>
                ))}
              </Space>
              <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />
              <Space size={4}>
                {["H1", "H2", "H3"].map(h => (
                  <div key={h} style={{ padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "#64748b", cursor: "pointer" }}>{h}</div>
                ))}
              </Space>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircleFilled style={{ color: "#10b981", fontSize: 14 }} />
                <Text style={{ fontSize: 12, color: "#10b981" }}>Auto-saved</Text>
              </div>
            </div>
            {/* Document content */}
            <div style={{ padding: "32px 48px 40px", minHeight: 240 }}>
              <Text style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 16 }}>CONTRACTOR AGREEMENT</Text>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 16px", color: "#0f172a" }}>Independent Contractor Agreement</h3>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, margin: "0 0 16px" }}>
                This Independent Contractor Agreement (&ldquo;Agreement&rdquo;) is entered into as of <span style={{ background: "#dbeafe", padding: "2px 6px", borderRadius: 4, color: "#1e40af" }}>[Date]</span> by and between <span style={{ background: "#dbeafe", padding: "2px 6px", borderRadius: 4, color: "#1e40af" }}>[Client Name]</span> (&ldquo;Client&rdquo;) and <span style={{ background: "#dbeafe", padding: "2px 6px", borderRadius: 4, color: "#1e40af" }}>[Your Name]</span> (&ldquo;Contractor&rdquo;).
              </p>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, margin: "0 0 16px" }}>
                <strong>1. Scope of Work.</strong> The Contractor shall perform the services described in Exhibit A attached hereto (&ldquo;Services&rdquo;), in accordance with the terms and conditions of this Agreement.
              </p>
              {/* AI suggestion bubble */}
              <div style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 12, padding: "14px 18px", marginTop: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <ThunderboltFilled style={{ color: "#7c3aed", fontSize: 16, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <Text style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, display: "block", marginBottom: 4 }}>AI Suggestion</Text>
                  <Text style={{ fontSize: 13, color: "#475569" }}>Based on California jurisdiction, consider adding a &ldquo;Non-Solicitation&rdquo; clause instead of a non-compete, as non-compete agreements are void in California under Bus. &amp; Prof. Code 16600.</Text>
                </div>
              </div>
            </div>
          </Card>
          {/* Feature cards below */}
          <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
            {EDITOR_FEATURES.map(f => (
              <Col key={f.title} xs={24} sm={12}>
                <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 20 } }}>
                  <Space align="start" size={14}>
                    <div style={{ flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>{f.title}</Text>
                      <Text style={{ fontSize: 13, color: "#64748b" }}>{f.desc}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── E-Signature Integration ─────────────────────── */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Row gutter={[48, 40]} align="middle">
            <Col xs={24} md={12}>
              <Tag style={{ marginBottom: 14, borderRadius: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
                Built-In E-Signatures
              </Tag>
              <h2 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
                Generate. Edit. Sign. All in One Place.
              </h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, margin: "0 0 24px" }}>
                No need to export to DocuSign or HelloSign. DealPilot includes legally binding e-signatures right inside the contract editor. Send for signature with one click.
              </p>
              <Space direction="vertical" size={12}>
                {[
                  "eIDAS (EU) and ESIGN Act (US) compliant",
                  "Sign by typing name or drawing on any device",
                  "Timestamp, IP address, and location recorded",
                  "Both parties sign on the same document",
                  "Automatic signed copy sent to all parties",
                ].map(pt => (
                  <Space key={pt} align="start" size={10}>
                    <CheckCircleFilled style={{ color: "#10b981", fontSize: 15, marginTop: 2 }} />
                    <Text style={{ fontSize: 15 }}>{pt}</Text>
                  </Space>
                ))}
              </Space>
            </Col>
            <Col xs={24} md={12}>
              {/* Signature mockup */}
              <Card style={{ borderRadius: 20, border: "2px solid #bbf7d0", boxShadow: "0 8px 32px rgba(16,185,129,0.1)" }} styles={{ body: { padding: 28 } }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <SafetyCertificateOutlined style={{ fontSize: 36, color: "#10b981" }} />
                  <Text strong style={{ display: "block", fontSize: 16, marginTop: 8 }}>E-Signature</Text>
                </div>
                <div style={{ background: "#f8fafc", border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: "24px 20px", textAlign: "center", marginBottom: 16 }}>
                  <Text style={{ fontFamily: "'Brush Script MT', cursive", fontSize: 32, color: "#0f172a" }}>John Smith</Text>
                  <div style={{ marginTop: 8, borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
                    <Text style={{ fontSize: 11, color: "#94a3b8" }}>Signed electronically on May 7, 2026 at 2:34 PM EST</Text>
                  </div>
                </div>
                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                  {[
                    { label: "IP Address", value: "192.168.1.xxx" },
                    { label: "Location", value: "New York, NY, US" },
                    { label: "Timestamp", value: "2026-05-07T14:34:22Z" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <Text type="secondary">{r.label}</Text>
                      <Text style={{ fontFamily: "monospace", fontSize: 12 }}>{r.value}</Text>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <PricingPreview />

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection
        emoji="📝"
        title="Generate Your First Contract in 60 Seconds"
        subtitle="Pick a contract type, select your jurisdiction, and let AI handle the legal heavy lifting. Edit, customise, and get it signed -- all free."
        buttonText="Start for Free"
        buttonHref="/sign-up"
        footnote="Free forever plan -- 2 contracts/month -- No credit card"
      />
    </>
  );
}
