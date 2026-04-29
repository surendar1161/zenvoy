/**
 * Feature flag helper.
 * Checks the feature_flags table — if a row exists for (feature, email) → enabled.
 * If a row exists with email=NULL → enabled for everyone.
 */
import { createClient } from "@/lib/supabase/client";

// Emails that have all beta features enabled (hard-coded safety net)
const BETA_EMAILS = ["surendar1160@gmail.com"];

export async function isFeatureEnabled(feature: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return false;

  // Hard-coded beta override
  if (BETA_EMAILS.includes(user.email)) return true;

  // Check DB flag
  const { data } = await supabase
    .from("feature_flags")
    .select("enabled")
    .eq("feature", feature)
    .or(`email.eq.${user.email},email.is.null`)
    .eq("enabled", true)
    .maybeSingle();

  return !!data;
}
