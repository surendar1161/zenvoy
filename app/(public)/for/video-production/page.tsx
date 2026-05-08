"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  ScissorOutlined,
  CameraOutlined,
  ScheduleOutlined,
  FileProtectOutlined,
  PlayCircleOutlined,
  ToolOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import LandingHero from "@/components/marketing/LandingHero";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import SocialProof from "@/components/marketing/SocialProof";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";

const { Text } = Typography;

/* ── Production phase breakdown ──────────────────────────── */

const PRODUCTION_PHASES = [
  {
    phase: "Pre-Production",
    timeline: "Weeks 1-2",
    color: "#eff6ff",
    border: "#bfdbfe",
    icon: <ScheduleOutlined style={{ fontSize: 20, color: "#0ea5e9" }} />,
    items: [
      "Creative brief and concept development",
      "Script writing and storyboard (8-12 frames)",
      "Shot list with camera angles and movement notes",
      "Location scouting: 3 options with availability and permits",
      "Talent casting and wardrobe direction",
      "Production schedule with crew call times and logistics",
    ],
  },
  {
    phase: "Production (Shoot Days)",
    timeline: "Days 1-3",
    color: "#fff7ed",
    border: "#fed7aa",
    icon: <CameraOutlined style={{ fontSize: 20, color: "#f59e0b" }} />,
    items: [
      "3 shoot days with director, DP, and sound operator",
      "Camera package: Sony FX6 / RED Komodo + cinema lenses",
      "Lighting: 3-point LED kit, grip equipment, modifiers",
      "Audio: wireless lavaliers, boom mic, field recorder",
      "Teleprompter setup for interview and scripted segments",
      "On-set director and production assistant",
    ],
  },
  {
    phase: "Post-Production",
    timeline: "Weeks 3-5",
    color: "#f0fdf4",
    border: "#bbf7d0",
    icon: <ScissorOutlined style={{ fontSize: 20, color: "#10b981" }} />,
    items: [
      "Rough cut delivery within 5 business days of wrap",
      "2 rounds of revisions on rough cut",
      "Colour grading: cinematic LUT + scene-by-scene correction",
      "Audio mix: dialogue cleanup, music licensing, SFX",
      "Motion graphics: lower thirds, title cards, logo animation",
      "Final delivery: 4K master + social cuts (16:9, 9:16, 1:1)",
    ],
  },
  {
    phase: "Delivery & Licensing",
    timeline: "Week 6",
    color: "#faf5ff",
    border: "#e9d5ff",
    icon: <CloudUploadOutlined style={{ fontSize: 20, color: "#7c3aed" }} />,
    items: [
      "Final files delivered via branded client portal",
      "Formats: ProRes 4K master, H.264 web, social media cuts",
      "Raw footage archive: available for 90 days post-delivery",
      "Music licensing: royalty-free, perpetual use included",
      "Usage rights: web, social, trade shows (1 year)",
      "Extended licensing available for broadcast and paid media",
    ],
  },
];

/* ── Equipment & licensing data ──────────────────────────── */

