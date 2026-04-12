/**
 * Edge Function: track-view
 * Records when a client views a proposal or contract.
 * Does NOT require authentication (client visits the portal link).
 */
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { adminClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  const { documentId, documentType, sectionTimes, durationSec } = await req.json();
  if (!documentId || !documentType) {
    return new Response(JSON.stringify({ ok: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sb = adminClient();

  // Log the view event
  await sb.from("document_views").insert({
    document_id:   documentId,
    document_type: documentType,
    viewer_ip:     req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown",
    viewer_ua:     req.headers.get("user-agent") ?? "",
    section_times: sectionTimes ?? {},
    duration_sec:  durationSec ?? 0,
  });

  // Update the document's view_count
  const table = documentType === "proposal" ? "proposals" : "contracts";
  await sb.from(table)
    .update({ view_count: sb.rpc("increment", {}), last_viewed_at: new Date().toISOString() })
    .eq("id", documentId);

  // Notify the document owner
  const { data: doc } = await sb.from(table).select("user_id, client_name").eq("id", documentId).maybeSingle();
  if (doc?.user_id) {
    await sb.from("notifications").insert({
      user_id:       doc.user_id,
      type:          `${documentType}_viewed`,
      document_id:   documentId,
      document_type: documentType,
      title:         `${doc.client_name ?? "Someone"} viewed your ${documentType}`,
      message:       durationSec ? `${Math.round(durationSec / 60)} min read` : "Just opened",
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
