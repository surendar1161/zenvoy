"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  BgColorsOutlined,
  FormatPainterOutlined,
  PictureOutlined,
  HighlightOutlined,
  LayoutOutlined,
  FileImageOutlined,
  StarOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Design deliverables data ────────────────────────────── */

const DELIVERABLES = [
  {
    category: "Brand Identity",
    color: "#faf5ff",
    border: "#e9d5ff",
    items: [
      "Primary logo + 3 variations (horizontal, stacked, icon-only)",
      "Colour palette: 2 primary, 3 secondary, 2 neutral",
      "Typography system: heading + body typeface pairings",
      "Brand guidelines document (40-60 pages, PDF)",
      "Social media profile assets (6 platforms)",
      "Business card and letterhead design",
    ],
  },
  {
    category: "Web & UI Design",
    color: "#eff6ff",
    border: "#bfdbfe",
    items: [
      "Mood board with 3 visual directions for client review",
      "Wireframes: 8 core pages (desktop + mobile)",
      "High-fidelity mockups in Figma (desktop, tablet, mobile)",
      "Interactive prototype with click-through flows",
      "Design system: components, spacing, grid documentation",
      "Developer handoff with specs and exported assets",
    ],
  },
  {
    category: "Packaging & Print",
    color: "#fff7ed",
    border: "#fed7aa",
    items: [
      "Packaging dieline and structural design",
      "3D mockup renders (3 angles per SKU)",
      "Print-ready files: CMYK, bleed, crop marks",
      "Material and finish recommendations",
      "2 rounds of revisions per design concept",
      "Press-check support (remote or on-site)",
    ],
  },
];

