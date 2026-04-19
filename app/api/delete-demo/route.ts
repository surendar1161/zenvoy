import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { createClient as createAdmin } from "@supabase/supabase-js";

function admin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;
  const userId = user.id;
  const db = admin();

  // Check they actually have demo data
  const { data: profile } = await db.from("profiles").select("has_demo_data").eq("id", userId).maybeSingle();
  if (!profile?.has_demo_data) {
    return NextResponse.json({ ok: true, message: "No demo data to delete" });
  }

  // Delete in reverse dependency order
  await db.from("time_entries").delete().eq("user_id", userId);
  await db.from("project_messages").delete().eq("user_id", userId);
  await db.from("project_files").delete().eq("user_id", userId);
  await db.from("tasks").delete().eq("user_id", userId);
  await db.from("projects").delete().eq("user_id", userId);
  await db.from("portal_messages").delete().in("portal_id",
    (await db.from("client_portals").select("id").eq("user_id", userId)).data?.map(p => p.id) ?? []
  );
  await db.from("portal_files").delete().in("portal_id",
    (await db.from("client_portals").select("id").eq("user_id", userId)).data?.map(p => p.id) ?? []
  );
  await db.from("portal_invoices").delete().eq("user_id", userId);
  await db.from("client_portals").delete().eq("user_id", userId);
  await db.from("invoices").delete().eq("user_id", userId);
  await db.from("contracts").delete().eq("user_id", userId);
  await db.from("proposals").delete().eq("user_id", userId);
  await db.from("clients").delete().eq("user_id", userId);
  await db.from("content_library").delete().eq("user_id", userId);

  // Clear the flag
  await db.from("profiles").update({
    has_demo_data: false,
    demo_seeded_at: null,
  }).eq("id", userId);

  return NextResponse.json({ ok: true, message: "Demo data deleted" });
}
