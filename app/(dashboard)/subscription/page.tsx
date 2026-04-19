"use client";

import { useEffect, useState } from "react";
import {
  Alert, Badge, Button, Card, Col, Result, Row, Space, Statistic,
  Switch, Tag, Typography, message, Divider, Spin,
} from "antd";
import {
  CheckCircleFilled, CloseCircleOutlined, ThunderboltFilled,
  CreditCardOutlined, SettingOutlined, ArrowRightOutlined, StarFilled,
} from "@ant-design/icons";
import { PLANS, getPlan } from "@/lib/plans";
import { getTrialInfo, trialBadgeText, trialUrgency } from "@/lib/trial";
import type { Plan, BillingPeriod } from "@/lib/plans";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
      if (url) window.location.href = url;
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
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}

      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: "0 0 6px", fontWeight: 800 }}>Subscription & Billing</Title>
        <Text type="secondary" style={{ fontSize: 15 }}>Manage your plan, billing, and usage.</Text>
      </div>

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
              <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => upgrade("pro")}
                style={{ borderRadius: 10, fontWeight: 600, background: "#0ea5e9", borderColor: "#0ea5e9" }}>
                Upgrade to Pro
              </Button>
            )}
          </Col>
        </Row>

        {sub?.status === "past_due" && (
          <Alert type="error" showIcon message="Payment failed" description="Update your payment method to restore access."
            style={{ marginTop: 16, borderRadius: 10 }}
            action={<Button onClick={openPortal} size="small" icon={<CreditCardOutlined />}>Update Card</Button>} />
        )}
      </Card>

      {/* Billing toggle */}
      {!isPaid && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 32 }}>
          <Text style={{ fontWeight: yearly ? 400 : 700 }}>Monthly</Text>
          <Switch checked={yearly} onChange={setYearly} style={{ background: yearly ? "#0ea5e9" : "#94a3b8" }} />
          <Text style={{ fontWeight: yearly ? 700 : 400 }}>
            Yearly <Tag color="green" style={{ borderRadius: 20, fontSize: 11, marginLeft: 4 }}>Save up to 21%</Tag>
          </Text>
        </div>
      )}

      {/* Plan cards */}
      <Row gutter={[20, 20]}>
        {PLANS.map(plan => {
          const isCurrent = sub?.plan === plan.id;
          const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <Col key={plan.id} xs={24} md={8}>
              <Card
                style={{
                  borderRadius: 18,
                  border: `2px solid ${isCurrent ? plan.color : plan.popular ? `${plan.color}50` : "#e2e8f0"}`,
                  height: "100%",
                  background: isCurrent ? `${plan.color}06` : "#fff",
                  boxShadow: plan.popular ? `0 8px 30px ${plan.color}20` : undefined,
                }}
                styles={{ body: { padding: 24 } }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <Title level={5} style={{ margin: "0 0 4px", fontWeight: 800 }}>{plan.name}</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>{plan.tagline}</Text>
                  </div>
                  {isCurrent && <Tag color={plan.color} style={{ borderRadius: 20, fontWeight: 700 }}>Current</Tag>}
                  {!isCurrent && plan.popular && <StarFilled style={{ color: "#f59e0b" }} />}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: "#0f172a" }}>${price}</span>
                  <span style={{ color: "#94a3b8", fontSize: 14 }}>/mo</span>
                  {yearly && plan.yearlyTotal > 0 && (
                    <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Billed ${plan.yearlyTotal}/yr</Text>
                  )}
                </div>

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
                    style={{ borderRadius: 10, height: 40, fontWeight: 700, background: plan.color, borderColor: plan.color }}
                  >
                    {sub?.plan === "pro" && plan.id === "business" ? "Upgrade to Business" : "Get " + plan.name}
                  </Button>
                )}

                <Divider style={{ margin: "20px 0 14px" }} />
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  {plan.features.slice(0, 6).map(f => (
                    <Space key={f} align="start" size={6}>
                      <CheckCircleFilled style={{ color: plan.color, fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                      <Text style={{ fontSize: 13 }}>{f}</Text>
                    </Space>
                  ))}
                  {plan.notIncluded?.slice(0, 3).map(f => (
                    <Space key={f} align="start" size={6}>
                      <CloseCircleOutlined style={{ color: "#e2e8f0", fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                      <Text type="secondary" style={{ fontSize: 13 }}>{f}</Text>
                    </Space>
                  ))}
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Usage stats */}
      <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginTop: 32 }} styles={{ body: { padding: 28 } }}>
        <Title level={5} style={{ margin: "0 0 20px" }}>Usage This Month</Title>
        <Row gutter={[24, 16]}>
          {[
            { label: "Proposals",  icon: "📄", limit: currentPlan.limits.proposals },
            { label: "Contracts",  icon: "📋", limit: currentPlan.limits.contracts },
            { label: "Team Members", icon: "👥", limit: currentPlan.limits.teamMembers },
          ].map(item => (
            <Col key={item.label} xs={24} sm={8}>
              <Statistic
                title={<Space>{item.icon}<Text type="secondary" style={{ fontSize: 13 }}>{item.label}</Text></Space>}
                value={item.limit === "unlimited" ? "∞ Unlimited" : `of ${item.limit}`}
                valueStyle={{ fontSize: 20, fontWeight: 700, color: "#0ea5e9" }}
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Money back guarantee */}
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          ✓ Cancel anytime · No hidden fees · Billed via Chargebee
        </Text>
      </div>
    </div>
  );
}

export default function SubscriptionPageWrapper() {
  return <Suspense><SubscriptionPage /></Suspense>;
}

function SubscriptionPage() {
  return <Suspense><SubscriptionContent /></Suspense>;
}
