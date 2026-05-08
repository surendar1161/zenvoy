"use client";

import { Row, Col, Card, Tag, Typography } from "antd";

const { Text } = Typography;

interface PainPoint {
  quote: string;
  author: string;
  pain: string;
}

interface PainPointsProps {
  title?: string;
  subtitle?: string;
  painPoints: PainPoint[];
}

export default function PainPoints({ title = "Sound familiar?", subtitle, painPoints }: PainPointsProps) {
  return (
    <section aria-label="Pain points" style={{ background: "#f8fafc", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Tag color="red" style={{ borderRadius: 20, marginBottom: 14, fontSize: 13, padding: "3px 14px" }}>Real freelancer frustrations</Tag>
          <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.5px" }}>{title}</h2>
          {subtitle && <p style={{ color: "#64748b", fontSize: 17 }}>{subtitle}</p>}
        </div>
        <Row gutter={[24, 24]}>
          {painPoints.map(p => (
            <Col key={p.quote} xs={24} md={8}>
              <Card style={{ borderRadius: 18, border: "1px solid #e2e8f0", height: "100%" }} styles={{ body: { padding: 28 } }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 24, color: "#e2e8f0" }}>"</div>
                  <Tag color="red" style={{ borderRadius: 20, fontSize: 11 }}>Pain {p.pain}</Tag>
                </div>
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.65, margin: "0 0 16px", fontStyle: "italic" }}>{p.quote}</p>
                <Text type="secondary" style={{ fontSize: 13 }}>— {p.author}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
