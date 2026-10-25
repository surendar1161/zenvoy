"use client";

import { useEffect, useState } from "react";
import { ConfigProvider, Layout, Menu, Button, Dropdown, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
  HomeOutlined, FileTextOutlined,
  AppstoreOutlined, SettingOutlined,
  PlusOutlined, LogoutOutlined, SafetyCertificateOutlined,
  BookOutlined, BarChartOutlined, CreditCardOutlined, TeamOutlined,
  GlobalOutlined, FolderOpenOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  FundOutlined, ThunderboltOutlined, DollarOutlined, RocketOutlined, CloseOutlined,
  HeatMapOutlined, ClockCircleOutlined, CalendarOutlined, WalletOutlined,
} from "@ant-design/icons";
import RunningTimerIndicator from "@/components/RunningTimerIndicator";
import UsageMeter from "@/components/UsageMeter";
import { Modal } from "antd";
import { getTrialInfo } from "@/lib/trial";
import { isFeatureEnabled } from "@/lib/feature-flags";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { antdTheme } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";
import Logo, { LogoMark } from "@/components/site/Logo";
import type { User } from "@supabase/supabase-js";
import type { UsageSummary } from "@/lib/usage";

const { Sider, Header, Content } = Layout;

const COLLAPSED_WIDTH = 68;
const EXPANDED_WIDTH = 244;

