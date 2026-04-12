import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Lazy — created per-request so env vars are available at runtime
const getAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ ok: false });

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" });
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = webhookSecret && sig
      ? stripe.webhooks.constructEvent(body, sig, webhookSecret)
      : JSON.parse(body); // allow unsigned in dev
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${(err as Error).message}` }, { status: 400 });
  }

  async function upsertSubscription(
    userId: string,
    customerId: string,
    subscriptionId: string,
    plan: string,
    billingPeriod: string,
    status: string,
    periodEnd: number | null,
    cancelAtPeriodEnd: boolean,
  ) {
    await getAdmin().from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan: plan || "pro",
      billing_period: billingPeriod || "monthly",
      status,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: cancelAtPeriodEnd,
    }, { onConflict: "user_id" });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan;
      const period = session.metadata?.billing_period;
      const subId = session.subscription as string;
      if (!userId || !subId) break;
      const sub = await stripe.subscriptions.retrieve(subId);
      const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
      await upsertSubscription(userId, session.customer as string, subId, plan ?? "pro", period ?? "monthly", sub.status, periodEnd, sub.cancel_at_period_end);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription & { current_period_end: number };
      const userId = sub.metadata?.supabase_user_id;
      if (!userId) break;
      const plan = event.type === "customer.subscription.deleted" ? "free" : (sub.metadata?.plan ?? "pro");
      const status = event.type === "customer.subscription.deleted" ? "canceled" : sub.status;
      await upsertSubscription(userId, sub.customer as string, sub.id, plan, sub.metadata?.billing_period ?? "monthly", status, sub.current_period_end, sub.cancel_at_period_end);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as unknown as { subscription?: string | { id: string } };
      const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
      if (subId) {
        await getAdmin().from("subscriptions").update({ status: "past_due" }).eq("stripe_subscription_id", subId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
