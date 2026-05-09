import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  const db = await createClient();
  const { data } = await db.from("bookings").select("*, clients(name)").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const db = await createClient();

  const allowed = ["title", "description", "scheduled_at", "duration_minutes", "timezone", "status", "meeting_link", "meeting_platform", "client_name", "client_email", "notes"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { data, error: updateErr } = await db.from("bookings")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const { id } = await params;
  const db = await createClient();
  await db.from("bookings").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
