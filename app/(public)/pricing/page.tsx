"use client";

import { useState } from "react";
import { Badge, Button, Card, Col, Row, Space, Switch, Tag, Typography } from "antd";
import { CheckCircleFilled, CloseCircleOutlined, ThunderboltFilled } from "@ant-design/icons";
import Link from "next/link";
import { PLANS } from "@/lib/plans";

const { Title, Text } = Typography;

const FAQ = [
  { q: "Can I cancel anytime?", a: "Yes. You can cancel your subscription at any time from the billing portal. You keep Pro/Business access until the end of your billing period." },
  { q: "Is there a free trial?", a: "The Free plan is available permanently — no credit card required. Upgrade whenever you're ready." },
  { q: "What payment methods do you accept?", a: "All major credit and debit cards (Visa, Mastercard, Amex, Discover) via Stripe. Invoicing available for Business annual plans." },
  { q: "Can I switch between monthly and yearly?", a: "Yes, you can switch at any time from your billing portal. Proration is handled automatically." },
  { q: "Do you offer refunds?", a: "We do not currently offer refunds. You can cancel your subscription at any time and you will not be charged again." },
  { q: "What happens when I hit the free plan limit?", a: "You'll be prompted to upgrade. Existing proposals and contracts are never deleted." },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div style={{ background: "#f8fafc" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px" }}>
        <Tag style={{ marginBottom: 16, padding: "4px 16px", borderRadius: 20, fontSize: 13, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8" }}>
          Simple, transparent pricing
        </Tag>
        <Title level={1} style={{ margin: "0 0 16px", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-1px" }}>
          Plans that grow with you
        </Title>
        <Text type="secondary" style={{ fontSize: 18, display: "block", marginBottom: 32 }}>
          Start free. Upgrade when you're ready. No hidden fees.
        </Text>

        {/* Toggle */}
        <Space align="center" size={12}>
          <Text style={{ fontWeight: yearly ? 400 : 700, color: yearly ? "#94a3b8" : "#0f172a" }}>Monthly</Text>
          <Switch checked={yearly} onChange={setYearly} style={{ background: yearly ? "#0ea5e9" : "#94a3b8" }} />
          <Text style={{ fontWeight: yearly ? 700 : 400, color: yearly ? "#0f172a" : "#94a3b8" }}>
            Yearly
            <Tag color="green" style={{ marginLeft: 8, borderRadius: 20, fontSize: 11 }}>Save up to 21%</Tag>
          </Text>
        </Space>
      </div>

      {/* Plans */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <Row gutter={[24, 24]} align="top">
          {PLANS.map(plan => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isFree = plan.id === "free";

            return (
              <Col key={plan.id} xs={24} md={8}>
                <Badge.Ribbon
                  text={plan.popular ? "⭐ Most Popular" : ""}
                  color="#0ea5e9"
                  style={{ display: plan.popular ? undefined : "none" }}
                >
                  <Card
                    style={{
                      borderRadius: 20,
                      border: `2px solid ${plan.popular ? plan.color : "#e2e8f0"}`,
                      boxShadow: plan.popular ? `0 12px 40px ${plan.color}25` : "0 2px 8px rgba(0,0,0,0.06)",
                      height: "100%",
                    }}
                    styles={{ body: { padding: 32 } }}
                  >
                    {/* Plan header */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${plan.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ThunderboltFilled style={{ color: plan.color, fontSize: 18 }} />
                        </div>
                        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>{plan.name}</Title>
                      </div>
                      <Text type="secondary" style={{ fontSize: 14 }}>{plan.tagline}</Text>
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 52, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
                        ${price}
                      </span>
                      <span style={{ color: "#94a3b8", fontSize: 16 }}>/mo</span>
                    </div>
                    {yearly && !isFree && (
                      <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
                        Billed as ${plan.yearlyTotal}/year
                      </Text>
                    )}
                    {!yearly && !isFree && (
                      <Text style={{ fontSize: 13, color: "#10b981", display: "block", marginBottom: 4 }}>
                        Switch to yearly → save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/yr
                      </Text>
                    )}

                    {/* CTA */}
                    <Link href={isFree ? "/sign-up" : `/sign-up?plan=${plan.id}&period=${yearly ? "yearly" : "monthly"}`}>
                      <Button
                        type={plan.popular ? "primary" : "default"}
                        size="large"
                        block
                        style={{
                          borderRadius: 12, height: 48, fontWeight: 700, marginTop: 20, marginBottom: 28,
                          ...(plan.popular ? { background: plan.color, borderColor: plan.color } : {}),
                          ...(plan.id === "business" ? { background: plan.color, borderColor: plan.color, color: "#fff" } : {}),
                        }}
                      >
                        {isFree ? "Start Free — No Card" : plan.popular ? "Start with Pro" : "Get Business"}
                      </Button>
                    </Link>

                    {/* Features */}
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 24 }}>
                      <Space direction="vertical" size={10} style={{ width: "100%" }}>
                        {plan.features.map(f => (
                          <Space key={f} align="start" size={8}>
                            <CheckCircleFilled style={{ color: plan.color, fontSize: 15, marginTop: 2, flexShrink: 0 }} />
                            <Text style={{ fontSize: 14 }}>{f}</Text>
                          </Space>
                        ))}
                        {plan.notIncluded?.map(f => (
                          <Space key={f} align="start" size={8}>
                            <CloseCircleOutlined style={{ color: "#cbd5e1", fontSize: 15, marginTop: 2, flexShrink: 0 }} />
                            <Text type="secondary" style={{ fontSize: 14 }}>{f}</Text>
                          </Space>
                        ))}
                      </Space>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Col>
            );
          })}
        </Row>

        {/* Comparison note */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Text type="secondary" style={{ fontSize: 14 }}>
            All plans include: AI generation with Claude Opus 4.6 · Stripe payment links · Web proposal URLs · Cover page · 15 contract types · 24-hour support
          </Text>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 80 }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 40, fontWeight: 800 }}>Frequently Asked Questions</Title>
          <Row gutter={[32, 24]}>
            {FAQ.map(item => (
              <Col key={item.q} xs={24} md={12}>
                <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 24 } }}>
                  <Text strong style={{ display: "block", marginBottom: 8, fontSize: 15 }}>{item.q}</Text>
                  <Text type="secondary" style={{ fontSize: 14, lineHeight: 1.6 }}>{item.a}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Enterprise CTA */}
        <Card style={{ borderRadius: 24, marginTop: 60, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", border: "none", boxShadow: "0 20px 60px rgba(14,165,233,0.25)" }} styles={{ body: { padding: "48px 40px", textAlign: "center" } }}>
          <Title level={2} style={{ color: "#fff", margin: "0 0 12px", fontWeight: 900 }}>
            Need more than 5 team members?
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, display: "block", marginBottom: 28 }}>
            Talk to us about an Enterprise plan — custom pricing, SLA, dedicated support, and SSO.
          </Text>
          <Button size="large" icon={<ThunderboltFilled />}
            style={{ height: 52, paddingInline: 36, fontSize: 15, fontWeight: 700, background: "#fff", color: "#0369a1", border: "none", borderRadius: 12 }}>
            Contact Sales
          </Button>
        </Card>
      </div>
    </div>
  );
}
