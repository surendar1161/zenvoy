"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Input, Modal, Radio, Space, Typography, message, Divider, Result } from "antd";
import {
  EditOutlined, CheckCircleFilled, SafetyCertificateOutlined,
  DeleteOutlined, InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface Props {
  documentId: string;
  documentType?: "proposal" | "contract";
  freelancerName?: string;
  clientName?: string;
  alreadySigned?: boolean;
  signedAt?: string;
  signerName?: string;
  onSigned?: () => void;
  primaryColor?: string;
}

export default function SignatureBlock({
  documentId,
  documentType = "proposal",
  freelancerName,
  clientName,
  alreadySigned = false,
  signedAt,
  signerName: existingSignerName,
  onSigned,
  primaryColor = "#0ea5e9",
}: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"type" | "draw">("type");
  const [typedName, setTypedName] = useState(clientName ?? "");
  const [signerEmail, setSignerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(alreadySigned);
  const [doneAt, setDoneAt] = useState(signedAt);
  const [doneName, setDoneName] = useState(existingSignerName);
  const [msgApi, ctx] = message.useMessage();

  // Canvas for drawing signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [open, mode]);

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    if (!canvasRef.current) return;
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d")!;
    const { x, y } = getPos(e, canvasRef.current);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d")!;
    const { x, y } = getPos(e, canvasRef.current);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  }

  function stopDraw() { drawing.current = false; }

  function clearCanvas() {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasDrawing(false);
  }

  async function submitSignature() {
    const signatureData = mode === "type"
      ? typedName.trim()
      : canvasRef.current?.toDataURL("image/png") ?? "";

    if (!signatureData || (mode === "type" && !typedName.trim())) {
      msgApi.error("Please provide your signature");
      return;
    }
    if (mode === "draw" && !hasDrawing) {
      msgApi.error("Please draw your signature");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sign-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          documentType,
          signerName: mode === "type" ? typedName.trim() : (typedName.trim() || clientName),
          signerEmail: signerEmail.trim() || undefined,
          signatureData,
          signatureType: mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      setDoneAt(data.signedAt);
      setDoneName(mode === "type" ? typedName.trim() : (typedName.trim() || clientName));
      setOpen(false);
      onSigned?.();
    } catch (e) {
      msgApi.error("Failed to save signature. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{
        border: `2px solid #10b981`, borderRadius: 16,
        padding: 28, background: "#f0fdf4", textAlign: "center"
      }}>
        <CheckCircleFilled style={{ fontSize: 48, color: "#10b981", marginBottom: 12 }} />
        <Title level={4} style={{ color: "#065f46", margin: "0 0 4px" }}>
          Signed & Accepted
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Signed by <strong>{doneName}</strong>
          {doneAt ? ` on ${new Date(doneAt).toLocaleString()}` : ""}
        </Text>
        <div style={{
          marginTop: 16, padding: "12px 16px",
          background: "#fff", borderRadius: 10, border: "1px solid #a7f3d0",
          fontFamily: "'Dancing Script', cursive, serif",
          fontSize: 28, color: "#065f46",
        }}>
          {doneName}
        </div>
      </div>
    );
  }

  return (
    <>
      {ctx}

      {/* Signature CTA */}
      <div style={{ border: `2px dashed ${primaryColor}40`, borderRadius: 16, padding: 32, textAlign: "center", background: `${primaryColor}05` }}>
        <SafetyCertificateOutlined style={{ fontSize: 40, color: primaryColor, marginBottom: 12 }} />
        <Title level={4} style={{ margin: "0 0 8px" }}>Ready to Accept?</Title>
        <Paragraph type="secondary" style={{ marginBottom: 24 }}>
          Sign this {documentType} digitally. Your signature is legally binding under US and EU e-signature laws.
          Stored with timestamp, date, and IP address.
        </Paragraph>
        <Space direction="vertical" style={{ width: "100%", maxWidth: 360, margin: "0 auto" }} size={12}>
          <Button
            type="primary" size="large" icon={<EditOutlined />} block
            onClick={() => setOpen(true)}
            style={{ height: 52, borderRadius: 12, fontWeight: 700, background: primaryColor, borderColor: primaryColor, fontSize: 16 }}
          >
            Sign This {documentType === "proposal" ? "Proposal" : "Contract"}
          </Button>
          <AcceptButton documentId={documentId} documentType={documentType} clientName={clientName} onAccepted={() => { setDone(true); setDoneAt(new Date().toISOString()); setDoneName(clientName); }} />
        </Space>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 20 }}>
          {["🔒 SSL Encrypted", "⚖️ EU & US Law Compliant", "🕒 Timestamped"].map(tag => (
            <Text key={tag} type="secondary" style={{ fontSize: 12 }}>{tag}</Text>
          ))}
        </div>
      </div>

      {/* Signature modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={
          <Space><SafetyCertificateOutlined style={{ color: primaryColor }} />
            <span>Sign {documentType === "proposal" ? "Proposal" : "Contract"}</span>
          </Space>
        }
        footer={null}
        width={520}
        centered
      >
        <div style={{ padding: "8px 0" }}>
          <Alert
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            message="By signing, you agree to the terms in this document. Your signature, timestamp, and IP address will be recorded."
            style={{ marginBottom: 20, borderRadius: 10, fontSize: 12 }}
          />

          {/* Name + Email */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Full Name *</Text>
            <Input
              size="large" placeholder="Your full legal name"
              value={typedName} onChange={e => setTypedName(e.target.value)}
              style={{ borderRadius: 10 }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Email (optional)</Text>
            <Input
              size="large" type="email" placeholder="your@email.com"
              value={signerEmail} onChange={e => setSignerEmail(e.target.value)}
              style={{ borderRadius: 10 }}
            />
          </div>

          <Divider style={{ margin: "0 0 16px" }} />

          {/* Signature type toggle */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: "block", marginBottom: 10, fontSize: 13 }}>Signature Style</Text>
            <Radio.Group value={mode} onChange={e => setMode(e.target.value)} buttonStyle="solid">
              <Radio.Button value="type" style={{ borderRadius: "8px 0 0 8px" }}>✏️ Type Name</Radio.Button>
              <Radio.Button value="draw" style={{ borderRadius: "0 8px 8px 0" }}>🖊 Draw</Radio.Button>
            </Radio.Group>
          </div>

          {/* Type preview */}
          {mode === "type" && (
            <div style={{
              border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 24px",
              background: "#fafafa", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
              fontSize: 36, color: "#1e293b",
            }}>
              {typedName || <span style={{ color: "#94a3b8", fontSize: 16 }}>Your signature will appear here</span>}
            </div>
          )}

          {/* Draw canvas */}
          {mode === "draw" && (
            <div style={{ position: "relative" }}>
              <canvas
                ref={canvasRef}
                width={460}
                height={140}
                style={{
                  border: "1px solid #e2e8f0", borderRadius: 12, background: "#fafafa",
                  cursor: "crosshair", touchAction: "none", width: "100%", display: "block",
                }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
              {!hasDrawing && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Draw your signature here</Text>
                </div>
              )}
              {hasDrawing && (
                <Button
                  size="small" icon={<DeleteOutlined />}
                  onClick={clearCanvas}
                  style={{ position: "absolute", top: 8, right: 8, borderRadius: 8 }}
                >
                  Clear
                </Button>
              )}
            </div>
          )}

          <Button
            type="primary" block size="large"
            loading={loading}
            disabled={!typedName.trim() && mode === "type"}
            onClick={submitSignature}
            style={{ marginTop: 20, height: 48, borderRadius: 12, fontWeight: 700, background: primaryColor, borderColor: primaryColor }}
          >
            Sign & Accept
          </Button>
          <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: 10, fontSize: 11 }}>
            Compliant with eIDAS (EU) and ESIGN Act (US)
          </Text>
        </div>
      </Modal>
    </>
  );
}

// ── Accept without signing ────────────────────────────────────
function AcceptButton({
  documentId, documentType, clientName, onAccepted,
}: { documentId: string; documentType: string; clientName?: string; onAccepted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [msgApi, ctx] = message.useMessage();

  async function accept() {
    setLoading(true);
    try {
      await fetch("/api/accept-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, documentType, acceptorName: clientName }),
      });
      onAccepted();
    } catch {
      msgApi.error("Failed to accept. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {ctx}
      <Button size="large" block loading={loading} onClick={accept}
        style={{ height: 48, borderRadius: 12, fontWeight: 600 }}>
        Accept Without Signing
      </Button>
    </>
  );
}
