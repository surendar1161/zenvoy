"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Typography } from "antd";
import { CalendarOutlined, LinkOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Platform = "calendly" | "cal_com" | "acuity" | "custom";

interface Props {
  link: string;
  platform?: Platform;
  clientName?: string;
  clientEmail?: string;
  primaryColor?: string;
}

function detectPlatform(url: string): Platform {
  try {
    const host = new URL(url).hostname;
    if (host.includes("calendly.com")) return "calendly";
    if (host.includes("cal.com")) return "cal_com";
    if (host.includes("acuityscheduling.com") || host.includes("squarespacescheduling.com")) return "acuity";
  } catch {}
  return "custom";
}

function buildEmbedUrl(link: string, platform: Platform, clientName?: string, clientEmail?: string): string {
  try {
    const url = new URL(link);
    if (platform === "calendly") {
      if (clientName) url.searchParams.set("name", clientName);
      if (clientEmail) url.searchParams.set("email", clientEmail);
    } else if (platform === "cal_com") {
      if (clientName) url.searchParams.set("name", clientName);
      if (clientEmail) url.searchParams.set("email", clientEmail);
    } else if (platform === "acuity") {
      if (clientName) url.searchParams.set("firstName", clientName.split(" ")[0]);
      if (clientEmail) url.searchParams.set("email", clientEmail);
    }
    return url.toString();
  } catch {
    return link;
  }
}

function supportsIframe(platform: Platform): boolean {
  return platform === "calendly" || platform === "cal_com";
}

export default function SchedulingEmbed({ link, platform, clientName, clientEmail, primaryColor = "#0ea5e9" }: Props) {
  const detected = platform ?? detectPlatform(link);
  const embedUrl = buildEmbedUrl(link, detected, clientName, clientEmail);
  const canEmbed = supportsIframe(detected);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (detected !== "calendly") return;
    function onMessage(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        setIframeLoaded(true);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [detected]);

  return (
    <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
      <div style={{
        padding: "16px 20px",
        background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)`,
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <CalendarOutlined style={{ fontSize: 20, color: primaryColor }} />
        <div>
          <Text strong style={{ fontSize: 15, display: "block" }}>Book a Meeting</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Select a time that works for you</Text>
        </div>
      </div>

      {canEmbed ? (
        <div style={{ position: "relative", minHeight: 600 }}>
          {!iframeLoaded && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
              <Text type="secondary">Loading scheduler...</Text>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={embedUrl}
            width="100%"
            height="660"
            frameBorder="0"
            onLoad={() => setIframeLoaded(true)}
            style={{ border: "none", display: "block" }}
            allow="payment"
          />
        </div>
      ) : (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <CalendarOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 16 }} />
          <Text style={{ display: "block", fontSize: 15, marginBottom: 4 }}>
            Schedule a call to discuss your project
          </Text>
          <Text type="secondary" style={{ display: "block", fontSize: 13, marginBottom: 20 }}>
            Click below to open the scheduling page
          </Text>
          <a href={embedUrl} target="_blank" rel="noopener noreferrer">
            <Button type="primary" icon={<LinkOutlined />} size="large"
              style={{ borderRadius: 10, fontWeight: 600, background: primaryColor, borderColor: primaryColor }}>
              Open Scheduling Page
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
