import type { SupabaseClient } from "@supabase/supabase-js";
import type { Plan } from "@/lib/plans";
import { getPlan } from "@/lib/plans";
import { hasProAccess } from "@/lib/trial";

export interface UsageItem {
  used: number;
  limit: number | "unlimited";
}

export interface UsageSummary {
  plan: Plan;
  hasUnlimitedUsage: boolean;
  periodLabel: string;
  proposals: UsageItem;
  contracts: UsageItem;
  teamMembers: UsageItem;
}

export function getCurrentMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function getUsagePeriodLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function hasUnlimitedUsage(plan: string, trialEndsAt: string | null | undefined): boolean {
  return hasProAccess(plan, trialEndsAt);
}

export async function getUserUsage(
  db: SupabaseClient,
  userId: string,
  plan: Plan,
  trialEndsAt: string | null | undefined,
): Promise<UsageSummary> {
  const monthStart = getCurrentMonthStart().toISOString();
  const unlimited = hasUnlimitedUsage(plan, trialEndsAt);
  const planConfig = getPlan(plan);

  const [
    { count: proposalCount },
    { count: contractCount },
    { count: teamCount },
  ] = await Promise.all([
    db.from("proposals").select("id", { count: "exact", head: true })
      .eq("user_id", userId).gte("created_at", monthStart),
    db.from("contracts").select("id", { count: "exact", head: true })
      .eq("user_id", userId).gte("created_at", monthStart),
    db.from("team_members").select("id", { count: "exact", head: true })
      .eq("owner_id", userId).neq("status", "suspended"),
  ]);

  const teamUsed = (teamCount ?? 0) + 1;

  return {
    plan,
    hasUnlimitedUsage: unlimited,
    periodLabel: getUsagePeriodLabel(),
    proposals: {
      used: proposalCount ?? 0,
      limit: unlimited ? "unlimited" : planConfig.limits.proposals,
    },
    contracts: {
      used: contractCount ?? 0,
      limit: unlimited ? "unlimited" : planConfig.limits.contracts,
    },
    teamMembers: {
      used: teamUsed,
      limit: planConfig.limits.teamMembers,
    },
  };
}

export function usagePercent(used: number, limit: number | "unlimited"): number {
  if (limit === "unlimited") return 0;
  if (limit <= 0) return 100;
  return Math.min(100, Math.round((used / limit) * 100));
}

export function isAtLimit(item: UsageItem): boolean {
  return item.limit !== "unlimited" && item.used >= item.limit;
}

export function usageLabel(item: UsageItem): string {
  if (item.limit === "unlimited") return `${item.used}`;
  return `${item.used}/${item.limit}`;
}
