import { NextRequest, NextResponse } from "next/server";
import { escapeLike, getPortalAdminClient, isValidPortalToken } from "@/lib/portal-server";

// Proposals shown in a client portal, found by token. See lib/portal-server.ts.
// The tables have no client_id column, so a proposal belongs to the portal when it
// is the freelancer's own and its client name equals the portal's client name
// (exact, case-insensitive). Drafts are never shown.

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!isValidPortalToken(token)) {
    return NextResponse.json({ error: "A valid token is required" }, { status: 400 });
  }

  const db = getPortalAdminClient();
  if (!db) {
    console.error("[portal] the server admin client is not configured; portal proposals cannot load");
    return NextResponse.json({ error: "Portal service is not configured" }, { status: 503 });
  }

  const { data: portal } = await db
    .from("client_portals")
    .select("id, user_id, client_name")
    .eq("token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (!portal) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 });
  }

  const clientName = (portal.client_name ?? "").trim();
  if (!clientName) return NextResponse.json([]);

  const { data, error } = await db
    .from("proposals")
    .select("id, client_name, client_company, project_type, proposal_text, tiers, add_ons, milestones, total_budget, deposit_percent, deposit_amount, currency, status, signed_at, signer_name, accepted_at, created_at, brand_snapshot, freelancer_name, timeline")
    .eq("user_id", portal.user_id)
    .in("status", ["sent", "viewed", "accepted"])
    .ilike("client_name", escapeLike(clientName))
    .order("created_at", { ascending: false });

  if (error) {
    // Report real failures instead of hiding them as "not found".
    console.error("[portal] proposals query failed:", error.message);
    return NextResponse.json({ error: "Could not load proposals" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
