import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { Plan } from "@/lib/plans";
import { getUserUsage } from "@/lib/usage";

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = await createClient();
  const [{ data: sub }, { data: profile }] = await Promise.all([
    db.from("subscriptions").select("plan").maybeSingle(),
    db.from("profiles").select("trial_ends_at").eq("id", user.id).maybeSingle(),
  ]);

  const plan = (sub?.plan ?? "free") as Plan;
  const usage = await getUserUsage(db, user.id, plan, profile?.trial_ends_at);

  return NextResponse.json(usage);
}
