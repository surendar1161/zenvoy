import { createClient } from "@supabase/supabase-js";
import { executeAction } from "./actions";

const MAX_DEPTH = 3;
const MAX_DAILY_EXECUTIONS = 100;

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

interface Condition {
  field: string;
  operator: "eq" | "neq" | "gt" | "lt" | "contains" | "exists";
  value?: unknown;
}

function evaluateConditions(conditions: Condition[], data: Record<string, unknown>): boolean {
  for (const c of conditions) {
    const val = data[c.field];
    switch (c.operator) {
      case "eq":       if (val !== c.value) return false; break;
      case "neq":      if (val === c.value) return false; break;
      case "gt":       if (Number(val) <= Number(c.value)) return false; break;
      case "lt":       if (Number(val) >= Number(c.value)) return false; break;
      case "contains": if (!String(val).includes(String(c.value))) return false; break;
      case "exists":   if (val == null || val === "") return false; break;
    }
  }
  return true;
}

export async function executeAutomations(
  userId: string,
  triggerType: string,
  triggerData: Record<string, unknown>,
  depth = 0,
): Promise<void> {
  if (depth > MAX_DEPTH) {
    console.warn(`[automations] Max depth exceeded for user ${userId}, trigger ${triggerType}`);
    return;
  }

  const db = getAdmin();

  // Rate limit check
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const { count: todayCount } = await db
    .from("automation_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", dayStart.toISOString());

  if ((todayCount ?? 0) >= MAX_DAILY_EXECUTIONS) {
    console.warn(`[automations] Daily limit reached for user ${userId}`);
    return;
  }

  // Find matching automations
  const { data: automations } = await db
    .from("workflow_automations")
    .select("*")
    .eq("user_id", userId)
    .eq("trigger_type", triggerType)
    .eq("enabled", true)
    .limit(50);

  if (!automations?.length) return;

  for (const auto of automations) {
    const startMs = Date.now();
    const conditions = (auto.conditions ?? []) as Condition[];
    const actions = (auto.actions ?? []) as { type: string; config: Record<string, unknown> }[];

    if (!evaluateConditions(conditions, triggerData)) continue;

    const results: { type: string; success: boolean; error?: string }[] = [];
    let hasFailure = false;

    for (const action of actions) {
      try {
        const result = await executeAction(userId, action, triggerData);
        results.push(result);
        if (!result.success) hasFailure = true;
      } catch (err) {
        results.push({ type: action.type, success: false, error: (err as Error).message });
        hasFailure = true;
      }
    }

    const allFailed = results.every(r => !r.success);
    const status = allFailed ? "failed" : hasFailure ? "partial" : "success";
    const durationMs = Date.now() - startMs;

    // Log execution
    await db.from("automation_logs").insert({
      automation_id: auto.id,
      user_id: userId,
      trigger_type: triggerType,
      trigger_data: triggerData,
      actions_executed: results,
      status,
      error_message: allFailed ? results.map(r => r.error).filter(Boolean).join("; ") : null,
      duration_ms: durationMs,
    });

    // Update automation stats
    await db.from("workflow_automations")
      .update({
        last_triggered_at: new Date().toISOString(),
        trigger_count: (auto.trigger_count ?? 0) + 1,
      })
      .eq("id", auto.id);
  }
}
