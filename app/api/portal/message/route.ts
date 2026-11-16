import { NextRequest, NextResponse } from "next/server";
import { clampText, getPortalAdminClient, isValidPortalToken } from "@/lib/portal-server";

// Token-based "send a message" for the client portal page. See lib/portal-server.ts.
// POST { token, content, senderName }

const MAX_CONTENT = 4000;
const MAX_NAME = 100;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = body.token;
  if (!isValidPortalToken(token)) {
    return NextResponse.json({ error: "A valid token is required" }, { status: 400 });
  }

  const content = clampText(body.content, MAX_CONTENT);
  if (!content) {
    return NextResponse.json({ error: "Message is empty" }, { status: 400 });
  }
  const senderName = clampText(body.senderName, MAX_NAME) || "Client";

  const db = getPortalAdminClient();
  if (!db) {
    console.error("[portal] SUPABASE_SERVICE_ROLE_KEY is not set; the token portal cannot send messages");
    return NextResponse.json({ error: "Portal service is not configured" }, { status: 503 });
  }

  const { data: portal } = await db
    .from("client_portals")
    .select("id")
    .eq("token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (!portal) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 });
  }

  const { data: message, error } = await db
    .from("portal_messages")
    .insert({
      portal_id: portal.id,
      sender: "client",
      sender_name: senderName,
      content,
      read_by_freelancer: false,
    })
    .select("id, sender, sender_name, content, created_at")
    .single();

  if (error || !message) {
    return NextResponse.json({ error: "Could not send message" }, { status: 500 });
  }

  return NextResponse.json(message, { status: 201 });
}
