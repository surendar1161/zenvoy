"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  Avatar, Button, Card, Divider, Input, List, Result, Space, Spin, Tag, Typography, message,
} from "antd";
import {
  FileOutlined, MessageOutlined, DollarOutlined, HomeOutlined,
  DownloadOutlined, SendOutlined, CheckCircleOutlined, PaperClipOutlined,
  CalendarOutlined, FileProtectOutlined, SolutionOutlined,
  UploadOutlined, InboxOutlined,
} from "@ant-design/icons";
import { Upload } from "antd";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { BrandKit } from "@/lib/brand";
import { DEFAULT_BRAND } from "@/lib/brand";
import SchedulingEmbed from "@/components/SchedulingEmbed";
import SignatureBlock from "@/components/SignatureBlock";

const { Title, Text, Paragraph } = Typography;

interface Portal { id: string; token: string; title: string | null; client_name: string | null; welcome_message: string | null; is_active: boolean; brand_override: BrandKit | null; }
interface PFile { id: string; name: string; size_bytes: number | null; category: string; storage_url: string | null; uploaded_by: string; created_at: string; approval_status?: string; }
interface PMsg { id: string; sender: string; sender_name: string | null; content: string; created_at: string; }
interface PInvoice { id: string; invoice_number: string | null; title: string; line_items: { description: string; quantity: number; unit_price: number; amount: number }[]; total: number; currency: string; status: string; due_date: string | null; payment_link: string | null; }
interface PContract { id: string; title: string | null; contract_type: string | null; party_a_name: string | null; party_b_name: string | null; governing_law: string | null; contract_text: string | null; status: string; signed_at: string | null; signer_name: string | null; created_at: string; }
interface PProposal { id: string; client_name: string | null; project_type: string | null; proposal_text: string | null; tiers: unknown; total_budget: number | null; currency: string | null; status: string; signed_at: string | null; signer_name: string | null; accepted_at: string | null; created_at: string; freelancer_name: string | null; }

const FILE_ICONS: Record<string, string> = { contract: "📄", invoice: "💰", design: "🎨", image: "🖼️", document: "📝", general: "📎" };
const INV_COLOR: Record<string, string> = { draft: "#94a3b8", sent: "#0ea5e9", viewed: "#06b6d4", paid: "#10b981", overdue: "#ef4444" };

const BASE_SECTIONS = [
  { key: "overview",   label: "Overview",   icon: <HomeOutlined /> },
  { key: "files",      label: "Files",      icon: <FileOutlined /> },
  { key: "contracts",  label: "Contracts",  icon: <FileProtectOutlined /> },
  { key: "proposals",  label: "Proposals",  icon: <SolutionOutlined /> },
  { key: "invoices",   label: "Invoices",   icon: <DollarOutlined /> },
  { key: "messages",   label: "Messages",   icon: <MessageOutlined /> },
  { key: "schedule",   label: "Schedule",   icon: <CalendarOutlined /> },
];

