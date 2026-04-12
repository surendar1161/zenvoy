import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SITE    = process.env.CHARGEBEE_SITE    ?? "";
const API_KEY = process.env.CHARGEBEE_API_KEY ?? "";

function cbAuth() {
  return "Basic " + Buffer.from(`${API_KEY}:`).toString("base64");
}

export async function POST(req: NextRequest) {
  if (!SITE || SITE.includes("placeholder")) {
    return NextResponse.json({ error: "Chargebee not configured" }, { status: 503 });
  }

  let user = null;
  const supabase = await createClient();
  const { data: { user: cookieUser } } = await supabase.auth.getUser();
  if (cookieUser) {
    user = cookieUser;
  } else {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { createClient: createAdmin } = await import("@supabase/supabase-js");
      const admin = createAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await admin.auth.getUser(authHeader.slice(7));
      user = data.user;
    }
  }
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