const EQUIPMENT_ITEMS = [
  { category: "Camera", items: ["Sony FX6 or RED Komodo body", "Cinema prime lens kit (24mm, 35mm, 50mm, 85mm)", "Tripod, slider, gimbal (DJI RS3 Pro)"] },
  { category: "Lighting", items: ["Aputure 600d + 300d LED fixtures", "Softboxes, flags, reflectors", "Portable LED panel kit for interviews"] },
  { category: "Audio", items: ["Sennheiser wireless lavalier kit (2 channels)", "Rode NTG5 shotgun mic + boom pole", "Sound Devices MixPre-6 field recorder"] },
  { category: "Licensing", items: ["Royalty-free music (Artlist / Musicbed)", "Stock footage if required (Artgrid)", "Font and motion graphics licenses"] },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function VideoProductionPage() {
  return (
    <>
      {/* 1 · Hero */}
      <LandingHero
        tag="Video Production Proposal Templates"
        title={
          <>
            Professional video proposals
            <br />
            that close <span style={{ color: "#7dd3fc" }}>production deals</span>
          </>
        }
        subtitle="Stop scoping shoot days in email threads. DealPilot generates video production proposals with pre-production timelines, equipment lists, milestone payments, and licensing terms — in 60 seconds."
        primaryCTA={{ text: "Create a Production Proposal", href: "/sign-up" }}
        secondaryCTA={{ text: "See a Sample Proposal", href: "/templates" }}
        footnote="Free forever plan · No credit card required"
      />

      {/* 2 · Production phase breakdown */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag style={{ background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa", borderRadius: 20, fontWeight: 700, fontSize: 13, padding: "4px 14px", marginBottom: 14 }}>
              Built for filmmakers
            </Tag>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Every production phase, clearly scoped
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 620, margin: "0 auto" }}>
              From pre-production to final delivery — each phase gets its own section with deliverables, timeline, and payment milestone.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {PRODUCTION_PHASES.map((phase) => (
              <Card key={phase.phase} style={{ borderRadius: 20, border: `1.5px solid ${phase.border}`, background: phase.color }} styles={{ body: { padding: 32 } }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  {phase.icon}
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{phase.phase}</h3>
                    <Text style={{ fontSize: 13, color: "#64748b" }}>{phase.timeline}</Text>
                  </div>
                </div>
                <Row gutter={[16, 10]}>
                  {phase.items.map((item) => (
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

      {/* 3 · Milestone payments for production phases */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Get paid at every production milestone
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 560, margin: "0 auto" }}>
              Split your production fee across phases. Each milestone generates a Stripe payment link — no invoicing, no chasing.
            </p>
          </div>

          <Row gutter={[20, 20]}>
            {[
              { milestone: "Booking Deposit", pct: "25%", trigger: "On contract signing", desc: "Secures your dates, reserves crew and equipment", color: "#eff6ff", border: "#bfdbfe" },
              { milestone: "Pre-Production Complete", pct: "25%", trigger: "Script + shot list approved", desc: "Due before crew call — covers planning deliverables", color: "#fff7ed", border: "#fed7aa" },
              { milestone: "Wrap Day", pct: "25%", trigger: "Final shoot day complete", desc: "Covers production costs: crew, equipment, location", color: "#f0fdf4", border: "#bbf7d0" },
              { milestone: "Final Delivery", pct: "25%", trigger: "Approved final cut delivered", desc: "Covers post-production: edit, colour, audio, graphics", color: "#faf5ff", border: "#e9d5ff" },
            ].map((m) => (
              <Col xs={24} md={12} key={m.milestone}>
                <Card style={{ borderRadius: 18, border: `1.5px solid ${m.border}`, background: m.color, height: "100%" }} styles={{ body: { padding: 28 } }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{m.milestone}</h3>
                    <Tag style={{ background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 20, fontWeight: 800, fontSize: 14 }}>{m.pct}</Tag>
                  </div>
                  <Text style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 8 }}>Trigger: {m.trigger}</Text>
                  <Text style={{ fontSize: 15, color: "#334155" }}>{m.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 4 · Equipment and licensing */}
      <section style={{ padding: "90px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Equipment lists and licensing — built into the proposal
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 580, margin: "0 auto" }}>
              Clients want transparency on gear and rights. DealPilot auto-generates equipment and licensing sections.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {EQUIPMENT_ITEMS.map((cat) => (
              <Col xs={24} md={12} key={cat.category}>
                <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 28 } }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <ToolOutlined style={{ fontSize: 18, color: "#0ea5e9" }} />
                    {cat.category}
                  </h3>
                  <Space direction="vertical" size={10} style={{ width: "100%" }}>
                    {cat.items.map((item) => (
                      <Space key={item} align="start" size={8}>
                        <CheckCircleFilled style={{ color: "#10b981", fontSize: 14, marginTop: 3, flexShrink: 0 }} />
                        <Text style={{ fontSize: 15, color: "#334155" }}>{item}</Text>
                      </Space>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 5 · Key features */}
      <FeatureShowcase
        sectionTitle="Made for how production companies work"
        sectionSubtitle="Shoot days, revision rounds, raw footage delivery — not generic freelancer features."
        features={[
          {
            icon: <PlayCircleOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />,
            title: "Production-Phase Billing",
            desc: "Attach Stripe payment links to each production phase: booking deposit, pre-production, wrap day, and final delivery. Clients pay as the project progresses — no lump-sum negotiations.",
            points: [
              "4-milestone payment structure built for production",
              "Stripe payment link per milestone",
              "Payment status visible to client in portal",
              "Automated payment reminders via email",
            ],
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            icon: <FileProtectOutlined style={{ fontSize: 28, color: "#7c3aed" }} />,
            title: "Usage Rights & Licensing",
            desc: "Define usage rights directly in the proposal: web only, social media, broadcast, paid media. Extended licensing is an upsell add-on. No ambiguity on what the client owns.",
            points: [
              "Usage rights section with clear scope",
              "Extended licensing as optional add-on",
              "Raw footage access terms and timeline",
              "Music licensing type documented (royalty-free, sync)",
            ],
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
          {
            icon: <CloudUploadOutlined style={{ fontSize: 28, color: "#10b981" }} />,
            title: "File Delivery via Portal",
            desc: "Deliver final cuts, social edits, and raw footage through your branded client portal. No WeTransfer links expiring after 7 days. Files stay accessible as long as the portal is active.",
            points: [
              "Upload any file: ProRes, H.264, RAW, WAV",
              "Organised by deliverable: master, social cuts, BTS",
              "Client downloads from branded portal",
              "File access tied to payment status",
            ],
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
        ]}
      />

      {/* 6 · Social Proof */}
      <SocialProof
        title="What videographers say"
        subtitle="Join filmmakers who close more production deals with less admin."
        testimonials={[
          {
            quote: "I used to email 3-page PDFs with no structure. Now I send a branded portal with a production breakdown, equipment list, and Stripe payment links. My booking rate doubled because clients can actually understand what they're paying for.",
            name: "Jordan C.",
            role: "Commercial Videographer",
          },
          {
            quote: "Milestone payments changed my cash flow. I get 25% at booking, 25% before the shoot, 25% at wrap, and 25% on delivery. No more waiting 60 days for a single $12K payment.",
            name: "Aisha P.",
            role: "Wedding & Event Filmmaker",
          },
          {
            quote: "The licensing section alone is worth it. Clients know exactly what usage rights they're getting. When they want broadcast rights, it's a clear add-on — not an awkward renegotiation after the fact.",
            name: "Marcus D.",
            role: "Director / DP, Production Company",
          },
        ]}
      />

      {/* 7 · FAQ */}
      <FAQSection
        title="Video production proposal FAQs"
        subtitle="Questions from videographers, filmmakers, and production company owners."
        faqs={[
          {
            q: "Can I include equipment lists and crew details in my proposal?",
            a: "Yes. The proposal includes dedicated sections for camera package, lighting, audio, and crew. List specific gear models, crew roles, and rates — so clients see exactly what their budget covers.",
          },
          {
            q: "How do milestone payments work for production projects?",
            a: "You split your fee across production phases: booking deposit (25%), pre-production complete (25%), wrap day (25%), and final delivery (25%). Each milestone generates a Stripe payment link. Clients pay as the project progresses.",
          },
          {
            q: "Can I define usage rights and licensing in the proposal?",
            a: "Yes. The licensing section lets you specify usage scope (web, social, broadcast, paid media), duration (1 year, perpetual), and territory. Extended licensing is presented as an optional add-on with separate pricing.",
          },
          {
            q: "What about raw footage delivery?",
            a: "You can define raw footage terms in the proposal: included or add-on, access duration (e.g., 90 days post-delivery), and delivery method. Raw files are uploaded to your branded client portal.",
          },
          {
            q: "Does it handle multi-day shoots and complex production schedules?",
            a: "Yes. The timeline section supports multi-day shoots with per-day breakdowns: call times, locations, crew, and equipment. You can also define setup and strike days as separate line items.",
          },
          {
            q: "Can I reuse proposals for similar production types?",
            a: "Absolutely. Clone any previous proposal and customise for the new client. Save common sections (equipment lists, licensing terms, crew rates) as reusable blocks.",
          },
        ]}
      />

      {/* 8 · CTA */}
      <CTASection
        title="Stop scoping productions in email threads"
        subtitle="Generate a video production proposal with phase breakdowns, equipment lists, milestone payments, and licensing terms — in 60 seconds. Free forever."
        buttonText="Create Your Production Proposal"
        buttonHref="/sign-up"
      />
    </>
  );
}
