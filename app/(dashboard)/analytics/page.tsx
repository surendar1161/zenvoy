"use client";

import { useEffect, useState } from "react";
import {
  Card, Col, Row, Statistic, Space, Typography, Tag, List, Avatar, Badge, Spin, Empty,
} from "antd";
import {
  EyeOutlined, FileTextOutlined, CheckCircleOutlined, EditOutlined,
  BellOutlined, ClockCircleOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

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

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  proposal_viewed:   <EyeOutlined style={{ color: "#0ea5e9" }} />,
  proposal_signed:   <EditOutlined style={{ color: "#10b981" }} />,
  proposal_accepted: <CheckCircleOutlined style={{ color: "#10b981" }} />,
  contract_signed:   <EditOutlined style={{ color: "#7c3aed" }} />,
  contract_viewed:   <EyeOutlined style={{ color: "#7c3aed" }} />,
};

export default function AnalyticsPage() {
  const [proposals, setProposals] = useState<ProposalStat[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: props }, { data: notifs }] = await Promise.all([
        supabase.from("proposals").select("id,client_name,project_type,status,view_count,last_viewed_at,signed_at,accepted_at,total_budget,currency,created_at").order("created_at", { ascending: false }),
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      setProposals((props ?? []) as ProposalStat[]);
      setNotifications((notifs ?? []) as Notification[]);
      // Mark all as read
      await supabase.from("notifications").update({ read: true }).eq("read", false);
      setLoading(false);
    }
    load();
  }, []);

  const totalViews   = proposals.reduce((s, p) => s + (p.view_count ?? 0), 0);
  const totalSigned  = proposals.filter(p => p.signed_at || p.accepted_at).length;
  const totalSent    = proposals.filter(p => p.status !== "draft").length;
  const convRate     = totalSent ? Math.round((totalSigned / totalSent) * 100) : 0;
  const totalRevenue = proposals.filter(p => p.signed_at || p.accepted_at).reduce((s, p) => s + (p.total_budget ?? 0), 0);

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
        <Text type="secondary" style={{ fontSize: 15 }}>Real-time tracking of your proposals — opens, signatures, revenue.</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
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

      {/* Revenue summary */}
      {totalRevenue > 0 && (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginTop: 24, background: "linear-gradient(135deg, #0369a1, #0ea5e9)" }} styles={{ body: { padding: 28 } }}>
          <Space>
            <CheckCircleOutlined style={{ fontSize: 32, color: "rgba(255,255,255,0.8)" }} />
            <div>
              <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", fontSize: 13 }}>Total Revenue from Signed Proposals</Text>
              <Title level={2} style={{ color: "#fff", margin: 0, fontWeight: 900 }}>
                USD {totalRevenue.toLocaleString()}
              </Title>
            </div>
          </Space>
        </Card>
      )}
    </div>
  );
}
