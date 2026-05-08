import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";
import { executeAutomations } from "@/lib/automations/engine";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const MAX_FOLLOW_UPS = 3;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdmin();
  const now = Date.now();
  const twoDaysAgo = new Date(now - TWO_DAYS_MS).toISOString();
  let emailed = 0;
  let errors = 0;

  // Find proposals that are sent, never viewed, sent > 2 days ago,
  // and either never nudged or last nudged > 2 days ago, with < 3 nudges
  const { data: proposals } = await db
    .from("proposals")
    .select("id, user_id, title, client_name, client_id, sent_at, follow_up_sent_at, follow_up_count, clients(name)")
    .eq("status", "sent")
    .eq("view_count", 0)
    .lt("sent_at", twoDaysAgo)
    .lt("follow_up_count", MAX_FOLLOW_UPS)
    .order("sent_at", { ascending: true })
    .limit(200);

  if (!proposals?.length) {
    return NextResponse.json({ ok: true, processed: 0, emailed: 0, errors: 0 });
  }

  // Filter out proposals whose last nudge was < 2 days ago (debounce)
  const eligible = proposals.filter(p => {
    if (!p.follow_up_sent_at) return true;
    return new Date(p.follow_up_sent_at).getTime() < now - TWO_DAYS_MS;
  });

  for (const p of eligible) {
    try {
      // Resolve client name
      const clients = p.clients as { name: string }[] | { name: string } | null;
      const clientName = p.client_name
        ?? (Array.isArray(clients) ? clients[0]?.name : clients?.name)
        ?? "your client";

      const daysSinceSent = Math.floor((now - new Date(p.sent_at).getTime()) / 86400000);
      const proposalTitle = p.title ?? "Untitled Proposal";

      // Check user preferences before sending
      const { data: prefs } = await db
        .from("notification_preferences")
        .select("email_enabled, proposal_follow_up")
        .eq("user_id", p.user_id)
        .maybeSingle();

      if (prefs?.email_enabled === false || prefs?.proposal_follow_up === false) {
        continue;
      }

      // Send nudge email
      await sendNotificationEmail(p.user_id, "proposal_follow_up", {
        clientName,
        proposalTitle,
        daysSinceSent,
        documentId: p.id,
      });

      // Create in-app notification
      await db.from("notifications").insert({
        user_id: p.user_id,
        type: "proposal_follow_up",
        title: `${clientName} hasn't viewed your proposal`,
        body: `Your proposal "${proposalTitle}" has been waiting for ${daysSinceSent} days. Consider sending a follow-up.`,
        document_id: p.id,
        document_type: "proposal",
      });

      // Update tracking columns
      await db
        .from("proposals")
        .update({
          follow_up_sent_at: new Date().toISOString(),
          follow_up_count: (p.follow_up_count ?? 0) + 1,
        })
        .eq("id", p.id);

      // Fire workflow automations
      executeAutomations(p.user_id, "proposal_follow_up", {
        clientName,
        proposalTitle,
        daysSinceSent,
        documentId: p.id,
        documentType: "proposal",
        followUpNumber: (p.follow_up_count ?? 0) + 1,
      }).catch(console.error);

      emailed++;
    } catch (err) {
      console.error(`[cron] Follow-up failed for proposal ${p.id}:`, err);
      errors++;
    }
  }

  return NextResponse.json({
    ok: true,
    processed: eligible.length,
    emailed,
    errors,
  });
}
