import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe not configured. Add STRIPE_SECRET_KEY to your environment." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2026-03-25.dahlia",
  });

  const { amount, currency, description, freelancerName, clientName } = await req.json();

  // Stripe amounts are in smallest currency unit (cents for USD/GBP/EUR)
  const amountInCents = Math.round(amount * 100);

  // Create a one-time price for the deposit
  const price = await stripe.prices.create({
    unit_amount: amountInCents,
    currency: currency.toLowerCase(),
    product_data: {
      name: description || `Project Deposit — ${freelancerName}`,
      metadata: { client: clientName, freelancer: freelancerName },
    },
  });

  // Create the payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    after_completion: {
      type: "redirect",
      redirect: { url: process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com" },
    },
    metadata: { client: clientName, freelancer: freelancerName },
  });

  return NextResponse.json({ url: paymentLink.url });
}
