import { NextRequest, NextResponse } from "next/server";
import { getPortalAdminClient, isValidPortalToken } from "@/lib/portal-server";

// Token-based read access for the client portal page. See lib/portal-server.ts.
// GET /api/portal/data?token=...            full portal (files, messages, invoices, scheduling link)
// GET /api/portal/data?token=...&only=messages   just the messages (used for polling)
// Add &visit=1 on the first load to record last_client_visit.

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!isValidPortalToken(token)) {
    return NextResponse.json({ error: "A valid token is required" }, { status: 400, headers: NO_STORE });
  }

  const db = getPortalAdminClient();
  if (!db) {
    console.error("[portal] SUPABASE_SERVICE_ROLE_KEY is not set; the token portal cannot load");
    return NextResponse.json({ error: "Portal service is not configured" }, { status: 503, headers: NO_STORE });
  }

  const { data: portal } = await db
    .from("client_portals")
    .select("id, user_id, title, client_name, welcome_message, is_active, brand_override")
    .eq("token", token)
    .maybeSingle();

  if (!portal) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404, headers: NO_STORE });
  }

  // A deactivated portal reveals nothing except that it is unavailable.
  if (!portal.is_active) {
    return NextResponse.json({ portal: { is_active: false } }, { headers: NO_STORE });
  }

  const messagesQuery = db
    .from("portal_messages")
    .select("id, sender, sender_name, content, created_at")
    .eq("portal_id", portal.id)
    .order("created_at");

  if (req.nextUrl.searchParams.get("only") === "messages") {
    const { data: messages } = await messagesQuery;
    return NextResponse.json({ messages: messages ?? [] }, { headers: NO_STORE });
  }

  const [{ data: files }, { data: messages }, { data: invoices }, { data: profile }] = await Promise.all([
    db.from("portal_files")
      .select("id, name, size_bytes, category, storage_url, uploaded_by, created_at, approval_status")
      .eq("portal_id", portal.id)
      .order("created_at", { ascending: false }),
    messagesQuery,
    db.from("portal_invoices")
      .select("id, invoice_number, title, line_items, total, currency, status, due_date, payment_link")
      .eq("portal_id", portal.id)
      .neq("status", "draft")
      .order("created_at", { ascending: false }),
    db.from("profiles")
      .select("scheduling_enabled, scheduling_link")
      .eq("id", portal.user_id)
      .maybeSingle(),
  ]);

  if (req.nextUrl.searchParams.get("visit") === "1") {
    // Best effort: a failed visit stamp must never break the page.
    await db.from("client_portals")
      .update({ last_client_visit: new Date().toISOString() })
      .eq("id", portal.id);
  }

  return NextResponse.json(
    {
      portal: {
        id: portal.id,
        title: portal.title,
        client_name: portal.client_name,
        welcome_message: portal.welcome_message,
        is_active: true,
        brand_override: portal.brand_override,
      },
      files: files ?? [],
      messages: messages ?? [],
      invoices: invoices ?? [],
      schedulingLink: profile?.scheduling_enabled && profile?.scheduling_link ? profile.scheduling_link : null,
    },
    { headers: NO_STORE },
  );
}
