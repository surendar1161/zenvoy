"use client";

import { useEffect, useState } from "react";
import {
  Alert, Badge, Button, Card, Col, Result, Row, Space, Statistic,
  Tag, Typography, message, Spin, Progress,
} from "antd";
import {
  CheckCircleFilled, CloseCircleOutlined, ThunderboltFilled,
  CreditCardOutlined, SettingOutlined, ArrowRightOutlined,
} from "@ant-design/icons";
import { PLANS, getPlan } from "@/lib/plans";
import { getTrialInfo, trialBadgeText, trialUrgency } from "@/lib/trial";
import type { Plan, BillingPeriod } from "@/lib/plans";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import type { UsageSummary } from "@/lib/usage";
import { isAtLimit, usageLabel, usagePercent } from "@/lib/usage";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Page, PageHeader } from "@/components/app/ui";
import { Button as BrandButton } from "@/components/site/ui";

const { Title, Text } = Typography;

interface SubData {
  plan: Plan;
  billing_period: BillingPeriod;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  chargebee_customer_id: string | null;
  stripe_customer_id: string | null;
  payment_provider: string | null;
}

const CHARGEBEE_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_CHARGEBEE_SITE &&
  !process.env.NEXT_PUBLIC_CHARGEBEE_SITE?.includes("placeholder")
);

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const [sub, setSub] = useState<SubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [msgApi, ctx] = message.useMessage();
  const supabase = createClient();

  useEffect(() => {
    load();
    const plan = searchParams.get("plan");
    if (searchParams.get("success")) msgApi.success(`🎉 ${plan ? `Welcome to ${plan.charAt(0).toUpperCase() + plan.slice(1)}!` : "Subscription activated!"}`);
    if (searchParams.get("canceled")) msgApi.info("Checkout canceled — no charges made.");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const [{ data }, { data: { user } }] = await Promise.all([
      supabase.from("subscriptions").select("*").maybeSingle(),
      supabase.auth.getUser(),
    ]);
    setSub(data as SubData ?? { plan: "free", billing_period: "monthly", status: "active", current_period_end: null, cancel_at_period_end: false, chargebee_customer_id: null, stripe_customer_id: null, payment_provider: "free" });
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("trial_ends_at").eq("id", user.id).maybeSingle();
      setTrialEndsAt(profile?.trial_ends_at ?? null);
    }
    try {
      const res = await fetch("/api/usage");
      if (res.ok) setUsage(await res.json());
    } catch {}
    setLoading(false);
  }

  async function upgrade(plan: Plan) {
    setUpgrading(plan);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const endpoint = "/api/chargebee/checkout";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ plan, billingPeriod: yearly ? "yearly" : "monthly" }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) {
        trackEvent("checkout_started", { plan, billing: yearly ? "yearly" : "monthly" });
        window.location.href = url;
      }
    } catch (e) {
      msgApi.error((e as Error).message);
    } finally {
      setUpgrading(null);
    }
  }

  async function openPortal() {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const endpoint = sub?.chargebee_customer_id
        ? "/api/chargebee/portal"
        : "/api/billing-portal";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {}),
        },
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (e) {
      msgApi.error((e as Error).message);
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 100 }}><Spin size="large" /></div>;

  const currentPlan = getPlan(sub?.plan ?? "free");
  const isPaid = sub?.plan !== "free";
  const isCanceling = sub?.cancel_at_period_end;
  const trial = getTrialInfo(trialEndsAt);

  return (
    <Page>
      {ctx}

      <PageHeader title="Subscription & Billing" sub="Manage your plan, billing, and usage." />

      {/* Trial banner */}
      {(trial.isOnTrial || trial.isExpired) && !isPaid && (
        <Card style={{
          borderRadius: 16, marginBottom: 24,
          border: `2px solid ${trial.isExpired ? "#e2e8f0" : trialUrgency(trial) === "critical" ? "#fca5a5" : trialUrgency(trial) === "warning" ? "#fcd34d" : "#bfdbfe"}`,
          background: trial.isExpired ? "#f8fafc" : trialUrgency(trial) === "critical" ? "#fff1f2" : trialUrgency(trial) === "warning" ? "#fffbeb" : "#eff6ff",
        }} styles={{ body: { padding: 24 } }}>
          <Row justify="space-between" align="middle" gutter={[16, 12]}>
            <Col>
              <Space size={12}>
                <span style={{ fontSize: 28 }}>{trial.isExpired ? "⏰" : "🎉"}</span>
                <div>
                  <Text strong style={{ fontSize: 16, display: "block" }}>
                    {trial.isOnTrial ? "30-Day Free Trial — Full Pro Access" : "Trial Ended"}
                  </Text>
                  {trial.isOnTrial && (
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {trialBadgeText(trial)} · Upgrade before your trial ends to keep all features
                    </Text>
                  )}
                  {trial.isExpired && (
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Your free trial ended. Choose a plan below to continue.
                    </Text>
                  )}
                  {trial.isOnTrial && trial.trialEndsAt && (
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                      Expires: {new Date(trial.trialEndsAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                    </Text>
                  )}
                </div>
              </Space>
            </Col>
            <Col>
              {trial.isOnTrial && (
                <Tag color="blue" style={{ borderRadius: 20, fontSize: 13, padding: "4px 14px", fontWeight: 700 }}>
                  {trial.daysLeft > 0 ? `${trial.daysLeft} days left` : `${trial.hoursLeft}h left`}
                </Tag>
              )}
            </Col>
          </Row>
        </Card>
      )}

      {/* Current plan card */}
      <Card style={{ borderRadius: 20, border: `2px solid ${currentPlan.color}`, marginBottom: 32, background: `${currentPlan.color}08` }} styles={{ body: { padding: 32 } }}>
        <Row align="middle" justify="space-between" gutter={[24, 16]}>
          <Col>
            <Space align="center" size={16}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${currentPlan.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ThunderboltFilled style={{ color: currentPlan.color, fontSize: 24 }} />
              </div>
              <div>
                <Space align="center" size={8}>
                  <Title level={3} style={{ margin: 0, fontWeight: 900 }}>{currentPlan.name} Plan</Title>
                  <Badge
                    count={sub?.status === "active" || sub?.status === "trialing" ? "Active" : sub?.status ?? "Active"}
                    color={sub?.status === "past_due" ? "red" : "green"}
                    style={{ borderRadius: 20, fontSize: 11 }}
                  />
                  {isCanceling && <Tag color="orange" style={{ borderRadius: 20 }}>Cancels at period end</Tag>}
                </Space>
                <Space size={8} style={{ marginTop: 4 }} wrap>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    {isPaid
                      ? `${sub?.billing_period === "yearly" ? "Annual" : "Monthly"} billing · Renews ${sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "—"}`
                      : "Free plan — upgrade to unlock unlimited proposals, e-signatures, and more"}
                  </Text>
                  {isPaid && sub?.chargebee_customer_id && (
                    <Tag style={{ borderRadius: 20, fontSize: 11, background: "#fff4e6", borderColor: "#fca5a5", color: "#c2410c" }}>
                      via Chargebee
                    </Tag>
                  )}
                  {isPaid && sub?.stripe_customer_id && !sub?.chargebee_customer_id && (
                    <Tag style={{ borderRadius: 20, fontSize: 11, background: "#f0f9ff", borderColor: "#7dd3fc", color: "#0369a1" }}>
                      via Stripe
                    </Tag>
                  )}
                </Space>
              </div>
            </Space>
          </Col>
          <Col>
            {isPaid ? (
              <Button icon={<SettingOutlined />} loading={portalLoading} onClick={openPortal} style={{ borderRadius: 10, fontWeight: 600 }}>
                Manage Billing
              </Button>
            ) : (
              <BrandButton onClick={() => upgrade("pro")}>
                <ArrowRightOutlined /> Upgrade to Pro
              </BrandButton>
            )}
          </Col>
        </Row>

        {sub?.status === "past_due" && (
          <Alert type="error" showIcon message="Payment failed" description="Update your payment method to restore access."
            style={{ marginTop: 16, borderRadius: 10 }}
            action={<Button onClick={openPortal} size="small" icon={<CreditCardOutlined />}>Update Card</Button>} />
        )}
      </Card>

      {!isPaid && (
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full border border-line bg-white p-1 shadow-soft" role="group" aria-label="Billing period">
            {[{ l: "Monthly", v: false }, { l: "Yearly", v: true }].map(o => (
              <button key={o.l} type="button" onClick={() => setYearly(o.v)} aria-pressed={yearly === o.v}
                className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-all duration-300 ${yearly === o.v ? "bg-ink text-white shadow-soft" : "text-ink-500 hover:text-ink"}`}>
                {o.l}
                {o.v && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">Save 25%</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        {PLANS.map(plan => {
          const isCurrent = sub?.plan === plan.id;
          const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
          const pop = !!plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative flex h-full flex-col rounded-3xl p-6 sm:p-7 ${
                pop
                  ? "bg-gradient-to-b from-ink to-ink-800 text-white shadow-float ring-1 ring-brand-400/40"
                  : "border border-line bg-white text-ink shadow-soft"
              } ${isCurrent && !pop ? "ring-2 ring-brand-400" : ""}`}
            >
              {pop && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-violet-600 px-4 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-[20px] font-bold">{plan.name}</div>
                  <div className={`text-[13.5px] ${pop ? "text-ink-300" : "text-ink-400"}`}>{plan.tagline}</div>
                </div>
                {isCurrent && (
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${pop ? "bg-white/15 text-white" : "bg-brand-50 text-brand-700"}`}>Current</span>
                )}
              </div>

              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-[44px] font-extrabold leading-none tabular-nums">${price}</span>
                <span className={`pb-1.5 text-[14px] ${pop ? "text-ink-300" : "text-ink-400"}`}>/mo</span>
              </div>
              <div className={`mt-1 min-h-5 text-[12.5px] ${pop ? "text-ink-300" : "text-ink-400"}`}>
                {yearly && plan.yearlyTotal > 0 ? `Billed $${plan.yearlyTotal}/yr` : ""}
              </div>

              <div className="mt-5">
                {isCurrent ? (
                  <Button block disabled style={{ borderRadius: 10, height: 40 }}>Current Plan</Button>
                ) : plan.id === "free" ? (
                  <Button block disabled={isPaid} style={{ borderRadius: 10, height: 40 }}
                    onClick={isPaid ? openPortal : undefined}>
                    {isPaid ? "Downgrade (via billing portal)" : "Current"}
                  </Button>
                ) : (
                  <Button
                    type="primary" block loading={upgrading === plan.id}
                    onClick={() => upgrade(plan.id as Plan)}
                    style={{
                      borderRadius: 10, height: 40, fontWeight: 700,
                      background: pop ? "#ffffff" : plan.color,
                      borderColor: pop ? "#ffffff" : plan.color,
                      color: pop ? "#0B1220" : "#ffffff",
                    }}
                  >
                    {sub?.plan === "pro" && plan.id === "business" ? "Upgrade to Business" : "Get " + plan.name}
                  </Button>
                )}
              </div>

              <div className={`my-5 border-t ${pop ? "border-white/15" : "border-line"}`} />
              <div className="space-y-2">
                {plan.features.slice(0, 6).map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircleFilled style={{ color: pop ? "#7dd3fc" : plan.color, fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                    <span className={`text-[13px] ${pop ? "text-ink-200" : "text-ink"}`}>{f}</span>
                  </div>
                ))}
                {plan.notIncluded?.slice(0, 3).map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <CloseCircleOutlined style={{ color: pop ? "rgba(255,255,255,0.28)" : "#e2e8f0", fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                    <span className={`text-[13px] ${pop ? "text-ink-300" : "text-ink-400"}`}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage stats */}
      <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginTop: 32 }} styles={{ body: { padding: 28 } }}>
        <Title level={5} style={{ margin: "0 0 4px" }}>Usage This Month</Title>
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 20 }}>
          {usage?.periodLabel ?? "Current month"} · Resets on the 1st
        </Text>
        <Row gutter={[24, 20]}>
          {[
            { label: "Proposals", icon: "📄", data: usage?.proposals ?? { used: 0, limit: currentPlan.limits.proposals } },
            { label: "Contracts", icon: "📋", data: usage?.contracts ?? { used: 0, limit: currentPlan.limits.contracts } },
            { label: "Team Members", icon: "👥", data: usage?.teamMembers ?? { used: 1, limit: currentPlan.limits.teamMembers } },
          ].map(item => {
            const atLimit = isAtLimit(item.data);
            const pct = usagePercent(item.data.used, item.data.limit);
            const unlimited = item.data.limit === "unlimited";

            return (
              <Col key={item.label} xs={24} sm={8}>
                <div style={{ padding: "16px 18px", borderRadius: 12, border: "1px solid #f1f5f9", background: "#f8fafc" }}>
                  <Space style={{ marginBottom: 8 }}>
                    <span>{item.icon}</span>
                    <Text type="secondary" style={{ fontSize: 13 }}>{item.label}</Text>
                  </Space>
                  <Statistic
                    value={unlimited ? item.data.used : usageLabel(item.data)}
                    suffix={unlimited ? <Text type="secondary" style={{ fontSize: 14 }}>· Unlimited</Text> : undefined}
                    valueStyle={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: atLimit ? "#ef4444" : "#0ea5e9",
                    }}
                  />
                  {!unlimited && (
                    <Progress
                      percent={pct}
                      size="small"
                      strokeColor={atLimit ? "#ef4444" : pct >= 80 ? "#f59e0b" : "#0ea5e9"}
                      style={{ marginTop: 8 }}
                    />
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
        {usage && !usage.hasUnlimitedUsage && (isAtLimit(usage.proposals) || isAtLimit(usage.contracts)) && (
          <Alert
            type="warning"
            showIcon
            style={{ marginTop: 20, borderRadius: 10 }}
            message="You've hit a free plan limit"
            description="Upgrade to Pro for unlimited proposals and contracts, or wait until the 1st of next month when limits reset."
            action={
              <Button size="small" type="primary" onClick={() => upgrade("pro")} style={{ borderRadius: 8 }}>
                Upgrade to Pro
              </Button>
            }
          />
        )}
      </Card>

      {/* Money back guarantee */}
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          ✓ Cancel anytime · No hidden fees · Billed via Chargebee
        </Text>
      </div>
    </Page>
  );
}

export default function SubscriptionPageWrapper() {
  return <Suspense><SubscriptionPage /></Suspense>;
}

function SubscriptionPage() {
  return <Suspense><SubscriptionContent /></Suspense>;
}
