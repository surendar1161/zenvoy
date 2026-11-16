"use client";

/**
 * Loads and edits the signed-in user's custom field definitions for projects or
 * tasks, with the plan limit. Definitions are private to the owner (RLS), and the
 * Free-plan limit is enforced in the database too; the checks here only give
 * friendly messages.
 */
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fieldLimitFor, isAtFieldLimit, isFieldLimitError, sanitizeDefinitionInput, sortedDefinitions,
  type CustomFieldDefinition, type DefinitionInput, type FieldEntity,
} from "@/lib/custom-fields";

export type FieldActionResult = { ok: true } | { ok: false; error: string; limitReached?: boolean };

export function useCustomFields(entity: FieldEntity) {
  const [defs, setDefs] = useState<CustomFieldDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number | "unlimited">(3);

  const reload = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const [{ data: rows }, { data: sub }, { data: profile }] = await Promise.all([
      supabase.from("custom_field_definitions").select("*").eq("entity", entity)
        .order("position").order("created_at"),
      supabase.from("subscriptions").select("plan").maybeSingle(),
      supabase.from("profiles").select("trial_ends_at").eq("id", user.id).maybeSingle(),
    ]);
    setDefs(sortedDefinitions((rows ?? []) as CustomFieldDefinition[]));
    setLimit(fieldLimitFor(sub?.plan ?? "free", profile?.trial_ends_at ?? null));
    setLoading(false);
  }, [entity]);

  useEffect(() => { reload(); }, [reload]);

  const atLimit = isAtFieldLimit(defs.length, limit);

  async function add(input: DefinitionInput): Promise<FieldActionResult> {
    const clean = sanitizeDefinitionInput(input);
    if (!clean.ok) return { ok: false, error: clean.error };
    if (atLimit) return { ok: false, error: "You have used all your custom fields on the Free plan.", limitReached: true };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "You are not signed in." };

    const position = defs.reduce((max, d) => Math.max(max, d.position), -1) + 1;
    const { data, error } = await supabase.from("custom_field_definitions")
      .insert({ ...clean.value, user_id: user.id, entity, position })
      .select().single();
    if (error) {
      if (isFieldLimitError(error.message)) {
        return { ok: false, error: "You have used all your custom fields on the Free plan.", limitReached: true };
      }
      if (error.code === "23505") return { ok: false, error: "You already have a field with that name." };
      return { ok: false, error: error.message };
    }
    setDefs(prev => sortedDefinitions([...prev, data as CustomFieldDefinition]));
    return { ok: true };
  }

  /** The type of an existing field cannot change, because stored values would no longer match. */
  async function update(id: string, input: Omit<DefinitionInput, "field_type">): Promise<FieldActionResult> {
    const current = defs.find(d => d.id === id);
    if (!current) return { ok: false, error: "That field no longer exists." };
    const clean = sanitizeDefinitionInput({ ...input, field_type: current.field_type });
    if (!clean.ok) return { ok: false, error: clean.error };

    const supabase = createClient();
    const { data, error } = await supabase.from("custom_field_definitions")
      .update({
        name: clean.value.name, options: clean.value.options,
        required: clean.value.required, show_in_list: clean.value.show_in_list,
      })
      .eq("id", id).select().single();
    if (error) {
      if (error.code === "23505") return { ok: false, error: "You already have a field with that name." };
      return { ok: false, error: error.message };
    }
    setDefs(prev => sortedDefinitions(prev.map(d => (d.id === id ? (data as CustomFieldDefinition) : d))));
    return { ok: true };
  }

  async function remove(id: string): Promise<FieldActionResult> {
    const supabase = createClient();
    const { error } = await supabase.from("custom_field_definitions").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    setDefs(prev => prev.filter(d => d.id !== id));
    return { ok: true };
  }

  /** Swap a field's position with its neighbour. */
  async function move(id: string, direction: -1 | 1): Promise<FieldActionResult> {
    const ordered = sortedDefinitions(defs);
    const i = ordered.findIndex(d => d.id === id);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= ordered.length) return { ok: true };
    const a = ordered[i];
    const b = ordered[j];
    const supabase = createClient();
    const [r1, r2] = await Promise.all([
      supabase.from("custom_field_definitions").update({ position: b.position }).eq("id", a.id),
      supabase.from("custom_field_definitions").update({ position: a.position }).eq("id", b.id),
    ]);
    if (r1.error || r2.error) return { ok: false, error: (r1.error ?? r2.error)!.message };
    await reload();
    return { ok: true };
  }

  return { defs, loading, limit, atLimit, add, update, remove, move, reload };
}

export type CustomFieldsApi = ReturnType<typeof useCustomFields>;
