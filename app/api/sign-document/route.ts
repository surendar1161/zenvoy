import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { documentId, documentType, signerName, signerEmail, signatureData, signatureType } = await req.json();

  if (!documentId || !signerName || !signatureData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  const now = new Date().toISOString();

  const table = documentType === "proposal" ? "proposals" : "contracts";

  const { error } = await supabase.from(table).update({
    signer_name: signerName,
    signer_email: signerEmail ?? null,
    signature_data: signatureData,
    signature_type: signatureType ?? "typed",
    signature_ip: ip,
    signature_ua: ua,
    signed_at: now,
    status: "signed",
  }).eq("id", documentId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify owner
  const { data: doc } = await supabase
    .from(table).select("user_id, client_name").eq("id", documentId).maybeSingle();

  if (doc?.user_id) {
    await supabase.from("notifications").insert({
      user_id: doc.user_id,
      type: `${documentType}_signed`,
      document_id: documentId,
      document_type: documentType,
      title: `🎉 ${signerName} signed your ${documentType}!`,
      message: `Signed at ${new Date(now).toLocaleString()} · IP: ${ip}`,
    });
  }

  return NextResponse.json({ ok: true, signedAt: now });
}
