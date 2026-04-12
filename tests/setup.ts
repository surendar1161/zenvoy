import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://ubutaehhczggyhyjgqjp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidXRhZWhoY3pnZ3loeWpncWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjcwNjcsImV4cCI6MjA5MTMwMzA2N30.V44I9WPTDB8HucV7IPBiP5PVHI1uZq3LWHR1VWqgTek";

// Freelancer — full dashboard access
export const FREELANCER_EMAIL    = "surendar1160+1@gmail.com";
export const FREELANCER_PASSWORD = process.env.FREELANCER_PASSWORD ?? "";

// Client — portal-only access
export const CLIENT_EMAIL    = "surendar1160+2@gmail.com";
export const CLIENT_PASSWORD = process.env.CLIENT_PASSWORD ?? "";

export function makeClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON);
}

export async function signInFreelancer() {
  const sb = makeClient();
  const { data, error } = await sb.auth.signInWithPassword({
    email: FREELANCER_EMAIL, password: FREELANCER_PASSWORD,
  });
  if (error) throw new Error(`Freelancer auth failed: ${error.message} — set FREELANCER_PASSWORD`);
  console.log(`  🔐 Freelancer signed in: ${data.user?.email}`);
  return sb;
}

export async function signInClient() {
  const sb = makeClient();
  const { data, error } = await sb.auth.signInWithPassword({
    email: CLIENT_EMAIL, password: CLIENT_PASSWORD,
  });
  if (error) throw new Error(`Client auth failed: ${error.message} — set CLIENT_PASSWORD`);
  console.log(`  🔐 Client signed in: ${data.user?.email}`);
  return sb;
}

export const RUN_ID = Date.now().toString(36).toUpperCase();
export function uid(prefix: string) { return `${prefix}_${RUN_ID}`; }
