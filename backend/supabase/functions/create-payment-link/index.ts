/**
 * Edge Function: create-payment-link
 * Creates a Stripe payment link for a proposal deposit.
 */
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { extractJwt } from "../_shared/supabase.ts";
import Stripe from "npm:stripe@14";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
});

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  const jwt = extractJwt(req);
  if (!jwt) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const { amount, currency, description, freelancerName, clientName } = await req.json();
  const amountInCents = Math.round(amount * 100);

  const price = await stripe.prices.create({
    unit_amount: amountInCents,
    currency:    currency.toLowerCase(),
    product_data: {
      name: description || `Project Deposit — ${freelancerName}`,
      metadata: { client: clientName, freelancer: freelancerName },
    },
  });

  const appUrl = Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173";
  const link = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    after_completion: { type: "redirect", redirect: { url: appUrl } },
    metadata: { client: clientName, freelancer: freelancerName },
  });

  return new Response(JSON.stringify({ url: link.url }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
