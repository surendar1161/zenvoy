import { requireAuth } from "@/lib/api-auth";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import type { Milestone } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ milestones: [] });

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" });

  const { milestones, totalBudget, currency, freelancerName, clientName } = await req.json() as {
    milestones: Milestone[];
    totalBudget: number;
    currency: string;
    freelancerName: string;
    clientName: string;
  };

  // Create Stripe payment links for all milestones in parallel
  const results = await Promise.allSettled(
    milestones.map(async (m) => {
      const amount = Math.round((totalBudget * m.percentage) / 100);
      const amountInCents = Math.round(amount * 100);

      const price = await stripe.prices.create({
        unit_amount: amountInCents,
        currency: currency.toLowerCase(),
        product_data: {
          name: `${m.name} — ${clientName}`,
          metadata: { freelancer: freelancerName, client: clientName, milestone: m.name },
        },
      });

      const link = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
          type: "redirect",
          redirect: { url: process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com" },
        },
        metadata: { freelancer: freelancerName, client: clientName, milestone: m.name },
      });

      return { id: m.id, paymentLink: link.url };
    })
  );

  const linkedMilestones = milestones.map((m, i) => {
    const result = results[i];
    return {
      ...m,
      paymentLink: result.status === "fulfilled" ? result.value.paymentLink : null,
    };
  });

  return NextResponse.json({ milestones: linkedMilestones });
}