export default function ClientPortalPage() {
  const { token } = useParams<{ token: string }>();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [files, setFiles] = useState<PFile[]>([]);
  const [messages, setMessages] = useState<PMsg[]>([]);
  const [invoices, setInvoices] = useState<PInvoice[]>([]);
  const [contracts, setContracts] = useState<PContract[]>([]);
  const [proposals, setProposals] = useState<PProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [section, setSection] = useState("overview");
  const [msgText, setMsgText] = useState("");
  const [clientName, setClientName] = useState("");
  const [sending, setSending] = useState(false);
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
  const [msgApi, ctx] = message.useMessage();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const visitTracked = useRef(false);

  useEffect(() => {
    load();
    return () => { channelRef.current?.unsubscribe(); };
  }, [token]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function load() {
    const supabase = createClient();
    const { data: p } = await supabase.from("client_portals").select("*").eq("token", token).maybeSingle();
    if (!p) { setLoading(false); return; }
    setPortal(p as Portal);
    setClientName(p.client_name ?? "");

    const [{ data: f }, { data: m }, { data: inv }] = await Promise.all([
      supabase.from("portal_files").select("*").eq("portal_id", p.id).order("created_at", { ascending: false }),
      supabase.from("portal_messages").select("*").eq("portal_id", p.id).order("created_at"),
      supabase.from("portal_invoices").select("*").eq("portal_id", p.id).neq("status", "draft").order("created_at", { ascending: false }),
    ]);
    setFiles((f ?? []) as PFile[]);
    setMessages((m ?? []) as PMsg[]);
    setInvoices((inv ?? []) as PInvoice[]);

    // Fetch contracts and proposals via portal API
    const [contractsRes, proposalsRes] = await Promise.all([
      fetch(`/api/portal/contracts?token=${token}`).then(r => r.ok ? r.json() : []),
      fetch(`/api/portal/proposals?token=${token}`).then(r => r.ok ? r.json() : []),
    ]);
    setContracts(contractsRes as PContract[]);
    setProposals(proposalsRes as PProposal[]);

    // Fetch freelancer's scheduling link
    if (p.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("scheduling_enabled, scheduling_link")
        .eq("id", p.user_id)
        .maybeSingle();
      if (profile?.scheduling_enabled && profile?.scheduling_link) {
        setSchedulingLink(profile.scheduling_link);
      }
    }

    setLoading(false);

    // Track visit
    if (!visitTracked.current) {
      visitTracked.current = true;
      await supabase.from("client_portals").update({ last_client_visit: new Date().toISOString() }).eq("id", p.id);
    }

    // Subscribe realtime
    const ch = supabase.channel(`client-portal-${p.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "portal_messages", filter: `portal_id=eq.${p.id}` },
        payload => setMessages(prev => [...prev, payload.new as PMsg]))
      .subscribe();
    channelRef.current = ch;
  }

  async function sendMessage() {
    if (!msgText.trim() || !portal) return;
    setSending(true);
    const supabase = createClient();
    await supabase.from("portal_messages").insert({
      portal_id: portal.id, sender: "client",
      sender_name: clientName || "Client",
      content: msgText.trim(), read_by_freelancer: false,
    });
    setMsgText("");
    setSending(false);
  }

  async function handleUpload(file: File) {
    if (!portal) return false;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("token", token);
      form.append("category", "general");
      form.append("clientName", clientName || portal.client_name || "Client");
      const res = await fetch("/api/portal/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        msgApi.error(err.error || "Upload failed");
        return false;
      }
      const uploaded = await res.json();
      setFiles(prev => [uploaded as PFile, ...prev]);
      msgApi.success("File uploaded successfully");
    } catch {
      msgApi.error("Upload failed");
    } finally {
      setUploading(false);
    }
    return false;
  }

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spin size="large" /></div>;

  if (!portal) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <Result status="404" title="Portal not found" subTitle="This link may have expired or been deactivated. Contact the sender for a new link." />
    </div>
  );

  if (!portal.is_active) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <Result status="warning" title="Portal unavailable" subTitle="This portal has been temporarily deactivated. Please contact the sender." />
    </div>
  );

  const brand: BrandKit = portal.brand_override ?? DEFAULT_BRAND;
  const primary = brand.primaryColor ?? "#0ea5e9";
  const fontFamily = `'${brand.fontFamily ?? "Inter"}', sans-serif`;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily }}>
      {ctx}

      {/* Load Google Font */}
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(brand.fontFamily ?? "Inter")}:wght@400;600;700;800&display=swap`} />

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${primary}dd, ${primary})`, padding: "0 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            {brand.logoUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={brand.logoUrl} alt="Logo" style={{ height: 36, objectFit: "contain" }} />
              : <Text strong style={{ color: "rgba(255,255,255,0.9)", fontSize: 18 }}>{brand.companyName}</Text>
            }
          </div>
          <Title level={2} style={{ color: "#fff", margin: "0 0 6px", fontWeight: 900, fontSize: 28 }}>
            {portal.title ?? `Project Hub — ${portal.client_name}`}
          </Title>
          {portal.welcome_message && (
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, display: "block", marginBottom: 24 }}>
              {portal.welcome_message}
            </Text>
          )}

          {/* Nav tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "none", flexWrap: "wrap" }}>
            {BASE_SECTIONS.filter(s => {
              if (s.key === "schedule" && !schedulingLink) return false;
              if (s.key === "contracts" && contracts.length === 0) return false;
              if (s.key === "proposals" && proposals.length === 0) return false;
              return true;
            }).map(s => (
              <button key={s.key} onClick={() => setSection(s.key)}
                style={{
                  padding: "10px 20px", border: "none", cursor: "pointer", fontFamily, fontWeight: 600,
                  fontSize: 14, borderRadius: "10px 10px 0 0", marginRight: 4,
                  background: section === s.key ? "#fff" : "rgba(255,255,255,0.15)",
                  color: section === s.key ? primary : "rgba(255,255,255,0.85)",
                  transition: "all 0.15s",
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── OVERVIEW ── */}
        {section === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { icon: "📎", label: "Files", value: files.length, onClick: () => setSection("files") },
                ...(contracts.length > 0 ? [{ icon: "📜", label: "Contracts", value: contracts.length, onClick: () => setSection("contracts") }] : []),
                ...(proposals.length > 0 ? [{ icon: "📋", label: "Proposals", value: proposals.length, onClick: () => setSection("proposals") }] : []),
                { icon: "💰", label: "Invoices", value: invoices.length, onClick: () => setSection("invoices") },
                { icon: "💬", label: "Messages", value: messages.length, onClick: () => setSection("messages") },
              ].map(s => (
                <Card key={s.label} hoverable onClick={s.onClick} style={{ borderRadius: 14, border: "1px solid #e2e8f0", cursor: "pointer", textAlign: "center" }} styles={{ body: { padding: 20 } }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: primary }}>{s.value}</div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{s.label}</Text>
                </Card>
              ))}
            </div>
            {/* Recent files */}
            {files.length > 0 && (
              <Card title="Recent Files" style={{ borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 20 }} styles={{ body: { padding: "8px 20px" } }}>
                {files.slice(0, 4).map(f => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ fontSize: 20 }}>{FILE_ICONS[f.category] ?? "📎"}</span>
                    <Text style={{ flex: 1, fontSize: 14 }}>{f.name}</Text>
                    {f.storage_url && <a href={f.storage_url} target="_blank" rel="noopener noreferrer"><Button size="small" icon={<DownloadOutlined />} style={{ borderRadius: 6 }} /></a>}
                  </div>
                ))}
              </Card>
            )}
            {/* Unpaid invoices */}
            {invoices.filter(i => i.status !== "paid" && i.status !== "cancelled").length > 0 && (
              <Card title={<span style={{ color: "#f59e0b" }}>⚠️ Outstanding Invoices</span>}
                style={{ borderRadius: 14, border: "1px solid #fcd34d", background: "#fffbeb" }} styles={{ body: { padding: 20 } }}>
                {invoices.filter(i => i.status !== "paid" && i.status !== "cancelled").map(inv => (
                  <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <Text strong>{inv.title}</Text>
                      {inv.due_date && <Text type="secondary" style={{ fontSize: 12, display: "block" }}>Due {new Date(inv.due_date).toLocaleDateString()}</Text>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text strong style={{ color: "#10b981", display: "block" }}>{inv.currency} {inv.total.toLocaleString()}</Text>
                      {inv.payment_link && (
                        <a href={inv.payment_link} target="_blank" rel="noopener noreferrer">
                          <Button size="small" type="primary" style={{ borderRadius: 6, background: primary, borderColor: primary, marginTop: 4 }}>Pay Now</Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {/* ── FILES ── */}
        {section === "files" && (
          <div>
            {/* Upload area */}
            <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
              <Upload.Dragger
                beforeUpload={handleUpload}
                showUploadList={false}
                disabled={uploading}
                multiple={false}
                style={{ borderRadius: 12, border: `2px dashed ${primary}40`, background: `${primary}05` }}
              >
                <p style={{ marginBottom: 8 }}>
                  <InboxOutlined style={{ fontSize: 36, color: primary }} />
                </p>
                <Text strong style={{ fontSize: 14 }}>
                  {uploading ? "Uploading..." : "Click or drag a file to upload"}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Share files with your team (max 25 MB)
                </Text>
              </Upload.Dragger>
            </Card>

            <Card title={<Space><FileOutlined style={{ color: primary }} />{files.length} Files</Space>}
              style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
              {files.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <PaperClipOutlined style={{ fontSize: 48, color: "#cbd5e1" }} />
                  <Text type="secondary" style={{ display: "block", marginTop: 12 }}>No files have been shared yet.</Text>
                </div>
              ) : (
                files.map(f => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
                    <Avatar size={40} style={{ background: "#f1f5f9", fontSize: 20 }}>{FILE_ICONS[f.category] ?? "📎"}</Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Space>
                        <Text strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</Text>
                        {f.uploaded_by === "client" && <Tag color="blue" style={{ borderRadius: 10, fontSize: 11 }}>You</Tag>}
                      </Space>
                      <div>
                        <Space size={12}>
                          <Tag style={{ borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>{f.category}</Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>{new Date(f.created_at).toLocaleDateString()}</Text>
                        </Space>
                      </div>
                    </div>
                    {f.storage_url && (
                      <a href={f.storage_url} target="_blank" rel="noopener noreferrer">
                        <Button icon={<DownloadOutlined />} style={{ borderRadius: 8 }}>Download</Button>
                      </a>
                    )}
                  </div>
                ))
              )}
            </Card>
          </div>
        )}

        {/* ── CONTRACTS ── */}
        {section === "contracts" && (
          <div>
            {contracts.length === 0 ? (
              <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "60px 40px" } }}>
                <FileProtectOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 12 }} />
                <Text type="secondary" style={{ display: "block" }}>No contracts available.</Text>
              </Card>
            ) : contracts.map(c => (
              <Card key={c.id} style={{ borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <div>
                    <Text strong style={{ fontSize: 16 }}>{c.title || "Contract"}</Text>
                    {c.contract_type && <Tag style={{ borderRadius: 20, fontSize: 11, marginLeft: 8, textTransform: "capitalize" }}>{c.contract_type}</Tag>}
                    <Tag style={{ borderRadius: 20, fontSize: 11, marginLeft: 4, color: c.status === "signed" ? "#10b981" : "#0ea5e9", borderColor: c.status === "signed" ? "#10b98140" : "#0ea5e940", background: c.status === "signed" ? "#10b98112" : "#0ea5e912", textTransform: "capitalize" }}>{c.status}</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{new Date(c.created_at).toLocaleDateString()}</Text>
                </div>
                <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
                  {c.party_a_name && <Text type="secondary" style={{ fontSize: 13 }}>From: <strong>{c.party_a_name}</strong></Text>}
                  {c.party_b_name && <Text type="secondary" style={{ fontSize: 13 }}>To: <strong>{c.party_b_name}</strong></Text>}
                  {c.governing_law && <Text type="secondary" style={{ fontSize: 13 }}>Law: <strong>{c.governing_law}</strong></Text>}
                </div>
                {c.contract_text && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 20px", marginBottom: 20, fontSize: 14, lineHeight: 1.7, color: "#334155", maxHeight: 400, overflowY: "auto" }}
                    dangerouslySetInnerHTML={{ __html: c.contract_text.replace(/\n/g, "<br/>") }} />
                )}
                <Divider />
                <SignatureBlock
                  documentId={c.id}
                  documentType="contract"
                  clientName={clientName || portal.client_name || undefined}
                  alreadySigned={!!c.signed_at}
                  signedAt={c.signed_at ?? undefined}
                  signerName={c.signer_name ?? undefined}
                  primaryColor={primary}
                  onSigned={() => setContracts(prev => prev.map(x => x.id === c.id ? { ...x, signed_at: new Date().toISOString(), signer_name: clientName || portal.client_name || "Client", status: "signed" } : x))}
                />
              </Card>
            ))}
          </div>
        )}

        {/* ── PROPOSALS ── */}
        {section === "proposals" && (
          <div>
            {proposals.length === 0 ? (
              <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "60px 40px" } }}>
                <SolutionOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 12 }} />
                <Text type="secondary" style={{ display: "block" }}>No proposals available.</Text>
              </Card>
            ) : proposals.map(p => {
              const statusColor: Record<string, string> = { sent: "#0ea5e9", viewed: "#06b6d4", accepted: "#10b981" };
              return (
                <Card key={p.id} style={{ borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                    <div>
                      <Text strong style={{ fontSize: 16 }}>{p.project_type || "Proposal"}</Text>
                      <Tag style={{ borderRadius: 20, fontSize: 11, marginLeft: 8, color: statusColor[p.status] ?? "#94a3b8", borderColor: `${statusColor[p.status] ?? "#94a3b8"}40`, background: `${statusColor[p.status] ?? "#94a3b8"}12`, textTransform: "capitalize" }}>{p.status}</Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString()}</Text>
                  </div>
                  {p.freelancer_name && <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>From: <strong>{p.freelancer_name}</strong></Text>}
                  {p.total_budget != null && (
                    <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "inline-block" }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Total Budget</Text>
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#10b981" }}>{p.currency ?? "USD"} {p.total_budget.toLocaleString()}</div>
                    </div>
                  )}
                  {p.proposal_text && (
                    <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 20px", marginBottom: 20, fontSize: 14, lineHeight: 1.7, color: "#334155", maxHeight: 400, overflowY: "auto" }}
                      dangerouslySetInnerHTML={{ __html: p.proposal_text.replace(/\n/g, "<br/>") }} />
                  )}
                  {p.status !== "accepted" && (
                    <>
                      <Divider />
                      <SignatureBlock
                        documentId={p.id}
                        documentType="proposal"
                        clientName={clientName || portal.client_name || undefined}
                        alreadySigned={!!p.signed_at}
                        signedAt={p.signed_at ?? undefined}
                        signerName={p.signer_name ?? undefined}
                        primaryColor={primary}
                        onSigned={() => setProposals(prev => prev.map(x => x.id === p.id ? { ...x, signed_at: new Date().toISOString(), signer_name: clientName || portal.client_name || "Client" } : x))}
                      />
                    </>
                  )}
                  {p.status === "accepted" && (
                    <div style={{ textAlign: "center", color: "#10b981", fontWeight: 700, fontSize: 15, padding: "12px 0" }}>
                      <CheckCircleOutlined style={{ marginRight: 6 }} />Accepted
                      {p.accepted_at && <Text type="secondary" style={{ display: "block", fontSize: 12, marginTop: 4 }}>on {new Date(p.accepted_at).toLocaleDateString()}</Text>}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ── INVOICES ── */}
        {section === "invoices" && (
          <div>
            {invoices.length === 0 ? (
              <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "60px 40px" } }}>
                <DollarOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 12 }} />
                <Text type="secondary" style={{ display: "block" }}>No invoices yet.</Text>
              </Card>
            ) : invoices.map(inv => (
              <Card key={inv.id} style={{ borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <div>
                    <Space align="center" size={10}>
                      <Text strong style={{ fontSize: 16 }}>{inv.invoice_number} — {inv.title}</Text>
                      <Tag style={{ borderRadius: 20, fontSize: 11, color: INV_COLOR[inv.status], borderColor: `${INV_COLOR[inv.status]}40`, background: `${INV_COLOR[inv.status]}12`, textTransform: "capitalize" }}>{inv.status}</Tag>
                    </Space>
                    {inv.due_date && <Text type="secondary" style={{ display: "block", fontSize: 13, marginTop: 2 }}>Due {new Date(inv.due_date).toLocaleDateString()}</Text>}
                  </div>
                  <Text strong style={{ fontSize: 22, color: "#10b981" }}>{inv.currency} {inv.total.toLocaleString()}</Text>
                </div>
                {inv.line_items?.length > 0 && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
                    {inv.line_items.map((li, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
                        <Text>{li.description} × {li.quantity}</Text>
                        <Text strong>{inv.currency} {li.amount.toLocaleString()}</Text>
                      </div>
                    ))}
                  </div>
                )}
                {inv.payment_link && inv.status !== "paid" && (
                  <a href={inv.payment_link} target="_blank" rel="noopener noreferrer">
                    <Button type="primary" block size="large"
                      style={{ borderRadius: 10, height: 48, fontWeight: 700, background: primary, borderColor: primary }}>
                      💳 Pay Now — {inv.currency} {inv.total.toLocaleString()}
                    </Button>
                  </a>
                )}
                {inv.status === "paid" && (
                  <div style={{ textAlign: "center", color: "#10b981", fontWeight: 700, fontSize: 15 }}>
                    <CheckCircleOutlined style={{ marginRight: 6 }} />Paid — Thank you!
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {section === "messages" && (
          <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
            {/* Name prompt */}
            {!clientName && (
              <div style={{ padding: "16px 20px", background: "#eff6ff", borderRadius: "12px 12px 0 0", borderBottom: "1px solid #dbeafe" }}>
                <Space>
                  <Text style={{ color: "#1d4ed8", fontSize: 13 }}>Your name:</Text>
                  <Input size="small" placeholder="e.g. Sarah Chen" style={{ borderRadius: 8, width: 200 }}
                    onBlur={e => setClientName(e.target.value)}
                    onPressEnter={e => setClientName((e.target as HTMLInputElement).value)} />
                </Space>
              </div>
            )}
            <div style={{ height: 420, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.length === 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <Text type="secondary">No messages yet. Say hello! 👋</Text>
                </div>
              )}
              {messages.map(msg => {
                const isClient = msg.sender === "client";
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isClient ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "70%" }}>
                      {!isClient && <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>{msg.sender_name ?? "Your team"}</Text>}
                      <div style={{
                        background: isClient ? primary : "#f1f5f9",
                        color: isClient ? "#fff" : "#0f172a",
                        padding: "10px 14px", borderRadius: isClient ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        fontSize: 14, lineHeight: 1.5,
                      }}>
                        {msg.content}
                      </div>
                      <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 3, textAlign: isClient ? "right" : "left" }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
              <Input value={msgText} onChange={e => setMsgText(e.target.value)}
                onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder="Message your team… (Enter to send)"
                style={{ borderRadius: 10, flex: 1 }} size="large" />
              <Button type="primary" icon={<SendOutlined />} loading={sending} onClick={sendMessage}
                disabled={!msgText.trim()} style={{ borderRadius: 10, height: 40, background: primary, borderColor: primary }}>
                Send
              </Button>
            </div>
          </Card>
        )}

        {/* ── SCHEDULE ── */}
        {section === "schedule" && schedulingLink && (
          <SchedulingEmbed
            link={schedulingLink}
            clientName={clientName || portal.client_name || ""}
            primaryColor={primary}
          />
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e2e8f0", padding: "20px 24px", textAlign: "center", marginTop: 40 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Secure client portal · Powered by {brand.companyName || "DealPilot"}
        </Text>
      </div>
    </div>
  );
}