const BASE_NAV: MenuProps["items"] = [
  { key: "/dashboard", icon: <HomeOutlined />, label: <Link href="/dashboard">Dashboard</Link> },
  { key: "/pipeline",  icon: <FundOutlined />,  label: <Link href="/pipeline">Pipeline</Link> },
  { type: "divider" },
  { 
    key: "/generate", 
    icon: <ThunderboltOutlined />, 
    label: <Link href="/generate">New Proposal</Link>,
  },
  { 
    key: "/contracts", 
    icon: <SafetyCertificateOutlined />, 
    label: <Link href="/contracts">Contracts</Link> 
  },
  { 
    key: "/website-analyzer", 
    icon: <RocketOutlined />, 
    label: <Link href="/website-analyzer">Website Analyzer <span className="ml-1.5 rounded-full bg-emerald-50 px-1.5 py-px text-[10px] font-bold text-emerald-600">NEW</span></Link> 
  },
  { type: "divider" },
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

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard", "/pipeline": "Pipeline", "/generate": "New proposal", "/contracts": "Contracts",
  "/website-analyzer": "Website analyzer", "/proposals": "Proposals", "/clients": "Clients", "/projects": "Projects",
  "/portals": "Client portals", "/invoices": "Invoices", "/expenses": "Expenses", "/time-tracking": "Time tracking",
  "/automations": "Automations", "/bookings": "Bookings", "/templates": "Templates", "/content-library": "Content library",
  "/analytics": "Analytics", "/subscription": "Subscription", "/settings": "Settings", "/capacity": "Capacity",
};

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
  const [usage, setUsage] = useState<UsageSummary | null>(null);

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
            label: <Link href="/capacity">Capacity <span className="ml-1.5 rounded-full bg-brand-50 px-1.5 py-px text-[10px] font-bold text-brand-700">Beta</span></Link>,
          };
          setNavItems(prev => {
            const items = [...(prev ?? [])];
            if (items.some(i => (i as unknown as Record<string, unknown>)?.key === "/capacity")) return items;
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

      fetch("/api/usage")
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUsage(data as UsageSummary); })
        .catch(() => {});

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
    { key: "email", label: <span className="text-[12px] text-ink-400">{user?.email ?? "Demo mode"}</span>, disabled: true },
    { type: "divider" },
    { key: "settings", label: <Link href="/settings">Settings</Link>, icon: <SettingOutlined /> },
    { key: "signout", label: "Sign Out", icon: <LogoutOutlined />, danger: true, onClick: handleSignOut },
  ];

  const trial = getTrialInfo(trialEndsAt);
  const isExpiredFree = trial.isExpired && plan === "free";

  const pageTitle = PAGE_TITLES[activeKey] ?? "";
  const bannerOn = isExpiredFree && showExpiredBanner && path !== "/subscription";
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? "Account";

  return (
    <ConfigProvider theme={antdTheme}>
      <style>{`
        .ant-layout-sider-children { display: flex !important; flex-direction: column !important; height: 100% !important; overflow: hidden !important; }
      `}</style>

      {/* Trial expired — modal (shown once per session) */}
      <Modal open={showExpiredModal} footer={null} closable={false} centered width={520} styles={{ body: { padding: 0 }, container: { padding: 0, overflow: "hidden", borderRadius: 28 } }}>
        <div className="dp-app overflow-hidden rounded-[28px]">
          <div className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-800 to-brand-900 px-9 pb-8 pt-10 text-center text-white">
            <div className="dp-grid absolute inset-0 opacity-25" aria-hidden />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/40 blur-[80px]" aria-hidden />
            <div className="relative">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[26px] ring-1 ring-white/20"><ClockCircleOutlined /></span>
              <h2 className="mt-5 text-[24px] font-extrabold">Your free trial has ended</h2>
              <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-ink-300">
                You had 30 days of full Pro access. Choose a plan to keep your proposals, contracts and client portals working.
              </p>
            </div>
          </div>
          <div className="bg-white px-9 pb-9 pt-7">
            <ul className="mb-6 space-y-3">
              {[
                "Unlimited proposals & contracts",
                "Digital e-signatures",
                "Client portals with file sharing & chat",
                "Deal pipeline & analytics",
                "AI contract generation (15 types)",
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-[14px] text-ink-700">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">✓</span>{f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2.5">
              <button
                onClick={() => { setShowExpiredModal(false); router.push("/subscription"); }}
                className="dp-btn-primary flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white"
              >
                <RocketOutlined /> View plans · from $12/mo
              </button>
              <button
                onClick={() => setShowExpiredModal(false)}
                aria-label="Dismiss"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-canvas text-ink-400 transition hover:bg-slate-100"
              >
                <CloseOutlined />
              </button>
            </div>
            <p className="mt-3 text-center text-[12px] text-ink-400">Cancel anytime · No hidden fees</p>
          </div>
        </div>
      </Modal>

      <Layout className="dp-app" style={{ minHeight: "100vh", background: "#F5F8FC" }}>
        {/* Trial expired — persistent top banner (dismissible per session) */}
        {bannerOn && (
          <div className="fixed inset-x-0 top-0 z-[200] flex h-11 items-center justify-center gap-3 bg-gradient-to-r from-ink via-ink-800 to-brand-800 px-4 text-white">
            <span className="truncate text-[13.5px]">
              <ClockCircleOutlined className="mr-2 text-brand-300" /><b>Your 30-day trial has ended.</b>{" "}
              <span className="hidden text-ink-300 sm:inline">Upgrade to keep your proposals, contracts and portals.</span>
            </span>
            <Link href="/subscription" className="shrink-0 rounded-full bg-white px-4 py-1 text-[12.5px] font-bold text-ink transition hover:bg-brand-50">Upgrade now →</Link>
            <button onClick={() => setShowExpiredBanner(false)} aria-label="Dismiss banner" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
              <CloseOutlined className="text-[12px]" />
            </button>
          </div>
        )}

        {/* Sidebar */}
        <Sider
          collapsed={collapsed}
          collapsedWidth={COLLAPSED_WIDTH}
          width={EXPANDED_WIDTH}
          style={{
            position: "fixed", insetInlineStart: 0, top: bannerOn ? 44 : 0, bottom: 0, zIndex: 100,
            background: "#fff", borderRight: "1px solid #E4E9F1",
            transition: "width 0.2s ease, top 0.2s ease",
            overflow: "hidden", display: "flex", flexDirection: "column",
          }}
          trigger={null}
          breakpoint="md"
          onBreakpoint={(broken) => setCollapsed(broken)}
        >
          {/* Logo + collapse toggle */}
          <div className={`flex items-center ${collapsed ? "flex-col gap-2 py-3" : "justify-between gap-2 px-4 pb-3 pt-4"}`}>
            <Link href="/dashboard" className="flex items-center" aria-label="DealPilot dashboard">
              {collapsed ? <LogoMark size={34} /> : <Logo />}
            </Link>
            <Button
              type="text" size="small"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(c => !c)}
              className="!flex !h-8 !w-8 !items-center !justify-center !text-ink-300 hover:!text-ink-700"
            />
          </div>

          {/* New Proposal CTA */}
          <div className="px-3 pb-2 pt-1">
            {collapsed ? (
              <Tooltip title="New Proposal" placement="right">
                <Link href="/generate" aria-label="New proposal">
                  <button className="dp-btn-primary grid h-10 w-full place-items-center rounded-xl text-white"><PlusOutlined /></button>
                </Link>
              </Tooltip>
            ) : (
              <Link href="/generate">
                <button className="dp-btn-primary flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white">
                  <PlusOutlined className="text-[12px]" /> New Proposal
                </button>
              </Link>
            )}
          </div>

          {/* Nav */}
          <div className="dp-side-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
            <Menu
              className="dp-menu"
              mode="inline"
              selectedKeys={[activeKey]}
              defaultOpenKeys={defaultOpenKeys}
              items={navItems}
              inlineCollapsed={collapsed}
              style={{ border: "none" }}
            />
          </div>

          <UsageMeter usage={usage} collapsed={collapsed} />

          {/* Trial expired — sidebar upgrade CTA */}
          {isExpiredFree && !collapsed && (
            <div className="relative mx-3 my-2 overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink-800 to-brand-800 p-4 text-white">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-500/40 blur-2xl" aria-hidden />
              <div className="relative">
                <div className="text-[13px] font-bold">Trial ended</div>
                <div className="mb-3 mt-0.5 text-[12px] text-ink-300">Upgrade to unlock all features</div>
                <Link href="/subscription" className="block rounded-xl bg-white py-2 text-center text-[12.5px] font-bold text-ink transition hover:bg-brand-50">Upgrade from $12/mo</Link>
              </div>
            </div>
          )}

          {/* User */}
          <div className={`shrink-0 border-t border-line ${collapsed ? "px-2 py-3" : "px-3 py-3"}`}>
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="topLeft">
              <button className={`flex w-full items-center rounded-xl p-2 text-left transition hover:bg-canvas ${collapsed ? "justify-center" : "gap-3"}`} aria-label="Account menu">
                <Tooltip title={collapsed ? (user?.user_metadata?.full_name ?? user?.email ?? "Account") : undefined} placement="right">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-violet-600 text-[13px] font-bold text-white">{initials}</span>
                </Tooltip>
                {!collapsed && (
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-ink">{displayName}</span>
                    <span className="block truncate text-[11.5px] text-ink-400">{user?.email ?? "Demo mode"}</span>
                  </span>
                )}
              </button>
            </Dropdown>
          </div>
        </Sider>

        {/* Main */}
        <Layout style={{ marginLeft: siderWidth, transition: "margin-left 0.2s ease", marginTop: bannerOn ? 44 : 0, background: "transparent" }}>
          <Header style={{
            background: "rgba(245,248,252,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid #E4E9F1", padding: "0 28px",
            position: "sticky", top: bannerOn ? 44 : 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, lineHeight: "normal",
          }}>
            <div className="min-w-0">
              <div className="truncate font-display text-[17px] font-bold text-ink">{pageTitle}</div>
            </div>
            <div className="flex items-center gap-3">
              <RunningTimerIndicator />
              <Link href="/generate">
                <button className="dp-btn-primary hidden h-9 items-center gap-2 rounded-xl px-4 text-[13px] font-bold text-white sm:flex">
                  <ThunderboltOutlined /> New Proposal
                </button>
              </Link>
            </div>
          </Header>
          <Content style={{ minHeight: "calc(100vh - 64px)", background: "transparent" }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
