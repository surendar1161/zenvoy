import { describe, it, expect } from "vitest";
import {
  extractFormValues, fieldLimitFor, formatFieldValue, formKey, isAtFieldLimit, isFieldLimitError,
  normalizeCustomFields, sanitizeDefinitionInput, sortedDefinitions, validateFieldValue,
  type CustomFieldDefinition,
} from "../lib/custom-fields";

// Pure unit tests: no Supabase or network needed.
const def = (over: Partial<CustomFieldDefinition>): CustomFieldDefinition => ({
  id: "f1", entity: "project", name: "Field", field_type: "text", options: [],
  required: false, show_in_list: true, position: 0, ...over,
});

describe("fieldLimitFor / isAtFieldLimit", () => {
  const future = new Date(Date.now() + 5 * 86400000).toISOString();
  const past = new Date(Date.now() - 5 * 86400000).toISOString();
  it("free users get 3, paid and trial users are unlimited", () => {
    expect(fieldLimitFor("free", null)).toBe(3);
    expect(fieldLimitFor("free", past)).toBe(3);
    expect(fieldLimitFor("free", future)).toBe("unlimited");
    expect(fieldLimitFor("pro", null)).toBe("unlimited");
    expect(fieldLimitFor("business", null)).toBe("unlimited");
  });
  it("reports when the limit is reached", () => {
    expect(isAtFieldLimit(2, 3)).toBe(false);
    expect(isAtFieldLimit(3, 3)).toBe(true);
    expect(isAtFieldLimit(99, "unlimited")).toBe(false);
  });
  it("recognises the database limit error", () => {
    expect(isFieldLimitError("custom_field_limit: Free plan allows 3")).toBe(true);
    expect(isFieldLimitError("something else")).toBe(false);
    expect(isFieldLimitError(undefined)).toBe(false);
  });
});

describe("sanitizeDefinitionInput", () => {
  it("trims the name and keeps simple types without options", () => {
    const r = sanitizeDefinitionInput({ name: "  PO number  ", field_type: "text", options: ["x"] });
    expect(r.ok && r.value).toMatchObject({ name: "PO number", options: [], required: false, show_in_list: true });
  });
  it("rejects empty and over-long names", () => {
    expect(sanitizeDefinitionInput({ name: "   ", field_type: "text" }).ok).toBe(false);
    expect(sanitizeDefinitionInput({ name: "x".repeat(61), field_type: "text" }).ok).toBe(false);
  });
  it("dropdowns need two distinct choices; duplicates and blanks are removed", () => {
    expect(sanitizeDefinitionInput({ name: "Stage", field_type: "select", options: ["A"] }).ok).toBe(false);
    expect(sanitizeDefinitionInput({ name: "Stage", field_type: "select", options: ["A", "a", " "] }).ok).toBe(false);
    const r = sanitizeDefinitionInput({ name: "Stage", field_type: "select", options: ["Design", " Build ", "design", ""] });
    expect(r.ok && r.value.options).toEqual(["Design", "Build"]);
  });
  it("a checkbox is never required", () => {
    const r = sanitizeDefinitionInput({ name: "Billable", field_type: "checkbox", required: true });
    expect(r.ok && r.value.required).toBe(false);
  });
});

describe("validateFieldValue", () => {
  it("enforces required for non-checkbox fields", () => {
    expect(validateFieldValue(def({ required: true }), "")).toMatch(/required/);
    expect(validateFieldValue(def({ required: false }), "")).toBeNull();
    expect(validateFieldValue(def({ field_type: "checkbox", required: true }), undefined)).toBeNull();
  });
  it("checks numbers, dates and dropdown choices", () => {
    expect(validateFieldValue(def({ field_type: "number" }), "abc")).toMatch(/number/);
    expect(validateFieldValue(def({ field_type: "number" }), "12.5")).toBeNull();
    expect(validateFieldValue(def({ field_type: "date" }), "2026-02-30")).toMatch(/date/);
    expect(validateFieldValue(def({ field_type: "date" }), "2026-02-28")).toBeNull();
    const sel = def({ field_type: "select", options: ["A", "B"] });
    expect(validateFieldValue(sel, "C")).toMatch(/choices/);
    expect(validateFieldValue(sel, "A")).toBeNull();
  });
  it("caps text length", () => {
    expect(validateFieldValue(def({}), "x".repeat(501))).toMatch(/up to/);
  });
});

describe("normalizeCustomFields", () => {
  const defs = [
    def({ id: "t", field_type: "text" }),
    def({ id: "n", field_type: "number" }),
    def({ id: "d", field_type: "date" }),
    def({ id: "s", field_type: "select", options: ["A", "B"] }),
    def({ id: "c", field_type: "checkbox" }),
  ];
  it("keeps valid values with the right types and drops empties, bad values and unknown keys", () => {
    const out = normalizeCustomFields(defs, {
      t: "  hello ", n: "42", d: "2026-11-16T10:00:00.000Z", s: "B", c: true, gone: "old",
    });
    expect(out).toEqual({ t: "hello", n: 42, d: "2026-11-16", s: "B", c: true });
    expect(normalizeCustomFields(defs, { t: "", n: "x", d: "nope", s: "Z", c: false })).toEqual({});
    expect(normalizeCustomFields(defs, null)).toEqual({});
  });
});

describe("formatFieldValue", () => {
  it("formats each type for display", () => {
    expect(formatFieldValue(def({ field_type: "checkbox" }), true)).toBe("Yes");
    expect(formatFieldValue(def({ field_type: "checkbox" }), undefined)).toBe("No");
    expect(formatFieldValue(def({ field_type: "number" }), 1234.5)).toBe("1,234.5");
    expect(formatFieldValue(def({ field_type: "date" }), "2026-11-16")).toBe("Nov 16, 2026");
    expect(formatFieldValue(def({ field_type: "text" }), undefined)).toBe("");
  });
});

describe("helpers", () => {
  it("sorts by position then name and can filter by entity", () => {
    const list = [
      def({ id: "b", name: "B", position: 1 }),
      def({ id: "a", name: "A", position: 1 }),
      def({ id: "z", name: "Z", position: 0, entity: "task" }),
    ];
    expect(sortedDefinitions(list, "project").map(d => d.id)).toEqual(["a", "b"]);
    expect(sortedDefinitions(list).map(d => d.id)).toEqual(["z", "a", "b"]);
  });
  it("round-trips form keys", () => {
    expect(formKey("abc")).toBe("cf_abc");
    expect(extractFormValues({ name: "x", cf_abc: 1, cf_def: "y" })).toEqual({ abc: 1, def: "y" });
  });
});
