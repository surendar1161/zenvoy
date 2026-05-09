import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const db = getClient();

  const { data: portal } = await db
    .from("client_portals")
    .select("id, user_id, client_id, client_name")
    .eq("token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (!portal) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 });
  }

  let query = db
    .from("contracts")
    .select("id, contract_type_name, governing_law, party_a_name, party_a_role, party_b_name, party_b_role, contract_text, status, signed_at, signer_name, created_at, category")
    .eq("user_id", portal.user_id)
    .in("status", ["reviewed", "signed"]);

  if (portal.client_id) {
    query = query.eq("client_id", portal.client_id);
  } else if (portal.client_name) {
    query = query.ilike("party_b_name", `%${portal.client_name}%`);
  } else {
    return NextResponse.json([]);
  }

  const { data } = await query.order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}
