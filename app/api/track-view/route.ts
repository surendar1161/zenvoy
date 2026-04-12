import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { documentId, documentType, sectionTimes, durationSec } = await req.json();
  if (!documentId || !documentType) return NextResponse.json({ ok: false });

  const supabase = await createClient();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  // Insert view event
  await supabase.from("document_views").insert({
    document_id: documentId,
    document_type: documentType,
    viewer_ip: ip,
    viewer_ua: ua,
    section_times: sectionTimes ?? {},
    duration_sec: durationSec ?? 0,
  });

  // Update view_count and last_viewed_at on the document
  const table = documentType === "proposal" ? "proposals" : "contracts";
  await supabase.rpc("increment_view_count", { tbl: table, doc_id: documentId });

  // Create notification for the document owner
  const { data: doc } = await supabase
    .from(table)
    .select("user_id, client_name, party_a_name")
    .eq("id", documentId)
    .maybeSingle();

  if (doc?.user_id) {
    const name = doc.client_name ?? doc.party_a_name ?? "Someone";
    await supabase.from("notifications").insert({
      user_id: doc.user_id,
      type: `${documentType}_viewed`,
      document_id: documentId,
      document_type: documentType,
      title: `${name} viewed your ${documentType}`,
      message: `Opened just now · ${durationSec ? Math.round(durationSec / 60) + " min read" : ""}`,
    });
  }

  return NextResponse.json({ ok: true });
}
