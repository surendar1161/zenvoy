"use client";

import { Row, Col, Space, Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

const { Text } = Typography;

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  points: string[];
  bg: string;
  border: string;
}

interface FeatureShowcaseProps {
  features: Feature[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function FeatureShowcase({ features, sectionTitle, sectionSubtitle }: FeatureShowcaseProps) {
  return (
    <section style={{ padding: "90px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {sectionTitle && (
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>{sectionTitle}</h2>
            {sectionSubtitle && <p style={{ color: "#64748b", fontSize: 17, maxWidth: 540, margin: "0 auto" }}>{sectionSubtitle}</p>}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
          {features.map((f, i) => (
            <Row key={f.title} gutter={[60, 40]} align="middle" style={{ flexDirection: i % 2 !== 0 ? "row-reverse" : "row" }}>
              <Col xs={24} md={12}>
                <div style={{ background: f.bg, border: `1.5px solid ${f.border}`, borderRadius: 24, padding: 40, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: 16 }}>{f.icon}</div>
                    <div style={{ fontSize: 40, fontWeight: 900, color: "#0f172a" }}>{f.title}</div>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <h3 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.3px" }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, margin: "0 0 20px" }}>{f.desc}</p>
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  {f.points.map(pt => (
                    <Space key={pt} align="start" size={8}>
                      <CheckCircleFilled style={{ color: "#10b981", fontSize: 15, marginTop: 2, flexShrink: 0 }} />
                      <Text style={{ fontSize: 15 }}>{pt}</Text>
                    </Space>
                  ))}
                </Space>
              </Col>
            </Row>
          ))}
        </div>
      </div>
    </section>
  );
}
