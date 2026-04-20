"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import { useEffect, useState } from "react";
import {
  Button, Card, Col, Row, Typography, Space, Tag, Empty, Modal,
  Tooltip, message, Badge, Select, Spin,
} from "antd";
import {
  FileTextOutlined, CopyOutlined, DeleteOutlined, EyeOutlined,
  PlusOutlined, DollarOutlined, CalendarOutlined, GlobalOutlined, EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import Link from "next/link";
import { listProposals, deleteProposal } from "@/lib/db";

const { Title, Text } = Typography;

function renderProposalMd(text: string): string {
  const blocks = text.split(/\n\n+/);
  return blocks.map(block => {
    const t = block.trim();
    if (!t) return "";

    // Headings
    if (/^### /.test(t)) return `<h3 style="font-size:15px;font-weight:700;margin:16px 0 6px;color:#0f172a">${t.replace(/^### /, "")}</h3>`;
    if (/^## /.test(t)) return `<h2 style="font-size:17px;font-weight:800;margin:20px 0 8px;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:6px">${t.replace(/^## /, "")}</h2>`;
    if (/^# /.test(t))  return `<h1 style="font-size:20px;font-weight:900;margin:20px 0 8px;color:#0f172a">${t.replace(/^# /, "")}</h1>`;

    // Table
    if (t.includes("|") && t.split("\n").length >= 3 && /^[\|\-:\s]+$/.test(t.split("\n")[1])) {
      const lines = t.split("\n").filter(Boolean);
      const headers = lines[0].split("|").map(h => h.trim()).filter(Boolean);
      const rows = lines.slice(2);
      const th = headers.map(h => `<th style="padding:9px 14px;background:#f8fafc;font-size:12px;font-weight:700;color:#64748b;border-bottom:2px solid #e2e8f0;text-align:left;white-space:nowrap">${inline(h)}</th>`).join("");
      const tbody = rows.map((row, ri) => {
        const cells = row.split("|").map(c => c.trim()).filter(Boolean);
        const tds = cells.map((c, ci) => `<td style="padding:9px 14px;font-size:13px;color:#374151;border-bottom:1px solid #f1f5f9;vertical-align:top;${ci===0?"font-weight:600;":""}">${inline(c)}</td>`).join("");
        return `<tr style="background:${ri%2===0?"#fff":"#f8fafc"}">${tds}</tr>`;
      }).join("");
      return `<div style="overflow-x:auto;margin:12px 0;border-radius:10px;border:1px solid #e2e8f0"><table style="width:100%;border-collapse:collapse"><thead><tr>${th}</tr></thead><tbody>${tbody}</tbody></table></div>`;
    }

    // Blockquote
    if (t.startsWith("> ")) return `<blockquote style="border-left:3px solid #0ea5e9;background:#f0f9ff;margin:10px 0;padding:10px 16px;border-radius:0 8px 8px 0;color:#0369a1;font-style:italic;font-size:13px">${inline(t.replace(/^> /gm, ""))}</blockquote>`;

    // Bullet list
    if (/^[-•*]\s/.test(t)) {
      const lis = t.split("\n").filter(l => /^[-•*]\s/.test(l.trim())).map(l => `<li style="margin-bottom:4px">${inline(l.replace(/^[-•*]\s+/,""))}</li>`).join("");
      return `<ul style="margin:6px 0;padding-left:20px;list-style:disc">${lis}</ul>`;
    }

    // Numbered list
    if (/^\d+\.\s/.test(t)) {
      const lis = t.split("\n").filter(l => /^\d+\.\s/.test(l.trim())).map(l => `<li style="margin-bottom:4px">${inline(l.replace(/^\d+\.\s+/,""))}</li>`).join("");
      return `<ol style="margin:6px 0;padding-left:20px">${lis}</ol>`;
    }

    return `<p style="margin:0 0 10px;line-height:1.75">${inline(t.replace(/\n/g,"<br/>"))}</p>`;
  }).join("\n");
}

function inline(t: string): string {
  return t
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:12px'>$1</code>");
}

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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
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

  const filtered = proposals.filter(p => {
    const matchSearch = !search ||
      p.client_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.client_company ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.project_type ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Title level={2} style={{ margin: "0 0 6px", fontWeight: 800 }}>My Proposals</Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Track, manage, and follow up on all your proposals.</Text>
        </div>
        <Link href="/generate">
          <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: 10, fontWeight: 600 }}>
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Search + filter */}
      {proposals.length > 0 && (
        <Space wrap style={{ marginBottom: 20 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            placeholder="Search client or project…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ width: 260, borderRadius: 10 }}
          />
          <Select
            placeholder="All statuses"
            allowClear
            value={statusFilter ?? undefined}
            onChange={v => setStatusFilter(v ?? null)}
            style={{ width: 160 }}
            options={[
              { value: "draft",    label: "Draft" },
              { value: "sent",     label: "Sent" },
              { value: "viewed",   label: "Viewed" },
              { value: "accepted", label: "Accepted" },
              { value: "declined", label: "Declined" },
              { value: "expired",  label: "Expired" },
            ]}
          />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {filtered.length} of {proposals.length} proposals
          </Text>
        </Space>
      )}

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
      ) : filtered.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: "center" }} styles={{ body: { padding: "60px 40px" } }}>
          <Text type="secondary" style={{ fontSize: 15, display: "block" }}>
            No proposals match your search. <Button type="link" onClick={() => { setSearch(""); setStatusFilter(null); }} style={{ padding: 0 }}>Clear filters</Button>
          </Text>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map(p => (
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
                  <Tooltip key="edit" title="Edit in document editor">
                    <Link href={`/editor/proposal/${p.id}`}>
                      <Button type="text" icon={<EditOutlined />} />
                    </Link>
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
                      { value: "draft",    label: "Draft" },
                      { value: "sent",     label: "Sent" },
                      { value: "viewed",   label: "Viewed" },
                      { value: "accepted", label: "Accepted" },
                      { value: "declined", label: "Declined" },
                      { value: "expired",  label: "Expired" },
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
            Copy Text
          </Button>,
          <a key="web" href={`/proposal/${preview.id}`} target="_blank" rel="noopener noreferrer">
            <Button type="primary" icon={<EyeOutlined />}>Open Full View & Download</Button>
          </a>,
        ] : null}
        title={preview ? `${preview.client_name} — ${preview.project_type}` : ""}
        width={820}
        styles={{ body: { maxHeight: "72vh", overflow: "auto", padding: "16px 24px" } }}
      >
        {preview?.proposal_text && (
          <div
            style={{ fontSize: 14, lineHeight: 1.8, color: "#374151" }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderProposalMd(preview.proposal_text))}}
          />
        )}
      </Modal>
    </div>
  );
}
