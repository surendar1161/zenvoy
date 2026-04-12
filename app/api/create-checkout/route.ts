import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Plan, BillingPeriod } from "@/lib/plans";

const PRICES: Record<string, { amount: number; interval: "month" | "year"; name: string }> = {
  pro_monthly:      { amount: 1200,  interval: "month", name: "Zenvoy Pro (Monthly)" },
  pro_yearly:       { amount: 10800, interval: "year",  name: "Zenvoy Pro (Yearly — save 25%)" },
  business_monthly: { amount: 2900,  interval: "month", name: "Zenvoy Business (Monthly)" },
  business_yearly:  { amount: 26400, interval: "year",  name: "Zenvoy Business (Yearly — save 24%)" },
};

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey.includes("placeholder")) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const { plan, billingPeriod }: { plan: Plan; billingPeriod: BillingPeriod } = await req.json();
  const priceKey = `${plan}_${billingPeriod}` as keyof typeof PRICES;
  const priceConfig = PRICES[priceKey];
  if (!priceConfig) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Get or create Stripe customer
  const { data: sub } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
  let customerId = sub?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: priceConfig.name, description: "Zenvoy subscription" },
        recurring: { interval: priceConfig.interval },
        unit_amount: priceConfig.amount,
      },
      quantity: 1,
    }],
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan, billing_period: billingPeriod },
    },
    success_url: `${appUrl}/subscription?success=1&plan=${plan}`,
    cancel_url:  `${appUrl}/subscription?canceled=1`,
    allow_promotion_codes: true,
    metadata: { supabase_user_id: user.id, plan, billing_period: billingPeriod },
  });

  return NextResponse.json({ url: session.url });
}
