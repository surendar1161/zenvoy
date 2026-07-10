import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DealPilot — AI Proposal Software for Freelancers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ fontSize: 48 }}>⚡</div>
          <span style={{ fontSize: 42, fontWeight: 800, color: "#fff" }}>DealPilot</span>
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", lineHeight: 1.15, maxWidth: 900, letterSpacing: "-2px" }}>
          Your AI Co-Pilot for Closing Client Deals
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.85)", marginTop: 24, maxWidth: 800, lineHeight: 1.4 }}>
          AI proposals · E-signatures · Client portals · Stripe payments
        </div>
      </div>
    ),
    { ...size },
  );
}
