import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Verify the request is authenticated via cookie session or Bearer token.
 * Returns the user or a 401 NextResponse.
 */
export async function requireAuth(req: NextRequest) {
  const supabase = await createClient();

  // Try cookie session first
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return { user, error: null };

  // Fallback: Bearer token header
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await admin.auth.getUser(auth.slice(7));
    if (data.user) return { user: data.user, error: null };
  }

  return {
    user: null,
    error: NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
  };
}
