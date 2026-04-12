import { createClient } from "npm:@supabase/supabase-js@2";

/** Admin client (bypasses RLS) — use only in webhook handlers */
export function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

/** User-scoped client (respects RLS) — pass the JWT from the request */
export function userClient(jwt: string) {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } },
  );
}

/** Extract and verify the user's JWT from the Authorization header */
export function extractJwt(req: Request): string | null {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
