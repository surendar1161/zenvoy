import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Plan, BillingPeriod } from "@/lib/plans";

const SITE    = process.env.CHARGEBEE_SITE    ?? "";
const API_KEY = process.env.CHARGEBEE_API_KEY ?? "";

const PLAN_IDS: Record<string, string> = {
  pro_monthly:       process.env.CHARGEBEE_PRO_MONTHLY_PLAN_ID      ?? "pro-monthly",
  pro_yearly:        process.env.CHARGEBEE_PRO_YEARLY_PLAN_ID        ?? "pro-yearly",
  business_monthly:  process.env.CHARGEBEE_BUSINESS_MONTHLY_PLAN_ID  ?? "business-monthly",
  business_yearly:   process.env.CHARGEBEE_BUSINESS_YEARLY_PLAN_ID   ?? "business-yearly",
};

function cbAuth() {
  // Chargebee: API key is the username, password is empty
  return "Basic " + Buffer.from(`${API_KEY}:`).toString("base64");
}

export async function POST(req: NextRequest) {
  if (!SITE || SITE.includes("placeholder") || !API_KEY || API_KEY.includes("placeholder")) {
    return NextResponse.json({ error: "Chargebee not configured. Add CHARGEBEE_SITE and CHARGEBEE_API_KEY to .env.local" }, { status: 503 });
  }

  const { plan, billingPeriod }: { plan: Plan; billingPeriod: BillingPeriod } = await req.json();
  const planId = PLAN_IDS[`${plan}_${billingPeriod}`];
  if (!planId) return NextResponse.json({ error: "Invalid plan or billing period" }, { status: 400 });

  // Try cookie-based session first, then Bearer token fallback
  let user = null;
  const supabase = await createClient();
  const { data: { user: cookieUser } } = await supabase.auth.getUser();
  if (cookieUser) {
    user = cookieUser;
  } else {
    // Bearer token fallback (production client-side fetch)
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { createClient: createAdmin } = await import("@supabase/supabase-js");
      const admin = createAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await admin.auth.getUser(token);
      user = data.user;
    }
  }
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const cbUrl  = `https://${SITE}.chargebee.com/api/v2/hosted_pages/checkout_new_for_items`;

  // Get existing Chargebee customer id if any
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("chargebee_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const body = new URLSearchParams({
    "subscription_items[item_price_id][0]":  planId,
    "subscription_items[quantity][0]":        "1",
    "redirect_url":  `${appUrl}/subscription?success=1&plan=${plan}&provider=chargebee`,
    "cancel_url":    `${appUrl}/subscription?canceled=1`,
    "subscription[meta_data][supabase_user_id]": user.id,
    "subscription[meta_data][plan]":             plan,
    "subscription[meta_data][billing_period]":   billingPeriod,
  });

  if (sub?.chargebee_customer_id) {
    body.set("customer[id]", sub.chargebee_customer_id);
    body.set("customer[meta_data][supabase_user_id]", user.id);
  } else {
    body.set("customer[email]",      user.email ?? "");
    body.set("customer[first_name]", (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "");
    body.set("customer[last_name]",  (user.user_metadata?.full_name as string | undefined)?.split(" ").slice(1).join(" ") ?? "");
    body.set("customer[meta_data][supabase_user_id]", user.id);
  }

  const cbRes = await fetch(cbUrl, {
    method: "POST",
    headers: { Authorization: cbAuth(), "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await cbRes.json();

  if (!cbRes.ok || !data.hosted_page?.url) {
    console.error("Chargebee checkout error:", JSON.stringify(data));
    return NextResponse.json(
      { error: data.message ?? "Chargebee checkout failed", detail: data },
      { status: cbRes.status }
    );
  }

  return NextResponse.json({ url: data.hosted_page.url, hostedPageId: data.hosted_page.id });
}
