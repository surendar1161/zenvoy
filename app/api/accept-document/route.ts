import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";
import { executeAutomations } from "@/lib/automations/engine";

export async function POST(req: NextRequest) {
  const { documentId, documentType, acceptorName, acceptorEmail } = await req.json();
  if (!documentId) return NextResponse.json({ error: "Missing documentId" }, { status: 400 });

  const supabase = await createClient();
  const now = new Date().toISOString();
  const table = documentType === "contract" ? "contracts" : "proposals";

  await supabase.from(table).update({
    accepted_at: now,
    status: "accepted",
    signer_name: acceptorName ?? null,
    signer_email: acceptorEmail ?? null,
  }).eq("id", documentId);

  const { data: doc } = await supabase
    .from(table).select("user_id, client_name").eq("id", documentId).maybeSingle();

  if (doc?.user_id) {
    await supabase.from("notifications").insert({
      user_id: doc.user_id,
      type: `${documentType}_accepted`,
      document_id: documentId,
      document_type: documentType,
      title: `✅ ${acceptorName ?? doc.client_name ?? "Client"} accepted your ${documentType}!`,
      message: `Accepted at ${new Date(now).toLocaleString()}`,
    });

    sendNotificationEmail(doc.user_id, "proposal_accepted", {
      acceptorName: acceptorName ?? doc.client_name ?? "Client",
      documentId, documentType,
    }).catch(console.error);

    executeAutomations(doc.user_id, "proposal_accepted", {
      acceptorName: acceptorName ?? doc.client_name ?? "Client",
      clientName: doc.client_name ?? "Client",
      documentId, documentType,
    }).catch(console.error);
  }

  return NextResponse.json({ ok: true, acceptedAt: now });
}
