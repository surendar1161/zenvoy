"use client";

import { Row, Col, Card, Space, Divider, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";

const { Text } = Typography;

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface SocialProofProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

export default function SocialProof({ title = "What freelancers say", subtitle, testimonials }: SocialProofProps) {
  return (
    <section aria-label="Testimonials" style={{ background: "#f8fafc", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", margin: "0 0 12px" }}>{title}</h2>
        {subtitle && <p style={{ color: "#64748b", fontSize: 16, textAlign: "center", marginBottom: 48 }}>{subtitle}</p>}
        <Row gutter={[24, 24]}>
          {testimonials.map(t => (
            <Col key={t.name} xs={24} md={8}>
              <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 28 } }}>
                <Space style={{ marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map(n => <StarFilled key={n} style={{ color: "#f59e0b", fontSize: 14 }} />)}
                </Space>
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>"{t.quote}"</p>
                <Divider style={{ margin: "0 0 16px" }} />
                <Text strong style={{ display: "block" }}>{t.name}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>{t.role}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
