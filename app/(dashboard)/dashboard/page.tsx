"use client";

import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import {
  ThunderboltOutlined, FileTextOutlined, SafetyCertificateOutlined,
  TeamOutlined, DollarOutlined, EyeOutlined, CheckCircleOutlined,
  ArrowRightOutlined, ClockCircleOutlined, BellOutlined,
  DeleteOutlined, ExperimentOutlined, PlusOutlined,
  TrophyOutlined, FireOutlined, LineChartOutlined, RocketOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getTrialInfo, trialBadgeText, trialUrgency } from "@/lib/trial";
import { Page, Card, SectionTitle, Banner, StatusPill, Trend, EmptyState } from "@/components/app/ui";
import { ButtonLink } from "@/components/site/ui";

interface DashboardData {
  userName: string;
  proposals: {
    total: number; draft: number; sent: number;
    viewed: number; accepted: number; declined: number;
    week: number; prevWeek: number;
  };
  contracts: { total: number; signed: number; draft: number };
  clients: { total: number; active: number; leads: number };
  revenue: number;
  revenueWeek: number;
  revenuePrevWeek: number;
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

function pctChange(now: number, prev: number): number {
  if (prev === 0) return now === 0 ? 0 : 100;
  return ((now - prev) / prev) * 100;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasDemoData, setHasDemoData] = useState(false);
  const [deletingDemo, setDeletingDemo] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { load(); }, []);

  async function handleDeleteDemo() {
    Modal.confirm({
      title: "Delete all demo data?",
      content: "This will permanently remove all demo clients, proposals, contracts, projects, invoices, and content library items. Your real data will not be affected.",
      okText: "Delete Demo Data",
      okType: "danger",
      onOk: async () => {
        setDeletingDemo(true);
        const res = await fetch("/api/delete-demo", { method: "POST" });
        setDeletingDemo(false);
        if (res.ok) {
          setHasDemoData(false);
          msgApi.success("Demo data deleted — your workspace is clean!");
          load();
        } else {
          msgApi.error("Failed to delete demo data");
        }
      },
    });
  }

  async function load() {
    const supabase = createClient();
    const [
      userResult,
      { data: props },
      { data: contracts },
      { data: clients },
      { data: notifs },
      { data: profile },
    ] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("proposals").select("id,client_name,project_type,status,currency,total_budget,view_count,created_at").order("created_at", { ascending: false }),
      supabase.from("contracts").select("id,status,created_at").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,status").order("created_at", { ascending: false }),
      supabase.from("notifications").select("id,title,message,type,created_at").order("created_at", { ascending: false }).limit(8),
      supabase.from("profiles").select("has_demo_data, trial_ends_at").eq("id", (await supabase.auth.getUser()).data.user?.id ?? "").maybeSingle(),
    ]);
    setHasDemoData(profile?.has_demo_data ?? false);
    setTrialEndsAt(profile?.trial_ends_at ?? null);

    const allProps = props ?? [];
    const allContracts = contracts ?? [];
    const allClients = clients ?? [];
    const now = Date.now();
    const d7 = now - 7 * 86400000;
    const d14 = now - 14 * 86400000;
    const inRange = (iso: string, from: number, to: number) => {
      const t = new Date(iso).getTime();
      return t >= from && t < to;
    };
    const won = (s: string) => s === "accepted" || s === "signed";
    const weekProps = allProps.filter(p => inRange(p.created_at, d7, now));
    const prevProps = allProps.filter(p => inRange(p.created_at, d14, d7));
    const weekRev = allProps.filter(p => won(p.status) && inRange(p.created_at, d7, now)).reduce((s, p) => s + (p.total_budget ?? 0), 0);
    const prevRev = allProps.filter(p => won(p.status) && inRange(p.created_at, d14, d7)).reduce((s, p) => s + (p.total_budget ?? 0), 0);

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
      proposals: {
        total: allProps.length,
        draft: allProps.filter(p => p.status === "draft").length,
        sent: allProps.filter(p => p.status === "sent").length,
        viewed: allProps.filter(p => p.status === "viewed").length,
        accepted: allProps.filter(p => won(p.status)).length,
        declined: allProps.filter(p => p.status === "declined").length,
        week: weekProps.length,
        prevWeek: prevProps.length,
      },
      contracts: {
        total: allContracts.length,
        signed: allContracts.filter(c => c.status === "signed").length,
        draft: allContracts.filter(c => c.status === "draft").length,
      },
      clients: {
        total: allClients.length,
        active: allClients.filter(c => c.status === "active").length,
        leads: allClients.filter(c => c.status === "lead").length,
      },
      revenue: allProps.filter(p => won(p.status)).reduce((s, p) => s + (p.total_budget ?? 0), 0),
      revenueWeek: weekRev,
      revenuePrevWeek: prevRev,
      viewCount: allProps.reduce((s, p) => s + (p.view_count ?? 0), 0),
      recentProposals: allProps.slice(0, 6) as DashboardData["recentProposals"],
      recentNotifications: (notifs ?? []) as DashboardData["recentNotifications"],
      needsAttention,
    });
    setLoading(false);
  }

  if (loading) {
    return (
      <Page>
        <div className="mb-8 space-y-3">
          <div className="dp-skel h-8 w-64" />
          <div className="dp-skel h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map(i => <div key={i} className="dp-skel h-16 rounded-2xl" />)}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map(i => <div key={i} className="dp-skel h-32 rounded-3xl" />)}
        </div>
      </Page>
    );
  }

  if (!data) return null;

  const convRate = data.proposals.total > 0
    ? Math.round((data.proposals.accepted / Math.max(data.proposals.total - data.proposals.draft, 1)) * 100)
    : 0;
  const hasAnyData = data.proposals.total > 0 || data.clients.total > 0;
  const pipelineValue = (data.proposals.sent + data.proposals.viewed) * (data.revenue / Math.max(data.proposals.accepted, 1));
  const potentialRevenue = Math.round(pipelineValue * (convRate / 100));
  const trial = getTrialInfo(trialEndsAt);
  const urgency = trialUrgency(trial);
  const trialTone = trial.isExpired ? "slate" : urgency === "critical" ? "rose" : urgency === "warning" ? "amber" : "brand";

  return (
    <Page>
      {ctx}

      { (trial.isOnTrial || trial.isExpired) && (
        <Banner
          tone={trialTone as "brand" | "amber" | "rose" | "slate"}
          icon={<ClockCircleOutlined />}
          title={trial.isOnTrial ? `Free trial — full Pro access · ${trialBadgeText(trial)}` : "Your 30-day trial has ended"}
          body={trial.isOnTrial
            ? "You have access to all features. Upgrade before your trial ends to keep access."
            : "Upgrade to Pro to continue using all features."}
          action={
            <Link href="/subscription" className="inline-flex h-9 items-center rounded-xl bg-ink px-4 text-[13px] font-bold text-white">
              {trial.isExpired ? "Upgrade now" : "View plans"}
            </Link>
          }
        />
      )}

      {hasDemoData && (
        <Banner
          tone="amber"
          icon={<ExperimentOutlined />}
          title="You're viewing demo data"
          body="Sample clients, proposals, contracts, projects and invoices are pre-loaded so you can explore. Delete them when you're ready to start fresh."
          action={
            <button
              onClick={handleDeleteDemo}
              disabled={deletingDemo}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
            >
              <DeleteOutlined /> {deletingDemo ? "Deleting…" : "Delete demo data"}
            </button>
          }
        />
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-extrabold tracking-tight text-ink sm:text-[34px]">
            Good {getTimeOfDay()}, {data.userName}
          </h1>
          <p className="mt-1 text-[15px] text-ink-500">
            {hasAnyData ? "Here's what's happening with your deals today." : "Welcome. Create your first proposal to get started."}
          </p>
        </div>
      </div>

      {/* Quick actions — always first, per UX audit */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/generate" className="dp-btn-primary group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-[18px]"><ThunderboltOutlined /></span>
          <span className="text-left">
            <span className="block text-[14.5px] font-bold">Generate proposal</span>
            <span className="block text-[12px] text-white/75">AI-written in 60 seconds</span>
          </span>
          <ArrowRightOutlined className="ml-auto text-[12px] opacity-70 transition group-hover:translate-x-0.5" />
        </Link>
        <Link href="/contracts" className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-[18px] text-emerald-600"><SafetyCertificateOutlined /></span>
          <span className="text-left">
            <span className="block text-[14.5px] font-bold text-ink">Create contract</span>
            <span className="block text-[12px] text-ink-400">{data.contracts.total} contract{data.contracts.total !== 1 ? "s" : ""} so far</span>
          </span>
        </Link>
        <Link href="/clients" className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-[18px] text-violet-600"><TeamOutlined /></span>
          <span className="text-left">
            <span className="block text-[14.5px] font-bold text-ink">Add a client</span>
            <span className="block text-[12px] text-ink-400">{data.clients.total} client{data.clients.total !== 1 ? "s" : ""} in your CRM</span>
          </span>
        </Link>
      </div>

      {!hasAnyData ? (
        <EmptyState
          icon={<ThunderboltOutlined />}
          title="Create your first proposal"
          body="Answer a few questions and Claude writes a branded proposal with pricing tiers and a Stripe payment link."
        >
          <ButtonLink href="/generate" size="lg">Generate my first proposal <ThunderboltOutlined /></ButtonLink>
          <ButtonLink href="/clients" variant="secondary" size="lg">Add a client</ButtonLink>
        </EmptyState>
      ) : (
        <>
          {/* Grouped metrics */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              icon={<DollarOutlined />}
              tone="emerald"
              label="Revenue"
              value={`$${data.revenue.toLocaleString()}`}
              sub={`from ${data.proposals.accepted} won proposal${data.proposals.accepted !== 1 ? "s" : ""}`}
              trend={pctChange(data.revenueWeek, data.revenuePrevWeek)}
              trendLabel="vs last week"
            />
            <Metric
              icon={<CheckCircleOutlined />}
              tone={convRate >= 50 ? "emerald" : convRate >= 25 ? "amber" : "rose"}
              label="Conversion"
              value={`${convRate}%`}
              sub={`${data.proposals.accepted} accepted of ${Math.max(data.proposals.total - data.proposals.draft, 0)} sent`}
            />
            <Metric
              icon={<RocketOutlined />}
              tone="brand"
              label="Deal flow"
              value={String(data.proposals.sent + data.proposals.viewed)}
              sub={`${data.proposals.sent} sent · ${data.proposals.viewed} viewed`}
              trend={pctChange(data.proposals.week, data.proposals.prevWeek)}
              trendLabel="new this week"
            />
            <Metric
              icon={<TeamOutlined />}
              tone="violet"
              label="Clients"
              value={String(data.clients.active)}
              sub={`${data.clients.leads} lead${data.clients.leads !== 1 ? "s" : ""} · ${data.viewCount} proposal views`}
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Forecast */}
            <Card>
              <SectionTitle icon={<LineChartOutlined />} title="Revenue forecast" />
              <div className="font-display text-[36px] font-extrabold tabular-nums text-emerald-600">
                ${(data.revenue + potentialRevenue).toLocaleString()}
              </div>
              <p className="mt-1 text-[13.5px] text-ink-500">
                ${data.revenue.toLocaleString()} won + ${potentialRevenue.toLocaleString()} expected from the pipeline
              </p>
              <div className="mt-5 space-y-2.5 rounded-2xl bg-canvas px-4 py-3.5 text-[13px]">
                <Row label="Pipeline value" value={`$${Math.round(pipelineValue).toLocaleString()}`} />
                <Row label={`Expected close (${convRate}%)`} value={`$${potentialRevenue.toLocaleString()}`} accent />
                <Row label="Active proposals" value={String(data.proposals.sent + data.proposals.viewed)} />
              </div>
              {convRate < 25 && data.proposals.total > 3 && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 px-3.5 py-3 text-[12.5px] text-amber-900">
                  <FireOutlined className="mt-0.5 text-amber-500" />
                  <span><b>Tip:</b> Conversion is low. Follow up on viewed proposals or revisit your pricing.</span>
                </div>
              )}
            </Card>

            {/* Today's focus */}
            <Card>
              <SectionTitle
                icon={<TrophyOutlined />}
                title="Today's focus"
                href={data.needsAttention.length > 3 ? "/proposals" : undefined}
                hrefLabel={data.needsAttention.length > 3 ? `View ${data.needsAttention.length - 3} more` : undefined}
              />
              {data.needsAttention.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-[22px] text-emerald-500"><CheckCircleOutlined /></span>
                  <p className="mt-3 text-[14px] font-semibold text-ink">All caught up</p>
                  <p className="text-[13px] text-ink-400">No follow-ups needed. Great work.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {data.needsAttention.slice(0, 3).map(item => (
                    <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-line px-3.5 py-3">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${item.status === "sent" ? "bg-amber-400" : "bg-brand-500"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-semibold text-ink">{item.client_name}</div>
                        <div className="truncate text-[12px] text-ink-400">{item.reason}</div>
                      </div>
                      <Link href="/proposals" className="shrink-0 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-bold text-white">
                        Follow up
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Pipeline */}
          <Card className="mb-6">
            <SectionTitle icon={<RocketOutlined />} title="Proposal pipeline" href="/proposals" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: "Draft", count: data.proposals.draft, color: "text-ink-400 bg-slate-100" },
                { label: "Sent", count: data.proposals.sent, color: "text-brand-700 bg-brand-50" },
                { label: "Viewed", count: data.proposals.viewed, color: "text-cyan-700 bg-cyan-50" },
                { label: "Won", count: data.proposals.accepted, color: "text-emerald-700 bg-emerald-50" },
                { label: "Declined", count: data.proposals.declined, color: "text-rose-700 bg-rose-50" },
              ].map(s => (
                <div key={s.label} className={`rounded-2xl px-3 py-4 text-center ${s.color.split(" ")[1]}`}>
                  <div className={`font-display text-[28px] font-extrabold tabular-nums ${s.color.split(" ")[0]}`}>{s.count}</div>
                  <div className="mt-0.5 text-[12px] font-semibold text-ink-500">{s.label}</div>
                  {data.proposals.total > 0 && (
                    <div className="mt-1 text-[11px] text-ink-300">{Math.round((s.count / data.proposals.total) * 100)}%</div>
                  )}
                </div>
              ))}
            </div>
            {data.proposals.total > 0 && (
              <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-slate-100">
                {[
                  { count: data.proposals.draft, color: "bg-slate-300" },
                  { count: data.proposals.sent, color: "bg-brand-500" },
                  { count: data.proposals.viewed, color: "bg-cyan-400" },
                  { count: data.proposals.accepted, color: "bg-emerald-500" },
                  { count: data.proposals.declined, color: "bg-rose-300" },
                ].map((s, i) => s.count > 0 ? (
                  <div key={i} className={s.color} style={{ width: `${(s.count / data.proposals.total) * 100}%` }} />
                ) : null)}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Recent proposals */}
            <Card padded={false} className="lg:col-span-3">
              <div className="px-6 pt-6">
                <SectionTitle icon={<FileTextOutlined />} title="Recent proposals" href="/proposals" />
              </div>
              {data.recentProposals.length === 0 ? (
                <p className="px-6 pb-6 text-[14px] text-ink-400">No proposals yet.</p>
              ) : (
                <ul>
                  {data.recentProposals.map(p => (
                    <li key={p.id} className="dp-row flex items-center gap-3 border-t border-line px-6 py-3.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 text-[12px] font-bold text-white">
                        {p.client_name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-[14px] font-semibold text-ink">{p.client_name}</span>
                          <StatusPill status={p.status} />
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[12px] text-ink-400">
                          <span>{p.project_type ?? "Proposal"}</span>
                          {p.view_count > 0 && <span className="inline-flex items-center gap-1"><EyeOutlined /> {p.view_count}</span>}
                          <span>{timeAgo(p.created_at)}</span>
                        </div>
                      </div>
                      {p.total_budget && p.total_budget > 0 && (
                        <span className="hidden text-[14px] font-bold tabular-nums text-emerald-600 sm:block">
                          {p.currency ?? "USD"} {p.total_budget.toLocaleString()}
                        </span>
                      )}
                      <div className="dp-row-actions flex shrink-0 gap-1">
                        <Link href={`/proposal/${p.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-canvas hover:text-brand-600" aria-label="View">
                          <EyeOutlined />
                        </Link>
                        <Link href={`/editor/proposal/${p.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-canvas hover:text-brand-600" aria-label="Edit">
                          <EditOutlined />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Activity */}
            <Card padded={false} className="lg:col-span-2">
              <div className="px-6 pt-6">
                <SectionTitle icon={<BellOutlined />} title="Activity" href="/analytics" hrefLabel="All activity" />
              </div>
              {data.recentNotifications.length === 0 ? (
                <p className="px-6 pb-8 text-[14px] leading-relaxed text-ink-400">Activity appears here when clients open your proposals.</p>
              ) : (
                <ul>
                  {data.recentNotifications.map(n => {
                    const good = n.type.includes("signed") || n.type.includes("accepted");
                    return (
                      <li key={n.id} className="flex items-start gap-3 border-t border-line px-6 py-3.5">
                        <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[13px] ${good ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600"}`}>
                          {good ? <CheckCircleOutlined /> : <EyeOutlined />}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-semibold text-ink">{n.title}</div>
                          {n.message && <div className="truncate text-[12px] text-ink-400">{n.message}</div>}
                          <div className="mt-0.5 text-[11.5px] text-ink-300">{timeAgo(n.created_at)}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}

      {/* Mobile quick compose */}
      <Link
        href="/generate"
        className="dp-btn-primary fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full text-[22px] text-white shadow-glow sm:hidden"
        aria-label="New proposal"
      >
        <PlusOutlined />
      </Link>
    </Page>
  );
}

function Metric({
  icon, tone, label, value, sub, trend, trendLabel,
}: {
  icon: React.ReactNode; tone: "brand" | "emerald" | "violet" | "amber" | "rose";
  label: string; value: string; sub: string; trend?: number; trendLabel?: string;
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <Card>
      <div className="flex items-start justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl text-[16px] ${tones[tone]}`}>{icon}</span>
        {trend !== undefined && <Trend value={trend} label={trendLabel} />}
      </div>
      <div className="mt-4 text-[12.5px] font-semibold uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-1 font-display text-[28px] font-extrabold leading-none tabular-nums text-ink">{value}</div>
      <div className="mt-2 text-[12.5px] text-ink-400">{sub}</div>
    </Card>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{label}</span>
      <span className={`font-semibold tabular-nums ${accent ? "text-emerald-600" : "text-ink"}`}>{value}</span>
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
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
