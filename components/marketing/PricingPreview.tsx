"use client";

import { useState } from "react";
import { Row, Col, Card, Button, Space, Switch, Tag, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

const PLANS = [
  {
    name: "Free",
    monthlyPrice: 0, yearlyPrice: 0,
    color: "#64748b",
    features: ["5 proposals/month", "2 contracts/month", "All 15 contract types", "19+ templates", "Brand kit", "Stripe payment links"],
    missing: ["E-signatures", "Analytics", "Client portals"],
  },
  {
    name: "Pro",
    monthlyPrice: 12, yearlyPrice: 9,
    color: "#0ea5e9",
    popular: true,
    features: ["Unlimited proposals & contracts", "Digital e-signatures", "Proposal analytics", "Client portals", "Content library", "White-label branding", "Priority support"],
    missing: [],
  },
  {
    name: "Business",
    monthlyPrice: 29, yearlyPrice: 22,
    color: "#7c3aed",
    features: ["Everything in Pro", "5 team members", "API access", "Custom domain", "Dedicated onboarding"],
    missing: [],
  },
];

export default function PricingPreview() {
  const [yearly, setYearly] = useState(false);

  return (
    <section aria-label="Pricing" style={{ background: "#fff", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.5px" }}>Simple, transparent pricing</h2>
          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 24 }}>Start free. Upgrade when you're ready.</p>
          <Space align="center" size={12}>
            <Text style={{ fontWeight: yearly ? 400 : 700 }}>Monthly</Text>
            <Switch checked={yearly} onChange={setYearly} style={{ background: yearly ? "#0ea5e9" : "#94a3b8" }} />
            <Text style={{ fontWeight: yearly ? 700 : 400 }}>
              Yearly <Tag color="green" style={{ marginLeft: 6, borderRadius: 20, fontSize: 11 }}>Save 25%</Tag>
            </Text>
          </Space>
        </div>
        <Row gutter={[20, 20]}>
          {PLANS.map(plan => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <Col key={plan.name} xs={24} md={8}>
                <Card
                  style={{
                    borderRadius: 20,
                    border: `2px solid ${plan.popular ? plan.color : "#e2e8f0"}`,
                    height: "100%",
                    boxShadow: plan.popular ? `0 12px 40px ${plan.color}20` : undefined,
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  {plan.popular && (
                    <div style={{ background: plan.color, color: "#fff", textAlign: "center", fontSize: 12, fontWeight: 700, padding: "4px 0", margin: "-28px -28px 20px", borderRadius: "18px 18px 0 0" }}>
                      Most Popular
                    </div>
                  )}
                  <Text strong style={{ fontSize: 18, display: "block", marginBottom: 4 }}>{plan.name}</Text>
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 44, fontWeight: 900, color: "#0f172a" }}>${price}</span>
                    <span style={{ color: "#94a3b8" }}>/mo</span>
                  </div>
                  <Link href={`/sign-up?plan=${plan.name.toLowerCase()}`}>
                    <Button type={plan.popular ? "primary" : "default"} block size="large"
                      style={{ borderRadius: 12, height: 44, fontWeight: 700, marginBottom: 20, ...(plan.popular ? { background: plan.color, borderColor: plan.color } : {}) }}>
                      {plan.name === "Free" ? "Start Free" : `Get ${plan.name}`}
                    </Button>
                  </Link>
                  <Space direction="vertical" size={7} style={{ width: "100%" }}>
                    {plan.features.map(f => (
                      <Space key={f} size={7}>
                        <CheckOutlined style={{ color: "#10b981", fontSize: 13 }} />
                        <Text style={{ fontSize: 13 }}>{f}</Text>
                      </Space>
                    ))}
                    {plan.missing.map(f => (
                      <Space key={f} size={7}>
                        <CloseOutlined style={{ color: "#e2e8f0", fontSize: 13 }} />
                        <Text type="secondary" style={{ fontSize: 13 }}>{f}</Text>
                      </Space>
                    ))}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
  );
}
