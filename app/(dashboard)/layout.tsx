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
  FundOutlined, ThunderboltOutlined, DollarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { antdTheme } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 228;

const NAV_ITEMS: MenuProps["items"] = [
  { key: "/dashboard",        icon: <HomeOutlined />,              label: <Link href="/dashboard">Dashboard</Link> },
  { key: "/pipeline",         icon: <FundOutlined />,              label: <Link href="/pipeline">Pipeline</Link> },
  { key: "/proposals",        icon: <FileTextOutlined />,          label: <Link href="/proposals">My Proposals</Link> },
  { key: "/clients",          icon: <TeamOutlined />,              label: <Link href="/clients">Clients</Link> },
  { key: "/projects",         icon: <FolderOpenOutlined />,        label: <Link href="/projects">Projects</Link> },
  { key: "/portals",          icon: <GlobalOutlined />,            label: <Link href="/portals">Client Portals</Link> },
  { key: "/invoices",         icon: <DollarOutlined />,            label: <Link href="/invoices">Invoices</Link> },
  { key: "/templates",        icon: <AppstoreOutlined />,          label: <Link href="/templates">Templates</Link> },
  { type: "divider" },
  { key: "/contracts",        icon: <SafetyCertificateOutlined />, label: <Link href="/contracts">Contracts</Link> },
  { type: "divider" },
  { key: "/content-library",  icon: <BookOutlined />,              label: <Link href="/content-library">Content Library</Link> },
  { key: "/analytics",        icon: <BarChartOutlined />,          label: <Link href="/analytics">Analytics</Link> },
  { type: "divider" },
  { key: "/subscription",     icon: <CreditCardOutlined />,        label: <Link href="/subscription">Subscription</Link> },
  { key: "/settings",         icon: <SettingOutlined />,           label: <Link href="/settings">Settings</Link> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const siderWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
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

  const activeKey =
    path === "/dashboard"
      ? "/dashboard"
      : (NAV_ITEMS ?? [])
          .map(i => (i as { key: string }).key)
          .filter(k => k !== "/dashboard" && path.startsWith(k))[0] ?? "/dashboard";

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string).split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  const userMenuItems: MenuProps["items"] = [
    { key: "email", label: <Text type="secondary" style={{ fontSize: 12 }}>{user?.email ?? "Demo mode"}</Text>, disabled: true },
    { type: "divider" },
    { key: "settings", label: <Link href="/settings">Settings</Link>, icon: <SettingOutlined /> },
    { key: "signout", label: "Sign Out", icon: <LogoutOutlined />, danger: true, onClick: handleSignOut },
  ];

  return (
    <ConfigProvider theme={antdTheme}>
      <Layout style={{ minHeight: "100vh" }}>
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
                <Text strong style={{ fontSize: 16, color: "#0ea5e9", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>Zenvoy</Text>
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
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={NAV_ITEMS}
            inlineCollapsed={collapsed}
            style={{ border: "none", flex: 1, padding: "0 8px" }}
          />

          {/* User */}
          <div style={{
            padding: collapsed ? "12px 8px" : "12px 16px",
            borderTop: "1px solid #f1f5f9",
            position: "absolute", bottom: 0, width: "100%",
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
        <Layout style={{ marginLeft: siderWidth, transition: "margin-left 0.2s ease" }}>
          <Header style={{
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e2e8f0", padding: "0 28px",
            position: "sticky", top: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            height: 60,
          }}>
            <div />
            <Space>
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
