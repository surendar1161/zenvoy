"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar, Button, Card, Col, Divider, Form, Input, InputNumber, List, Modal,
  Row, Select, Space, Spin, Tag, Typography, Upload, message, DatePicker, Tabs,
} from "antd";
import type { UploadFile } from "antd";
import {
  ArrowLeftOutlined, FileOutlined, MessageOutlined, DollarOutlined,
  PlusOutlined, SendOutlined, DownloadOutlined, DeleteOutlined,
  LinkOutlined, CopyOutlined, EyeOutlined, PaperClipOutlined,
  FileTextOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Portal { id: string; token: string; title: string | null; client_name: string | null; client_email: string | null; welcome_message: string | null; is_active: boolean; brand_override: Record<string,string> | null; created_at: string; }
interface PFile { id: string; name: string; size_bytes: number | null; mime_type: string | null; storage_url: string | null; category: string; uploaded_by: string; created_at: string; approval_status: "pending" | "approved" | "needs_revision"; approval_note: string | null; }
interface PMsg { id: string; sender: string; sender_name: string | null; content: string; created_at: string; read_by_client: boolean; }
interface PInvoice { id: string; invoice_number: string | null; title: string; line_items: LineItem[]; total: number; currency: string; status: string; due_date: string | null; payment_link: string | null; created_at: string; }
interface LineItem { description: string; quantity: number; unit_price: number; amount: number; }

const FILE_ICONS: Record<string, string> = { contract: "📄", invoice: "💰", design: "🎨", image: "🖼️", document: "📝", general: "📎" };
const INV_STATUS_COLOR: Record<string, string> = { draft: "default", sent: "blue", viewed: "cyan", paid: "green", overdue: "red", cancelled: "default" };
const APPROVAL_COLORS: Record<string, string> = { pending: "#f59e0b", approved: "#10b981", needs_revision: "#ef4444" };
const APPROVAL_LABELS: Record<string, string> = { pending: "Awaiting Review", approved: "Approved ✓", needs_revision: "Needs Revision" };

export default function PortalManagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [files, setFiles] = useState<PFile[]>([]);
  const [messages, setMessages] = useState<PMsg[]>([]);
  const [invoices, setInvoices] = useState<PInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invForm] = Form.useForm();
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
  const [msgApi, ctx] = message.useMessage();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => { loadAll(); return () => { channelRef.current?.unsubscribe(); }; }, [id]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function loadAll() {
    const supabase = createClient();
    const [{ data: p }, { data: f }, { data: m }, { data: inv }] = await Promise.all([
      supabase.from("client_portals").select("*").eq("id", id).maybeSingle(),
      supabase.from("portal_files").select("*").eq("portal_id", id).order("created_at", { ascending: false }),
      supabase.from("portal_messages").select("*").eq("portal_id", id).order("created_at"),
      supabase.from("portal_invoices").select("*").eq("portal_id", id).order("created_at", { ascending: false }),
    ]);
    if (!p) { router.push("/portals"); return; }
    setPortal(p as Portal);
    setFiles((f ?? []) as PFile[]);
    setMessages((m ?? []) as PMsg[]);
    setInvoices((inv ?? []) as PInvoice[]);
    setLoading(false);

    // Subscribe to new messages
    const supabase2 = createClient();
    const ch = supabase2.channel(`portal-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "portal_messages", filter: `portal_id=eq.${id}` },
        (payload) => setMessages(prev => [...prev, payload.new as PMsg]))
      .subscribe();
    channelRef.current = ch;
  }

  async function sendMessage() {
    if (!msgText.trim()) return;
    setSending(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const freelancerName = (user?.user_metadata?.full_name as string) ?? "Freelancer";
    await supabase.from("portal_messages").insert({
      portal_id: id, sender: "freelancer",
      sender_name: freelancerName,
      content: msgText.trim(), read_by_client: false,
    });
    // Notify client via email
    if (portal?.token) {
      fetch("/api/portal/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: portal.token, event: "freelancer_message", data: { freelancerName, messagePreview: msgText.trim().slice(0, 200) } }),
      }).catch(() => {});
    }
    setMsgText("");
    setSending(false);
  }

  async function uploadFile(file: File, category: string) {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("portal-files").upload(path, file);
    if (uploadError) { msgApi.error("Upload failed: " + uploadError.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("portal-files").getPublicUrl(path);
    const { data: row } = await supabase.from("portal_files").insert({
      portal_id: id, name: file.name, original_name: file.name,
      size_bytes: file.size, mime_type: file.type,
      storage_path: path, storage_url: publicUrl, category, uploaded_by: "freelancer",
    }).select().single();
    if (row) setFiles(prev => [row as PFile, ...prev]);
    // Notify client about new file
    if (portal?.token) {
      fetch("/api/portal/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: portal.token, event: "freelancer_file_uploaded", data: { fileName: file.name } }),
      }).catch(() => {});
    }
    msgApi.success("File uploaded!");
    setUploading(false);
  }

  async function deleteFile(fileId: string, path: string) {
    Modal.confirm({
      title: "Delete this file?", okText: "Delete", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.storage.from("portal-files").remove([path]);
        await supabase.from("portal_files").delete().eq("id", fileId);
        setFiles(prev => prev.filter(f => f.id !== fileId));
        msgApi.success("File deleted");
      },
    });
  }

  async function createInvoice() {
    const values = await invForm.validateFields();
    const total = lineItems.reduce((s, i) => s + i.amount, 0);
    const supabase = createClient();
    const num = `INV-${String(invoices.length + 1).padStart(3, "0")}`;
    const { data } = await supabase.from("portal_invoices").insert({
      portal_id: id, title: values.title, invoice_number: num,
      line_items: lineItems, subtotal: total,
      tax_rate: values.tax_rate ?? 0, tax_amount: total * (values.tax_rate ?? 0) / 100,
      total: total * (1 + (values.tax_rate ?? 0) / 100),
      currency: values.currency ?? "USD", notes: values.notes,
      due_date: values.due_date ? values.due_date.toISOString() : null,
      status: "draft",
    }).select().single();
    if (data) {
      setInvoices(prev => [data as PInvoice, ...prev]);
      // Notify client about new invoice
      if (portal?.token) {
        const inv = data as PInvoice;
        fetch("/api/portal/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: portal.token, event: "invoice_sent", data: { invoiceTitle: inv.title, amount: `${inv.currency} ${inv.total.toLocaleString()}` } }),
        }).catch(() => {});
      }
    }
    setInvoiceOpen(false);
    invForm.resetFields();
    setLineItems([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
    msgApi.success("Invoice created!");
  }

  async function updateInvoiceStatus(invId: string, status: string) {
    const supabase = createClient();
    await supabase.from("portal_invoices").update({ status, paid_at: status === "paid" ? new Date().toISOString() : null }).eq("id", invId);
    setInvoices(prev => prev.map(i => i.id === invId ? { ...i, status } : i));
  }

  function updateLineItem(idx: number, field: keyof LineItem, value: string | number) {
    setLineItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: value };
      updated.amount = updated.quantity * updated.unit_price;
      return updated;
    }));
  }

  function formatBytes(b: number | null) {
    if (!b) return "";
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1024 / 1024).toFixed(1)} MB`;
  }

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 120 }}>{ctx}<Spin size="large" /></div>;
  if (!portal) return null;
  const unreadCount = messages.filter(m => m.sender === "client" && !m.read_by_client).length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>
      {ctx}
      <Link href="/portals"><Button type="text" icon={<ArrowLeftOutlined />} style={{ padding: "4px 0", color: "#64748b", marginBottom: 16 }}>All Portals</Button></Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Title level={2} style={{ margin: "0 0 4px", fontWeight: 800 }}>{portal.client_name ?? "Client Portal"}</Title>
          <Text type="secondary">{portal.title ?? "Portal"}</Text>
        </div>
        <Space>
          <Button icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(`${appUrl}/portal/${portal.token}`); msgApi.success("Link copied!"); }}>
            Copy Link
          </Button>
          <a href={`/portal/${portal.token}`} target="_blank" rel="noopener noreferrer">
            <Button type="primary" icon={<EyeOutlined />}>Preview as Client</Button>
          </a>
        </Space>
      </div>

      <Tabs defaultActiveKey="files" size="large" type="card">

        {/* ── FILES ── */}
        <TabPane tab={<Space><FileOutlined />Files ({files.length})</Space>} key="files">
          <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <Title level={5} style={{ margin: 0 }}>Shared Files</Title>
              <Upload
                beforeUpload={(file) => { uploadFile(file, "general"); return false; }}
                showUploadList={false}
                multiple
              >
                <Button type="primary" icon={<PlusOutlined />} loading={uploading} style={{ borderRadius: 8 }}>
                  Upload File
                </Button>
              </Upload>
            </div>
            {files.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                <PaperClipOutlined style={{ fontSize: 48, marginBottom: 12 }} />
                <Text type="secondary" style={{ display: "block" }}>No files yet. Upload files to share with your client.</Text>
              </div>
            ) : (
              <List
                dataSource={files}
                renderItem={f => (
                  <List.Item style={{ padding: "12px 0" }} actions={[
                    f.storage_url && <a key="dl" href={f.storage_url} target="_blank" rel="noopener noreferrer"><Button type="text" size="small" icon={<DownloadOutlined />} /></a>,
                    <Button key="del" type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteFile(f.id, f.storage_url ?? "")} />,
                  ]}>
                    <List.Item.Meta
                      avatar={<Avatar style={{ background: "#f1f5f9", fontSize: 20 }}>{FILE_ICONS[f.category] ?? "📎"}</Avatar>}
                      title={<Text strong style={{ fontSize: 14 }}>{f.name}</Text>}
                      description={
                        <Space size={10} wrap>
                          <Tag style={{ borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>{f.category}</Tag>
                          {f.uploaded_by === "client" && <Tag color="blue" style={{ borderRadius: 10, fontSize: 11 }}>Client Upload</Tag>}
                          {f.size_bytes && <Text type="secondary" style={{ fontSize: 12 }}>{formatBytes(f.size_bytes)}</Text>}
                          <Text type="secondary" style={{ fontSize: 12 }}>{new Date(f.created_at).toLocaleDateString()}</Text>
                          <Tag style={{ borderRadius: 20, fontSize: 11, color: APPROVAL_COLORS[f.approval_status ?? "pending"], borderColor: `${APPROVAL_COLORS[f.approval_status ?? "pending"]}40`, background: `${APPROVAL_COLORS[f.approval_status ?? "pending"]}12` }}>
                            {APPROVAL_LABELS[f.approval_status ?? "pending"]}
                          </Tag>
                          {f.approval_note && <Text style={{ fontSize: 11, color: "#ef4444" }}>Note: {f.approval_note}</Text>}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </TabPane>

        {/* ── MESSAGES ── */}
        <TabPane
          tab={<Space><MessageOutlined />Chat {unreadCount > 0 && <Tag color="red" style={{ borderRadius: 20, fontSize: 11 }}>{unreadCount}</Tag>}</Space>}
          key="messages"
        >
          <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
            {/* Chat messages */}
            <div style={{ height: 400, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.length === 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
                  <Text type="secondary">No messages yet. Start the conversation!</Text>
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.sender === "freelancer";
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "70%" }}>
                      {!isMe && <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>{msg.sender_name ?? "Client"}</Text>}
                      <div style={{
                        background: isMe ? "#0ea5e9" : "#f1f5f9",
                        color: isMe ? "#fff" : "#0f172a",
                        padding: "10px 14px", borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        fontSize: 14, lineHeight: 1.5,
                      }}>
                        {msg.content}
                      </div>
                      <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 3, textAlign: isMe ? "right" : "left" }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            {/* Message input */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
              <Input
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder="Type a message… (Enter to send)"
                style={{ borderRadius: 10, flex: 1 }}
                size="large"
              />
              <Button type="primary" icon={<SendOutlined />} loading={sending} onClick={sendMessage}
                disabled={!msgText.trim()} style={{ borderRadius: 10, height: 40 }}>
                Send
              </Button>
            </div>
          </Card>
        </TabPane>

        {/* ── INVOICES ── */}
        <TabPane tab={<Space><DollarOutlined />Invoices ({invoices.length})</Space>} key="invoices">
          <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <Title level={5} style={{ margin: 0 }}>Invoices</Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setInvoiceOpen(true)} style={{ borderRadius: 8 }}>
                Create Invoice
              </Button>
            </div>
            {invoices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <DollarOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 12 }} />
                <Text type="secondary" style={{ display: "block" }}>No invoices yet.</Text>
              </div>
            ) : (
              <List dataSource={invoices} renderItem={inv => (
                <List.Item style={{ padding: "16px 0" }} actions={[
                  <Select key="status" value={inv.status} size="small" style={{ width: 110 }}
                    onChange={v => updateInvoiceStatus(inv.id, v)}
                    options={["draft","sent","viewed","paid","overdue","cancelled"].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />,
                ]}>
                  <List.Item.Meta
                    avatar={<Avatar style={{ background: "#f0fdf4", color: "#10b981", fontWeight: 700 }} icon={<FileTextOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{inv.invoice_number} — {inv.title}</Text>
                        <Tag color={INV_STATUS_COLOR[inv.status]} style={{ borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>{inv.status}</Tag>
                      </Space>
                    }
                    description={
                      <Space size={16}>
                        <Text strong style={{ color: "#10b981", fontSize: 15 }}>{inv.currency} {inv.total.toLocaleString()}</Text>
                        {inv.due_date && <Text type="secondary" style={{ fontSize: 12 }}>Due {new Date(inv.due_date).toLocaleDateString()}</Text>}
                      </Space>
                    }
                  />
                </List.Item>
              )} />
            )}
          </Card>
        </TabPane>

      </Tabs>

      {/* Create Invoice Modal */}
      <Modal open={invoiceOpen} onCancel={() => setInvoiceOpen(false)} title="Create Invoice" width={640}
        footer={[
          <Button key="cancel" onClick={() => setInvoiceOpen(false)}>Cancel</Button>,
          <Button key="create" type="primary" onClick={createInvoice} style={{ borderRadius: 8, fontWeight: 600 }}>Create Invoice</Button>,
        ]}
      >
        <Form form={invForm} layout="vertical" size="large" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={16}><Form.Item name="title" label="Invoice Title" rules={[{ required: true }]}><Input placeholder="Website Design — Phase 1" style={{ borderRadius: 8 }} /></Form.Item></Col>
            <Col span={8}><Form.Item name="currency" label="Currency"><Select defaultValue="USD" options={["USD","GBP","EUR","AUD","INR"].map(c => ({ value: c, label: c }))} /></Form.Item></Col>
          </Row>
          {/* Line items */}
          <Text strong style={{ display: "block", marginBottom: 10 }}>Line Items</Text>
          {lineItems.map((item, idx) => (
            <Row gutter={[8, 0]} key={idx} style={{ marginBottom: 8 }}>
              <Col span={10}><Input placeholder="Description" value={item.description} onChange={e => updateLineItem(idx, "description", e.target.value)} style={{ borderRadius: 6 }} /></Col>
              <Col span={4}><InputNumber placeholder="Qty" value={item.quantity} min={1} onChange={v => updateLineItem(idx, "quantity", v ?? 1)} style={{ width: "100%", borderRadius: 6 }} /></Col>
              <Col span={5}><InputNumber placeholder="Unit price" value={item.unit_price} min={0} onChange={v => updateLineItem(idx, "unit_price", v ?? 0)} style={{ width: "100%", borderRadius: 6 }} /></Col>
              <Col span={4}><Input value={item.amount.toFixed(2)} readOnly style={{ borderRadius: 6, background: "#f8fafc", textAlign: "right" }} /></Col>
              <Col span={1}><Button type="text" danger icon={<DeleteOutlined />} onClick={() => setLineItems(p => p.filter((_, i) => i !== idx))} /></Col>
            </Row>
          ))}
          <Button size="small" icon={<PlusOutlined />} onClick={() => setLineItems(p => [...p, { description: "", quantity: 1, unit_price: 0, amount: 0 }])} style={{ marginBottom: 16 }}>Add Line</Button>
          <div style={{ textAlign: "right", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
            Total: {lineItems.reduce((s, i) => s + i.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="tax_rate" label="Tax %"><InputNumber min={0} max={100} placeholder="0" style={{ width: "100%", borderRadius: 8 }} /></Form.Item></Col>
            <Col span={16}><Form.Item name="due_date" label="Due Date"><DatePicker style={{ width: "100%", borderRadius: 8 }} /></Form.Item></Col>
          </Row>
          <Form.Item name="notes" label="Notes"><Input.TextArea rows={2} placeholder="Payment terms, bank details…" style={{ borderRadius: 8 }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
