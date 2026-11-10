import { describe, it, expect } from "vitest";
import { DEFAULT_GTM_ID, isValidGtmId, resolveGtmId } from "../lib/gtm";

describe("gtm helpers", () => {
  it("accepts only well-formed container ids", () => {
    expect(isValidGtmId("GTM-PW6H8RDZ")).toBe(true);
    expect(isValidGtmId("G-ABC123")).toBe(false);
    expect(isValidGtmId("GTM-')+alert(1)//")).toBe(false);
    expect(isValidGtmId(undefined)).toBe(false);
  });
  it("does not load in development", () => {
    expect(resolveGtmId(undefined, "development")).toBeNull();
  });
  it("falls back to the default id, or the env override when valid", () => {
    expect(resolveGtmId(undefined, "production")).toBe(DEFAULT_GTM_ID);
    expect(resolveGtmId("", "production")).toBe(DEFAULT_GTM_ID);
    expect(resolveGtmId("GTM-ABCD1234", "production")).toBe("GTM-ABCD1234");
  });
  it("refuses an unsafe or malformed env id instead of injecting it", () => {
    expect(resolveGtmId("GTM-')+alert(1)//", "production")).toBeNull();
    expect(resolveGtmId("not-an-id", "production")).toBeNull();
  });
});
