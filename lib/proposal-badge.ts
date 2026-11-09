import { hasProAccess } from "./trial";

/**
 * The "Made with DealPilot" badge on client-facing proposals is removed by the
 * Pro white-label feature. Same access rule as the rest of the app: paid
 * Pro/Business, or an active trial, hides it.
 */
export function shouldShowBadge(
  plan: string | null | undefined,
  trialEndsAt: string | null | undefined,
): boolean {
  return !hasProAccess(plan ?? "free", trialEndsAt);
}

export const BADGE_HREF = "/sign-up?source=proposal-badge";
