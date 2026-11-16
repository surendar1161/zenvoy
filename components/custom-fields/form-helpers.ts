import dayjs from "dayjs";
import {
  extractFormValues, formKey, normalizeCustomFields,
  type CustomFieldDefinition, type CustomFieldValues,
} from "@/lib/custom-fields";

/** Stored values -> Ant Design form values (cf_<id>), with dates as dayjs objects. */
export function toFormValues(
  defs: CustomFieldDefinition[],
  stored: CustomFieldValues | null | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const def of defs) {
    const v = stored?.[def.id];
    if (v === undefined || v === null) continue;
    out[formKey(def.id)] = def.field_type === "date" && typeof v === "string" ? dayjs(v) : v;
  }
  return out;
}

/** Form values -> what is saved in the custom_fields column. */
export function fromFormValues(
  defs: CustomFieldDefinition[],
  formValues: Record<string, unknown>,
): CustomFieldValues {
  const raw = extractFormValues(formValues);
  for (const key of Object.keys(raw)) {
    const v = raw[key];
    if (dayjs.isDayjs(v)) raw[key] = v.format("YYYY-MM-DD");
  }
  return normalizeCustomFields(defs, raw);
}

/** The cf_<id> form field names, so they can be cleared when a form is reset. */
export function formFieldNames(defs: CustomFieldDefinition[]): string[] {
  return defs.map(d => formKey(d.id));
}
