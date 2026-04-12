"use client";

import { useEffect, useState } from "react";
import {
  Avatar, Badge, Button, Card, Col, Empty, List, Progress,
  Row, Space, Statistic, Tag, Typography, Spin,
} from "antd";
import {
  ThunderboltOutlined, FileTextOutlined, SafetyCertificateOutlined,
  TeamOutlined, DollarOutlined, EyeOutlined, CheckCircleOutlined,
  ArrowRightOutlined, ClockCircleOutlined, BellOutlined, WarningOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const { Title, Text } = Typography;

const PROPOSAL_STATUS_COLOR: Record<string, string> = {
  draft: "#94a3b8", sent: "#0ea5e9", viewed: "#06b6d4",
  accepted: "#10b981", signed: "#10b981", declined: "#ef4444", expired: "#f59e0b",
};

interface DashboardData {
  userName: string;
  proposals: {
    total: number; draft: number; sent: number;
    viewed: number; accepted: number; declined: number;
  };
  contracts: { total: number; signed: number; draft: number };
  clients: { total: number; active: number; leads: number };
  revenue: number;
  viewCount: number;
  recentProposals: {
    id: string; client_name: string; project_type: string | null;
    status: string; currency: string | null; total_budget: number | null;
    view_count: number; created_at: string;
  }[];
  recentNotifications: {
    id: string; title: string; message: string; type: string; created_at: string;
  }[];
  needsAttention: {
    id: string; client_name: string; project_type: string | null;
    status: string; created_at: string; reason: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const supabase = createClient();

    const [
      userResult,
      { data: props },
      { data: contracts },
      { data: clients },
      { data: notifs },
    ] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("proposals").select("id,client_name,project_type,status,currency,total_budget,view_count,created_at").order("created_at", { ascending: false }),
      supabase.from("contracts").select("id,status,created_at").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,status").order("created_at", { ascending: false }),
      supabase.from("notifications").select("id,title,message,type,created_at").order("created_at", { ascending: false }).limit(8),
    ]);

    const allProps = props ?? [];
    const allContracts = contracts ?? [];
    const allClients = clients ?? [];

    // Proposal stats
    const pStats = {
      total: allProps.length,
      draft:    allProps.filter(p => p.status === "draft").length,
      sent:     allProps.filter(p => p.status === "sent").length,
      viewed:   allProps.filter(p => p.status === "viewed").length,
      accepted: allProps.filter(p => p.status === "accepted" || p.status === "signed").length,
      declined: allProps.filter(p => p.status === "declined").length,
    };

    // Revenue from accepted/signed
    const revenue = allProps
      .filter(p => p.status === "accepted" || p.status === "signed")
      .reduce((s, p) => s + (p.total_budget ?? 0), 0);

    // Total views
    const viewCount = allProps.reduce((s, p) => s + (p.view_count ?? 0), 0);

    // Needs attention: sent >3 days ago and not viewed; or viewed >2 days ago and not accepted
    const now = Date.now();
    const needsAttention = allProps
      .filter(p => {
        const age = (now - new Date(p.created_at).getTime()) / 86400000;
        if (p.status === "sent" && age > 3) return true;
        if (p.status === "viewed" && age > 2) return true;
        return false;
      })
      .slice(0, 5)
      .map(p => {
        const age = Math.floor((now - new Date(p.created_at).getTime()) / 86400000);
        return {
          ...p,
          reason: p.status === "sent"
            ? `Sent ${age} days ago — not opened yet`
            : `Viewed ${age} days ago — awaiting signature`,
        };
      });

    setData({
      userName: (userResult.data?.user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there",
      proposals: pStats,
      contracts: {
        total:  allContracts.length,
        signed: allContracts.filter(c => c.status === "signed").length,
        draft:  allContracts.filter(c => c.status === "draft").length,
      },
      clients: {
        total:  allClients.length,
        active: allClients.filter(c => c.status === "active").length,
        leads:  allClients.filter(c => c.status === "lead").length,
      },
      revenue,
      viewCount,
      recentProposals: allProps.slice(0, 6) as DashboardData["recentProposals"],
      recentNotifications: (notifs ?? []) as DashboardData["recentNotifications"],
      needsAttention,
    });
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) return null;

  const convRate = data.proposals.total > 0
    ? Math.round((data.proposals.accepted / Math.max(data.proposals.total - data.proposals.draft, 1)) * 100)
    : 0;

  const hasAnyData = data.proposals.total > 0 || data.clients.total > 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>

      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: "0 0 4px", fontWeight: 800 }}>
          Good {getTimeOfDay()}, {data.userName} 👋
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          {hasAnyData
            ? `Here's what's happening with your business today.`
            : `Welcome! Create your first proposal to get started.`}
        </Text>
      </div>

      {/* Empty state for new users */}
      {!hasAnyData ? (
        <Card style={{ borderRadius: 20, border: "2px dashed #e2e8f0", marginBottom: 24, textAlign: "center" }} styles={{ body: { padding: "60px 40px" } }}>
          <ThunderboltOutlined style={{ fontSize: 56, color: "#0ea5e9", marginBottom: 20 }} />
          <Title level={3} style={{ margin: "0 0 10px" }}>Create your first proposal</Title>
          <Text type="secondary" style={{ fontSize: 15, display: "block", marginBottom: 28 }}>
            Generate a professional AI proposal in under 60 seconds — with your brand, pricing tiers, and a Stripe payment link.
          </Text>
          <Space size={12}>
            <Link href="/generate">
              <Button type="primary" size="large" icon={<ThunderboltOutlined />}
                style={{ borderRadius: 12, height: 48, fontWeight: 700, paddingInline: 28 }}>
                Generate My First Proposal
              </Button>
            </Link>
            <Link href="/clients">
              <Button size="large" style={{ borderRadius: 12, height: 48 }}>Add a Client</Button>
            </Link>
          </Space>
        </Card>
      ) : (
        <>
          {/* ── Key metrics ── */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {[
              {
                title: "Total Revenue",
                value: `$${data.revenue.toLocaleString()}`,
                sub: `from ${data.proposals.accepted} won proposal${data.proposals.accepted !== 1 ? "s" : ""}`,
                icon: <DollarOutlined />,
                color: "#10b981",
                trend: data.revenue > 0 ? <Space size={4}><RiseOutlined style={{ color: "#10b981" }} /><Text style={{ color: "#10b981", fontSize: 12 }}>Active</Text></Space> : null,
              },
              {
                title: "Conversion Rate",
                value: `${convRate}%`,
                sub: `${data.proposals.accepted} accepted of ${data.proposals.total - data.proposals.draft} sent`,
                icon: <CheckCircleOutlined />,
                color: convRate >= 50 ? "#10b981" : convRate >= 25 ? "#f59e0b" : "#ef4444",
              },
              {
                title: "Proposal Views",
                value: data.viewCount.toLocaleString(),
                sub: `across ${data.proposals.total} proposals`,
                icon: <EyeOutlined />,
                color: "#0ea5e9",
              },
              {
                title: "Active Clients",
                value: data.clients.active.toLocaleString(),
                sub: `${data.clients.leads} lead${data.clients.leads !== 1 ? "s" : ""} in pipeline`,
                icon: <TeamOutlined />,
                color: "#7c3aed",
              },
            ].map(m => (
              <Col key={m.title} xs={24} sm={12} lg={6}>
                <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 22 } }}>
                  <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>{m.title}</Text>
                      <div style={{ fontSize: 28, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</div>
                      <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>{m.sub}</Text>
                    </div>
                    <Avatar size={40} style={{ background: `${m.color}15`, color: m.color, flexShrink: 0 }} icon={m.icon} />
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {/* ── Proposal pipeline ── */}
          <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 24 }} styles={{ body: { padding: 24 } }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <Title level={5} style={{ margin: 0 }}>Proposal Pipeline</Title>
              <Link href="/proposals">
                <Button type="link" icon={<ArrowRightOutlined />} style={{ padding: 0 }}>View all</Button>
              </Link>
            </div>
            <Row gutter={[16, 16]}>
              {[
                { label: "Draft",    count: data.proposals.draft,    color: "#94a3b8" },
                { label: "Sent",     count: data.proposals.sent,     color: "#0ea5e9" },
                { label: "Viewed",   count: data.proposals.viewed,   color: "#06b6d4" },
                { label: "Won",      count: data.proposals.accepted, color: "#10b981" },
                { label: "Declined", count: data.proposals.declined, color: "#ef4444" },
              ].map(stage => (
                <Col key={stage.label} xs={12} sm={4} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: `${stage.color}15`, border: `2px solid ${stage.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 8px",
                  }}>
                    <Text style={{ fontWeight: 900, fontSize: 18, color: stage.color }}>{stage.count}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{stage.label}</Text>
                </Col>
              ))}
            </Row>
            {/* Progress bar */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", gap: 2, borderRadius: 8, overflow: "hidden", height: 8 }}>
                {[
                  { count: data.proposals.draft, color: "#e2e8f0" },
                  { count: data.proposals.sent, color: "#0ea5e9" },
                  { count: data.proposals.viewed, color: "#06b6d4" },
                  { count: data.proposals.accepted, color: "#10b981" },
                  { count: data.proposals.declined, color: "#fca5a5" },
                ].map((s, i) => {
                  const pct = data.proposals.total > 0 ? (s.count / data.proposals.total) * 100 : 0;
                  return pct > 0 ? <div key={i} style={{ flex: pct, background: s.color, minWidth: 4 }} /> : null;
                })}
              </div>
            </div>
          </Card>

          <Row gutter={[24, 24]}>
            {/* ── Needs attention ── */}
            <Col xs={24} lg={12}>
              <Card
                title={<Space><WarningOutlined style={{ color: "#f59e0b" }} /><span>Needs Attention</span>{data.needsAttention.length > 0 && <Badge count={data.needsAttention.length} color="#f59e0b" />}</Space>}
                style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }}
                styles={{ body: { padding: 0 } }}
              >
                {data.needsAttention.length === 0 ? (
                  <Empty description={<Text type="secondary">All caught up! No follow-ups needed.</Text>}
                    style={{ padding: "32px 20px" }}
                    image={<CheckCircleOutlined style={{ fontSize: 48, color: "#10b981" }} />}
                    imageStyle={{ height: 60 }} />
                ) : (
                  <List
                    dataSource={data.needsAttention}
                    renderItem={item => (
                      <List.Item style={{ padding: "14px 20px" }}>
                        <List.Item.Meta
                          avatar={
                            <Avatar style={{ background: item.status === "sent" ? "#fff7ed" : "#eff6ff", color: item.status === "sent" ? "#f59e0b" : "#0ea5e9" }}
                              icon={item.status === "sent" ? <ClockCircleOutlined /> : <EyeOutlined />} />
                          }
                          title={<Text strong style={{ fontSize: 14 }}>{item.client_name}</Text>}
                          description={<Text type="secondary" style={{ fontSize: 12 }}>{item.reason}</Text>}
                        />
                        <Link href={`/generate`}>
                          <Button size="small" style={{ borderRadius: 8, fontSize: 12 }}>Follow up</Button>
                        </Link>
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>

            {/* ── Recent activity ── */}
            <Col xs={24} lg={12}>
              <Card
                title={<Space><BellOutlined style={{ color: "#0ea5e9" }} />Activity</Space>}
                extra={<Link href="/analytics"><Button type="link" style={{ padding: 0, fontSize: 13 }}>All activity</Button></Link>}
                style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }}
                styles={{ body: { padding: 0 } }}
              >
                {data.recentNotifications.length === 0 ? (
                  <Empty description={<Text type="secondary">Activity will appear here when clients open your proposals.</Text>}
                    style={{ padding: "32px 20px" }} imageStyle={{ height: 60 }} />
                ) : (
                  <List
                    dataSource={data.recentNotifications}
                    renderItem={notif => {
                      const isPositive = notif.type.includes("signed") || notif.type.includes("accepted");
                      const color = isPositive ? "#10b981" : "#0ea5e9";
                      return (
                        <List.Item style={{ padding: "12px 20px" }}>
                          <List.Item.Meta
                            avatar={
                              <Avatar size={36} style={{ background: `${color}15`, color, fontSize: 14 }}>
                                {isPositive ? "✅" : "👁"}
                              </Avatar>
                            }
                            title={<Text style={{ fontSize: 13, fontWeight: 600 }}>{notif.title}</Text>}
                            description={
                              <Space direction="vertical" size={0}>
                                {notif.message && <Text type="secondary" style={{ fontSize: 12 }}>{notif.message}</Text>}
                                <Text type="secondary" style={{ fontSize: 11 }}>{timeAgo(notif.created_at)}</Text>
                              </Space>
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* ── Recent proposals ── */}
          {data.recentProposals.length > 0 && (
            <Card
              title={<Space><FileTextOutlined style={{ color: "#0ea5e9" }} />Recent Proposals</Space>}
              extra={<Link href="/proposals"><Button type="link" style={{ padding: 0, fontSize: 13 }}>View all <ArrowRightOutlined /></Button></Link>}
              style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginTop: 24 }}
              styles={{ body: { padding: 0 } }}
            >
              <List
                dataSource={data.recentProposals}
                renderItem={p => {
                  const statusColor = PROPOSAL_STATUS_COLOR[p.status] ?? "#94a3b8";
                  return (
                    <List.Item style={{ padding: "14px 24px" }}>
                      <List.Item.Meta
                        avatar={
                          <Avatar style={{ background: `${statusColor}15`, color: statusColor, fontWeight: 700 }}>
                            {p.client_name.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        title={
                          <Space size={8}>
                            <Text strong style={{ fontSize: 14 }}>{p.client_name}</Text>
                            <Tag style={{ borderRadius: 20, fontSize: 11, color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}12`, margin: 0 }}>
                              {p.status}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space size={16}>
                            <Text type="secondary" style={{ fontSize: 12 }}>{p.project_type ?? "—"}</Text>
                            {p.view_count > 0 && (
                              <Space size={4}>
                                <EyeOutlined style={{ color: "#94a3b8", fontSize: 11 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>{p.view_count} view{p.view_count !== 1 ? "s" : ""}</Text>
                              </Space>
                            )}
                            <Text type="secondary" style={{ fontSize: 12 }}>{timeAgo(p.created_at)}</Text>
                          </Space>
                        }
                      />
                      {p.total_budget && p.total_budget > 0 && (
                        <Text strong style={{ color: "#10b981", fontSize: 15 }}>
                          {p.currency ?? "USD"} {p.total_budget.toLocaleString()}
                        </Text>
                      )}
                    </List.Item>
                  );
                }}
              />
            </Card>
          )}

          {/* ── Quick actions (minimal) ── */}
          <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
            <Col xs={24} sm={8}>
              <Link href="/generate">
                <Card hoverable style={{ borderRadius: 14, border: "1px solid #e2e8f0", cursor: "pointer" }} styles={{ body: { padding: 18 } }}>
                  <Space>
                    <Avatar style={{ background: "#eff6ff", color: "#0ea5e9" }} icon={<ThunderboltOutlined />} />
                    <div>
                      <Text strong style={{ display: "block", fontSize: 14 }}>New Proposal</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>AI-generated in 60s</Text>
                    </div>
                  </Space>
                </Card>
              </Link>
            </Col>
            <Col xs={24} sm={8}>
              <Link href="/clients">
                <Card hoverable style={{ borderRadius: 14, border: "1px solid #e2e8f0", cursor: "pointer" }} styles={{ body: { padding: 18 } }}>
                  <Space>
                    <Avatar style={{ background: "#f5f3ff", color: "#7c3aed" }} icon={<TeamOutlined />} />
                    <div>
                      <Text strong style={{ display: "block", fontSize: 14 }}>Add Client</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{data.clients.total} client{data.clients.total !== 1 ? "s" : ""} total</Text>
                    </div>
                  </Space>
                </Card>
              </Link>
            </Col>
            <Col xs={24} sm={8}>
              <Link href="/contracts">
                <Card hoverable style={{ borderRadius: 14, border: "1px solid #e2e8f0", cursor: "pointer" }} styles={{ body: { padding: 18 } }}>
                  <Space>
                    <Avatar style={{ background: "#f0fdf4", color: "#10b981" }} icon={<SafetyCertificateOutlined />} />
                    <div>
                      <Text strong style={{ display: "block", fontSize: 14 }}>New Contract</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{data.contracts.total} contract{data.contracts.total !== 1 ? "s" : ""} total</Text>
                    </div>
                  </Space>
                </Card>
              </Link>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
