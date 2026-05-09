"use client";

import { useEffect, useState } from "react";
import { ConfigProvider, Layout, Menu, Button, Avatar, Typography, Space, Dropdown, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
  HomeOutlined, FileTextOutlined,
  AppstoreOutlined, BgColorsOutlined, SettingOutlined, ThunderboltFilled,
  PlusOutlined, UserOutlined, LogoutOutlined, SafetyCertificateOutlined,
  BookOutlined, BarChartOutlined, CreditCardOutlined, TeamOutlined,
  GlobalOutlined, FolderOpenOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  FundOutlined, ThunderboltOutlined, DollarOutlined, RocketOutlined, CloseOutlined,
  HeatMapOutlined, ClockCircleOutlined, CalendarOutlined, WalletOutlined,
} from "@ant-design/icons";
import RunningTimerIndicator from "@/components/RunningTimerIndicator";
import { Modal } from "antd";
import { getTrialInfo } from "@/lib/trial";
import { isFeatureEnabled } from "@/lib/feature-flags";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { antdTheme } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 228;

const BASE_NAV: MenuProps["items"] = [
  { key: "/dashboard", icon: <HomeOutlined />, label: <Link href="/dashboard">Dashboard</Link> },
  { key: "/pipeline",  icon: <FundOutlined />,  label: <Link href="/pipeline">Pipeline</Link> },
  {
    key: "grp-clients",
    icon: <TeamOutlined />,
    label: "Clients & Projects",
    children: [
      { key: "/proposals", icon: <FileTextOutlined />,  label: <Link href="/proposals">My Proposals</Link> },
      { key: "/clients",   icon: <TeamOutlined />,      label: <Link href="/clients">Clients</Link> },
      { key: "/projects",  icon: <FolderOpenOutlined />, label: <Link href="/projects">Projects</Link> },
      { key: "/portals",   icon: <GlobalOutlined />,     label: <Link href="/portals">Client Portals</Link> },
    ],
  },
  {
    key: "grp-finance",
    icon: <DollarOutlined />,
    label: "Finance",
    children: [
      { key: "/invoices",      icon: <DollarOutlined />,       label: <Link href="/invoices">Invoices</Link> },
      { key: "/expenses",      icon: <WalletOutlined />,       label: <Link href="/expenses">Expenses</Link> },
      { key: "/time-tracking", icon: <ClockCircleOutlined />,  label: <Link href="/time-tracking">Time Tracking</Link> },
    ],
  },
  {
    key: "grp-tools",
    icon: <AppstoreOutlined />,
    label: "Tools",
    children: [
      { key: "/automations", icon: <ThunderboltOutlined />,       label: <Link href="/automations">Automations</Link> },
      { key: "/bookings",    icon: <CalendarOutlined />,          label: <Link href="/bookings">Bookings</Link> },
      { key: "/templates",   icon: <AppstoreOutlined />,          label: <Link href="/templates">Templates</Link> },
      { key: "/contracts",   icon: <SafetyCertificateOutlined />, label: <Link href="/contracts">Contracts</Link> },
    ],
  },
  {
    key: "grp-insights",
    icon: <BarChartOutlined />,
    label: "Insights",
    children: [
      { key: "/content-library", icon: <BookOutlined />,    label: <Link href="/content-library">Content Library</Link> },
      { key: "/analytics",       icon: <BarChartOutlined />, label: <Link href="/analytics">Analytics</Link> },
    ],
  },
  { type: "divider" },
  { key: "/subscription", icon: <CreditCardOutlined />, label: <Link href="/subscription">Subscription</Link> },
  { key: "/settings",     icon: <SettingOutlined />,     label: <Link href="/settings">Settings</Link> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showExpiredBanner, setShowExpiredBanner] = useState(true);
  const [navItems, setNavItems] = useState<MenuProps["items"]>(BASE_NAV);

  const siderWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (!data.user) return;

      // Check feature flags and build nav dynamically
      isFeatureEnabled("capacity_planning").then(hasCapacity => {
        if (hasCapacity) {
          const capacityItem = {
            key: "/capacity",
            icon: <HeatMapOutlined />,
            label: <Link href="/capacity">Capacity <span style={{ fontSize: 10, background: "#0ea5e920", color: "#0369a1", padding: "1px 6px", borderRadius: 8, marginLeft: 4 }}>Beta</span></Link>,
          };
          setNavItems(prev => {
            const items = [...(prev ?? [])];
            const dividerIdx = items.findIndex(i => (i as unknown as Record<string, unknown>)?.type === "divider");
            if (dividerIdx >= 0) items.splice(dividerIdx, 0, capacityItem);
            else items.push(capacityItem);
            return items;
          });
        }
      });

      // Load trial + plan
      const [{ data: profile }, { data: sub }] = await Promise.all([
        supabase.from("profiles").select("trial_ends_at").eq("id", data.user.id).maybeSingle(),
        supabase.from("subscriptions").select("plan").maybeSingle(),
      ]);
      const t = profile?.trial_ends_at ?? null;
      const p = sub?.plan ?? "free";
      setTrialEndsAt(t);
      setPlan(p);
      // Show expired modal once per session if trial expired + no paid plan
      if (p === "free" && t) {
        const trial = getTrialInfo(t);
        if (trial.isExpired) {
          const shownKey = "dealpilot_trial_expired_modal_shown";
          if (!sessionStorage.getItem(shownKey)) {
            sessionStorage.setItem(shownKey, "1");
            setShowExpiredModal(true);
          }
        }
      }
    });
  }, []);

  // Persist collapse state
  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const allNavKeys = (navItems ?? []).flatMap(i => {
    const item = i as unknown as Record<string, unknown>;
    if (item?.children) return (item.children as { key: string }[]).map(c => c.key);
    return [item?.key as string];
  }).filter(Boolean);

  const activeKey =
    path === "/dashboard"
      ? "/dashboard"
      : allNavKeys.filter(k => k !== "/dashboard" && path.startsWith(k))[0] ?? "/dashboard";

  const defaultOpenKeys = (navItems ?? [])
    .filter(i => {
      const item = i as unknown as Record<string, unknown>;
      if (!item?.children || !item?.key) return false;
      return (item.children as { key: string }[]).some(c => path.startsWith(c.key));
    })
    .map(i => (i as unknown as { key: string }).key);

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string).split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  const userMenuItems: MenuProps["items"] = [
    { key: "email", label: <Text type="secondary" style={{ fontSize: 12 }}>{user?.email ?? "Demo mode"}</Text>, disabled: true },
    { type: "divider" },
    { key: "settings", label: <Link href="/settings">Settings</Link>, icon: <SettingOutlined /> },
    { key: "signout", label: "Sign Out", icon: <LogoutOutlined />, danger: true, onClick: handleSignOut },
  ];

  const trial = getTrialInfo(trialEndsAt);
  const isExpiredFree = trial.isExpired && plan === "free";

  return (
    <ConfigProvider theme={antdTheme}>
      <style>{`
        .ant-layout-sider-children {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          overflow: hidden !important;
        }
      `}</style>
      {/* Trial expired — full-screen modal (shown once per session) */}
      <Modal
        open={showExpiredModal}
        footer={null}
        closable={false}
        centered
        width={520}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1, #0ea5e9)", padding: "40px 40px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⏰</div>
            <Text strong style={{ color: "#fff", fontSize: 22, display: "block", marginBottom: 8 }}>
              Your free trial has ended
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>
              You had 30 days of full Pro access. Choose a plan to keep your proposals, contracts, and client portals working.
            </Text>
          </div>
          <div style={{ padding: "28px 40px 36px", background: "#fff" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {[
                "Unlimited proposals & contracts",
                "Digital e-signatures",
                "Client portals with file sharing & chat",
                "Deal pipeline & analytics",
                "AI contract generation (15 types)",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>
                  </div>
                  <Text style={{ fontSize: 14 }}>{f}</Text>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowExpiredModal(false); router.push("/subscription"); }}
                style={{ flex: 1, height: 48, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0369a1, #0ea5e9)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                🚀 View Plans — from $12/mo
              </button>
              <button
                onClick={() => setShowExpiredModal(false)}
                style={{ width: 48, height: 48, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: 16, color: "#64748b" }}
              >
                ✕
              </button>
            </div>
            <Text type="secondary" style={{ fontSize: 12, textAlign: "center", display: "block", marginTop: 12 }}>
              Cancel anytime · No hidden fees
            </Text>
          </div>
        </div>
      </Modal>

      <Layout style={{ minHeight: "100vh" }}>
        {/* Trial expired — persistent top banner (dismissible per session) */}
        {isExpiredFree && showExpiredBanner && path !== "/subscription" && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
            background: "linear-gradient(90deg, #0c4a6e, #0369a1)",
            padding: "10px 24px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          }}>
            <Text style={{ color: "#fff", fontSize: 14 }}>
              ⏰ <strong>Your 30-day trial has ended.</strong> Upgrade to keep your proposals, contracts, and portals.
            </Text>
            <Link href="/subscription">
              <button style={{ background: "#fff", color: "#0369a1", border: "none", borderRadius: 8, padding: "6px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Upgrade Now →
              </button>
            </Link>
            <button
              onClick={() => setShowExpiredBanner(false)}
              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 16, padding: "0 4px", marginLeft: 4 }}
            >
              ✕
            </button>
          </div>
        )}
        {/* Sidebar */}
        <Sider
          collapsed={collapsed}
          collapsedWidth={COLLAPSED_WIDTH}
          width={EXPANDED_WIDTH}
          style={{
            position: "fixed", insetInlineStart: 0, top: 0, bottom: 0, zIndex: 100,
            background: "#fff", borderRight: "1px solid #e2e8f0",
            transition: "width 0.2s ease",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}
          trigger={null}
          breakpoint="md"
          onBreakpoint={(broken) => setCollapsed(broken)}
        >
          {/* Logo + collapse toggle */}
          <div style={{
            padding: collapsed ? "12px 0" : "16px 16px 12px",
            borderBottom: "1px solid #f1f5f9",
            marginBottom: 8,
            display: "flex",
            flexDirection: collapsed ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: collapsed ? 6 : 8,
          }}>
            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flex: collapsed ? undefined : 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ThunderboltFilled style={{ color: "#fff", fontSize: 16 }} />
              </div>
              {!collapsed && (
                <Text strong style={{ fontSize: 16, color: "#0ea5e9", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>DealPilot</Text>
              )}
            </Link>
            <Button
              type="text"
              size="small"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(c => !c)}
              style={{ color: "#94a3b8", flexShrink: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
            />
          </div>

          {/* New Proposal CTA */}
          <div style={{ padding: collapsed ? "8px 12px" : "8px 12px" }}>
            {collapsed ? (
              <Tooltip title="New Proposal" placement="right">
                <Link href="/generate">
                  <Button type="primary" icon={<PlusOutlined />} block
                    style={{ borderRadius: 10, height: 40, padding: 0 }} />
                </Link>
              </Tooltip>
            ) : (
              <Link href="/generate">
                <Button type="primary" icon={<PlusOutlined />} block
                  style={{ borderRadius: 10, height: 40, fontWeight: 600 }}>
                  New Proposal
                </Button>
              </Link>
            )}
          </div>

          {/* Nav */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            <Menu
              mode="inline"
              selectedKeys={[activeKey]}
              defaultOpenKeys={defaultOpenKeys}
              items={navItems}
              inlineCollapsed={collapsed}
              style={{ border: "none", padding: "0 8px" }}
            />
          </div>

          {/* Trial expired — sidebar upgrade CTA */}
          {isExpiredFree && !collapsed && (
            <div style={{ margin: "8px 12px", borderRadius: 12, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", padding: "14px 16px" }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>
                🔒 Trial Ended
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, display: "block", marginBottom: 10 }}>
                Upgrade to unlock all features
              </Text>
              <Link href="/subscription">
                <button style={{ width: "100%", background: "#fff", color: "#0369a1", border: "none", borderRadius: 8, padding: "7px 0", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  Upgrade from $12/mo
                </button>
              </Link>
            </div>
          )}

          {/* User */}
          <div style={{
            padding: collapsed ? "12px 8px" : "12px 16px",
            borderTop: "1px solid #f1f5f9",
            flexShrink: 0,
          }}>
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="topLeft">
              <div style={{
                display: "flex", alignItems: "center",
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? "center" : "flex-start",
                cursor: "pointer", padding: "8px 4px", borderRadius: 10, transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Tooltip title={collapsed ? (user?.user_metadata?.full_name ?? user?.email ?? "Account") : undefined} placement="right">
                  <Avatar style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)", flexShrink: 0 }} icon={!initials ? <UserOutlined /> : undefined}>
                    {initials}
                  </Avatar>
                </Tooltip>
                {!collapsed && (
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Text strong style={{ fontSize: 13, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.user_metadata?.full_name ?? "Account"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.email ?? "Click to sign out"}
                    </Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Sider>

        {/* Main */}
        <Layout style={{ marginLeft: siderWidth, transition: "margin-left 0.2s ease", marginTop: isExpiredFree && showExpiredBanner && path !== "/subscription" ? 44 : 0 }}>
          <Header style={{
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e2e8f0", padding: "0 28px",
            position: "sticky", top: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            height: 60,
          }}>
            <div />
            <Space size={12}>
              <RunningTimerIndicator />
              <Link href="/generate">
                <Button type="primary" icon={<ThunderboltOutlined />} size="small" style={{ borderRadius: 8, fontWeight: 600 }}>
                  New Proposal
                </Button>
              </Link>
            </Space>
          </Header>
          <Content style={{ minHeight: "calc(100vh - 60px)", background: "#f8fafc" }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
