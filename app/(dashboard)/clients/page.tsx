"use client";

import { useEffect, useState } from "react";
import {
  Avatar, Button, Card, Col, Dropdown, Input, Modal,
  Row, Select, Tag, message, Form,
  Tooltip,
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
import { Page, PageHeader, Stat, EmptyState } from "@/components/app/ui";
import { Button as BrandButton } from "@/components/site/ui";

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
    <Page wide>
      {ctx}

      <PageHeader
        title="Clients"
        sub="Track clients, proposals, contracts, and revenue in one place."
        count={clients.length ? `${clients.length} total` : undefined}
        action={<BrandButton onClick={openCreate}><PlusOutlined /> Add client</BrandButton>}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<TeamOutlined />} tone="brand" label="Total" value={clients.length} />
        <Stat icon={<UserOutlined />} tone="emerald" label="Active" value={activeCount} />
        <Stat icon={<FilterOutlined />} tone="amber" label="Leads" value={leadCount} />
        <Stat icon={<DollarOutlined />} tone="violet" label="Revenue" value={`$${totalRevenue.toLocaleString()}`} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Input prefix={<SearchOutlined className="text-ink-300" />} placeholder="Search clients"
          value={search} onChange={e => setSearch(e.target.value)}
          className="!w-[280px]" allowClear />
        <Select placeholder="All statuses" allowClear value={statusFilter ?? undefined}
          onChange={v => setStatusFilter(v ?? null)} className="!w-[160px]"
          options={STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))} />
      </div>

      {/* Client grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(i => <div key={i} className="dp-skel h-52 rounded-3xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<TeamOutlined />} title={clients.length ? "No matches" : "No clients yet"} body={clients.length ? "Try a different name, company, or status." : "Add your first client to track proposals, contracts, and revenue."}>
          {clients.length
            ? <button type="button" onClick={() => { setSearch(""); setStatusFilter(null); }} className="text-[14px] font-semibold text-brand-600">Clear filters</button>
            : <BrandButton onClick={openCreate}><PlusOutlined /> Add first client</BrandButton>}
        </EmptyState>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map(client => {
            const statusCfg = getStatusConfig(client.status);
            return (
              <Col key={client.id} xs={24} sm={12} lg={8}>
                <Card
                  className="h-full overflow-hidden"
                  styles={{ body: { padding: 0 } }}
                  hoverable
                >
                  {/* Card header */}
                  <div className="border-b border-line px-5 pb-4 pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/clients/${client.id}`} className="flex min-w-0 flex-1 items-center gap-3 no-underline">
                        <Avatar size={44} style={{ background: client.avatar_color, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                          {getInitials(client.name)}
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate text-[15px] font-semibold text-ink">{client.name}</div>
                          {client.company && <div className="truncate text-[13px] text-ink-400">{client.company}</div>}
                        </div>
                      </Link>
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ color: statusCfg.color, background: `${statusCfg.color}18` }}>
                          {statusCfg.label}
                        </span>
                        <Dropdown menu={clientMenu(client)} trigger={["click"]} placement="bottomRight">
                          <Button type="text" icon={<EllipsisOutlined />} size="small" />
                        </Dropdown>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 px-5 py-3.5 text-[13px] text-ink-700">
                    {client.email && <div className="flex items-center gap-2"><MailOutlined className="text-ink-300" />{client.email}</div>}
                    {client.phone && <div className="flex items-center gap-2"><PhoneOutlined className="text-ink-300" />{client.phone}</div>}
                    {(client.city || client.country) && (
                      <div className="flex items-center gap-2"><GlobalOutlined className="text-ink-300" />{[client.city, client.country].filter(Boolean).join(", ")}</div>
                    )}
                  </div>

                  <div className="border-t border-line px-5 py-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-300">Deals</div>
                        <div className="font-display text-[18px] font-extrabold text-brand-600">{client.deal_count}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-300">Revenue</div>
                        <div className="font-display text-[18px] font-extrabold text-emerald-600">${(client.total_revenue ?? 0).toLocaleString()}</div>
                      </div>
                    </div>
                    {client.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {client.tags.slice(0, 3).map(t => (
                          <Tag key={t} className="!m-0 !rounded-full">{t}</Tag>
                        ))}
                        {client.tags.length > 3 && <Tag className="!m-0 !rounded-full">+{client.tags.length - 3}</Tag>}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 border-t border-line px-4 py-3">
                    <Link href={`/clients/${client.id}`} className="flex-1">
                      <Button block size="small">View profile</Button>
                    </Link>
                    <Tooltip title="New proposal">
                      <a href={`/generate?client=${encodeURIComponent(client.name)}&company=${encodeURIComponent(client.company ?? "")}`}>
                        <Button size="small" icon={<FileTextOutlined />} aria-label="New proposal" />
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
        title={<span className="inline-flex items-center gap-2"><TeamOutlined className="text-brand-600" />{editing ? "Edit client" : "Add a client"}</span>}
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
    </Page>
  );
}
