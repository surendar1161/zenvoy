import { describe, it, expect, afterEach } from "vitest";
import { clampText, getPortalAdminClient, isValidPortalToken } from "../lib/portal-server";

// Pure unit tests: no Supabase or network needed.
describe("isValidPortalToken", () => {
  it("accepts the 32-character hex tokens portals use", () => {
    expect(isValidPortalToken("079df2cb0ed74fec938ecf8e89c83367")).toBe(true);
  });
  it("accepts URL-safe tokens", () => {
    expect(isValidPortalToken("Abc_def-123456789012")).toBe(true);
  });
  it("rejects short, empty, non-string and odd-character values", () => {
    for (const bad of ["", "deadbeef", null, undefined, 123, "has space 12345678901234", "a;drop table x;--aaaaaaaa", "x".repeat(129)]) {
      expect(isValidPortalToken(bad)).toBe(false);
    }
  });
});

describe("clampText", () => {
  it("trims and caps length", () => {
    expect(clampText("  hello  ", 100)).toBe("hello");
    expect(clampText("abcdef", 3)).toBe("abc");
  });
  it("returns an empty string for non-strings", () => {
    expect(clampText(undefined, 10)).toBe("");
    expect(clampText(42, 10)).toBe("");
  });
});

describe("getPortalAdminClient", () => {
  const saved = { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = saved.url;
    process.env.SUPABASE_SERVICE_ROLE_KEY = saved.key;
    if (saved.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (saved.key === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it("fails closed (null) when the service-role key is missing, even if an anon key exists", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key-should-not-be-used";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(getPortalAdminClient()).toBeNull();
  });

  it("returns a client when both URL and service-role key are set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test-value";
    expect(getPortalAdminClient()).not.toBeNull();
  });
});
