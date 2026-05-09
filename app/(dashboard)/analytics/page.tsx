"use client";

import { useEffect, useState } from "react";
import {
  Card, Col, Row, Statistic, Space, Typography, Tag, List, Avatar, Badge, Spin, Empty, Tooltip,
} from "antd";
import {
  EyeOutlined, FileTextOutlined, CheckCircleOutlined, EditOutlined,
  BellOutlined, ClockCircleOutlined, DollarOutlined, WalletOutlined,
  RiseOutlined, FallOutlined, TeamOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  document_type: string;
}

interface ProposalStat {
  id: string;
  client_name: string;
  project_type: string;
  status: string;
  view_count: number;
  last_viewed_at: string | null;
  signed_at: string | null;
  accepted_at: string | null;
  total_budget: number;
  currency: string;
  created_at: string;
}

interface Invoice {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  proposal_viewed:   <EyeOutlined style={{ color: "#0ea5e9" }} />,
  proposal_signed:   <EditOutlined style={{ color: "#10b981" }} />,
  proposal_accepted: <CheckCircleOutlined style={{ color: "#10b981" }} />,
  contract_signed:   <EditOutlined style={{ color: "#7c3aed" }} />,
  contract_viewed:   <EyeOutlined style={{ color: "#7c3aed" }} />,
};

const CATEGORY_META: Record<string, { label: string; color: string; emoji: string }> = {
  software:      { label: "Software",      color: "#3b82f6", emoji: "💻" },
  hardware:      { label: "Hardware",      color: "#6366f1", emoji: "🖥️" },
  travel:        { label: "Travel",        color: "#8b5cf6", emoji: "✈️" },
  office:        { label: "Office",        color: "#0ea5e9", emoji: "🏢" },
  marketing:     { label: "Marketing",     color: "#f59e0b", emoji: "📢" },
  education:     { label: "Education",     color: "#10b981", emoji: "📚" },
  subscriptions: { label: "Subscriptions", color: "#ec4899", emoji: "🔄" },
  meals:         { label: "Meals",         color: "#f97316", emoji: "🍽️" },
  other:         { label: "Other",         color: "#94a3b8", emoji: "📎" },
};

