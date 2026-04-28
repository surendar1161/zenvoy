import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, source = "lead_magnet", magnet = "proposal_templates" } = await req.json().catch(() => ({}));

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("lead_captures").upsert({
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      source,
      magnet,
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
      user_agent: req.headers.get("user-agent") || null,
    }, { onConflict: "email" });

    if (error) {
      console.error("[lead-magnet]", error.message);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("[lead-magnet]", err?.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
