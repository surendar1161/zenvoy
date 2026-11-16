/**
 * Server-side helpers for the token-based client portal (/portal/[token]).
 *
 * Why this exists: since supabase/update-07-roles.sql the portal tables are
 * readable only by a signed-in account whose email matches the portal, so an
 * anonymous client holding the link cannot read them from the browser. These
 * helpers let API routes serve exactly one portal, looked up by its secret
 * token, using the service-role key on the server.
 *
 * Security rules for anything that uses this file:
 *  - Fail closed: if the service-role key is missing, do NOT fall back to the
 *    anon key (that silently returns "not found" and hides the misconfiguration).
 *  - Look up by token only, and never return user_id, client_email or storage_path.
 *  - Never add a public read policy to the portal tables instead of using this.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Portal tokens are URL-safe strings (32 hex characters in practice). */
const TOKEN_RE = /^[A-Za-z0-9_-]{16,128}$/;

export function isValidPortalToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_RE.test(value);
}

/** Trim and cap user text. Non-strings become an empty string. */
export function clampText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Escape a value for a case-insensitive exact match with ILIKE, so that a
 * client named "50%_off" matches only that name and not a wildcard pattern.
 */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, ch => `\\${ch}`);
}

/** Service-role client, or null when the server is not configured for it. */
export function getPortalAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