export default function AnalyticsPage() {
  const [proposals, setProposals] = useState<ProposalStat[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: props }, { data: notifs }, { data: invs }, { data: exps }] = await Promise.all([
        supabase.from("proposals").select("id,client_name,project_type,status,view_count,last_viewed_at,signed_at,accepted_at,total_budget,currency,created_at").order("created_at", { ascending: false }),
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("invoices").select("id,total,status,created_at").order("created_at", { ascending: false }),
        supabase.from("expenses").select("id,amount,category,date").order("date", { ascending: false }),
      ]);
      setProposals((props ?? []) as ProposalStat[]);
      setNotifications((notifs ?? []) as Notification[]);
      setInvoices((invs ?? []) as Invoice[]);
      setExpenses((exps ?? []) as Expense[]);
      await supabase.from("notifications").update({ read: true }).eq("read", false);
      setLoading(false);
    }
    load();
  }, []);

  // Proposal stats
  const totalViews   = proposals.reduce((s, p) => s + (p.view_count ?? 0), 0);
  const totalSigned  = proposals.filter(p => p.signed_at || p.accepted_at).length;
  const totalSent    = proposals.filter(p => p.status !== "draft").length;
  const convRate     = totalSent ? Math.round((totalSigned / totalSent) * 100) : 0;

  // Financial stats
  const proposalRevenue = proposals
    .filter(p => p.signed_at || p.accepted_at || p.status === "accepted" || p.status === "signed")
    .reduce((s, p) => s + (p.total_budget ?? 0), 0);
  const invoiceRevenue = invoices
    .filter(i => i.status === "paid")
    .reduce((s, i) => s + (i.total ?? 0), 0);
  const totalRevenue = proposalRevenue + invoiceRevenue;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Monthly trend (last 12 months)
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
  }
  const monthlyData = months.map(m => {
    const rev = proposals
      .filter(p => (p.signed_at || p.accepted_at) && dayjs(p.signed_at || p.accepted_at).format("YYYY-MM") === m)
      .reduce((s, p) => s + (p.total_budget ?? 0), 0)
    + invoices
      .filter(i => i.status === "paid" && dayjs(i.created_at).format("YYYY-MM") === m)
      .reduce((s, i) => s + (i.total ?? 0), 0);
    const exp = expenses
      .filter(e => dayjs(e.date).format("YYYY-MM") === m)
      .reduce((s, e) => s + e.amount, 0);
    return { month: m, revenue: rev, expenses: exp };
  });
  const maxBar = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.expenses)), 1);

  // Expense breakdown by category
  const catTotals: Record<string, number> = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] ?? 0) + e.amount; });
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const maxCat = catEntries[0]?.[1] ?? 1;

  // Top clients by revenue
  const clientRevMap: Record<string, number> = {};
  proposals
    .filter(p => p.signed_at || p.accepted_at || p.status === "accepted" || p.status === "signed")
    .forEach(p => { clientRevMap[p.client_name] = (clientRevMap[p.client_name] ?? 0) + (p.total_budget ?? 0); });
  const topClients = Object.entries(clientRevMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const STATUS_COLORS: Record<string, string> = {
    draft: "default", sent: "blue", viewed: "cyan",
    accepted: "green", signed: "green", declined: "red", expired: "orange",
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "120px 0" }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: "0 0 6px", fontWeight: 800 }}>Analytics</Title>
        <Text type="secondary" style={{ fontSize: 15 }}>Real-time tracking of proposals, revenue, expenses, and profitability.</Text>
      </div>

      {/* Proposal Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          { title: "Total Views",        value: totalViews,   icon: <EyeOutlined />,           color: "#0ea5e9" },
          { title: "Sent Proposals",     value: totalSent,    icon: <FileTextOutlined />,       color: "#7c3aed" },
          { title: "Signed / Accepted",  value: totalSigned,  icon: <CheckCircleOutlined />,    color: "#10b981" },
          { title: "Conversion Rate",    value: `${convRate}%`, icon: <ClockCircleOutlined />, color: "#f59e0b" },
        ].map(s => (
          <Col key={s.title} xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
              <Space>
                <Avatar style={{ background: `${s.color}18`, color: s.color }} icon={s.icon} />
                <Statistic
                  title={<Text type="secondary" style={{ fontSize: 13 }}>{s.title}</Text>}
                  value={s.value}
                  valueStyle={{ color: s.color, fontWeight: 800, fontSize: 26 }}
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Financial Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {[
          { title: "Total Revenue",   value: `$${totalRevenue.toLocaleString()}`,  icon: <DollarOutlined />,  color: "#10b981" },
          { title: "Total Expenses",  value: `$${totalExpenses.toLocaleString()}`, icon: <WalletOutlined />,  color: "#ef4444" },
          { title: "Net Profit",      value: `$${netProfit.toLocaleString()}`,     icon: netProfit >= 0 ? <RiseOutlined /> : <FallOutlined />, color: netProfit >= 0 ? "#10b981" : "#ef4444" },
          { title: "Profit Margin",   value: `${profitMargin}%`,                   icon: <RiseOutlined />,    color: profitMargin >= 0 ? "#10b981" : "#ef4444" },
        ].map(s => (
          <Col key={s.title} xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
              <Space>
                <Avatar style={{ background: `${s.color}18`, color: s.color }} icon={s.icon} />
                <Statistic
                  title={<Text type="secondary" style={{ fontSize: 13 }}>{s.title}</Text>}
                  value={s.value}
                  valueStyle={{ color: s.color, fontWeight: 800, fontSize: 26 }}
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Revenue vs Expenses — 12-month bar chart */}
      <Card
        title={<Space><DollarOutlined />Revenue vs Expenses (Last 12 Months)</Space>}
        style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 24 }}
        styles={{ body: { padding: "20px 24px" } }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 200 }}>
          {monthlyData.map(d => (
            <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 160, width: "100%" }}>
                <Tooltip title={`Revenue: $${d.revenue.toLocaleString()}`}>
                  <div style={{
                    flex: 1,
                    height: Math.max(d.revenue / maxBar * 150, d.revenue > 0 ? 4 : 0),
                    background: "linear-gradient(180deg, #10b981, #34d399)",
                    borderRadius: "4px 4px 0 0",
                    cursor: "default",
                    transition: "height 0.3s ease",
                  }} />
                </Tooltip>
                <Tooltip title={`Expenses: $${d.expenses.toLocaleString()}`}>
                  <div style={{
                    flex: 1,
                    height: Math.max(d.expenses / maxBar * 150, d.expenses > 0 ? 4 : 0),
                    background: "linear-gradient(180deg, #ef4444, #f87171)",
                    borderRadius: "4px 4px 0 0",
                    cursor: "default",
                    transition: "height 0.3s ease",
                  }} />
                </Tooltip>
              </div>
              <Text type="secondary" style={{ fontSize: 10, whiteSpace: "nowrap" }}>
                {dayjs(d.month + "-01").format("MMM")}
              </Text>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
          <Space size={6}><div style={{ width: 12, height: 12, borderRadius: 3, background: "#10b981" }} /><Text type="secondary" style={{ fontSize: 12 }}>Revenue</Text></Space>
          <Space size={6}><div style={{ width: 12, height: 12, borderRadius: 3, background: "#ef4444" }} /><Text type="secondary" style={{ fontSize: 12 }}>Expenses</Text></Space>
        </div>
      </Card>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* Expense breakdown */}
        <Col xs={24} lg={12}>
          <Card
            title={<Space><WalletOutlined />Expense Breakdown</Space>}
            style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }}
            styles={{ body: { padding: "16px 24px" } }}
          >
            {catEntries.length === 0 ? (
              <Empty description="No expenses tracked yet" style={{ padding: 20 }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {catEntries.map(([cat, total]) => {
                  const meta = CATEGORY_META[cat] ?? CATEGORY_META.other;
                  const pct = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={{ fontSize: 13, fontWeight: 600 }}>{meta.emoji} {meta.label}</Text>
                        <Text style={{ fontSize: 13, color: meta.color, fontWeight: 700 }}>
                          ${total.toLocaleString()} <Text type="secondary" style={{ fontSize: 11 }}>({pct}%)</Text>
                        </Text>
                      </div>
                      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4 }}>
                        <div style={{
                          height: "100%",
                          width: `${(total / maxCat) * 100}%`,
                          background: meta.color,
                          borderRadius: 4,
                          transition: "width 0.3s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>

        {/* Top clients by revenue */}
        <Col xs={24} lg={12}>
          <Card
            title={<Space><TeamOutlined />Top Clients by Revenue</Space>}
            style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }}
            styles={{ body: { padding: 0 } }}
          >
            {topClients.length === 0 ? (
              <Empty description="No revenue data yet" style={{ padding: 40 }} />
            ) : (
              <List
                dataSource={topClients}
                renderItem={([name, rev], idx) => (
                  <List.Item style={{ padding: "12px 24px" }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{
                          background: idx < 3 ? ["#fef3c7", "#f1f5f9", "#fff7ed"][idx] : "#f8fafc",
                          color: idx < 3 ? ["#f59e0b", "#64748b", "#ea580c"][idx] : "#94a3b8",
                          fontWeight: 800,
                          fontSize: 13,
                        }}>
                          {idx + 1}
                        </Avatar>
                      }
                      title={<Text strong style={{ fontSize: 14 }}>{name}</Text>}
                    />
                    <Text strong style={{ color: "#10b981", fontSize: 14 }}>
                      ${rev.toLocaleString()}
                    </Text>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Proposal activity */}
        <Col xs={24} lg={14}>
          <Card title={<Space><FileTextOutlined />Proposal Activity</Space>}
            style={{ borderRadius: 16, border: "1px solid #e2e8f0" }}
            styles={{ body: { padding: 0 } }}>
            {proposals.length === 0 ? (
              <Empty description="No proposals yet" style={{ padding: 40 }} />
            ) : (
              <List
                dataSource={proposals.slice(0, 15)}
                renderItem={p => (
                  <List.Item style={{ padding: "14px 20px" }}>
                    <List.Item.Meta
                      avatar={<Avatar style={{ background: "#eff6ff", color: "#0ea5e9" }} icon={<FileTextOutlined />} />}
                      title={<Space size={8}>
                        <Text strong style={{ fontSize: 14 }}>{p.client_name}</Text>
                        <Tag color={STATUS_COLORS[p.status] ?? "default"} style={{ borderRadius: 20, fontSize: 11 }}>{p.status}</Tag>
                      </Space>}
                      description={<Space size={12} style={{ fontSize: 12 }}>
                        <span>{p.project_type ?? "—"}</span>
                        {p.view_count > 0 && <span><EyeOutlined /> {p.view_count} view{p.view_count !== 1 ? "s" : ""}</span>}
                        {p.last_viewed_at && <span>Last seen {new Date(p.last_viewed_at).toLocaleDateString()}</span>}
                      </Space>}
                    />
                    {p.total_budget > 0 && (
                      <Text strong style={{ color: "#10b981", fontSize: 14 }}>
                        {p.currency} {p.total_budget.toLocaleString()}
                      </Text>
                    )}
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Notifications */}
        <Col xs={24} lg={10}>
          <Card
            title={<Space><BellOutlined />Activity Feed
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge count={notifications.filter(n => !n.read).length} size="small" />
              )}
            </Space>}
            style={{ borderRadius: 16, border: "1px solid #e2e8f0" }}
            styles={{ body: { padding: 0 } }}
          >
            {notifications.length === 0 ? (
              <Empty description="No activity yet" style={{ padding: 40 }} />
            ) : (
              <List
                dataSource={notifications.slice(0, 20)}
                renderItem={n => (
                  <List.Item style={{ padding: "12px 20px", background: n.read ? "transparent" : "#f0f9ff" }}>
                    <List.Item.Meta
                      avatar={<Avatar icon={NOTIF_ICONS[n.type] ?? <BellOutlined />} style={{ background: "#f8fafc" }} />}
                      title={<Text strong style={{ fontSize: 13 }}>{n.title}</Text>}
                      description={<Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{n.message}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{new Date(n.created_at).toLocaleString()}</Text>
                      </Space>}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
