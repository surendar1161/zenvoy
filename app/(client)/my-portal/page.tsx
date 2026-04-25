"use client";

import { useEffect, useRef, useState } from "react";
import {
  Avatar, Badge, Button, Card, Col, Empty, Progress, Row, Space,
  Spin, Tag, Tabs, Typography, message, Tooltip,
} from "antd";
import {
  FileOutlined, MessageOutlined, DollarOutlined, DownloadOutlined,
  SendOutlined, CheckCircleOutlined, ThunderboltFilled, LogoutOutlined,
  ClockCircleOutlined, CheckOutlined, EditOutlined, BellOutlined,
  FolderOpenOutlined, HistoryOutlined, UserOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

interface Portal {
  id: string; token: string; title: string | null;
  client_name: string | null; welcome_message: string | null; project_id: string | null;
  brand_override: { primaryColor?: string; logoUrl?: string; companyName?: string } | null;
}
interface PFile {
  id: string; name: string; size_bytes: number | null; category: string;
  storage_url: string | null; created_at: string;
  approval_status: "pending" | "approved" | "needs_revision";
  approval_note: string | null;
}
interface PMsg { id: string; sender: string; sender_name: string | null; content: string; created_at: string; }
interface PInvoice { id: string; invoice_number: string | null; title: string; total: number; currency: string; status: string; due_date: string | null; payment_link: string | null; created_at: string; }
interface ProjectTask { id: string; title: string; status: string; }
interface Activity { id: string; actor: string; actor_name: string | null; event_type: string; description: string; created_at: string; }

const INV_COLOR: Record<string, string> = { draft: "#94a3b8", sent: "#0ea5e9", viewed: "#06b6d4", paid: "#10b981", overdue: "#ef4444" };
const FILE_ICONS: Record<string, string> = { contract: "📄", invoice: "💰", design: "🎨", image: "🖼️", document: "📝", general: "📎" };
const APPROVAL_CONFIG = {
  pending:        { color: "#f59e0b", bg: "#fffbeb", label: "Awaiting Review",  icon: <ClockCircleOutlined /> },
  approved:       { color: "#10b981", bg: "#f0fdf4", label: "Approved",         icon: <CheckCircleOutlined /> },
  needs_revision: { color: "#ef4444", bg: "#fff1f2", label: "Needs Revision",   icon: <EditOutlined /> },
};

export default function MyPortalPage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [activePortal, setActivePortal] = useState<Portal | null>(null);
  const [files, setFiles] = useState<PFile[]>([]);
  const [messages, setMessages] = useState<PMsg[]>([]);
  const [invoices, setInvoices] = useState<PInvoice[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [msgApi, ctx] = message.useMessage();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    load();
    return () => { channelRef.current?.unsubscribe(); };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setClientEmail(user.email ?? "");
    setClientName(user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Client");

    // Check first visit
    const visitKey = `dealpilot_portal_visited_${user.id}`;
    if (!localStorage.getItem(visitKey)) {
      setIsFirstVisit(true);
      localStorage.setItem(visitKey, "1");
    }

    const { data: ps } = await supabase
      .from("client_portals")
      .select("*")
      .eq("client_email", user.email)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    setPortals((ps ?? []) as Portal[]);
    if (ps && ps.length > 0) await loadPortalData(ps[0] as Portal);
    setLoading(false);
  }

  async function loadPortalData(portal: Portal) {
    setActivePortal(portal);
    const supabase = createClient();

    const [{ data: f }, { data: m }, { data: inv }, { data: act }] = await Promise.all([
      supabase.from("portal_files").select("*").eq("portal_id", portal.id).order("created_at", { ascending: false }),
      supabase.from("portal_messages").select("*").eq("portal_id", portal.id).order("created_at"),
      supabase.from("portal_invoices").select("*").eq("portal_id", portal.id).neq("status", "draft").order("created_at", { ascending: false }),
      supabase.from("portal_activity").select("*").eq("portal_id", portal.id).order("created_at", { ascending: false }).limit(50),
    ]);

    setFiles((f ?? []) as PFile[]);
    setMessages((m ?? []) as PMsg[]);
    setInvoices((inv ?? []) as PInvoice[]);
    setActivity((act ?? []) as Activity[]);

    // Load project tasks if portal has a linked project
    if (portal.project_id) {
      const { data: t } = await supabase
        .from("tasks")
        .select("id, title, status")
        .eq("project_id", portal.project_id)
        .order("position");
      setTasks((t ?? []) as ProjectTask[]);
    } else {
      setTasks([]);
    }

    // Realtime
    channelRef.current?.unsubscribe();
    const ch = supabase.channel(`client-portal-${portal.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "portal_messages", filter: `portal_id=eq.${portal.id}` },
        p => setMessages(prev => [...prev, p.new as PMsg]))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "portal_activity", filter: `portal_id=eq.${portal.id}` },
        p => setActivity(prev => [p.new as Activity, ...prev]))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "portal_files", filter: `portal_id=eq.${portal.id}` },
        p => setFiles(prev => prev.map(f => f.id === (p.new as PFile).id ? p.new as PFile : f)))
      .subscribe();
    channelRef.current = ch;
  }

  async function sendMessage() {
    if (!msgText.trim() || !activePortal) return;
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.from("portal_messages").insert({
      portal_id: activePortal.id, sender: "client",
      sender_name: clientName, content: msgText.trim(), read_by_freelancer: false,
    });
    if (!error) {
      // Log activity
      await supabase.from("portal_activity").insert({
        portal_id: activePortal.id, actor: "client", actor_name: clientName,
        event_type: "message_sent", description: `${clientName} sent a message`,
      });
      setMsgText("");
    } else {
      msgApi.error("Message failed: " + error.message);
    }
    setSending(false);
  }

  async function approveFile(fileId: string, status: "approved" | "needs_revision", note?: string) {
    if (!activePortal) return;
    setApprovingId(fileId);
    const supabase = createClient();
    await supabase.from("portal_files").update({
      approval_status: status,
      approval_note: note ?? null,
      approved_at: status === "approved" ? new Date().toISOString() : null,
    }).eq("id", fileId);

    const file = files.find(f => f.id === fileId);
    await supabase.from("portal_activity").insert({
      portal_id: activePortal.id, actor: "client", actor_name: clientName,
      event_type: status === "approved" ? "file_approved" : "file_revision",
      description: `${clientName} ${status === "approved" ? "approved" : "requested revisions on"} "${file?.name}"`,
      meta: { file_id: fileId, note },
    });

    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, approval_status: status, approval_note: note ?? null } : f));
    msgApi.success(status === "approved" ? "File approved!" : "Revision requested");
    setApprovingId(null);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin size="large" />
    </div>
  );

  const brand = activePortal?.brand_override ?? {};
  const primary = brand.primaryColor ?? "#0ea5e9";

  const pending       = invoices.filter(i => i.status !== "paid" && i.status !== "cancelled");
  const paid          = invoices.filter(i => i.status === "paid");
  const totalOwed     = pending.reduce((s, i) => s + i.total, 0);
  const totalPaid     = paid.reduce((s, i) => s + i.total, 0);
  const doneTasks     = tasks.filter(t => t.status === "done").length;
  const taskPct       = tasks.length ? Math.round(doneTasks / tasks.length * 100) : 0;
  const awaitingFiles = files.filter(f => f.approval_status === "pending").length;
  const newMsgs       = messages.filter(m => m.sender === "freelancer").length;

  // Onboarding checklist
  const checklist = [
    { done: invoices.length > 0 || files.length > 0, label: "Your portal is ready — files and invoices will appear here" },
    { done: messages.length > 0, label: "Say hello — send your first message to your team" },
    { done: paid.length > 0,     label: "Complete your first payment" },
    { done: files.filter(f => f.approval_status !== "pending").length > 0, label: "Review and approve your first deliverable" },
  ];
  const checklistDone = checklist.filter(c => c.done).length;

  const tabItems = [
    {
      key: "overview",
      label: <Space><ThunderboltFilled />Overview</Space>,
      children: (
        <div>
          {/* First visit welcome */}
          {isFirstVisit && (
            <Card style={{ borderRadius: 16, background: `linear-gradient(135deg, ${primary}18, ${primary}08)`, border: `1.5px solid ${primary}30`, marginBottom: 20 }} styles={{ body: { padding: 24 } }}>
              <Space align="start" size={14}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 22 }}>👋</span>
                </div>
                <div>
                  <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>
                    Welcome to your project portal{activePortal?.client_name ? `, ${activePortal.client_name}` : ""}!
                  </Text>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    {activePortal?.welcome_message ?? "Everything for your project is here — files, invoices, updates, and a direct line to your team. No more email chains."}
                  </Text>
                </div>
              </Space>
            </Card>
          )}

          {/* Onboarding checklist */}
          {checklistDone < checklist.length && (
            <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }} styles={{ body: { padding: 20 } }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <Text strong style={{ fontSize: 15 }}>Getting started</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>{checklistDone}/{checklist.length} complete</Text>
              </div>
              <Progress percent={Math.round(checklistDone / checklist.length * 100)} showInfo={false} strokeColor={primary} trailColor="#f1f5f9" style={{ marginBottom: 14 }} />
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                {checklist.map((c, i) => (
                  <Space key={i} size={10}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${c.done ? "#10b981" : "#e2e8f0"}`, background: c.done ? "#10b981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {c.done && <CheckOutlined style={{ color: "#fff", fontSize: 11 }} />}
                    </div>
                    <Text style={{ fontSize: 13, color: c.done ? "#94a3b8" : "#374151", textDecoration: c.done ? "line-through" : "none" }}>{c.label}</Text>
                  </Space>
                ))}
              </Space>
            </Card>
          )}

          {/* Stats */}
          <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
            {[
              { icon: "📎", label: "Files Shared",     value: files.length,     onClick: () => setTab("files"),    alert: awaitingFiles > 0, alertLabel: `${awaitingFiles} awaiting review` },
              { icon: "💰", label: "Outstanding",      value: `${invoices[0]?.currency ?? "USD"} ${totalOwed.toLocaleString()}`, onClick: () => setTab("invoices"), alert: pending.length > 0, alertLabel: `${pending.length} unpaid` },
              { icon: "✅", label: "Total Paid",       value: `${invoices[0]?.currency ?? "USD"} ${totalPaid.toLocaleString()}`, onClick: () => setTab("invoices"), alert: false, alertLabel: "" },
              { icon: "💬", label: "Messages",         value: messages.length,  onClick: () => setTab("messages"), alert: newMsgs > 0, alertLabel: "new messages" },
            ].map(s => (
              <Col key={s.label} xs={12} sm={6}>
                <Card hoverable onClick={s.onClick} style={{ borderRadius: 14, border: `1.5px solid ${s.alert ? "#fcd34d" : "#e2e8f0"}`, cursor: "pointer", textAlign: "center", background: s.alert ? "#fffbeb" : "#fff" }} styles={{ body: { padding: 18 } }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: primary }}>{s.value}</div>
                  <Text type="secondary" style={{ fontSize: 11 }}>{s.label}</Text>
                  {s.alert && <Text style={{ fontSize: 10, color: "#92400e", display: "block", marginTop: 2, fontWeight: 600 }}>{s.alertLabel}</Text>}
                </Card>
              </Col>
            ))}
          </Row>

          {/* Project progress */}
          {tasks.length > 0 && (
            <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 20 } }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Space><FolderOpenOutlined style={{ color: primary }} /><Text strong>Project Progress</Text></Space>
                <Text strong style={{ color: primary }}>{taskPct}%</Text>
              </div>
              <Progress percent={taskPct} showInfo={false} strokeColor={primary} trailColor="#f1f5f9" style={{ marginBottom: 12 }} />
              <Text type="secondary" style={{ fontSize: 13 }}>{doneTasks} of {tasks.length} tasks completed</Text>
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tasks.slice(0, 6).map(t => (
                  <Tag key={t.id} style={{
                    borderRadius: 20, fontSize: 11, padding: "2px 10px",
                    background: t.status === "done" ? "#f0fdf4" : "#f8fafc",
                    color: t.status === "done" ? "#10b981" : "#64748b",
                    borderColor: t.status === "done" ? "#bbf7d0" : "#e2e8f0",
                    textDecoration: t.status === "done" ? "line-through" : "none",
                  }}>
                    {t.status === "done" && <CheckOutlined style={{ marginRight: 4 }} />}{t.title}
                  </Tag>
                ))}
                {tasks.length > 6 && <Tag style={{ borderRadius: 20, fontSize: 11 }}>+{tasks.length - 6} more</Tag>}
              </div>
            </Card>
          )}

          {/* Outstanding invoices */}
          {pending.length > 0 && (
            <Card style={{ borderRadius: 14, border: "1px solid #fcd34d", background: "#fffbeb", marginBottom: 16 }} styles={{ body: { padding: 20 } }}>
              <Text strong style={{ color: "#92400e", display: "block", marginBottom: 12 }}>
                ⚠️ {pending.length} outstanding invoice{pending.length > 1 ? "s" : ""} — total {invoices[0]?.currency ?? "USD"} {totalOwed.toLocaleString()}
              </Text>
              {pending.map(inv => (
                <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid #fde68a" }}>
                  <div>
                    <Text strong style={{ fontSize: 14 }}>{inv.title}</Text>
                    {inv.due_date && (
                      <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                        Due {new Date(inv.due_date) < new Date() ? "⚠️ overdue — " : ""}{new Date(inv.due_date).toLocaleDateString()}
                      </Text>
                    )}
                  </div>
                  <Space>
                    <Text strong style={{ color: "#10b981" }}>{inv.currency} {inv.total.toLocaleString()}</Text>
                    {inv.payment_link && (
                      <a href={inv.payment_link} target="_blank" rel="noopener noreferrer">
                        <Button type="primary" size="small" style={{ borderRadius: 8, background: primary, borderColor: primary }}>Pay Now</Button>
                      </a>
                    )}
                  </Space>
                </div>
              ))}
            </Card>
          )}

          {/* Files awaiting approval */}
          {files.filter(f => f.approval_status === "pending").length > 0 && (
            <Card style={{ borderRadius: 14, border: "1px solid #bfdbfe", background: "#eff6ff" }} styles={{ body: { padding: 20 } }}>
              <Text strong style={{ color: "#1d4ed8", display: "block", marginBottom: 12 }}>
                📋 {awaitingFiles} file{awaitingFiles > 1 ? "s" : ""} awaiting your review
              </Text>
              {files.filter(f => f.approval_status === "pending").map(f => (
                <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid #bfdbfe" }}>
                  <Text style={{ fontSize: 13 }}>{FILE_ICONS[f.category] ?? "📎"} {f.name}</Text>
                  <Space size={6}>
                    <Button size="small" icon={<CheckOutlined />} style={{ borderRadius: 8, borderColor: "#10b981", color: "#10b981" }}
                      loading={approvingId === f.id}
                      onClick={() => approveFile(f.id, "approved")}>
                      Approve
                    </Button>
                    <Button size="small" danger style={{ borderRadius: 8 }}
                      loading={approvingId === f.id}
                      onClick={() => approveFile(f.id, "needs_revision", "Please revise")}>
                      Revise
                    </Button>
                  </Space>
                </div>
              ))}
            </Card>
          )}
        </div>
      ),
    },
    {
      key: "files",
      label: (
        <Badge count={awaitingFiles} size="small" offset={[4, -2]}>
          <Space><FileOutlined />Files</Space>
        </Badge>
      ),
      children: (
        <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
          {files.length === 0 ? (
            <Empty style={{ padding: 60 }} description="No files shared yet" />
          ) : (
            files.map(f => {
              const appr = APPROVAL_CONFIG[f.approval_status];
              return (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: "1px solid #f8fafc" }}>
                  <Avatar size={42} style={{ background: "#f1f5f9", fontSize: 20, flexShrink: 0 }}>{FILE_ICONS[f.category] ?? "📎"}</Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</Text>
                    <Space size={8} style={{ marginTop: 3 }}>
                      <Tag style={{ borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>{f.category}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(f.created_at).fromNow()}</Text>
                      <Tag style={{ borderRadius: 20, fontSize: 11, background: appr.bg, color: appr.color, borderColor: `${appr.color}30` }}>
                        {appr.icon} {appr.label}
                      </Tag>
                    </Space>
                    {f.approval_note && f.approval_status === "needs_revision" && (
                      <Text style={{ fontSize: 12, color: "#ef4444", display: "block", marginTop: 3 }}>Note: {f.approval_note}</Text>
                    )}
                  </div>
                  <Space>
                    {f.storage_url && (
                      <a href={f.storage_url} target="_blank" rel="noopener noreferrer">
                        <Button icon={<DownloadOutlined />} style={{ borderRadius: 8 }}>Download</Button>
                      </a>
                    )}
                    {f.approval_status === "pending" && (
                      <>
                        <Button icon={<CheckOutlined />} style={{ borderRadius: 8, borderColor: "#10b981", color: "#10b981" }}
                          loading={approvingId === f.id}
                          onClick={() => approveFile(f.id, "approved")}>
                          Approve
                        </Button>
                        <Button danger style={{ borderRadius: 8 }}
                          loading={approvingId === f.id}
                          onClick={() => approveFile(f.id, "needs_revision")}>
                          Needs Revision
                        </Button>
                      </>
                    )}
                  </Space>
                </div>
              );
            })
          )}
        </Card>
      ),
    },
    {
      key: "invoices",
      label: (
        <Badge count={pending.length} size="small" offset={[4, -2]}>
          <Space><DollarOutlined />Invoices</Space>
        </Badge>
      ),
      children: (
        <div>
          {/* Payment summary */}
          {invoices.length > 0 && (
            <Row gutter={[14, 14]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={8}>
                <Card style={{ borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: 16 } }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Total Paid</Text>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#10b981" }}>{invoices[0]?.currency} {totalPaid.toLocaleString()}</div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ borderRadius: 12, border: "1px solid #fcd34d", background: "#fffbeb", textAlign: "center" }} styles={{ body: { padding: 16 } }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Outstanding</Text>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#f59e0b" }}>{invoices[0]?.currency} {totalOwed.toLocaleString()}</div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: 16 } }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Total Invoices</Text>
                  <div style={{ fontSize: 22, fontWeight: 900, color: primary }}>{invoices.length}</div>
                </Card>
              </Col>
            </Row>
          )}

          {invoices.length === 0 ? (
            <Card style={{ borderRadius: 14 }} styles={{ body: { padding: "60px 40px", textAlign: "center" } }}>
              <Empty description="No invoices yet" />
            </Card>
          ) : (
            invoices.map(inv => (
              <Card key={inv.id} style={{ borderRadius: 14, border: `1.5px solid ${inv.status === "overdue" ? "#fecaca" : "#e2e8f0"}`, marginBottom: 14, background: inv.status === "overdue" ? "#fff1f2" : "#fff" }} styles={{ body: { padding: 24 } }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: inv.payment_link && inv.status !== "paid" ? 16 : 0 }}>
                  <div>
                    <Space size={8}>
                      <Text strong style={{ fontSize: 16 }}>{inv.invoice_number} — {inv.title}</Text>
                      <Tag color={INV_COLOR[inv.status]} style={{ borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>{inv.status}</Tag>
                    </Space>
                    {inv.due_date && <Text type="secondary" style={{ display: "block", fontSize: 13, marginTop: 2 }}>Due {new Date(inv.due_date).toLocaleDateString()}</Text>}
                  </div>
                  <Text strong style={{ fontSize: 22, color: "#10b981" }}>{inv.currency} {inv.total.toLocaleString()}</Text>
                </div>
                {inv.payment_link && inv.status !== "paid" ? (
                  <a href={inv.payment_link} target="_blank" rel="noopener noreferrer">
                    <Button type="primary" block size="large" style={{ borderRadius: 10, height: 46, fontWeight: 700, background: primary, borderColor: primary }}>
                      💳 Pay Now — {inv.currency} {inv.total.toLocaleString()}
                    </Button>
                  </a>
                ) : inv.status === "paid" ? (
                  <div style={{ textAlign: "center", color: "#10b981", fontWeight: 700, padding: "8px 0" }}>
                    <CheckCircleOutlined style={{ marginRight: 6 }} />Paid — Thank you!
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </div>
      ),
    },
    {
      key: "messages",
      label: <Space><MessageOutlined />Messages</Space>,
      children: (
        <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
          <div style={{ height: 460, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", gap: 8 }}>
                <MessageOutlined style={{ fontSize: 40, color: "#cbd5e1" }} />
                <Text type="secondary">No messages yet — start the conversation! 👋</Text>
              </div>
            )}
            {messages.map(msg => {
              const isMe = msg.sender === "client";
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 10, alignItems: "flex-end" }}>
                  <Tooltip title={msg.sender_name ?? (isMe ? "You" : "Your team")}>
                    <Avatar size={32} style={{ flexShrink: 0, background: isMe ? primary : "#e2e8f0", color: isMe ? "#fff" : "#64748b", fontWeight: 700, fontSize: 13 }}>
                      {(msg.sender_name ?? "?")[0]?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                  <div style={{ maxWidth: "68%" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 4, flexDirection: isMe ? "row-reverse" : "row" }}>
                      <Text style={{ fontSize: 12, fontWeight: 600 }}>{isMe ? "You" : msg.sender_name}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(msg.created_at).fromNow()}</Text>
                    </div>
                    <div style={{
                      background: isMe ? primary : "#f1f5f9",
                      color: isMe ? "#fff" : "#0f172a",
                      padding: "10px 14px",
                      borderRadius: isMe ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      fontSize: 14, lineHeight: 1.6, wordBreak: "break-word",
                    }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, alignItems: "flex-end" }}>
            <Avatar size={34} style={{ background: primary, color: "#fff", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>
              {clientName[0]?.toUpperCase() ?? <UserOutlined />}
            </Avatar>
            <textarea
              value={msgText}
              onChange={e => setMsgText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Message your team… (Enter to send, Shift+Enter for new line)"
              rows={2}
              style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit" }}
            />
            <Button type="primary" icon={<SendOutlined />} loading={sending} onClick={sendMessage}
              disabled={!msgText.trim()} style={{ borderRadius: 10, height: 42, background: primary, borderColor: primary, flexShrink: 0 }}>
              Send
            </Button>
          </div>
        </Card>
      ),
    },
    {
      key: "activity",
      label: <Space><HistoryOutlined />Activity</Space>,
      children: (
        <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
          {activity.length === 0 ? (
            <Empty style={{ padding: 60 }} description="No activity yet" />
          ) : (
            <div style={{ padding: "8px 0" }}>
              {activity.map((a, i) => (
                <div key={a.id} style={{ display: "flex", gap: 14, padding: "14px 20px", borderBottom: i < activity.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: a.actor === "client" ? "#eff6ff" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                    {a.actor === "client" ? "👤" : a.actor === "freelancer" ? "💼" : "⚡"}
                  </div>
                  <div>
                    <Text style={{ fontSize: 14, display: "block" }}>{a.description}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(a.created_at).fromNow()}</Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {ctx}

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${primary}dd, ${primary})`, padding: "0 24px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px 0 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {brand.logoUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={brand.logoUrl} alt="" style={{ height: 34, objectFit: "contain" }} />
                : <Text strong style={{ color: "#fff", fontSize: 17 }}>{brand.companyName ?? "Your Project"}</Text>
              }
            </div>
            <Space>
              <Avatar size={30} style={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, fontSize: 13 }}>
                {clientName[0]?.toUpperCase()}
              </Avatar>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}>{clientName}</Text>
              {portals.length > 1 && portals.map(p => (
                <Button key={p.id} size="small"
                  style={{ borderRadius: 20, fontSize: 12, background: activePortal?.id === p.id ? "#fff" : "rgba(255,255,255,0.15)", color: activePortal?.id === p.id ? primary : "rgba(255,255,255,0.85)", border: "none" }}
                  onClick={() => loadPortalData(p)}>
                  {p.title ?? p.client_name ?? "Portal"}
                </Button>
              ))}
              <Button type="text" icon={<LogoutOutlined />} onClick={signOut}
                style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }} size="small">Sign out</Button>
            </Space>
          </div>

          {activePortal && (
            <Title level={3} style={{ color: "#fff", margin: "0 0 4px", fontWeight: 800 }}>
              {activePortal.title ?? `${activePortal.client_name}'s Portal`}
            </Title>
          )}

          {/* Tab nav */}
          <div style={{ display: "flex", gap: 2, marginTop: 12 }}>
            {tabItems.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{
                  padding: "9px 18px", border: "none", cursor: "pointer",
                  fontWeight: 600, fontSize: 13, borderRadius: "8px 8px 0 0",
                  background: tab === t.key ? "#fff" : "rgba(255,255,255,0.15)",
                  color: tab === t.key ? primary : "rgba(255,255,255,0.85)",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px" }}>
        {!activePortal ? (
          <Card style={{ borderRadius: 16, textAlign: "center" }} styles={{ body: { padding: "80px 40px" } }}>
            <BellOutlined style={{ fontSize: 56, color: "#cbd5e1", marginBottom: 16 }} />
            <Title level={4} style={{ color: "#64748b" }}>No portal found</Title>
            <Text type="secondary">Contact your freelancer to set up your project portal at {clientEmail}.</Text>
          </Card>
        ) : (
          tabItems.find(t => t.key === tab)?.children
        )}
      </div>
    </div>
  );
}
