/**
 * Edge Function: chargebee-webhook
 * Handles Chargebee subscription lifecycle events.
 * verify_jwt = false (set in function config below)
 */
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { adminClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  // Verify basic auth password if set
  const webhookPassword = Deno.env.get("CHARGEBEE_WEBHOOK_PASSWORD");
  if (webhookPassword) {
    const auth = req.headers.get("authorization");
    const expected = `Basic ${btoa(`:${webhookPassword}`)}`;
    if (auth !== expected) return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const eventType = body.event_type as string;
  const content   = body.content as Record<string, unknown>;
  const sub       = content?.subscription as Record<string, unknown> | undefined;
  if (!sub) return new Response(JSON.stringify({ received: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const sb          = adminClient();
  const customerId  = sub.customer_id as string;
  const subId       = sub.id as string;
  const items       = (sub.subscription_items as { item_price_id: string }[] | undefined) ?? [];
  const itemPriceId = items[0]?.item_price_id ?? "";
  const plan        = itemPriceId.startsWith("business") ? "business" : itemPriceId.startsWith("pro") ? "pro" : "free";
  const billing     = itemPriceId.includes("yearly") ? "yearly" : "monthly";
  const status      = eventType === "subscription_cancelled" ? "canceled" : (sub.status as string ?? "active");
  const periodEnd   = (sub.current_term_end ?? sub.next_billing_at) as number | null;

  const metaData = sub.meta_data as Record<string, string> | undefined;
  let userId = metaData?.supabase_user_id;

  if (!userId) {
    const { data } = await sb.from("subscriptions").select("user_id").eq("chargebee_customer_id", customerId).maybeSingle();
    userId = data?.user_id;
  }

  if (userId) {
    await sb.from("subscriptions").upsert({
      user_id:                    userId,
      chargebee_customer_id:      customerId,
      chargebee_subscription_id:  subId,
      plan,
      billing_period:             billing,
      status,
      current_period_end:         periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      payment_provider:           "chargebee",
    }, { onConflict: "user_id" });

    if (eventType === "payment_failed") {
      await sb.from("notifications").insert({
        user_id: userId, type: "payment_failed",
        title: "Payment failed",
        message: "We couldn't process your subscription payment. Please update your billing details.",
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
