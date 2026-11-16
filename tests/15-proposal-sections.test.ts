import { describe, it, expect } from "vitest";
import { parseSections } from "../lib/proposal-sections";

// Pure unit tests: no Supabase or network needed.
describe("parseSections", () => {
  it("splits on ## headings and keeps ### inside the section (old behaviour)", () => {
    const md = "## Scope\nBuild it.\n### Detail\nMore.\n## Price\nUSD 5,000";
    const s = parseSections(md);
    expect(s.map(x => x.title)).toEqual(["Scope", "Price"]);
    expect(s[0].content).toContain("### Detail");
  });

  it("falls back to ### headings when the AI uses them (the blank client page bug)", () => {
    const md = [
      "---", "**Proposal for X**", "---",
      "### 1. Executive Summary", "Dear Priya, hello.", "---",
      "### 2. Deliverables", "- audit", "- 8 posts",
    ].join("\n");
    const s = parseSections(md);
    expect(s.map(x => x.title)).toEqual(["1. Executive Summary", "2. Deliverables"]);
    expect(s[0].content).toBe("Dear Priya, hello.");
    expect(s[1].content).toContain("8 posts");
  });

  it("returns the whole text as one untitled section when there are no headings", () => {
    const s = parseSections("Just a paragraph with no headings.");
    expect(s).toHaveLength(1);
    expect(s[0].title).toBe("");
    expect(s[0].heading).toBe("");
    expect(s[0].content).toBe("Just a paragraph with no headings.");
  });

  it("returns nothing for empty text", () => {
    expect(parseSections("")).toEqual([]);
    expect(parseSections("   \n  ")).toEqual([]);
  });
});
