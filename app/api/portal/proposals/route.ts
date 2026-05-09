import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const db = getClient();

  const { data: portal } = await db
    .from("client_portals")
    .select("id, user_id, client_id, client_name")
    .eq("token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (!portal) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 });
  }

  let query = db
    .from("proposals")
    .select("id, client_name, client_company, project_type, proposal_text, tiers, add_ons, milestones, total_budget, deposit_percent, deposit_amount, currency, status, signed_at, signer_name, accepted_at, created_at, brand_snapshot, freelancer_name, timeline")
    .eq("user_id", portal.user_id)
    .in("status", ["sent", "viewed", "accepted"]);

  if (portal.client_id) {
    query = query.eq("client_id", portal.client_id);
  } else if (portal.client_name) {
    query = query.ilike("client_name", `%${portal.client_name}%`);
  } else {
    return NextResponse.json([]);
  }

  const { data } = await query.order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}
