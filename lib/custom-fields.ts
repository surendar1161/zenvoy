/**
 * Custom fields for projects and tasks: types, validation, normalising and display.
 *
 * Pure functions with no UI or network code, so they can be unit tested. Field
 * definitions live in the custom_field_definitions table; values live in the
 * custom_fields jsonb column on projects and tasks, keyed by definition id
 * (so renaming a field never loses data). Values are private to the owner:
 * never select them in client-facing code.
 */
import { hasProAccess } from "./trial";

export type FieldType = "text" | "number" | "date" | "select" | "checkbox";
export type FieldEntity = "project" | "task";

export interface CustomFieldDefinition {
  id: string;
  entity: FieldEntity;
  name: string;
  field_type: FieldType;
  /** Choices for a dropdown field. Empty for other types. */
  options: string[];
  required: boolean;
  /** Show as a column in the project or task table. */
  show_in_list: boolean;
  position: number;
}

/** Stored values: definition id -> value. Dates are "YYYY-MM-DD". */
export type CustomFieldValues = Record<string, string | number | boolean>;

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox (yes / no)" },
];

export const FREE_FIELD_LIMIT = 3;
export const MAX_NAME_LENGTH = 60;
export const MAX_OPTIONS = 20;
export const MAX_OPTION_LENGTH = 50;
export const MAX_TEXT_LENGTH = 500;

/** Error text the database trigger raises when the free limit is hit. */
export const FIELD_LIMIT_ERROR_PREFIX = "custom_field_limit";

/** How many fields per type (projects, tasks) this user may define. */
export function fieldLimitFor(plan: string, trialEndsAt: string | null | undefined): number | "unlimited" {
  return hasProAccess(plan, trialEndsAt) ? "unlimited" : FREE_FIELD_LIMIT;
}

export function isAtFieldLimit(count: number, limit: number | "unlimited"): boolean {
  return limit !== "unlimited" && count >= limit;
}

export function isFieldLimitError(message: string | null | undefined): boolean {
  return !!message && message.includes(FIELD_LIMIT_ERROR_PREFIX);
}

export interface DefinitionInput {
  name: string;
  field_type: FieldType;
  options?: string[];
  required?: boolean;
  show_in_list?: boolean;
}

export type SanitizeResult =
  | { ok: true; value: Required<DefinitionInput> }
  | { ok: false; error: string };

/** Trim and validate a field definition coming from the "Manage fields" form. */
export function sanitizeDefinitionInput(input: DefinitionInput): SanitizeResult {
  const name = (input.name ?? "").trim();
  if (!name) return { ok: false, error: "Give the field a name." };
  if (name.length > MAX_NAME_LENGTH) return { ok: false, error: `Field names can be up to ${MAX_NAME_LENGTH} characters.` };
  if (!FIELD_TYPES.some(t => t.value === input.field_type)) return { ok: false, error: "Pick a field type." };

  let options: string[] = [];
  if (input.field_type === "select") {
    const seen = new Set<string>();
    for (const raw of input.options ?? []) {
      const opt = (raw ?? "").trim();
      if (!opt) continue;
      if (opt.length > MAX_OPTION_LENGTH) return { ok: false, error: `Each choice can be up to ${MAX_OPTION_LENGTH} characters.` };
      const key = opt.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      options.push(opt);
    }
    if (options.length < 2) return { ok: false, error: "A dropdown needs at least two choices." };
    if (options.length > MAX_OPTIONS) return { ok: false, error: `A dropdown can have up to ${MAX_OPTIONS} choices.` };
  } else {
    options = [];
  }

  return {
    ok: true,
    value: {
      name,
      field_type: input.field_type,
      options,
      // A required checkbox would force "yes", which is never what is meant.
      required: input.field_type === "checkbox" ? false : !!input.required,
      show_in_list: input.show_in_list !== false,
    },
  };
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})/;

/** Returns "YYYY-MM-DD" for a valid date string, otherwise null. */
function toIsoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const m = value.match(ISO_DATE);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
}

/** Error message for one value, or null when it is fine. */
export function validateFieldValue(def: CustomFieldDefinition, value: unknown): string | null {
  if (def.field_type === "checkbox") return null;
  if (isEmpty(value)) return def.required ? `${def.name} is required.` : null;

  switch (def.field_type) {
    case "text":
      return typeof value === "string" && value.length > MAX_TEXT_LENGTH
        ? `${def.name} can be up to ${MAX_TEXT_LENGTH} characters.` : null;
    case "number": {
      const n = typeof value === "number" ? value : Number(value);
      return Number.isFinite(n) ? null : `${def.name} must be a number.`;
    }
    case "date":
      return toIsoDate(value) ? null : `${def.name} must be a valid date.`;
    case "select":
      return typeof value === "string" && def.options.includes(value) ? null : `Pick one of the choices for ${def.name}.`;
    default:
      return null;
  }
}

/**
 * Turn raw form values into what is stored: only known fields, correctly typed,
 * with empty values left out. Unknown keys (deleted fields) are dropped.
 */
export function normalizeCustomFields(
  defs: CustomFieldDefinition[],
  raw: Record<string, unknown> | null | undefined,
): CustomFieldValues {
  const out: CustomFieldValues = {};
  const source = raw ?? {};
  for (const def of defs) {
    const value = source[def.id];
    if (def.field_type === "checkbox") {
      if (value === true) out[def.id] = true;
      continue;
    }
    if (isEmpty(value) || validateFieldValue(def, value)) continue;
    switch (def.field_type) {
      case "text": out[def.id] = (value as string).trim(); break;
      case "number": out[def.id] = typeof value === "number" ? value : Number(value); break;
      case "date": out[def.id] = toIsoDate(value) as string; break;
      case "select": out[def.id] = value as string; break;
    }
  }
  return out;
}

/** Text shown in tables and chips. Empty string when the field has no value. */
export function formatFieldValue(def: CustomFieldDefinition, value: unknown): string {
  if (def.field_type === "checkbox") return value === true ? "Yes" : "No";
  if (isEmpty(value)) return "";
  switch (def.field_type) {
    case "number": {
      const n = typeof value === "number" ? value : Number(value);
      return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 6 }) : String(value);
    }
    case "date": {
      const iso = toIsoDate(value);
      if (!iso) return String(value);
      const [y, m, d] = iso.split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    }
    default:
      return String(value);
  }
}

/** Definitions for one entity, in display order. */
export function sortedDefinitions(defs: CustomFieldDefinition[], entity?: FieldEntity): CustomFieldDefinition[] {
  return defs
    .filter(d => !entity || d.entity === entity)
    .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
}

/** Form field name used for a definition inside an Ant Design form. */
export function formKey(defId: string): string {
  return `cf_${defId}`;
}

/** Collect the cf_<id> entries from form values into { <id>: value }. */
export function extractFormValues(values: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(values)) {
    if (key.startsWith("cf_")) out[key.slice(3)] = val;
  }
  return out;
}
