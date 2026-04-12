"use client";

import { useEffect, useState } from "react";
import {
  Avatar, Badge, Button, Card, Col, Dropdown, Empty, Input, Modal,
  Row, Select, Space, Statistic, Tag, Typography, message, Form,
  Tooltip, Progress,
} from "antd";
import type { MenuProps } from "antd";
import {
  PlusOutlined, SearchOutlined, UserOutlined, MailOutlined, PhoneOutlined,
  GlobalOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined,
  FileTextOutlined, SafetyCertificateOutlined, DollarOutlined,
  TeamOutlined, FilterOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const { Title, Text } = Typography;
const { TextArea } = Input;

const STATUS_OPTIONS = [
  { value: "lead",     label: "Lead",     color: "#f59e0b" },
  { value: "active",   label: "Active",   color: "#10b981" },
  { value: "inactive", label: "Inactive", color: "#94a3b8" },
  { value: "churned",  label: "Churned",  color: "#ef4444" },
];

const SOURCE_OPTIONS = [
  "Referral", "Upwork", "LinkedIn", "Cold Outreach", "Website",
  "Social Media", "Conference", "Job Board", "Agency", "Other",
];

const AVATAR_COLORS = [
  "#0ea5e9","#7c3aed","#10b981","#f59e0b","#ef4444","#0369a1","#5b21b6","#065f46",
];

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  status: string;
  source: string | null;
  tags: string[];
  notes: string | null;
  avatar_color: string;
  total_revenue: number;
  deal_count: number;
  created_at: string;
}

