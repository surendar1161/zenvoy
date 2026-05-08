"use client";

import { Collapse, Typography } from "antd";

const { Text, Paragraph } = Typography;

interface FAQ {
  q: string;
  a: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQ[];
}

export default function FAQSection({ title = "Frequently Asked Questions", subtitle, faqs }: FAQSectionProps) {
  return (
    <section aria-label="FAQ" style={{ background: "#f8fafc", padding: "80px 24px", borderTop: "1px solid #e2e8f0" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>{title}</h2>
        {subtitle && <p style={{ color: "#64748b", fontSize: 16, textAlign: "center", marginBottom: 40 }}>{subtitle}</p>}
        <Collapse
          accordion
          bordered={false}
          style={{ background: "transparent" }}
          items={faqs.map((item, i) => ({
            key: String(i),
            label: <Text strong style={{ fontSize: 15 }}>{item.q}</Text>,
            children: <Paragraph style={{ color: "#475569", margin: 0, lineHeight: 1.7 }}>{item.a}</Paragraph>,
            style: { marginBottom: 10, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" },
          }))}
        />
      </div>
    </section>
  );
}
