"use client";

import { Button, Card, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

interface CTASectionProps {
  emoji?: string;
  tagline?: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonHref?: string;
  footnote?: string;
}

export default function CTASection({
  emoji = "📨",
  tagline = "Your AI envoy. Every client, every deal.",
  title,
  subtitle,
  buttonText = "Start for Free — 60-second setup",
  buttonHref = "/sign-up",
  footnote = "Free forever plan · No credit card · Instant access",
}: CTASectionProps) {
  return (
    <section aria-label="Call to action" style={{ padding: "90px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <Card
          style={{ borderRadius: 28, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", border: "none", boxShadow: "0 24px 80px rgba(14,165,233,0.3)" }}
          styles={{ body: { padding: "60px 48px" } }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
            {tagline}
          </Text>
          <h2 style={{ color: "#fff", fontSize: 34, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            {title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 17, lineHeight: 1.65, margin: "0 0 36px" }}>
            {subtitle}
          </p>
          <Link href={buttonHref}>
            <Button size="large" icon={<ArrowRightOutlined />}
              style={{ height: 56, paddingInline: 42, fontSize: 17, fontWeight: 800, background: "#fff", color: "#0369a1", border: "none", borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
              {buttonText}
            </Button>
          </Link>
          {footnote && (
            <div style={{ marginTop: 20, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{footnote}</div>
          )}
        </Card>
      </div>
    </section>
  );
}
