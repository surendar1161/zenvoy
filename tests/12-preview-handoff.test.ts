import { describe, it, expect } from "vitest";
import { HANDOFF_KEY, HANDOFF_TTL_MS, clearHandoff, loadHandoff, saveHandoff } from "../lib/preview-handoff";

function memoryStore() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    raw: m,
  };
}

const sample = { slug: "logo-design-proposal", projectType: "logo design", brief: "Need a logo for a new bakery, start next month." };

describe("preview handoff", () => {
  it("round-trips a saved brief", () => {
    const s = memoryStore();
    saveHandoff(sample, s, 1000);
    expect(loadHandoff(s, 2000)).toMatchObject(sample);
  });

  it("expires after the TTL and removes the entry", () => {
    const s = memoryStore();
    saveHandoff(sample, s, 0);
    expect(loadHandoff(s, HANDOFF_TTL_MS + 1)).toBeNull();
    expect(s.raw.has(HANDOFF_KEY)).toBe(false);
  });

  it("drops malformed or wrong-version data", () => {
    const s = memoryStore();
    s.setItem(HANDOFF_KEY, "{not json");
    expect(loadHandoff(s)).toBeNull();
    s.setItem(HANDOFF_KEY, JSON.stringify({ v: 2, brief: "x" }));
    expect(loadHandoff(s)).toBeNull();
    expect(s.raw.has(HANDOFF_KEY)).toBe(false);
  });

  it("clear removes it, and a missing store never throws", () => {
    const s = memoryStore();
    saveHandoff(sample, s);
    clearHandoff(s);
    expect(loadHandoff(s)).toBeNull();
    expect(() => saveHandoff(sample, null)).not.toThrow();
    expect(loadHandoff(null)).toBeNull();
  });
});