const VISUAL_PROPOSAL_SECTIONS = [
  { label: "Cover Page", desc: "Your logo, client name, project title — branded and elegant", icon: <PictureOutlined style={{ fontSize: 22, color: "#7c3aed" }} /> },
  { label: "Creative Brief", desc: "Project goals, target audience, brand voice, competitor landscape", icon: <HighlightOutlined style={{ fontSize: 22, color: "#0ea5e9" }} /> },
  { label: "Mood Board & Direction", desc: "Visual references, colour exploration, typography options", icon: <FormatPainterOutlined style={{ fontSize: 22, color: "#f59e0b" }} /> },
  { label: "Deliverables & Scope", desc: "Every asset listed with format, dimensions, and revision rounds", icon: <FileImageOutlined style={{ fontSize: 22, color: "#10b981" }} /> },
  { label: "Timeline & Milestones", desc: "Concept → revisions → final delivery with payment triggers", icon: <LayoutOutlined style={{ fontSize: 22, color: "#ef4444" }} /> },
  { label: "Investment", desc: "Good / Better / Best packages with add-on options", icon: <GiftOutlined style={{ fontSize: 22, color: "#0369a1" }} /> },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function DesignersPage() {
  return (
    <>
      {/* 1 · Hero */}
      <LandingHero
        tag="Graphic Design Proposal Generator"
        title={
          <>
            Design proposals that match
            <br />
            your <span style={{ color: "#c4b5fd" }}>creative standards</span>
          </>
        }
        subtitle="Your work is polished. Your proposals should be too. DealPilot generates branded design proposals with deliverable scoping, revision terms, and milestone payments — in 60 seconds."
        primaryCTA={{ text: "Create a Design Proposal", href: "/sign-up" }}
        secondaryCTA={{ text: "Preview a Template", href: "/templates" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 · Brand kit showcase — white-label everything */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ background: "#faf5ff", color: "#7c3aed", border: "1px solid #e9d5ff", borderRadius: 20, fontWeight: 700, fontSize: 13, padding: "4px 14px", marginBottom: 14 }}>
              White-label everything
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Your brand on every proposal, contract, and portal
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 600, margin: "0 auto" }}>
              You're a designer. Sending a generic-looking proposal is brand damage. DealPilot lets you white-label every touchpoint.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {[
              { icon: <BgColorsOutlined style={{ fontSize: 28, color: "#7c3aed" }} />, title: "Brand Kit", desc: "Upload your logo, set your colour palette, choose from 5 professional typefaces. Applied automatically to every proposal, contract, and portal." },
              { icon: <PictureOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />, title: "Custom Cover Pages", desc: "Every proposal opens with a branded cover: your logo, client name, project title, and date. Set it once, it auto-applies forever." },
              { icon: <FormatPainterOutlined style={{ fontSize: 28, color: "#10b981" }} />, title: "No DealPilot Branding", desc: "Clients never see our name. Proposals, PDFs, portals, and emails all carry your studio's identity — as if you built the system yourself." },
              { icon: <LayoutOutlined style={{ fontSize: 28, color: "#f59e0b" }} />, title: "Multiple Brand Profiles", desc: "Run two studios? Freelance under different brands? Save multiple brand kits and switch between them per proposal." },
              { icon: <StarOutlined style={{ fontSize: 28, color: "#ef4444" }} />, title: "PDF Export Quality", desc: "Export proposals as pixel-perfect PDFs with your brand applied. Typography, spacing, and colours render exactly as designed." },
              { icon: <HighlightOutlined style={{ fontSize: 28, color: "#0369a1" }} />, title: "Portfolio-Ready", desc: "Your proposals become portfolio pieces. Clients share them internally — and your brand travels with every forward." },
            ].map((item) => (
              <Col xs={24} md={8} key={item.title}>
                <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 28 } }}>
                  <div style={{ marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>{item.title}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 3 · Design-specific deliverables */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Scope deliverables the way designers actually work
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 580, margin: "0 auto" }}>
              Revision rounds, file formats, mood boards, brand guidelines — all structured into clear proposal sections.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {DELIVERABLES.map((section) => (
              <Card key={section.category} style={{ borderRadius: 20, border: `1.5px solid ${section.border}`, background: section.color }} styles={{ body: { padding: 32 } }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 16px" }}>{section.category}</h3>
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

      {/* 4 · Visual proposal preview */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              What your design proposal includes
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Every section is AI-generated from your project details. Customize anything, regenerate sections, export to PDF.
            </p>
          </div>

          <Row gutter={[20, 20]}>
            {VISUAL_PROPOSAL_SECTIONS.map((item) => (
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

      {/* 5 · Key features for designers */}
      <FeatureShowcase
        sectionTitle="Features designers actually need"
        sectionSubtitle="Revision rounds, mood boards, brand guidelines — not CRM jargon."
        features={[
          {
            icon: <FormatPainterOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
            title: "Revision Round Pricing",
            desc: "Define included revision rounds per deliverable and price additional rounds separately. Clients know exactly what's included — no awkward 'that's outside scope' conversations.",
            points: [
              "Set revision rounds per deliverable (e.g., 2 rounds for logo, 3 for web)",
              "Price additional revisions: $150/round or hourly rate",
              "Revision policy auto-included in contract terms",
              "Clients sign off on scope before you start",
            ],
            bg: "#faf5ff",
            border: "#e9d5ff",
          },
          {
            icon: <BgColorsOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
            title: "Milestone Payments",
            desc: "Split payments across creative phases: concept, revisions, final delivery. Each milestone triggers a Stripe payment link. Get paid as you design — not 60 days after delivery.",
            points: [
              "Concept phase: 40% deposit to start",
              "Revision phase: 30% on first round approval",
              "Final delivery: 30% on asset handoff",
              "Stripe links auto-generated per milestone",
            ],
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            icon: <FileImageOutlined style={{ fontSize: 28, color: "#10b981" }} />,
            title: "Asset Delivery via Portal",
            desc: "Deliver final files through your branded client portal. Upload PSDs, AIs, Figma links, brand guidelines — clients download everything from one place. No WeTransfer links.",
            points: [
              "Upload any file type: PSD, AI, PDF, Figma, PNG, SVG",
              "Organised folders per deliverable or phase",
              "Client downloads from branded portal",
              "File access tied to contract and payment status",
            ],
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
        ]}
      />

      {/* 6 · Social Proof */}
      <SocialProof
        title="What designers say"
        subtitle="Join designers who send proposals as polished as their portfolio."
        testimonials={[
          {
            quote: "I was embarrassed sending Google Doc proposals to clients who are paying me $15K for branding. Now my proposals match the quality of my work. Clients comment on how professional the experience is.",
            name: "Nina A.",
            role: "Brand Identity Designer",
          },
          {
            quote: "The revision round pricing is a game-changer. Clients know upfront that 2 rounds are included and extras cost $200/round. Zero awkward conversations. Zero scope creep.",
            name: "Leo S.",
            role: "UI/UX Designer, Freelance",
          },
          {
            quote: "I deliver brand guidelines, logos, and social assets through the client portal. It's branded with my studio's identity. Clients love it — it's like having my own SaaS platform.",
            name: "Amara J.",
            role: "Creative Director, Studio of One",
          },
        ]}
      />

      {/* 7 · FAQ */}
      <FAQSection
        title="Design proposal FAQs"
        subtitle="Questions from graphic designers, brand designers, and UI/UX freelancers."
        faqs={[
          {
            q: "Can I include mood boards or visual references in my proposal?",
            a: "Yes. The proposal editor supports image uploads and links. You can embed mood board images, colour swatches, and typography references directly in the proposal — or link to your Figma or Pinterest board.",
          },
          {
            q: "How do I handle revision rounds in the proposal?",
            a: "You define how many revision rounds are included per deliverable (e.g., 2 rounds for logo concepts, 3 for web mockups). Additional revisions are priced separately. The revision policy is auto-included in the contract terms.",
          },
          {
            q: "Can I present different pricing packages for design projects?",
            a: "Absolutely. Use Good / Better / Best pricing tiers — for example, Logo Only ($2,500), Logo + Brand Guidelines ($5,000), Full Brand Identity ($8,500). Clients self-select the package that fits their budget.",
          },
          {
            q: "Does it support brand identity projects with multiple deliverables?",
            a: "Yes. List every deliverable with specs: logo variations, colour palette, typography, business cards, social assets, brand guidelines. Each deliverable can have its own revision rounds and file format specifications.",
          },
          {
            q: "Can I deliver final files through DealPilot?",
            a: "Yes. Upload final assets (PSD, AI, PDF, PNG, SVG, Figma links) to your branded client portal. Clients download from one place — no WeTransfer, no Google Drive links, no expired downloads.",
          },
          {
            q: "Is the free plan enough for freelance designers?",
            a: "Yes. The Free plan includes unlimited proposals, contracts, e-signatures, brand kit, client portal, and Stripe payment links. You get everything you need to win clients and get paid — no credit card required.",
          },
        ]}
      />

      {/* 8 · CTA */}
      <CTASection
        title="Your proposals should look as good as your designs"
        subtitle="Generate a branded design proposal with deliverable scoping, revision terms, and milestone payments — in 60 seconds. Free forever."
        buttonText="Create Your Design Proposal"
        buttonHref="/sign-up"
      />
    </>
  );
}
