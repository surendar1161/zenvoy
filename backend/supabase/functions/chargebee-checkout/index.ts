/**
 * Edge Function: chargebee-checkout
 * Creates a Chargebee hosted checkout page for subscription upgrades.
 */
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { extractJwt, userClient } from "../_shared/supabase.ts";

const CHARGEBEE_SITE    = Deno.env.get("CHARGEBEE_SITE")!;
const CHARGEBEE_API_KEY = Deno.env.get("CHARGEBEE_API_KEY")!;
const FRONTEND_URL      = Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173";

const PLANS: Record<string, string> = {
  pro_monthly:       Deno.env.get("CHARGEBEE_PRO_MONTHLY_PLAN_ID")      ?? "pro-monthly",
  pro_yearly:        Deno.env.get("CHARGEBEE_PRO_YEARLY_PLAN_ID")        ?? "pro-yearly",
  business_monthly:  Deno.env.get("CHARGEBEE_BUSINESS_MONTHLY_PLAN_ID")  ?? "business-monthly",
  business_yearly:   Deno.env.get("CHARGEBEE_BUSINESS_YEARLY_PLAN_ID")   ?? "business-yearly",
};

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  const jwt = extractJwt(req);
  if (!jwt) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const sb = userClient(jwt);
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const { plan, billingPeriod } = await req.json();
  const planId = PLANS[`${plan}_${billingPeriod}`];
  if (!planId) return new Response(JSON.stringify({ error: "Invalid plan" }), {
    status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

  // Call Chargebee REST API
  const cbAuth = btoa(`:${CHARGEBEE_API_KEY}`);
  const res = await fetch(`https://${CHARGEBEE_SITE}.chargebee.com/api/v2/hosted_pages/checkout_new_for_items`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${cbAuth}`,
      "Content-Type":  "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "subscription_items[item_price_id][0]": planId,
      "subscription_items[quantity][0]":       "1",
      "redirect_url":     `${FRONTEND_URL}/subscription?success=1&plan=${plan}`,
      "cancel_url":       `${FRONTEND_URL}/subscription?canceled=1`,
      "customer[email]":  user.email ?? "",
      "customer[meta_data][supabase_user_id]": user.id,
      "subscription[meta_data][supabase_user_id]": user.id,
      "subscription[meta_data][plan]":             plan,
      "subscription[meta_data][billing_period]":   billingPeriod,
    }),
  });

  const data = await res.json();
  const url = data.hosted_page?.url;
  if (!url) return new Response(JSON.stringify({ error: "Chargebee checkout failed", detail: data }), {
    status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

  return new Response(JSON.stringify({ url }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
