import { createClient as createAdmin } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { documentId, documentType, signerName, signerEmail, signatureData, signatureType } = await req.json();

  if (!documentId || !signerName || !signatureData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["proposal", "contract"].includes(documentType)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  // Validate document exists and is not already signed (using service role)
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const table = documentType === "proposal" ? "proposals" : "contracts";
  const { data: doc } = await admin.from(table).select("id, user_id, client_name, status").eq("id", documentId).maybeSingle();
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  if (doc.status === "signed") return NextResponse.json({ error: "Already signed" }, { status: 409 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  const now = new Date().toISOString();

  const { error } = await admin.from(table).update({
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
  if (doc?.user_id) {
    await admin.from("notifications").insert({
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
