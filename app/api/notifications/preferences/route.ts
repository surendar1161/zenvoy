import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = await createClient();
  let { data } = await db.from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) {
    const { data: created } = await db.from("notification_preferences")
      .insert({ user_id: user.id })
      .select("*")
      .single();
    data = created;
  }

  return NextResponse.json(data);
}

const ALLOWED_FIELDS = [
  "email_enabled", "proposal_viewed", "proposal_signed", "proposal_accepted",
  "proposal_declined", "proposal_follow_up", "invoice_sent", "invoice_paid",
  "invoice_overdue", "contract_signed", "payment_received", "payment_failed",
  "portal_file_uploaded", "portal_message_received", "portal_invoice_sent",
];

export async function PUT(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const body = await req.json();
  const update: Record<string, boolean> = {};
  for (const [key, val] of Object.entries(body)) {
    if (ALLOWED_FIELDS.includes(key) && typeof val === "boolean") {
      update[key] = val;
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const db = await createClient();

  const { data: existing } = await db.from("notification_preferences")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    await db.from("notification_preferences").insert({ user_id: user.id, ...update });
  } else {
    await db.from("notification_preferences").update(update).eq("user_id", user.id);
  }

  const { data } = await db.from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json(data);
}
