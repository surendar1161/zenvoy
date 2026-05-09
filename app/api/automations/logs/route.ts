import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const db = await createClient();
  const { data, count } = await db
    .from("automation_logs")
    .select("*, workflow_automations(name)", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return NextResponse.json({ logs: data ?? [], total: count ?? 0 });
}
