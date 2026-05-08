"use client";

import { useEffect, useState } from "react";
import {
  Button, Card, Col, Empty, Row, Space, Spin, Switch, Tag, Typography, message, Tabs, Table, Tooltip, Modal,
} from "antd";
import {
  ThunderboltOutlined, PlusOutlined, DeleteOutlined, EditOutlined,
  CheckCircleOutlined, WarningOutlined, ClockCircleOutlined,
  EyeOutlined, DollarOutlined, FileProtectOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import AutomationBuilder from "@/components/AutomationBuilder";
import type { AutomationData } from "@/components/AutomationBuilder";
import { AUTOMATION_TEMPLATES } from "@/lib/automations/templates";

const { Title, Text } = Typography;

const TRIGGER_LABELS: Record<string, string> = {
  proposal_accepted: "Proposal Accepted", proposal_viewed: "Proposal Viewed",
  proposal_signed: "Proposal Signed", proposal_declined: "Proposal Declined",
  contract_signed: "Contract Signed", invoice_paid: "Invoice Paid",
  invoice_overdue: "Invoice Overdue", invoice_sent: "Invoice Sent",
  payment_received: "Payment Received", payment_failed: "Payment Failed",
};

const TRIGGER_COLORS: Record<string, string> = {
  proposal_accepted: "green", proposal_viewed: "blue", proposal_signed: "green",
  proposal_declined: "red", contract_signed: "green", invoice_paid: "green",
  invoice_overdue: "red", invoice_sent: "blue", payment_received: "green", payment_failed: "red",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  FileProtectOutlined: <FileProtectOutlined />, ClockCircleOutlined: <ClockCircleOutlined />,
  DollarOutlined: <DollarOutlined />, EyeOutlined: <EyeOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />, WarningOutlined: <WarningOutlined />,
};

interface Automation {
  id: string; name: string; description: string | null; enabled: boolean;
  trigger_type: string; conditions: unknown[]; actions: unknown[];
  last_triggered_at: string | null; trigger_count: number;
  template_id: string | null; created_at: string;
}

interface LogEntry {
  id: string; automation_id: string; trigger_type: string;
  status: string; error_message: string | null; duration_ms: number;
  created_at: string;
  workflow_automations?: { name: string } | null;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Automation | null>(null);
  const [saving, setSaving] = useState(false);
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { load(); }, []);

  async function load() {
    const [autoRes, logRes] = await Promise.all([
      fetch("/api/automations"),
      fetch("/api/automations/logs?limit=20"),
    ]);
    if (autoRes.ok) setAutomations(await autoRes.json());
    if (logRes.ok) {
      const body = await logRes.json();
      setLogs(body.logs ?? []);
    }
    setLoading(false);
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    await fetch(`/api/automations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled } : a));
  }

  async function deleteAutomation(id: string) {
    Modal.confirm({
      title: "Delete automation?", okText: "Delete", okType: "danger",
      onOk: async () => {
        await fetch(`/api/automations/${id}`, { method: "DELETE" });
        setAutomations(prev => prev.filter(a => a.id !== id));
        msgApi.success("Deleted");
      },
    });
  }

  async function handleSave(data: AutomationData) {
    setSaving(true);
    const isEdit = !!data.id;
    const res = await fetch(isEdit ? `/api/automations/${data.id}` : "/api/automations", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json();
      msgApi.error(err.error ?? "Failed to save");
      return;
    }
    const saved = await res.json();
    if (isEdit) {
      setAutomations(prev => prev.map(a => a.id === saved.id ? saved : a));
    } else {
      setAutomations(prev => [saved, ...prev]);
    }
    setBuilderOpen(false);
    setEditTarget(null);
    msgApi.success(isEdit ? "Updated" : "Created");
  }

  async function createFromTemplate(tpl: typeof AUTOMATION_TEMPLATES[0]) {
    setSaving(true);
    const res = await fetch("/api/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tpl.name,
        description: tpl.description,
        trigger_type: tpl.trigger_type,
        conditions: tpl.conditions,
        actions: tpl.actions,
        template_id: tpl.id,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json();
      msgApi.error(err.error ?? "Failed to create");
      return;
    }
    const saved = await res.json();
    setAutomations(prev => [saved, ...prev]);
    msgApi.success("Automation created from template");
  }

  const logColumns: TableColumnsType<LogEntry> = [
    {
      title: "Automation", key: "name", render: (_, l) => {
        const name = (l.workflow_automations as { name: string } | null)?.name ?? "—";
        return <Text style={{ fontSize: 13 }}>{name}</Text>;
      },
    },
    {
      title: "Trigger", key: "trigger", render: (_, l) => (
        <Tag color={TRIGGER_COLORS[l.trigger_type] ?? "default"} style={{ borderRadius: 12, fontSize: 11 }}>
          {TRIGGER_LABELS[l.trigger_type] ?? l.trigger_type}
        </Tag>
      ),
    },
    {
      title: "Status", key: "status", render: (_, l) => (
        <Tag color={l.status === "success" ? "green" : l.status === "partial" ? "orange" : "red"} style={{ borderRadius: 12 }}>
          {l.status}
        </Tag>
      ),
    },
    {
      title: "Time", key: "time", render: (_, l) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {new Date(l.created_at).toLocaleString()} ({l.duration_ms}ms)
        </Text>
      ),
    },
  ];

  if (loading) {
    return <div style={{ textAlign: "center", padding: 120 }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
      {ctx}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <ThunderboltOutlined style={{ fontSize: 24, color: "#8b5cf6" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Automations</Title>
            <Tag style={{ borderRadius: 20 }}>{automations.length} active</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>Automate repetitive tasks with trigger-based workflows.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large"
          onClick={() => { setEditTarget(null); setBuilderOpen(true); }}
          style={{ borderRadius: 10, fontWeight: 600, background: "#8b5cf6", borderColor: "#8b5cf6" }}>
          New Automation
        </Button>
      </div>

      <Tabs defaultActiveKey="automations" items={[
        {
          key: "automations",
          label: "My Automations",
          children: automations.length === 0 ? (
            <Card style={{ borderRadius: 16, border: "2px dashed #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "60px 40px" } }}>
              <ThunderboltOutlined style={{ fontSize: 64, color: "#cbd5e1", marginBottom: 16 }} />
              <Title level={4} style={{ color: "#64748b", margin: "0 0 8px" }}>No automations yet</Title>
              <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                Start from a template below or create a custom automation.
              </Text>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setBuilderOpen(true)}
                style={{ borderRadius: 12, background: "#8b5cf6", borderColor: "#8b5cf6" }}>
                Create First Automation
              </Button>
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {automations.map(a => (
                <Col key={a.id} xs={24} md={12}>
                  <Card
                    style={{ borderRadius: 16, border: "1px solid #e2e8f0", opacity: a.enabled ? 1 : 0.6 }}
                    styles={{ body: { padding: 20 } }}
                    actions={[
                      <Tooltip key="edit" title="Edit">
                        <Button type="text" icon={<EditOutlined />}
                          onClick={() => { setEditTarget(a); setBuilderOpen(true); }} />
                      </Tooltip>,
                      <Tooltip key="del" title="Delete">
                        <Button type="text" danger icon={<DeleteOutlined />}
                          onClick={() => deleteAutomation(a.id)} />
                      </Tooltip>,
                    ]}
                  >
                    <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 14 }}>{a.name}</Text>
                      <Switch size="small" checked={a.enabled}
                        onChange={v => toggleEnabled(a.id, v)} />
                    </Space>
                    {a.description && (
                      <Text type="secondary" style={{ display: "block", fontSize: 12, marginBottom: 8 }}>
                        {a.description}
                      </Text>
                    )}
                    <Space size={4} wrap>
                      <Tag color={TRIGGER_COLORS[a.trigger_type] ?? "default"} style={{ borderRadius: 12, fontSize: 11 }}>
                        {TRIGGER_LABELS[a.trigger_type] ?? a.trigger_type}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {a.actions.length} action{a.actions.length !== 1 ? "s" : ""}
                      </Text>
                      {a.trigger_count > 0 && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          · Ran {a.trigger_count}x
                        </Text>
                      )}
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ),
        },
        {
          key: "templates",
          label: "Templates",
          children: (
            <Row gutter={[16, 16]}>
              {AUTOMATION_TEMPLATES.map(tpl => {
                const alreadyUsed = automations.some(a => a.template_id === tpl.id);
                return (
                  <Col key={tpl.id} xs={24} sm={12} lg={8}>
                    <Card
                      style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }}
                      styles={{ body: { padding: 20 } }}
                    >
                      <Space style={{ marginBottom: 8 }}>
                        <span style={{ fontSize: 20, color: "#8b5cf6" }}>
                          {ICON_MAP[tpl.icon] ?? <ThunderboltOutlined />}
                        </span>
                        <Text strong style={{ fontSize: 14 }}>{tpl.name}</Text>
                      </Space>
                      <Text type="secondary" style={{ display: "block", fontSize: 12, marginBottom: 12 }}>
                        {tpl.description}
                      </Text>
                      <Space size={4} style={{ marginBottom: 12 }}>
                        <Tag color={TRIGGER_COLORS[tpl.trigger_type]} style={{ borderRadius: 12, fontSize: 11 }}>
                          {TRIGGER_LABELS[tpl.trigger_type]}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {tpl.actions.length} action{tpl.actions.length !== 1 ? "s" : ""}
                        </Text>
                      </Space>
                      <Button block disabled={alreadyUsed} loading={saving}
                        onClick={() => createFromTemplate(tpl)}
                        style={{ borderRadius: 8, fontWeight: 600 }}>
                        {alreadyUsed ? "Already Added" : "Use Template"}
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ),
        },
        {
          key: "activity",
          label: "Activity Log",
          children: logs.length === 0 ? (
            <Empty description="No automation activity yet" />
          ) : (
            <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
              <Table dataSource={logs} columns={logColumns} rowKey="id"
                pagination={{ pageSize: 10 }} />
            </Card>
          ),
        },
      ]} />

      <AutomationBuilder
        open={builderOpen}
        onClose={() => { setBuilderOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        initial={editTarget as AutomationData | null}
        saving={saving}
      />
    </div>
  );
}
