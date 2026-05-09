import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";
import { sendPortalClientEmail } from "@/lib/email";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

type PortalEvent =
  | "client_message"
  | "client_file_uploaded"
  | "freelancer_message"
  | "freelancer_file_uploaded"
  | "invoice_sent";

export async function POST(req: NextRequest) {
  const { token, event, data } = await req.json() as {
    token: string;
    event: PortalEvent;
    data: Record<string, string>;
  };

  if (!token || !event) {
    return NextResponse.json({ error: "token and event are required" }, { status: 400 });
  }

  const db = getClient();

  const { data: portal } = await db
    .from("client_portals")
    .select("id, user_id, client_name, client_email, title, token")
    .eq("token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (!portal) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 });
  }

  const isClientAction = event.startsWith("client_");

  if (isClientAction) {
    sendNotificationEmail(portal.user_id, "portal_file_uploaded", {
      clientName: data.clientName ?? portal.client_name ?? "Client",
      fileName: data.fileName ?? "",
      portalTitle: portal.title,
      portalId: portal.id,
      event,
    }).catch(console.error);
  } else if (portal.client_email) {
    sendPortalClientEmail(portal.client_email, event, {
      freelancerName: data.freelancerName ?? "Your team",
      portalToken: portal.token,
      portalTitle: portal.title,
      ...data,
    }).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
