"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import { useEffect, useState } from "react";
import {
  Button, Card, Col, Row, Space, Modal,
  Tooltip, message, Select, Input,
} from "antd";
import {
  FileTextOutlined, CopyOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined,
  PlusOutlined, DollarOutlined, CalendarOutlined, GlobalOutlined, EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { listProposals, deleteProposal } from "@/lib/db";
import { Page, PageHeader, StatusPill, EmptyState } from "@/components/app/ui";
import { ButtonLink } from "@/components/site/ui";

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
    <Page>
      {ctx}
      <PageHeader
        title="Proposals"
        sub="Track, manage, and follow up on every proposal."
        count={proposals.length ? `${proposals.length} total` : undefined}
        action={<ButtonLink href="/generate"><PlusOutlined /> New proposal</ButtonLink>}
      />

      {proposals.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Input
            prefix={<SearchOutlined className="text-ink-300" />}
            placeholder="Search client or project"
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            className="!w-[260px]"
          />
          <Select
            placeholder="All statuses"
            allowClear
            value={statusFilter ?? undefined}
            onChange={v => setStatusFilter(v ?? null)}
            className="!w-[160px]"
            options={[
              { value: "draft", label: "Draft" },
              { value: "sent", label: "Sent" },
              { value: "viewed", label: "Viewed" },
              { value: "accepted", label: "Accepted" },
              { value: "declined", label: "Declined" },
              { value: "expired", label: "Expired" },
            ]}
          />
          <span className="text-[13px] text-ink-400">{filtered.length} of {proposals.length}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(i => <div key={i} className="dp-skel h-48 rounded-3xl" />)}
        </div>
      ) : proposals.length === 0 ? (
        <EmptyState icon={<FileTextOutlined />} title="No proposals yet" body="Generate your first AI proposal and it will show up here.">
          <ButtonLink href="/generate" size="lg"><PlusOutlined /> Generate first proposal</ButtonLink>
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<SearchOutlined />} title="No matches" body="Nothing matches that search or status.">
          <button type="button" onClick={() => { setSearch(""); setStatusFilter(null); }} className="text-[14px] font-semibold text-brand-600">Clear filters</button>
        </EmptyState>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map(p => (
            <Col key={p.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full"
                styles={{ body: { padding: 22 } }}
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
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-semibold text-ink">
                        {p.client_name}{p.client_company ? ` · ${p.client_company}` : ""}
                      </div>
                      <div className="text-[13px] text-ink-400">{p.project_type ?? "—"}</div>
                    </div>
                    <StatusPill status={p.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
                    {p.total_budget ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                        <DollarOutlined /> {p.currency ?? "USD"} {p.total_budget.toLocaleString()}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 text-ink-400">
                      <CalendarOutlined /> {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>

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
          <Button key="pdf" icon={<DownloadOutlined />}
            onClick={() => window.open(`/api/pdf/proposal/${preview.id}`, "_blank")}>
            Download PDF
          </Button>,
          <a key="web" href={`/proposal/${preview.id}`} target="_blank" rel="noopener noreferrer">
            <Button type="primary" icon={<EyeOutlined />}>Open Full View</Button>
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
    </Page>
  );
}
