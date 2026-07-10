import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isChargebeeConfigured, validateChargebeePlanConfig } from "@/lib/chargebee";

const SITE = process.env.CHARGEBEE_SITE ?? "";
const API_KEY = process.env.CHARGEBEE_API_KEY ?? "";

/** GET /api/chargebee/validate-config — lists configured vs actual Chargebee item price IDs */
export async function GET() {
  if (!isChargebeeConfigured) {
    return NextResponse.json({ error: "Chargebee not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const report = await validateChargebeePlanConfig(SITE, API_KEY);

  return NextResponse.json({
    ok: report.missing.length === 0,
    ...report,
    fix:
      report.missing.length > 0
        ? "Create USD price points in Chargebee (Plans → Pricing → Set Price) or update CHARGEBEE_*_PLAN_ID in Vercel to match active_item_prices IDs."
        : "All configured item price IDs exist in Chargebee.",
  });
}
