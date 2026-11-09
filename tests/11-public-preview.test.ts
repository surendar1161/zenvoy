import { describe, it, expect } from "vitest";
import { BRIEF_MAX, BRIEF_MIN, cleanBrief, clientIp, createLimiter } from "../lib/public-preview";

describe("cleanBrief", () => {
  it("rejects non-strings and short briefs", () => {
    expect(cleanBrief(undefined).ok).toBe(false);
    expect(cleanBrief("too short").ok).toBe(false);
  });
  it("rejects overlong briefs", () => {
    expect(cleanBrief("a".repeat(BRIEF_MAX + 1)).ok).toBe(false);
  });
  it("strips control characters and collapses blank lines", () => {
    const r = cleanBrief("Need a logo\u0000 for my bakery.\n\n\n\nBudget is open, start next month ok.");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.brief).not.toMatch(/\u0000/);
      expect(r.brief).not.toMatch(/\n{3,}/);
      expect(r.brief.length).toBeGreaterThanOrEqual(BRIEF_MIN);
    }
  });
});

describe("createLimiter", () => {
  it("allows up to the limit then blocks until the window resets", () => {
    let t = 0;
    const hit = createLimiter(2, 1000, () => t);
    expect(hit("a").allowed).toBe(true);
    expect(hit("a").allowed).toBe(true);
    const blocked = hit("a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBe(1);
    expect(hit("b").allowed).toBe(true);
    t = 1001;
    expect(hit("a").allowed).toBe(true);
  });
});

describe("clientIp", () => {
  const h = (m: Record<string, string>) => ({ get: (k: string) => m[k] ?? null });
  it("uses the first forwarded address", () => {
    expect(clientIp(h({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });
  it("falls back to x-real-ip then unknown", () => {
    expect(clientIp(h({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientIp(h({}))).toBe("unknown");
  });
});
