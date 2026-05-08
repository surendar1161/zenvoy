"use client";

import { Button, Space, Tag } from "antd";
import { ThunderboltFilled } from "@ant-design/icons";
import Link from "next/link";

interface CTA {
  text: string;
  href: string;
  type?: "primary" | "secondary";
}

interface LandingHeroProps {
  tag?: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCTA?: CTA;
  secondaryCTA?: CTA;
  footnote?: string;
}

export default function LandingHero({ tag, title, subtitle, primaryCTA, secondaryCTA, footnote }: LandingHeroProps) {
  return (
    <section
      aria-label="Hero"
      style={{ background: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)", padding: "90px 24px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} aria-hidden />
      <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
        {tag && (
          <Tag style={{ marginBottom: 18, borderRadius: 20, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 13, fontWeight: 700, padding: "5px 16px" }}>
            {tag}
          </Tag>
        )}
        <h1 style={{ fontSize: "clamp(32px, 5.5vw, 56px)", fontWeight: 900, color: "#fff", lineHeight: 1.12, margin: "0 0 18px", letterSpacing: "-1.5px" }}>
          {title}
        </h1>
        <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "rgba(255,255,255,0.88)", maxWidth: 640, margin: "0 auto 36px", lineHeight: 1.65 }}>
          {subtitle}
        </p>
        <Space size={12} wrap style={{ justifyContent: "center" }}>
          {primaryCTA && (
            <Link href={primaryCTA.href}>
              <Button type="primary" size="large" icon={<ThunderboltFilled />}
                style={{ height: 54, paddingInline: 36, fontSize: 17, fontWeight: 800, background: "#fff", color: "#0369a1", border: "none", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.22)" }}>
                {primaryCTA.text}
              </Button>
            </Link>
          )}
          {secondaryCTA && (
            <Link href={secondaryCTA.href}>
              <Button size="large"
                style={{ height: 54, paddingInline: 28, fontSize: 15, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", borderRadius: 14 }}>
                {secondaryCTA.text}
              </Button>
            </Link>
          )}
        </Space>
        {footnote && (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 18 }}>{footnote}</p>
        )}
      </div>
    </section>
  );
}
