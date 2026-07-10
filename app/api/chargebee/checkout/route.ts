import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createChargebeeCheckoutSession, resolveChargebeePlanId } from "@/lib/chargebee";
import type { Plan, BillingPeriod } from "@/lib/plans";

const SITE    = process.env.CHARGEBEE_SITE    ?? "";
const API_KEY = process.env.CHARGEBEE_API_KEY ?? "";

export async function POST(req: NextRequest) {
  if (!SITE || SITE.includes("placeholder") || !API_KEY || API_KEY.includes("placeholder")) {
    return NextResponse.json({ error: "Chargebee not configured. Add CHARGEBEE_SITE and CHARGEBEE_API_KEY to .env.local" }, { status: 503 });
  }

  const { plan, billingPeriod }: { plan: Plan; billingPeriod: BillingPeriod } = await req.json();
  const planId = resolveChargebeePlanId(`${plan}_${billingPeriod}`);
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

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("chargebee_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const result = await createChargebeeCheckoutSession({
    site: SITE,
    apiKey: API_KEY,
    planId,
    plan,
    billingPeriod,
    userId: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name as string | undefined,
    customerId: sub?.chargebee_customer_id,
    redirectUrl: `${appUrl}/subscription?success=1&plan=${plan}&provider=chargebee`,
    cancelUrl: `${appUrl}/subscription?canceled=1`,
  });

  if (!result.ok) {
    console.error("Chargebee checkout error:", JSON.stringify({
      site: result.site,
      planId: result.planId,
      detail: result.detail,
    }));
    return NextResponse.json(
      { error: result.error, detail: result.detail },
      { status: result.status },
    );
  }

  return NextResponse.json({ url: result.url, hostedPageId: result.hostedPageId });
}
