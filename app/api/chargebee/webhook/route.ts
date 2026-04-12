import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

// Lazy — created per-request so env vars are available at runtime
function getAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type CBPlan = "free" | "pro" | "business";
type CBStatus = "active" | "trialing" | "past_due" | "canceled" | "unpaid";

function resolvePlan(itemPriceId: string): CBPlan {
  if (itemPriceId.startsWith("business")) return "business";
  if (itemPriceId.startsWith("pro")) return "pro";
  return "free";
}

function resolveBilling(itemPriceId: string): string {
  return itemPriceId.includes("yearly") ? "yearly" : "monthly";
}

function mapStatus(cbStatus: string): CBStatus {
  const map: Record<string, CBStatus> = {
    active: "active", in_trial: "trialing", past_due: "past_due",
    cancelled: "canceled", paused: "canceled", non_renewing: "active",
  };
  return map[cbStatus] ?? "active";
}

async function upsert(
  userId: string,
  customerId: string,
  subscriptionId: string,
  plan: CBPlan,
  billing: string,
  status: CBStatus,
  periodEnd: number | null,
) {
  await getAdmin().from("subscriptions").upsert({
    user_id: userId,
    chargebee_customer_id: customerId,
    chargebee_subscription_id: subscriptionId,
    plan,
    billing_period: billing,
    status,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
  }, { onConflict: "user_id" });
}

export async function POST(req: NextRequest) {
  // Verify webhook authenticity (Chargebee sends a basic-auth style header or custom header)
  const webhookPassword = process.env.CHARGEBEE_WEBHOOK_PASSWORD;
  if (webhookPassword) {
    const auth = req.headers.get("authorization");
    const expected = `Basic ${Buffer.from(`:${webhookPassword}`).toString("base64")}`;
    if (auth !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const eventType = body.event_type as string;
  const content = body.content as Record<string, unknown>;

  const SUBSCRIPTION_EVENTS = [
    "subscription_created",
    "subscription_activated",
    "subscription_renewed",
    "subscription_changed",
    "subscription_cancelled",
    "subscription_reactivated",
    "subscription_paused",
    "payment_succeeded",
    "payment_failed",
  ];

  if (!SUBSCRIPTION_EVENTS.includes(eventType)) {
    return NextResponse.json({ received: true });
  }

  const sub = content.subscription as Record<string, unknown> | undefined;
  const customer = content.customer as Record<string, unknown> | undefined;
  if (!sub) return NextResponse.json({ received: true });

  const subscriptionId = sub.id as string;
  const customerId = (sub.customer_id ?? customer?.id) as string;
  const subscriptionItems = (sub.subscription_items as { item_price_id: string }[] | undefined) ?? [];
  const firstItem = subscriptionItems[0];
  const itemPriceId = firstItem?.item_price_id ?? "";

  const plan = resolvePlan(itemPriceId);
  const billing = resolveBilling(itemPriceId);
  const status = eventType === "subscription_cancelled"
    ? "canceled"
    : mapStatus(sub.status as string);
  const periodEnd = (sub.current_term_end ?? sub.next_billing_at) as number | null;

  // Find supabase user via pass_thru_content or customer metadata
  const passThroughStr = (sub.meta_data as Record<string, string> | undefined)?.supabase_user_id
    ?? (customer?.meta_data as Record<string, string> | undefined)?.supabase_user_id;

  let userId = passThroughStr ?? null;

  // Fallback: look up by existing chargebee_customer_id
  if (!userId) {
    const { data } = await getAdmin()
      .from("subscriptions")
      .select("user_id")
      .eq("chargebee_customer_id", customerId)
      .maybeSingle();
    userId = data?.user_id ?? null;
  }

  if (!userId) {
    console.warn("Chargebee webhook: could not resolve user for customer", customerId);
    return NextResponse.json({ received: true });
  }

  await upsert(userId, customerId, subscriptionId, plan, billing, status, periodEnd);

  // Notify user of payment failure
  if (eventType === "payment_failed") {
    await getAdmin().from("notifications").insert({
      user_id: userId,
      type: "payment_failed",
      title: "Payment failed",
      message: "We couldn't process your subscription payment. Please update your billing details.",
    });
  }

  return NextResponse.json({ received: true });
}
