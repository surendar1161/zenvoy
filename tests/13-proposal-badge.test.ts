import { describe, it, expect } from "vitest";
import { shouldShowBadge } from "../lib/proposal-badge";

const future = new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString();
const past = new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString();

describe("shouldShowBadge", () => {
  it("shows for free users with no trial or an expired trial", () => {
    expect(shouldShowBadge("free", null)).toBe(true);
    expect(shouldShowBadge(undefined, undefined)).toBe(true);
    expect(shouldShowBadge("free", past)).toBe(true);
  });
  it("hides for paid plans and for an active trial", () => {
    expect(shouldShowBadge("pro", null)).toBe(false);
    expect(shouldShowBadge("business", past)).toBe(false);
    expect(shouldShowBadge("free", future)).toBe(false);
  });
});
