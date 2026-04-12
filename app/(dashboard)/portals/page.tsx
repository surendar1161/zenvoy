"use client";

import { useEffect, useState } from "react";
import {
  Avatar, Badge, Button, Card, Col, Empty, Modal, Row, Space,
  Tag, Typography, message, Form, Input, Switch, Tooltip, Spin,
} from "antd";
import ClientSelect from "@/components/ClientSelect";
import type { ClientOption } from "@/components/ClientSelect";
import {
  PlusOutlined, LinkOutlined, CopyOutlined, EyeOutlined,
  MessageOutlined, FileOutlined, TeamOutlined, SettingOutlined,
  GlobalOutlined, DeleteOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { loadBrand } from "@/lib/brand";

const { Title, Text } = Typography;

interface Portal {
  id: string;
  token: string;
  title: string | null;
  client_name: string | null;
  client_email: string | null;
  is_active: boolean;
  last_client_visit: string | null;
  created_at: string;
  _unread?: number;
}

export default function PortalsPage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [msgApi, ctx] = message.useMessage();
  const brand = loadBrand();
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("client_portals")
      .select("*")
      .order("created_at", { ascending: false });
    setPortals((data ?? []) as Portal[]);
    setLoading(false);
  }

  async function create() {
    const values = await form.validateFields();
    setCreating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { msgApi.error("Not signed in."); setCreating(false); return; }
    const { data, error } = await supabase
      .from("client_portals")
      .insert({
        user_id: user.id,
        title: values.title,
        client_name: values.client_name,
        client_email: values.client_email,
        welcome_message: values.welcome_message,
        is_active: true,
        brand_override: brand,
      })
      .select()
      .single();
    setCreating(false);
    if (error) { msgApi.error(error.message); return; }
    setPortals(prev => [data as Portal, ...prev]);
    setCreateOpen(false);
    form.resetFields();
    msgApi.success("Portal created! Share the link with your client.");
  }

  async function toggleActive(id: string, active: boolean) {
    const supabase = createClient();
    await supabase.from("client_portals").update({ is_active: active }).eq("id", id);
    setPortals(prev => prev.map(p => p.id === id ? { ...p, is_active: active } : p));
  }

  async function deletePortal(id: string) {
    Modal.confirm({
      title: "Delete portal?",
      content: "All files, messages, and invoices in this portal will be permanently deleted.",
      okText: "Delete", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("client_portals").delete().eq("id", id);
        setPortals(prev => prev.filter(p => p.id !== id));
        msgApi.success("Portal deleted");
      },
    });
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${appUrl}/portal/${token}`);
    msgApi.success("Portal link copied!");
  }

  function getInitials(name: string | null) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <GlobalOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Client Portals</Title>
            <Tag style={{ borderRadius: 20 }}>{portals.length} active</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>
            One branded link per client — files, invoices, contracts, and chat. All in one place.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large"
          onClick={() => setCreateOpen(true)}
          style={{ borderRadius: 10, fontWeight: 600 }}>
          Create Portal
        </Button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spin size="large" /></div>
      ) : portals.length === 0 ? (
        <Card style={{ borderRadius: 20, border: "2px dashed #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "80px 40px" } }}>
          <GlobalOutlined style={{ fontSize: 64, color: "#cbd5e1", marginBottom: 20 }} />
          <Title level={3} style={{ margin: "0 0 10px" }}>Create your first client portal</Title>
          <Text type="secondary" style={{ fontSize: 15, display: "block", marginBottom: 28 }}>
            Send one link to your client — they can access files, invoices, contracts, and message you directly. Fully branded.
          </Text>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}
            style={{ borderRadius: 12, height: 48, fontWeight: 700 }}>
            Create First Portal
          </Button>
        </Card>
      ) : (
        <Row gutter={[18, 18]}>
          {portals.map(portal => (
            <Col key={portal.id} xs={24} md={12} lg={8}>
              <Card
                style={{ borderRadius: 18, border: `1.5px solid ${portal.is_active ? "#e2e8f0" : "#f1f5f9"}`, height: "100%", opacity: portal.is_active ? 1 : 0.7 }}
                styles={{ body: { padding: 0 } }}
              >
                {/* Header */}
                <div style={{ padding: "20px 20px 16px", background: portal.is_active ? "linear-gradient(135deg, #0369a1, #0ea5e9)" : "#94a3b8", borderRadius: "16px 16px 0 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Space>
                      <Avatar size={44} style={{ background: "rgba(255,255,255,0.25)", fontWeight: 700, fontSize: 16, color: "#fff" }}>
                        {getInitials(portal.client_name)}
                      </Avatar>
                      <div>
                        <Text strong style={{ color: "#fff", display: "block", fontSize: 15 }}>
                          {portal.client_name ?? "Unnamed Client"}
                        </Text>
                        <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                          {portal.title ?? "Client Portal"}
                        </Text>
                      </div>
                    </Space>
                    <Switch
                      size="small"
                      checked={portal.is_active}
                      onChange={v => toggleActive(portal.id, v)}
                      style={{ background: portal.is_active ? "rgba(255,255,255,0.4)" : "#94a3b8" }}
                    />
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "16px 20px" }}>
                  <Space direction="vertical" size={10} style={{ width: "100%" }}>
                    {/* Portal link */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", border: "1px solid #f1f5f9" }}>
                      <LinkOutlined style={{ color: "#94a3b8", fontSize: 12, flexShrink: 0 }} />
                      <Text style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        /portal/{portal.token.slice(0, 16)}…
                      </Text>
                      <Tooltip title="Copy link">
                        <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyLink(portal.token)}
                          style={{ padding: 0, height: "auto", color: "#0ea5e9" }} />
                      </Tooltip>
                    </div>

                    {/* Meta */}
                    <Space size={16}>
                      {portal.client_email && (
                        <Text type="secondary" style={{ fontSize: 12 }}>✉️ {portal.client_email}</Text>
                      )}
                      {portal.last_client_visit && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          👁 Last seen {new Date(portal.last_client_visit).toLocaleDateString()}
                        </Text>
                      )}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      Created {new Date(portal.created_at).toLocaleDateString()}
                    </Text>
                  </Space>
                </div>

                {/* Actions */}
                <div style={{ padding: "12px 16px 16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link href={`/portals/${portal.id}`} style={{ flex: 1 }}>
                    <Button block icon={<SettingOutlined />} style={{ borderRadius: 8, fontWeight: 600 }}>
                      Manage
                    </Button>
                  </Link>
                  <Tooltip title="View as client">
                    <a href={`/portal/${portal.token}`} target="_blank" rel="noopener noreferrer">
                      <Button icon={<EyeOutlined />} style={{ borderRadius: 8 }} />
                    </a>
                  </Tooltip>
                  <Tooltip title="Copy link">
                    <Button icon={<CopyOutlined />} onClick={() => copyLink(portal.token)} style={{ borderRadius: 8 }} />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button danger icon={<DeleteOutlined />} onClick={() => deletePortal(portal.id)} style={{ borderRadius: 8 }} />
                  </Tooltip>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onCancel={() => setCreateOpen(false)}
        title={<Space><GlobalOutlined style={{ color: "#0ea5e9" }} />Create Client Portal</Space>}
        width={540}
        footer={[
          <Button key="cancel" onClick={() => setCreateOpen(false)}>Cancel</Button>,
          <Button key="create" type="primary" loading={creating} onClick={create}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            Create Portal
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }}>
          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Select Client *</Text>}
            required
          >
            <ClientSelect
              onSelect={(client: ClientOption | null) => {
                form.setFieldsValue({
                  client_name:  client?.name ?? "",
                  client_email: client?.email ?? "",
                  title: client
                    ? `${client.name}${client.company ? ` — ${client.company}` : ""} Portal`
                    : "",
                });
              }}
              placeholder="Choose an existing client…"
            />
          </Form.Item>
          {/* Hidden fields populated by ClientSelect */}
          <Form.Item name="client_name" hidden><Input /></Form.Item>
          <Form.Item name="client_email" hidden><Input /></Form.Item>
          <Form.Item name="title" label={<Text strong style={{ fontSize: 13 }}>Portal Title</Text>}>
            <Input placeholder="e.g. Website Redesign — Acme Corp" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="welcome_message" label={<Text strong style={{ fontSize: 13 }}>Welcome Message</Text>}>
            <Input.TextArea rows={3} placeholder="Hi Sarah, welcome to your project portal! Everything you need is here — files, invoices, and a direct line to me."
              style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
        <div style={{ background: "#eff6ff", borderRadius: 10, padding: "12px 16px", marginTop: 4 }}>
          <Text style={{ fontSize: 12, color: "#1d4ed8" }}>
            🎨 Your brand kit (logo, colours, font) will be automatically applied to this portal.
          </Text>
        </div>
      </Modal>
    </div>
  );
}
