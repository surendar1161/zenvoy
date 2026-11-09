/**
 * Helpers for the no-login proposal preview (POST /api/public-preview).
 * Kept free of Next/AI imports so they can be unit-tested.
 */

export const BRIEF_MIN = 40;
export const BRIEF_MAX = 1500;

export type BriefCheck = { ok: true; brief: string } | { ok: false; error: string };

/** Trim, drop control characters, collapse blank-line runs, enforce length. */
export function cleanBrief(input: unknown): BriefCheck {
  if (typeof input !== "string") return { ok: false, error: "Paste a short brief first." };
  const brief = input
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (brief.length < BRIEF_MIN) {
    return { ok: false, error: `Add a little more detail (at least ${BRIEF_MIN} characters).` };
  }
  if (brief.length > BRIEF_MAX) {
    return { ok: false, error: `Keep the brief under ${BRIEF_MAX} characters.` };
  }
  return { ok: true, brief };
}

type Bucket = { count: number; resetAt: number };

/**
 * Fixed-window limiter. In-memory, so it is per server instance on Vercel:
 * a best-effort guard against casual abuse, not a hard guarantee.
 */
export function createLimiter(limit: number, windowMs: number, now: () => number = Date.now) {
  const buckets = new Map<string, Bucket>();
  return function hit(key: string): { allowed: boolean; retryAfterSec: number } {
    const t = now();
    if (buckets.size > 5000) {
      buckets.forEach((b, k) => { if (b.resetAt <= t) buckets.delete(k); });
    }
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= t) {
      buckets.set(key, { count: 1, resetAt: t + windowMs });
      return { allowed: true, retryAfterSec: 0 };
    }
    if (bucket.count >= limit) {
      return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - t) / 1000) };
    }
    bucket.count += 1;
    return { allowed: true, retryAfterSec: 0 };
  };
}

export function clientIp(headers: { get(name: string): string | null }): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim() || "unknown";
  return headers.get("x-real-ip")?.trim() || "unknown";
}
