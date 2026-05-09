import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const token = formData.get("token") as string | null;
  const category = (formData.get("category") as string) || "general";
  const clientName = (formData.get("clientName") as string) || "Client";

  if (!file || !token) {
    return NextResponse.json({ error: "file and token are required" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds 25 MB limit" }, { status: 400 });
  }

  const db = getClient();

  const { data: portal } = await db
    .from("client_portals")
    .select("id, user_id, client_name, client_email, title")
    .eq("token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (!portal) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const storagePath = `${portal.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await db.storage
    .from("portal-files")
    .upload(storagePath, buf, { contentType: file.type });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: urlData } = db.storage.from("portal-files").getPublicUrl(storagePath);

  const { data: record, error: insertErr } = await db
    .from("portal_files")
    .insert({
      portal_id: portal.id,
      user_id: portal.user_id,
      name: file.name,
      original_name: file.name,
      size_bytes: file.size,
      mime_type: file.type,
      storage_path: storagePath,
      storage_url: urlData.publicUrl,
      category,
      uploaded_by: "client",
      approval_status: "pending",
    })
    .select("*")
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  await db.from("portal_activity").insert({
    portal_id: portal.id,
    actor: "client",
    actor_name: clientName,
    event_type: "file_uploaded",
    description: `Uploaded ${file.name}`,
    meta: { fileId: record.id, fileName: file.name, category },
  });

  // Fire notification to freelancer (non-blocking)
  fetch(new URL("/api/portal/notify", req.url).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      event: "client_file_uploaded",
      data: { fileName: file.name, clientName },
    }),
  }).catch(() => {});

  return NextResponse.json(record, { status: 201 });
}
