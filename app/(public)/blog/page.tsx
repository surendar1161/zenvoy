"use client";

import { Row, Col, Card, Tag, Space, Button, Typography } from "antd";
import { ArrowRightOutlined, ThunderboltFilled, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

const POSTS = [
  {
    slug: "how-to-write-a-freelance-proposal",
    tag: "Guide",
    tagColor: "#0ea5e9",
    title: "How to Write a Freelance Proposal That Wins",
    excerpt: "A step-by-step guide to writing proposals that close deals — covering structure, tone, pricing, and the psychology behind why clients say yes.",
    date: "May 7, 2026",
    readTime: "12 min read",
  },
  {
    slug: "how-to-price-freelance-projects",
    tag: "Pricing",
    tagColor: "#7c3aed",
    title: "How to Price Freelance Projects (Without Undercharging)",
    excerpt: "The complete pricing guide for freelancers — hourly vs project-based, value pricing, rate calculators, and how to present pricing that clients respect.",
    date: "May 7, 2026",
    readTime: "14 min read",
  },
  {
    slug: "how-to-follow-up-on-a-proposal",
    tag: "Sales",
    tagColor: "#10b981",
    title: "How to Follow Up on a Proposal Without Being Annoying",
    excerpt: "The exact timing, templates, and strategy for following up on proposals — including what to do when clients go silent.",
    date: "May 7, 2026",
    readTime: "9 min read",
  },
  {
    slug: "freelance-proposal-examples",
    tag: "Examples",
    tagColor: "#f59e0b",
    title: "7 Freelance Proposal Examples That Actually Won Clients",
    excerpt: "Real-world proposal breakdowns across web development, design, copywriting, consulting, and more — with annotations on what made each one work.",
    date: "May 7, 2026",
    readTime: "15 min read",
  },
];

export default function BlogIndexPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)", padding: "80px 24px 70px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} aria-hidden />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <Tag style={{ marginBottom: 16, borderRadius: 20, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
            DealPilot Blog
          </Tag>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-1px" }}>
            Win more clients.<br />Close more deals.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.82)", lineHeight: 1.6, margin: 0 }}>
            Actionable guides on proposals, pricing, contracts, and freelance business — from the team building DealPilot.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section style={{ padding: "60px 24px 0", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Link href={`/blog/${POSTS[0].slug}`} style={{ textDecoration: "none" }}>
            <Card
              hoverable
              style={{ borderRadius: 20, border: "2px solid #0ea5e9", overflow: "hidden", boxShadow: "0 12px 40px rgba(14,165,233,0.12)" }}
              styles={{ body: { padding: 0 } }}
            >
              <Row>
                <Col xs={24} md={10}>
                  <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1)", height: "100%", minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 56, marginBottom: 12 }}>📝</div>
                      <div style={{ color: "#7dd3fc", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured Guide</div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={14}>
                  <div style={{ padding: "36px 36px" }}>
                    <Tag style={{ borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 14, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#0369a1" }}>
                      {POSTS[0].tag}
                    </Tag>
                    <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px", color: "#0f172a" }}>
                      {POSTS[0].title}
                    </h2>
                    <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, margin: "0 0 20px" }}>
                      {POSTS[0].excerpt}
                    </p>
                    <Space size={16}>
                      <Space size={6}>
                        <CalendarOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
                        <Text type="secondary" style={{ fontSize: 13 }}>{POSTS[0].date}</Text>
                      </Space>
                      <Space size={6}>
                        <ClockCircleOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
                        <Text type="secondary" style={{ fontSize: 13 }}>{POSTS[0].readTime}</Text>
                      </Space>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>
          </Link>
        </div>
      </section>

      {/* All Posts Grid */}
      <section style={{ padding: "48px 24px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 32px" }}>All articles</h2>
          <Row gutter={[24, 24]}>
            {POSTS.map(post => (
              <Col key={post.slug} xs={24} md={12}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <Card
                    hoverable
                    style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }}
                    styles={{ body: { padding: 28 } }}
                  >
                    <Tag style={{ borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 14, background: `${post.tagColor}15`, border: `1px solid ${post.tagColor}40`, color: post.tagColor }}>
                      {post.tag}
                    </Tag>
                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.3px", color: "#0f172a" }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: "0 0 20px" }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Space size={16}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{post.date}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{post.readTime}</Text>
                      </Space>
                      <ArrowRightOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <Card
            style={{ borderRadius: 24, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", border: "none", boxShadow: "0 24px 80px rgba(14,165,233,0.25)" }}
            styles={{ body: { padding: "48px 40px" } }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📨</div>
            <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 900, margin: "0 0 12px" }}>
              Stop writing proposals from scratch
            </h2>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 16, lineHeight: 1.6, margin: "0 0 28px" }}>
              Generate a professional, AI-written proposal in 60 seconds. Free plan available.
            </p>
            <Link href="/sign-up">
              <Button size="large" icon={<ThunderboltFilled />}
                style={{ height: 52, paddingInline: 36, fontSize: 16, fontWeight: 800, background: "#fff", color: "#0369a1", border: "none", borderRadius: 14 }}>
                Try DealPilot Free
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </main>
  );
}
