"use client";

import { useEffect, useState } from "react";
import {
  Avatar, Button, Card, Col, Empty, Input, InputNumber, Progress, Row, Select,
  Space, Spin, Tag, Tooltip, Typography, message, Badge,
} from "antd";
import {
  ThunderboltOutlined, PlusOutlined, EyeOutlined,
  DollarOutlined, ClockCircleOutlined, ArrowRightOutlined,
  CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined,
  SendOutlined, FundOutlined, TrophyOutlined, FireOutlined,
  SearchOutlined, FilterOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const STAGES = [
  { key: "draft",    label: "Draft",    color: "#94a3b8", bg: "#f1f5f9", icon: <FileTextOutlined />,      desc: "Created, not sent" },
  { key: "sent",     label: "Sent",     color: "#3b82f6", bg: "#eff6ff", icon: <SendOutlined />,           desc: "Waiting for client" },
  { key: "viewed",   label: "Viewed",   color: "#8b5cf6", bg: "#f5f3ff", icon: <EyeOutlined />,            desc: "Client has opened it" },
  { key: "accepted", label: "Won",      color: "#10b981", bg: "#f0fdf4", icon: <CheckCircleOutlined />,    desc: "Proposal accepted" },
  { key: "declined", label: "Lost",     color: "#ef4444", bg: "#fff1f2", icon: <CloseCircleOutlined />,    desc: "Proposal declined" },
  { key: "expired",  label: "Expired",  color: "#f59e0b", bg: "#fffbeb", icon: <ClockCircleOutlined />,   desc: "No response" },
];

interface Proposal {
  id: string;
  client_name: string;
  client_company: string | null;
  project_type: string | null;
  currency: string | null;
  total_budget: number | null;
  status: string;
  view_count: number | null;
  created_at: string;
  proposal_text: string | null;
}

export default function PipelinePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [budgetMin, setBudgetMin] = useState<number | null>(null);
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("proposals")
      .select("id,client_name,client_company,project_type,currency,total_budget,status,view_count,created_at,proposal_text")
      .order("created_at", { ascending: false });
    if (error) { msgApi.error(error.message); }
    else {
      setProposals(data ?? []);
      const c = data?.find(p => p.currency)?.currency;
      if (c) setCurrency(c);
    }
    setLoading(false);
  }

  async function moveStage(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("proposals").update({ status }).eq("id", id);
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    msgApi.success("Status updated");
  }

  // Metrics
  const total       = proposals.length;
  const won         = proposals.filter(p => p.status === "accepted");
  const active      = proposals.filter(p => ["sent","viewed"].includes(p.status));
  const winRate     = total > 0 ? Math.round(won.length / total * 100) : 0;
  const pipelineVal = active.reduce((s, p) => s + (p.total_budget ?? 0), 0);
  const wonVal      = won.reduce((s, p) => s + (p.total_budget ?? 0), 0);
  const avgDeal     = won.length > 0 ? Math.round(wonVal / won.length) : 0;
  const viewedPct   = proposals.filter(p => p.status !== "draft").length > 0
    ? Math.round(proposals.filter(p => ["viewed","accepted"].includes(p.status)).length / proposals.filter(p => p.status !== "draft").length * 100)
    : 0;

  const hasFilters = !!search || !!stageFilter || budgetMin != null || budgetMax != null;
  const filteredProposals = proposals.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        p.client_name.toLowerCase().includes(q) ||
        (p.client_company ?? "").toLowerCase().includes(q) ||
        (p.project_type ?? "").toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (stageFilter && p.status !== stageFilter) return false;
    if (budgetMin != null && (p.total_budget ?? 0) < budgetMin) return false;
    if (budgetMax != null && (p.total_budget ?? 0) > budgetMax) return false;
    return true;
  });

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 120 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 28px" }}>
      {ctx}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <FundOutlined style={{ fontSize: 26, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Deal Pipeline</Title>
            <Tag color="blue" style={{ borderRadius: 20, fontWeight: 700 }}>{total} proposals</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>
            Track every deal from draft to closed — see where revenue is at risk.
          </Text>
        </div>
        <Link href="/generate">
          <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: 10, fontWeight: 600 }}>
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Space wrap size={12} style={{ marginBottom: 20 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Search by client, company, or project..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          style={{ width: 280, borderRadius: 10 }}
        />
        <Select
          placeholder="All stages"
          allowClear
          value={stageFilter ?? undefined}
          onChange={v => setStageFilter(v ?? null)}
          style={{ width: 160 }}
          options={STAGES.map(s => ({ value: s.key, label: s.label }))}
        />
        <InputNumber
          placeholder="Min budget"
          value={budgetMin}
          onChange={v => setBudgetMin(v)}
          min={0}
          style={{ width: 130, borderRadius: 10 }}
          prefix={<DollarOutlined style={{ color: "#94a3b8" }} />}
        />
        <InputNumber
          placeholder="Max budget"
          value={budgetMax}
          onChange={v => setBudgetMax(v)}
          min={0}
          style={{ width: 130, borderRadius: 10 }}
          prefix={<DollarOutlined style={{ color: "#94a3b8" }} />}
        />
        {hasFilters && (
          <>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {filteredProposals.length} of {proposals.length} proposals
            </Text>
            <Button
              size="small"
              onClick={() => { setSearch(""); setStageFilter(null); setBudgetMin(null); setBudgetMax(null); }}
              style={{ borderRadius: 8, fontSize: 12 }}
            >
              Clear filters
            </Button>
          </>
        )}
      </Space>

      {/* KPI row */}
      <Row gutter={[14, 14]} style={{ marginBottom: 28 }}>
        {[
          {
            icon: <DollarOutlined style={{ fontSize: 22, color: "#0ea5e9" }} />,
            label: "Pipeline Value",
            value: `${currency} ${pipelineVal.toLocaleString()}`,
            sub: `${active.length} active proposals`,
            color: "#0ea5e9", bg: "#eff6ff",
          },
          {
            icon: <TrophyOutlined style={{ fontSize: 22, color: "#10b981" }} />,
            label: "Won This Month",
            value: `${currency} ${wonVal.toLocaleString()}`,
            sub: `${won.length} deals closed`,
            color: "#10b981", bg: "#f0fdf4",
          },
          {
            icon: <FireOutlined style={{ fontSize: 22, color: "#f59e0b" }} />,
            label: "Win Rate",
            value: `${winRate}%`,
            sub: `${won.length} of ${total} proposals`,
            color: "#f59e0b", bg: "#fffbeb",
          },
          {
            icon: <EyeOutlined style={{ fontSize: 22, color: "#8b5cf6" }} />,
            label: "Open Rate",
            value: `${viewedPct}%`,
            sub: "sent proposals viewed",
            color: "#8b5cf6", bg: "#f5f3ff",
          },
          {
            icon: <ThunderboltOutlined style={{ fontSize: 22, color: "#0369a1" }} />,
            label: "Avg Deal Size",
            value: avgDeal > 0 ? `${currency} ${avgDeal.toLocaleString()}` : "—",
            sub: "from won proposals",
            color: "#0369a1", bg: "#eff6ff",
          },
        ].map(k => (
          <Col key={k.label} xs={12} sm={8} md={8} lg={5}>
            <Card style={{ borderRadius: 14, border: `1.5px solid ${k.color}20`, background: k.bg, height: "100%" }} styles={{ body: { padding: 18 } }}>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                {k.icon}
                <div style={{ fontSize: 22, fontWeight: 900, color: k.color, lineHeight: 1.2 }}>{k.value}</div>
                <Text type="secondary" style={{ fontSize: 11 }}>{k.label}</Text>
                <Text style={{ fontSize: 11, color: k.color }}>{k.sub}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Win rate progress bar */}
      {total > 0 && (
        <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 28 }} styles={{ body: { padding: "16px 24px" } }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            {STAGES.map(s => {
              const count = filteredProposals.filter(p => p.status === s.key).length;
              const val = filteredProposals.filter(p => p.status === s.key).reduce((sum, p) => sum + (p.total_budget ?? 0), 0);
              return (
                <Space key={s.key} size={6}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                  <Text style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{s.label}</Text>
                  <Badge count={count} style={{ background: s.color, fontSize: 10 }} />
                  {val > 0 && <Text type="secondary" style={{ fontSize: 11 }}>{currency} {val.toLocaleString()}</Text>}
                </Space>
              );
            })}
          </div>
          <div style={{ display: "flex", height: 8, borderRadius: 8, overflow: "hidden", gap: 2 }}>
            {STAGES.map(s => {
              const filteredTotal = filteredProposals.length;
              const pct = filteredTotal > 0 ? (filteredProposals.filter(p => p.status === s.key).length / filteredTotal) * 100 : 0;
              return pct > 0 ? (
                <Tooltip key={s.key} title={`${s.label}: ${Math.round(pct)}%`}>
                  <div style={{ width: `${pct}%`, background: s.color, borderRadius: 4, cursor: "pointer", transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")} />
                </Tooltip>
              ) : null;
            })}
          </div>
        </Card>
      )}

      {/* Kanban columns */}
      {total === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: "center", border: "2px dashed #e2e8f0" }} styles={{ body: { padding: "80px 40px" } }}>
          <FundOutlined style={{ fontSize: 64, color: "#cbd5e1", marginBottom: 16 }} />
          <Title level={3} style={{ color: "#64748b", margin: "0 0 8px" }}>No proposals yet</Title>
          <Text type="secondary" style={{ fontSize: 15, display: "block", marginBottom: 28 }}>
            Create your first proposal to start tracking your deal pipeline.
          </Text>
          <Link href="/generate">
            <Button type="primary" size="large" icon={<PlusOutlined />} style={{ borderRadius: 12, height: 48, fontWeight: 700 }}>
              Create First Proposal
            </Button>
          </Link>
        </Card>
      ) : hasFilters && filteredProposals.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: "center", border: "2px dashed #e2e8f0" }} styles={{ body: { padding: "60px 40px" } }}>
          <FilterOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 12 }} />
          <Title level={4} style={{ color: "#64748b", margin: "0 0 8px" }}>No matching proposals</Title>
          <Text type="secondary" style={{ fontSize: 14, display: "block", marginBottom: 16 }}>
            Try adjusting your search or filters to find what you're looking for.
          </Text>
          <Button onClick={() => { setSearch(""); setStageFilter(null); setBudgetMin(null); setBudgetMax(null); }} style={{ borderRadius: 8 }}>
            Clear All Filters
          </Button>
        </Card>
      ) : (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 16, alignItems: "flex-start" }}>
          {STAGES.map(stage => {
            const stageProposals = filteredProposals.filter(p => p.status === stage.key);
            const stageValue = stageProposals.reduce((s, p) => s + (p.total_budget ?? 0), 0);
            return (
              <div key={stage.key} style={{ minWidth: 260, maxWidth: 280, flex: "0 0 260px" }}>
                {/* Column header */}
                <div style={{ background: stage.bg, borderRadius: "12px 12px 0 0", padding: "12px 16px", border: `1.5px solid ${stage.color}25`, borderBottom: `3px solid ${stage.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Space size={6}>
                      <span style={{ color: stage.color, fontSize: 16 }}>{stage.icon}</span>
                      <Text strong style={{ color: stage.color, fontSize: 14 }}>{stage.label}</Text>
                      <Badge count={stageProposals.length} style={{ background: stage.color, fontSize: 10 }} />
                    </Space>
                  </div>
                  {stageValue > 0 && (
                    <Text style={{ fontSize: 12, color: stage.color, fontWeight: 700, display: "block", marginTop: 4 }}>
                      {currency} {stageValue.toLocaleString()}
                    </Text>
                  )}
                  <Text type="secondary" style={{ fontSize: 11 }}>{stage.desc}</Text>
                </div>

                {/* Cards */}
                <div style={{ background: "#f8fafc", border: `1px solid ${stage.color}20`, borderTop: "none", borderRadius: "0 0 12px 12px", minHeight: 120, padding: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                  {stageProposals.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "#cbd5e1" }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>No proposals</Text>
                    </div>
                  ) : (
                    stageProposals.map(p => (
                      <ProposalCard
                        key={p.id}
                        proposal={p}
                        stageColor={stage.color}
                        currency={currency}
                        onMove={moveStage}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProposalCard({
  proposal: p, stageColor, currency, onMove,
}: {
  proposal: Proposal;
  stageColor: string;
  currency: string;
  onMove: (id: string, status: string) => void;
}) {
  const initials = p.client_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const age = dayjs(p.created_at).fromNow();
  const isOld = dayjs().diff(dayjs(p.created_at), "day") > 14 && !["accepted","declined"].includes(p.status);

  return (
    <Card
      style={{ borderRadius: 10, border: `1px solid ${stageColor}25`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: "default" }}
      styles={{ body: { padding: 14 } }}
      hoverable
    >
      {/* Client */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <Avatar size={34} style={{ background: `${stageColor}25`, color: stageColor, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
          {initials}
        </Avatar>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Text strong style={{ fontSize: 13, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.client_name}
          </Text>
          {p.client_company && (
            <Text type="secondary" style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
              {p.client_company}
            </Text>
          )}
        </div>
      </div>

      {/* Project type */}
      {p.project_type && (
        <Tag style={{ borderRadius: 20, fontSize: 10, padding: "0 8px", marginBottom: 8, background: `${stageColor}12`, color: stageColor, borderColor: `${stageColor}30`, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.project_type}
        </Tag>
      )}

      {/* Budget + views */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        {p.total_budget ? (
          <Text strong style={{ color: "#10b981", fontSize: 14 }}>
            {currency} {p.total_budget.toLocaleString()}
          </Text>
        ) : <span />}
        <Space size={6}>
          {(p.view_count ?? 0) > 0 && (
            <Tooltip title={`Viewed ${p.view_count} time${p.view_count === 1 ? "" : "s"}`}>
              <Space size={3}>
                <EyeOutlined style={{ color: "#8b5cf6", fontSize: 12 }} />
                <Text style={{ color: "#8b5cf6", fontSize: 11, fontWeight: 600 }}>{p.view_count}</Text>
              </Space>
            </Tooltip>
          )}
          {isOld && (
            <Tooltip title="No activity in 14+ days">
              <ClockCircleOutlined style={{ color: "#f59e0b", fontSize: 12 }} />
            </Tooltip>
          )}
        </Space>
      </div>

      {/* Age */}
      <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 10 }}>
        Created {age}
      </Text>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Link href={`/proposal/${p.id}`} target="_blank">
          <Button size="small" icon={<EyeOutlined />} style={{ borderRadius: 6, fontSize: 11, height: 26 }}>View</Button>
        </Link>
        <Select
          size="small"
          value={p.status}
          style={{ flex: 1, minWidth: 90, fontSize: 11 }}
          onChange={v => onMove(p.id, v)}
          options={[
            { value: "draft",    label: "Draft" },
            { value: "sent",     label: "Sent" },
            { value: "viewed",   label: "Viewed" },
            { value: "accepted", label: "Won ✓" },
            { value: "declined", label: "Lost ✗" },
            { value: "expired",  label: "Expired" },
          ]}
        />
      </div>
    </Card>
  );
}
