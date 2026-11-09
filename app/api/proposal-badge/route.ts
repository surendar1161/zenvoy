import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { shouldShowBadge } from "@/lib/proposal-badge";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Public, read-only: tells the client proposal page whether to show the
 * "Made with DealPilot" badge. Returns only a boolean, never plan details.
 * Fails closed to "no badge" so a lookup problem never defaces a proposal.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!UUID.test(id)) return NextResponse.json({ showBadge: false });

  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data: proposal } = await db.from("proposals").select("user_id").eq("id", id).maybeSingle();
    if (!proposal?.user_id) return NextResponse.json({ showBadge: false });

    const [{ data: sub }, { data: profile }] = await Promise.all([
      db.from("subscriptions").select("plan").eq("user_id", proposal.user_id).maybeSingle(),
      db.from("profiles").select("trial_ends_at").eq("id", proposal.user_id).maybeSingle(),
    ]);
    // Without the service-role key, RLS hides these rows: treat "unknown" as no badge.
    if (!sub && !profile) return NextResponse.json({ showBadge: false });

    return NextResponse.json({ showBadge: shouldShowBadge(sub?.plan, profile?.trial_ends_at) });
  } catch {
    return NextResponse.json({ showBadge: false });
  }
}
