import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = getAdmin();
  const { data } = await db
    .from("workflow_automations")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = getAdmin();
  const body = await req.json();

  const allowed = ["name", "description", "enabled", "trigger_type", "conditions", "actions"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { data, error: updateErr } = await db
    .from("workflow_automations")
    .update(update)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = getAdmin();
  await db
    .from("workflow_automations")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
