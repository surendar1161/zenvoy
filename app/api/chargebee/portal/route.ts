import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SITE    = process.env.CHARGEBEE_SITE    ?? "";
const API_KEY = process.env.CHARGEBEE_API_KEY ?? "";

function cbAuth() {
  return "Basic " + Buffer.from(`${API_KEY}:`).toString("base64");
}

export async function POST(_req: NextRequest) {
  if (!SITE || SITE.includes("placeholder")) {
    return NextResponse.json({ error: "Chargebee not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("chargebee_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.chargebee_customer_id) {
    return NextResponse.json({ error: "No Chargebee subscription found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const cbUrl  = `https://${SITE}.chargebee.com/api/v2/portal_sessions`;

  const cbRes = await fetch(cbUrl, {
    method: "POST",
    headers: { Authorization: cbAuth(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "redirect_url":  `${appUrl}/subscription`,
      "customer[id]":  sub.chargebee_customer_id,
    }),
  });

  const data = await cbRes.json();

  if (!cbRes.ok || !data.portal_session?.access_url) {
    console.error("Chargebee portal error:", JSON.stringify(data));
    return NextResponse.json({ error: data.message ?? "Portal session failed" }, { status: cbRes.status });
  }

  return NextResponse.json({ url: data.portal_session.access_url });
}
