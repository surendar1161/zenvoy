import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const VALID_TYPES = [
  "all", "proposal_viewed", "proposal_signed", "proposal_accepted", "proposal_declined",
  "contract_signed", "invoice_sent", "invoice_paid", "invoice_overdue",
  "payment_received", "payment_failed",
];

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const type = req.nextUrl.searchParams.get("type") ?? "all";

  if (!token || !VALID_TYPES.includes(type)) {
    return new NextResponse(html("Invalid unsubscribe link", "error"), { headers: { "Content-Type": "text/html" } });
  }

  const db = getAdmin();
  const { data: prefs } = await db.from("notification_preferences")
    .select("id")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (!prefs) {
    return new NextResponse(html("Invalid or expired unsubscribe link", "error"), { headers: { "Content-Type": "text/html" } });
  }

  const update: Record<string, boolean> = {};
  if (type === "all") {
    update.email_enabled = false;
  } else {
    update[type] = false;
  }

  await db.from("notification_preferences").update(update).eq("id", prefs.id);

  const msg = type === "all"
    ? "You have been unsubscribed from all DealPilot email notifications."
    : `You have been unsubscribed from "${type.replace(/_/g, " ")}" notifications.`;

  return new NextResponse(html(msg, "success"), { headers: { "Content-Type": "text/html" } });
}

function html(message: string, type: "success" | "error"): string {
  const color = type === "success" ? "#10b981" : "#ef4444";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Unsubscribe</title></head>
<body style="margin:0;padding:60px 20px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-align:center">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:40px 32px">
<div style="font-size:40px;margin-bottom:16px">${type === "success" ? "✅" : "⚠️"}</div>
<h1 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 12px">${type === "success" ? "Unsubscribed" : "Error"}</h1>
<p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px">${message}</p>
<p style="color:#94a3b8;font-size:12px">You can re-enable notifications in your <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://dealpilot.app"}/settings?tab=notifications" style="color:#0ea5e9">DealPilot settings</a>.</p>
</div></body></html>`;
}
