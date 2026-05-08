"use client";

import { Button, Card, Divider, Space, Tag, Typography } from "antd";
import { ThunderboltFilled, ArrowRightOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

interface BlogArticleProps {
  tag: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  children: React.ReactNode;
}

export default function BlogArticle({ tag, title, subtitle, date, readTime, children }: BlogArticleProps) {
  return (
    <main>
      {/* Article Header */}
      <section style={{ background: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)", padding: "80px 24px 70px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} aria-hidden />
        <div style={{ position: "relative", maxWidth: 740, margin: "0 auto" }}>
          <div style={{ marginBottom: 16 }}>
            <Link href="/blog" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>
              ← Back to Blog
            </Link>
          </div>
          <Tag style={{ marginBottom: 16, borderRadius: 20, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
            {tag}
          </Tag>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-1px" }}>
            {title}
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.82)", lineHeight: 1.6, margin: "0 0 24px" }}>
            {subtitle}
          </p>
          <Space size={16}>
            <Space size={6}>
              <CalendarOutlined style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }} />
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{date}</Text>
            </Space>
            <Space size={6}>
              <ClockCircleOutlined style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }} />
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{readTime}</Text>
            </Space>
          </Space>
        </div>
      </section>

      {/* Article Body */}
      <section style={{ padding: "60px 24px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {children}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "0 24px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <Divider style={{ margin: "0 0 48px" }} />
          <Card
            style={{ borderRadius: 24, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", border: "none", boxShadow: "0 24px 80px rgba(14,165,233,0.25)" }}
            styles={{ body: { padding: "48px 40px", textAlign: "center" } }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📨</div>
            <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Skip the writing. Generate with AI.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.65, margin: "0 0 28px", maxWidth: 480, marginInline: "auto" }}>
              DealPilot uses Claude AI to generate a fully personalised, professional proposal in 60 seconds. Try it free — no credit card required.
            </p>
            <Link href="/sign-up">
              <Button size="large" icon={<ArrowRightOutlined />}
                style={{ height: 52, paddingInline: 36, fontSize: 16, fontWeight: 800, background: "#fff", color: "#0369a1", border: "none", borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                Generate Your First Proposal Free
              </Button>
            </Link>
            <div style={{ marginTop: 16, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
              Free plan: 5 proposals/month · No credit card · 60-second setup
            </div>
          </Card>
        </div>
      </section>

      {/* Related Articles */}
      <section style={{ padding: "60px 24px 80px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 24px" }}>Keep reading</h3>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {[
              { title: "How to Write a Freelance Proposal That Wins", href: "/blog/how-to-write-a-freelance-proposal", tag: "Guide" },
              { title: "How to Price Freelance Projects (Without Undercharging)", href: "/blog/how-to-price-freelance-projects", tag: "Pricing" },
              { title: "How to Follow Up on a Proposal Without Being Annoying", href: "/blog/how-to-follow-up-on-a-proposal", tag: "Sales" },
              { title: "7 Freelance Proposal Examples That Actually Won Clients", href: "/blog/freelance-proposal-examples", tag: "Examples" },
            ].map(a => (
              <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
                <Card hoverable style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" } }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Tag style={{ borderRadius: 20, fontSize: 11, margin: 0 }}>{a.tag}</Tag>
                    <Text strong style={{ fontSize: 15 }}>{a.title}</Text>
                  </div>
                  <ArrowRightOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
                </Card>
              </Link>
            ))}
          </Space>
        </div>
      </section>
    </main>
  );
}
