import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = getAdmin();
  const tab = req.nextUrl.searchParams.get("tab") ?? "upcoming";
  const now = new Date().toISOString();

  let query = db.from("bookings").select("*, clients(name)").eq("user_id", user.id);

  if (tab === "upcoming") {
    query = query.or(`scheduled_at.gte.${now},scheduled_at.is.null`).in("status", ["pending", "confirmed"]).order("scheduled_at", { ascending: true });
  } else {
    query = query.or(`status.in.(completed,cancelled,no_show),scheduled_at.lt.${now}`).order("scheduled_at", { ascending: false });
  }

  const { data } = await query.limit(100);
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const db = getAdmin();

  const { data, error: insertErr } = await db.from("bookings").insert({
    user_id: user.id,
    client_id: body.client_id ?? null,
    proposal_id: body.proposal_id ?? null,
    portal_id: body.portal_id ?? null,
    title: body.title ?? "Meeting",
    description: body.description ?? null,
    scheduled_at: body.scheduled_at ?? null,
    duration_minutes: body.duration_minutes ?? 30,
    timezone: body.timezone ?? null,
    status: body.status ?? "pending",
    meeting_link: body.meeting_link ?? null,
    meeting_platform: body.meeting_platform ?? null,
    client_name: body.client_name ?? null,
    client_email: body.client_email ?? null,
    notes: body.notes ?? null,
    source: body.source ?? "manual",
  }).select("*").single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
