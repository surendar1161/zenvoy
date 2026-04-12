"use client";

import { useEffect, useState } from "react";
import {
  Button, Card, Col, Row, Typography, Space, Tag, Empty, Modal,
  Tooltip, message, Badge, Select, Spin,
} from "antd";
import {
  FileTextOutlined, CopyOutlined, DeleteOutlined, EyeOutlined,
  PlusOutlined, DollarOutlined, CalendarOutlined, GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { listProposals, deleteProposal } from "@/lib/db";

const { Title, Text, Paragraph } = Typography;

const STATUS_COLORS: Record<string, string> = {
  draft: "default", sent: "blue", viewed: "cyan",
  accepted: "green", declined: "red", expired: "orange",
};

type Proposal = {
  id: string;
  client_name: string;
  client_company: string | null;
  project_type: string | null;
  currency: string | null;
  total_budget: number | null;
  status: string;
  created_at: string;
  proposal_text: string | null;
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Proposal | null>(null);
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { fetchProposals(); }, []);

  async function fetchProposals() {
    setLoading(true);
    const rows = await listProposals();
    setProposals(rows as Proposal[]);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    Modal.confirm({
      title: "Delete proposal?",
      content: "This cannot be undone.",
      okText: "Delete", okType: "danger",
      onOk: async () => {
        await deleteProposal(id);
        setProposals(prev => prev.filter(p => p.id !== id));
        if (preview?.id === id) setPreview(null);
        msgApi.success("Proposal deleted");
      },
    });
  }

  async function updateStatus(id: string, status: string) {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("proposals").update({ status }).eq("id", id);
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    msgApi.success(`Status updated to ${status}`);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    msgApi.success("Copied to clipboard!");
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Title level={2} style={{ margin: "0 0 6px", fontWeight: 800 }}>My Proposals</Title>
          <Text type="secondary" style={{ fontSize: 15 }}>All proposals stored in your Supabase database.</Text>
        </div>
        <Link href="/generate">
          <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: 10, fontWeight: 600 }}>
            New Proposal
          </Button>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}><Spin size="large" /></div>
      ) : proposals.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: "center" }} styles={{ body: { padding: "80px 40px" } }}>
          <Empty
            image={<FileTextOutlined style={{ fontSize: 64, color: "#cbd5e1" }} />}
            imageStyle={{ height: 80 }}
            description={
              <div>
                <Title level={4} style={{ color: "#64748b", marginBottom: 8 }}>No proposals yet</Title>
                <Text type="secondary">Generate your first AI proposal to see it here.</Text>
              </div>
            }
          >
            <Link href="/generate">
              <Button type="primary" icon={<PlusOutlined />} size="large">Generate First Proposal</Button>
            </Link>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {proposals.map(p => (
            <Col key={p.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }}
                styles={{ body: { padding: 24 } }}
                actions={[
                  <Tooltip key="copy" title="Copy proposal text">
                    <Button type="text" icon={<CopyOutlined />}
                      disabled={!p.proposal_text}
                      onClick={() => p.proposal_text && copyText(p.proposal_text)} />
                  </Tooltip>,
                  <Tooltip key="view" title="Preview">
                    <Button type="text" icon={<EyeOutlined />} onClick={() => setPreview(p)} />
                  </Tooltip>,
                  <Tooltip key="web" title="Open web view">
                    <a href={`/proposal/${p.id}`} target="_blank" rel="noopener noreferrer">
                      <Button type="text" icon={<GlobalOutlined />} />
                    </a>
                  </Tooltip>,
                  <Tooltip key="del" title="Delete">
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(p.id)} />
                  </Tooltip>,
                ]}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <Text strong style={{ fontSize: 15, display: "block", marginBottom: 2 }}>
                        {p.client_name}{p.client_company ? ` · ${p.client_company}` : ""}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>{p.project_type ?? "—"}</Text>
                    </div>
                    <Badge status={STATUS_COLORS[p.status] as "default" | "success" | "error" | "warning" | "processing"}>
                      <Tag color={STATUS_COLORS[p.status]} style={{ borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>
                        {p.status}
                      </Tag>
                    </Badge>
                  </div>

                  <Space size={16}>
                    {p.total_budget && (
                      <Space size={4}>
                        <DollarOutlined style={{ color: "#10b981", fontSize: 13 }} />
                        <Text style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>
                          {p.currency ?? "USD"} {p.total_budget.toLocaleString()}
                        </Text>
                      </Space>
                    )}
                    <Space size={4}>
                      <CalendarOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </Text>
                    </Space>
                  </Space>

                  <Select
                    size="small"
                    value={p.status}
                    style={{ width: "100%", borderRadius: 8 }}
                    onChange={v => updateStatus(p.id, v)}
                    options={[
                      { value: "draft",    label: "📝 Draft" },
                      { value: "sent",     label: "📤 Sent" },
                      { value: "viewed",   label: "👁 Viewed" },
                      { value: "accepted", label: "✅ Accepted" },
                      { value: "declined", label: "❌ Declined" },
                      { value: "expired",  label: "⏰ Expired" },
                    ]}
                  />
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Preview Modal */}
      <Modal
        open={!!preview}
        onCancel={() => setPreview(null)}
        footer={preview ? [
          <Button key="copy" icon={<CopyOutlined />}
            onClick={() => preview.proposal_text && copyText(preview.proposal_text)}>
            Copy
          </Button>,
          <a key="web" href={`/proposal/${preview.id}`} target="_blank" rel="noopener noreferrer">
            <Button type="primary">Open Web View</Button>
          </a>,
        ] : null}
        title={preview ? `${preview.client_name} — ${preview.project_type}` : ""}
        width={760}
        styles={{ body: { maxHeight: "70vh", overflow: "auto" } }}
      >
        {preview?.proposal_text && (
          <Paragraph>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
              {preview.proposal_text}
            </pre>
          </Paragraph>
        )}
      </Modal>
    </div>
  );
}
