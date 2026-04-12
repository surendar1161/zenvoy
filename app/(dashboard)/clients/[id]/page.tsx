"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar, Badge, Button, Card, Col, Divider, Form, Input, List, Modal,
  Row, Select, Space, Statistic, Tag, Timeline, Typography, message, Spin, Empty,
} from "antd";
import {
  ArrowLeftOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, EditOutlined,
  PlusOutlined, FileTextOutlined, SafetyCertificateOutlined, DeleteOutlined,
  PushpinOutlined, PushpinFilled, CheckCircleOutlined, EyeOutlined,
  DollarOutlined, CalendarOutlined, UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const STATUS_OPTIONS = [
  { value: "lead",     label: "Lead",     color: "#f59e0b" },
  { value: "active",   label: "Active",   color: "#10b981" },
  { value: "inactive", label: "Inactive", color: "#94a3b8" },
  { value: "churned",  label: "Churned",  color: "#ef4444" },
];

interface Client {
  id: string; name: string; company: string | null; email: string | null;
  phone: string | null; website: string | null; country: string | null; city: string | null;
  status: string; source: string | null; tags: string[]; notes: string | null;
  avatar_color: string; total_revenue: number; deal_count: number; created_at: string;
}

interface Note {
  id: string; content: string; pinned: boolean; created_at: string;
}

interface ProposalRow {
  id: string; project_type: string | null; currency: string | null;
  total_budget: number | null; status: string; created_at: string;
}

interface ContractRow {
  id: string; contract_type_name: string | null; governing_law: string | null;
  status: string; created_at: string;
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm] = Form.useForm();
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { load(); }, [id]);

  async function load() {
    const supabase = createClient();
    const [{ data: c }, { data: n }, { data: p }, { data: ct }] = await Promise.all([
      supabase.from("clients").select("*").eq("id", id).maybeSingle(),
      supabase.from("client_notes").select("*").eq("client_id", id).order("pinned", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("proposals").select("id,project_type,currency,total_budget,status,created_at").eq("client_id", id).order("created_at", { ascending: false }),
      supabase.from("contracts").select("id,contract_type_name,governing_law,status,created_at").eq("client_id", id).order("created_at", { ascending: false }),
    ]);
    if (!c) { router.push("/clients"); return; }
    setClient(c as Client);
    setNotes((n ?? []) as Note[]);
    setProposals((p ?? []) as ProposalRow[]);
    setContracts((ct ?? []) as ContractRow[]);
    setLoading(false);
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setAddingNote(true);
    const supabase = createClient();
    const { data } = await supabase.from("client_notes").insert({ client_id: id, content: noteText.trim() }).select().single();
    if (data) setNotes(prev => [data as Note, ...prev]);
    setNoteText("");
    setAddingNote(false);
    msgApi.success("Note added");
  }

  async function togglePin(note: Note) {
    const supabase = createClient();
    await supabase.from("client_notes").update({ pinned: !note.pinned }).eq("id", note.id);
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, pinned: !n.pinned } : n)
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)));
  }

  async function deleteNote(noteId: string) {
    const supabase = createClient();
    await supabase.from("client_notes").delete().eq("id", noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }

  async function saveEdit() {
    const values = await editForm.validateFields();
    setSavingEdit(true);
    const supabase = createClient();
    await supabase.from("clients").update(values).eq("id", id);
    setClient(prev => prev ? { ...prev, ...values } : prev);
    setSavingEdit(false);
    setEditOpen(false);
    msgApi.success("Client updated");
  }

  async function updateStatus(status: string) {
    const supabase = createClient();
    await supabase.from("clients").update({ status }).eq("id", id);
    setClient(prev => prev ? { ...prev, status } : prev);
    msgApi.success("Status updated");
  }

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 120 }}><Spin size="large" /></div>;
  if (!client) return null;

  const statusCfg = STATUS_OPTIONS.find(s => s.value === client.status) ?? STATUS_OPTIONS[0];
  const initials = client.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const totalRevenue = proposals.filter(p => p.status === "accepted" || p.status === "signed")
    .reduce((s, p) => s + (p.total_budget ?? 0), 0);

  const PROPOSAL_STATUS_COLORS: Record<string, string> = {
    draft: "default", sent: "blue", viewed: "cyan", accepted: "green", signed: "green", declined: "red",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}

      {/* Back */}
      <Link href="/clients">
        <Button type="text" icon={<ArrowLeftOutlined />} style={{ padding: "4px 0", color: "#64748b", marginBottom: 20 }}>All Clients</Button>
      </Link>

      {/* Header card */}
      <Card style={{ borderRadius: 20, border: `2px solid ${client.avatar_color}30`, marginBottom: 24, background: `${client.avatar_color}05` }} styles={{ body: { padding: 32 } }}>
        <Row align="middle" justify="space-between" gutter={[24, 16]} wrap>
          <Col>
            <Space size={20} align="center">
              <Avatar size={72} style={{ background: client.avatar_color, fontWeight: 800, fontSize: 26, flexShrink: 0 }}>
                {initials}
              </Avatar>
              <div>
                <Space align="center" size={12} wrap>
                  <Title level={2} style={{ margin: 0, fontWeight: 900 }}>{client.name}</Title>
                  <Select value={client.status} size="small" onChange={updateStatus}
                    style={{ width: 120 }}
                    options={STATUS_OPTIONS.map(s => ({
                      value: s.value,
                      label: <Space size={6}><span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />{s.label}</Space>,
                    }))} />
                </Space>
                <Space style={{ marginTop: 6 }} wrap>
                  {client.company && <Text type="secondary" style={{ fontSize: 15 }}>{client.company}</Text>}
                  {client.source && <Tag style={{ borderRadius: 20, fontSize: 12 }}>via {client.source}</Tag>}
                  {client.tags?.map(t => <Tag key={t} style={{ borderRadius: 20, fontSize: 11 }}>{t}</Tag>)}
                </Space>
              </div>
            </Space>
          </Col>
          <Col>
            <Space wrap>
              <Link href={`/generate?client=${encodeURIComponent(client.name)}&company=${encodeURIComponent(client.company ?? "")}`}>
                <Button icon={<FileTextOutlined />} style={{ borderRadius: 10, fontWeight: 600 }}>New Proposal</Button>
              </Link>
              <Button type="primary" icon={<EditOutlined />} onClick={() => {
                editForm.setFieldsValue({ name: client.name, company: client.company, email: client.email, phone: client.phone, website: client.website, city: client.city, status: client.status, source: client.source, tags: client.tags, notes: client.notes });
                setEditOpen(true);
              }} style={{ borderRadius: 10, fontWeight: 600 }}>
                Edit
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* LEFT: Stats + Contact + Notes */}
        <Col xs={24} lg={10}>
          {/* Stats */}
          <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }} styles={{ body: { padding: 24 } }}>
            <Row gutter={[16, 16]}>
              {[
                { title: "Proposals",  value: proposals.length,    color: "#0ea5e9", icon: <FileTextOutlined /> },
                { title: "Contracts",  value: contracts.length,    color: "#7c3aed", icon: <SafetyCertificateOutlined /> },
                { title: "Won",        value: proposals.filter(p => p.status === "accepted" || p.status === "signed").length, color: "#10b981", icon: <CheckCircleOutlined /> },
                { title: "Revenue",    value: `$${totalRevenue.toLocaleString()}`, color: "#f59e0b", icon: <DollarOutlined /> },
              ].map(s => (
                <Col span={12} key={s.title}>
                  <Statistic
                    title={<Space size={4}><Avatar size={20} style={{ background: `${s.color}15`, color: s.color }} icon={s.icon} /><Text type="secondary" style={{ fontSize: 11 }}>{s.title}</Text></Space>}
                    value={s.value}
                    valueStyle={{ color: s.color, fontWeight: 800, fontSize: 22 }}
                  />
                </Col>
              ))}
            </Row>
          </Card>

          {/* Contact info */}
          <Card title={<Space><UserOutlined style={{ color: "#0ea5e9" }} />Contact</Space>}
            style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }}
            styles={{ body: { padding: 20 } }}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {client.email && <Space><MailOutlined style={{ color: "#0ea5e9" }} /><a href={`mailto:${client.email}`}>{client.email}</a></Space>}
              {client.phone && <Space><PhoneOutlined style={{ color: "#10b981" }} /><Text>{client.phone}</Text></Space>}
              {client.website && <Space><GlobalOutlined style={{ color: "#7c3aed" }} /><a href={client.website} target="_blank" rel="noopener noreferrer">{client.website.replace(/^https?:\/\//, "")}</a></Space>}
              {(client.city || client.country) && <Space><span>📍</span><Text>{[client.city, client.country].filter(Boolean).join(", ")}</Text></Space>}
              <Space><CalendarOutlined style={{ color: "#94a3b8" }} /><Text type="secondary" style={{ fontSize: 12 }}>Client since {new Date(client.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</Text></Space>
            </Space>
            {client.notes && (
              <>
                <Divider style={{ margin: "16px 0" }} />
                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>NOTES</Text>
                <Paragraph style={{ fontSize: 13, color: "#374151", marginBottom: 0 }}>{client.notes}</Paragraph>
              </>
            )}
          </Card>

          {/* Notes */}
          <Card title={<Space>📝 Notes <Tag style={{ borderRadius: 20 }}>{notes.length}</Tag></Space>}
            style={{ borderRadius: 16, border: "1px solid #e2e8f0" }}
            styles={{ body: { padding: 20 } }}>
            <div style={{ marginBottom: 16 }}>
              <TextArea rows={2} value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note…" style={{ borderRadius: 8, marginBottom: 8 }} />
              <Button type="primary" size="small" loading={addingNote} onClick={addNote}
                disabled={!noteText.trim()} style={{ borderRadius: 8, fontWeight: 600 }}>
                Add Note
              </Button>
            </div>
            {notes.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 13 }}>No notes yet. Add your first note above.</Text>
            ) : (
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {notes.map(note => (
                  <div key={note.id} style={{ background: note.pinned ? "#fffbeb" : "#f8fafc", borderRadius: 10, padding: "10px 14px", border: `1px solid ${note.pinned ? "#fde68a" : "#f1f5f9"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>{new Date(note.created_at).toLocaleString()}</Text>
                      <Space size={4}>
                        <Button type="text" size="small" icon={note.pinned ? <PushpinFilled style={{ color: "#f59e0b" }} /> : <PushpinOutlined />} onClick={() => togglePin(note)} />
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => deleteNote(note.id)} />
                      </Space>
                    </div>
                    <Text style={{ fontSize: 13 }}>{note.content}</Text>
                  </div>
                ))}
              </Space>
            )}
          </Card>
        </Col>

        {/* RIGHT: Proposals + Contracts + Timeline */}
        <Col xs={24} lg={14}>
          {/* Proposals */}
          <Card
            title={<Space><FileTextOutlined style={{ color: "#0ea5e9" }} />Proposals <Tag style={{ borderRadius: 20 }}>{proposals.length}</Tag></Space>}
            extra={<Link href={`/generate?client=${encodeURIComponent(client.name)}&company=${encodeURIComponent(client.company ?? "")}`}><Button size="small" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>New</Button></Link>}
            style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }}
            styles={{ body: { padding: 0 } }}
          >
            {proposals.length === 0 ? (
              <Empty description="No proposals yet" style={{ padding: 32 }} />
            ) : (
              <List dataSource={proposals} renderItem={p => (
                <List.Item style={{ padding: "12px 20px" }}>
                  <List.Item.Meta
                    avatar={<Avatar style={{ background: "#eff6ff", color: "#0ea5e9" }} icon={<FileTextOutlined />} />}
                    title={<Space size={8}><Text strong style={{ fontSize: 13 }}>{p.project_type ?? "Proposal"}</Text><Tag color={PROPOSAL_STATUS_COLORS[p.status] ?? "default"} style={{ borderRadius: 20, fontSize: 11 }}>{p.status}</Tag></Space>}
                    description={<Text type="secondary" style={{ fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString()}</Text>}
                  />
                  {p.total_budget && <Text strong style={{ color: "#10b981", fontSize: 14 }}>{p.currency ?? "USD"} {p.total_budget.toLocaleString()}</Text>}
                </List.Item>
              )} />
            )}
          </Card>

          {/* Contracts */}
          <Card
            title={<Space><SafetyCertificateOutlined style={{ color: "#7c3aed" }} />Contracts <Tag style={{ borderRadius: 20 }}>{contracts.length}</Tag></Space>}
            extra={<Link href="/contracts"><Button size="small" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>New</Button></Link>}
            style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }}
            styles={{ body: { padding: 0 } }}
          >
            {contracts.length === 0 ? (
              <Empty description="No contracts yet" style={{ padding: 32 }} />
            ) : (
              <List dataSource={contracts} renderItem={c => (
                <List.Item style={{ padding: "12px 20px" }}>
                  <List.Item.Meta
                    avatar={<Avatar style={{ background: "#f5f3ff", color: "#7c3aed" }} icon={<SafetyCertificateOutlined />} />}
                    title={<Space size={8}><Text strong style={{ fontSize: 13 }}>{c.contract_type_name ?? "Contract"}</Text><Tag style={{ borderRadius: 20, fontSize: 11 }}>{c.status}</Tag></Space>}
                    description={<Text type="secondary" style={{ fontSize: 12 }}>{c.governing_law ?? "—"} · {new Date(c.created_at).toLocaleDateString()}</Text>}
                  />
                </List.Item>
              )} />
            )}
          </Card>

          {/* Activity timeline */}
          <Card title="Activity Timeline" style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
            <Timeline
              items={[
                ...proposals.map(p => ({
                  dot: <FileTextOutlined style={{ color: "#0ea5e9" }} />,
                  children: (
                    <div>
                      <Text strong style={{ fontSize: 13 }}>Proposal: {p.project_type ?? "Proposal"}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString()} · {p.status}</Text>
                    </div>
                  ),
                })),
                ...contracts.map(c => ({
                  dot: <SafetyCertificateOutlined style={{ color: "#7c3aed" }} />,
                  children: (
                    <div>
                      <Text strong style={{ fontSize: 13 }}>Contract: {c.contract_type_name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{new Date(c.created_at).toLocaleDateString()} · {c.status}</Text>
                    </div>
                  ),
                })),
                {
                  dot: <UserOutlined style={{ color: "#10b981" }} />,
                  children: <><Text strong style={{ fontSize: 13 }}>Client added</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>{new Date(client.created_at).toLocaleDateString()}</Text></>,
                },
              ].sort((a, b) => 0) /* already sorted by creation */}
            />
          </Card>
        </Col>
      </Row>

      {/* Edit modal */}
      <Modal open={editOpen} onCancel={() => setEditOpen(false)} title="Edit Client" width={600}
        footer={[
          <Button key="cancel" onClick={() => setEditOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={savingEdit} onClick={saveEdit} style={{ borderRadius: 8, fontWeight: 600 }}>Save</Button>,
        ]}>
        <Form form={editForm} layout="vertical" size="large" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="name" label="Full Name" rules={[{ required: true }]}><Input style={{ borderRadius: 8 }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="company" label="Company"><Input style={{ borderRadius: 8 }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="email" label="Email"><Input style={{ borderRadius: 8 }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="phone" label="Phone"><Input style={{ borderRadius: 8 }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="status" label="Status"><Select options={STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))} /></Form.Item></Col>
            <Col span={12}><Form.Item name="website" label="Website"><Input style={{ borderRadius: 8 }} /></Form.Item></Col>
            <Col span={24}><Form.Item name="tags" label="Tags"><Select mode="tags" style={{ width: "100%" }} /></Form.Item></Col>
            <Col span={24}><Form.Item name="notes" label="Notes"><TextArea rows={3} style={{ borderRadius: 8 }} /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