const EMPTY_FORM = {
  name: "", company: "", email: "", phone: "", website: "",
  city: "", country: "", status: "lead", source: "", tags: [] as string[], notes: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("clients load error:", error.message);
      if (error.message.includes("relation") || error.message.includes("schema cache")) {
        msgApi.error("Clients table not set up yet. Please run the SQL migration in Supabase.");
      }
    }
    setClients((data ?? []) as Client[]);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    form.setFieldsValue(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(client: Client) {
    setEditing(client);
    form.setFieldsValue({
      name: client.name, company: client.company ?? "", email: client.email ?? "",
      phone: client.phone ?? "", website: client.website ?? "", city: client.city ?? "",
      country: client.country ?? "", status: client.status, source: client.source ?? "",
      tags: client.tags ?? [], notes: client.notes ?? "",
    });
    setModalOpen(true);
  }

  async function save() {
    const values = await form.validateFields();
    setSaving(true);
    const supabase = createClient();

    // Get the authenticated user's ID (required for RLS)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      msgApi.error("Not signed in. Please sign in and try again.");
      setSaving(false);
      return;
    }

    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    if (editing) {
      const { error } = await supabase
        .from("clients")
        .update({ ...values })
        .eq("id", editing.id);
      if (error) { msgApi.error("Update failed: " + error.message); setSaving(false); return; }
      msgApi.success("Client updated");
    } else {
      const { data: inserted, error } = await supabase
        .from("clients")
        .insert({ ...values, avatar_color: color, user_id: user.id })
        .select()
        .single();
      if (error) {
        msgApi.error("Could not save client: " + error.message);
        setSaving(false);
        return;
      }
      // Optimistically add to list immediately (don't wait for load())
      if (inserted) setClients(prev => [inserted as Client, ...prev]);
      msgApi.success("Client added");
      setSaving(false);
      setModalOpen(false);
      return; // skip load() — already updated optimistically
    }

    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function deleteClient(id: string) {
    Modal.confirm({
      title: "Delete this client?",
      content: "Their proposals and contracts will remain but the client profile will be removed.",
      okText: "Delete", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("clients").delete().eq("id", id);
        setClients(prev => prev.filter(c => c.id !== id));
        msgApi.success("Client deleted");
      },
    });
  }

  const filtered = clients.filter(c => {
    const s = search.toLowerCase();
    const matchSearch = !s || c.name.toLowerCase().includes(s) || (c.company ?? "").toLowerCase().includes(s) || (c.email ?? "").toLowerCase().includes(s);
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalRevenue = clients.reduce((s, c) => s + (c.total_revenue ?? 0), 0);
  const activeCount = clients.filter(c => c.status === "active").length;
  const leadCount = clients.filter(c => c.status === "lead").length;

  function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  function getStatusConfig(status: string) {
    return STATUS_OPTIONS.find(s => s.value === status) ?? STATUS_OPTIONS[0];
  }

  function clientMenu(client: Client): MenuProps {
    return {
      items: [
        { key: "edit",    label: "Edit",              icon: <EditOutlined />,                   onClick: () => openEdit(client) },
        { key: "proposal",label: "New Proposal",      icon: <FileTextOutlined />,               onClick: () => window.location.href = `/generate?client=${encodeURIComponent(client.name)}&company=${encodeURIComponent(client.company ?? "")}` },
        { key: "contract",label: "New Contract",      icon: <SafetyCertificateOutlined />,      onClick: () => window.location.href = `/contracts` },
        { type: "divider" },
        { key: "delete",  label: "Delete",            icon: <DeleteOutlined />, danger: true,   onClick: () => deleteClient(client.id) },
      ],
    };
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <TeamOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Clients</Title>
            <Tag style={{ borderRadius: 20 }}>{clients.length} total</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>Track your clients, proposals, contracts, and revenue in one place.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreate}
          style={{ borderRadius: 10, fontWeight: 600 }}>
          Add Client
        </Button>
      </div>

      {/* Stats row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {[
          { title: "Total Clients",  value: clients.length, icon: <TeamOutlined />,   color: "#0ea5e9" },
          { title: "Active",         value: activeCount,    icon: <UserOutlined />,    color: "#10b981" },
          { title: "Leads",          value: leadCount,      icon: <FilterOutlined />,  color: "#f59e0b" },
          { title: "Total Revenue",  value: `$${totalRevenue.toLocaleString()}`, icon: <DollarOutlined />, color: "#7c3aed" },
        ].map(s => (
          <Col key={s.title} xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 20 } }}>
              <Space>
                <Avatar style={{ background: `${s.color}15`, color: s.color }} icon={s.icon} />
                <Statistic
                  title={<Text type="secondary" style={{ fontSize: 12 }}>{s.title}</Text>}
                  value={s.value}
                  valueStyle={{ color: s.color, fontWeight: 800, fontSize: 22 }}
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Space style={{ marginBottom: 20 }} wrap>
        <Input prefix={<SearchOutlined style={{ color: "#94a3b8" }} />} placeholder="Search clients…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: 280, borderRadius: 10 }} allowClear />
        <Select placeholder="All statuses" allowClear value={statusFilter ?? undefined}
          onChange={v => setStatusFilter(v ?? null)} style={{ width: 160 }}
          options={STATUS_OPTIONS.map(s => ({ value: s.value, label: <Space><span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />{s.label}</Space> }))} />
      </Space>

      {/* Client grid */}
      {loading ? null : filtered.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: "center" }} styles={{ body: { padding: "80px 40px" } }}>
          <Empty image={<TeamOutlined style={{ fontSize: 64, color: "#cbd5e1" }} />} imageStyle={{ height: 80 }}
            description={<><Title level={4} style={{ color: "#64748b" }}>No clients yet</Title><Text type="secondary">Add your first client to track proposals, contracts, and revenue.</Text></>}>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add First Client</Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map(client => {
            const statusCfg = getStatusConfig(client.status);
            return (
              <Col key={client.id} xs={24} sm={12} lg={8}>
                <Card
                  style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%", transition: "box-shadow 0.2s" }}
                  styles={{ body: { padding: 0 } }}
                  hoverable
                >
                  {/* Card header */}
                  <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Link href={`/clients/${client.id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flex: 1, minWidth: 0 }}>
                        <Avatar size={44} style={{ background: client.avatar_color, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                          {getInitials(client.name)}
                        </Avatar>
                        <div style={{ minWidth: 0 }}>
                          <Text strong style={{ fontSize: 15, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#0f172a" }}>
                            {client.name}
                          </Text>
                          {client.company && (
                            <Text type="secondary" style={{ fontSize: 13, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {client.company}
                            </Text>
                          )}
                        </div>
                      </Link>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <Badge dot color={statusCfg.color}>
                          <Tag style={{ borderRadius: 20, fontSize: 11, color: statusCfg.color, borderColor: `${statusCfg.color}40`, background: `${statusCfg.color}12`, margin: 0 }}>
                            {statusCfg.label}
                          </Tag>
                        </Badge>
                        <Dropdown menu={clientMenu(client)} trigger={["click"]} placement="bottomRight">
                          <Button type="text" icon={<EllipsisOutlined />} size="small" style={{ borderRadius: 6 }} />
                        </Dropdown>
                      </div>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div style={{ padding: "14px 20px 10px" }}>
                    <Space direction="vertical" size={6} style={{ width: "100%" }}>
                      {client.email && (
                        <Space size={6}>
                          <MailOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
                          <Text style={{ fontSize: 13 }}>{client.email}</Text>
                        </Space>
                      )}
                      {client.phone && (
                        <Space size={6}>
                          <PhoneOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
                          <Text style={{ fontSize: 13 }}>{client.phone}</Text>
                        </Space>
                      )}
                      {(client.city || client.country) && (
                        <Space size={6}>
                          <GlobalOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
                          <Text style={{ fontSize: 13 }}>{[client.city, client.country].filter(Boolean).join(", ")}</Text>
                        </Space>
                      )}
                    </Space>
                  </div>

                  {/* Metrics */}
                  <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #f8fafc" }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text type="secondary" style={{ fontSize: 11, display: "block" }}>DEALS</Text>
                        <Text strong style={{ fontSize: 16, color: "#0ea5e9" }}>{client.deal_count}</Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary" style={{ fontSize: 11, display: "block" }}>REVENUE</Text>
                        <Text strong style={{ fontSize: 16, color: "#10b981" }}>
                          ${(client.total_revenue ?? 0).toLocaleString()}
                        </Text>
                      </Col>
                    </Row>
                    {client.tags?.length > 0 && (
                      <Space wrap style={{ marginTop: 10 }}>
                        {client.tags.slice(0, 3).map(t => (
                          <Tag key={t} style={{ borderRadius: 20, fontSize: 11, padding: "0 8px" }}>{t}</Tag>
                        ))}
                        {client.tags.length > 3 && <Tag style={{ borderRadius: 20, fontSize: 11 }}>+{client.tags.length - 3}</Tag>}
                      </Space>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div style={{ padding: "10px 16px 14px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8 }}>
                    <Link href={`/clients/${client.id}`} style={{ flex: 1 }}>
                      <Button block size="small" style={{ borderRadius: 8, fontWeight: 600 }}>View Profile</Button>
                    </Link>
                    <Tooltip title="New Proposal">
                      <a href={`/generate?client=${encodeURIComponent(client.name)}&company=${encodeURIComponent(client.company ?? "")}`}>
                        <Button size="small" icon={<FileTextOutlined />} style={{ borderRadius: 8 }} />
                      </a>
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={<Space><TeamOutlined style={{ color: "#0ea5e9" }} />{editing ? "Edit Client" : "Add New Client"}</Space>}
        width={640}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={save}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            {editing ? "Save Changes" : "Add Client"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Name is required" }]}>
                <Input placeholder="Sarah Chen" prefix={<UserOutlined style={{ color: "#94a3b8" }} />} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="company" label="Company">
                <Input placeholder="Acme Corp" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
                <Input placeholder="sarah@acme.com" prefix={<MailOutlined style={{ color: "#94a3b8" }} />} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="+1 555 123 4567" prefix={<PhoneOutlined style={{ color: "#94a3b8" }} />} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Select options={STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="source" label="Source">
                <Select placeholder="How did you meet?" allowClear
                  options={SOURCE_OPTIONS.map(s => ({ value: s, label: s }))} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="City">
                <Input placeholder="San Francisco" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="website" label="Website">
                <Input placeholder="https://acmecorp.com" prefix={<GlobalOutlined style={{ color: "#94a3b8" }} />} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="Add tags (press Enter)" style={{ width: "100%" }}
                  options={["Design","Development","Marketing","SEO","Startup","Enterprise","Long-term","One-off"].map(t => ({ value: t, label: t }))} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="notes" label="Notes">
                <TextArea rows={3} placeholder="Add any notes about this client…" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
