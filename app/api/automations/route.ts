import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const MAX_AUTOMATIONS_PER_USER = 50;

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
  const { data } = await db
    .from("workflow_automations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = getAdmin();

  // Check limit
  const { count } = await db
    .from("workflow_automations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= MAX_AUTOMATIONS_PER_USER) {
    return NextResponse.json(
      { error: `Maximum ${MAX_AUTOMATIONS_PER_USER} automations allowed` },
      { status: 400 },
    );
  }

  const body = await req.json();
  const { name, description, trigger_type, conditions, actions, template_id } = body;

  if (!name || !trigger_type || !actions?.length) {
    return NextResponse.json({ error: "name, trigger_type, and actions are required" }, { status: 400 });
  }

  const { data, error: insertErr } = await db
    .from("workflow_automations")
    .insert({
      user_id: user.id,
      name,
      description: description ?? null,
      trigger_type,
      conditions: conditions ?? [],
      actions,
      template_id: template_id ?? null,
    })
    .select("*")
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
