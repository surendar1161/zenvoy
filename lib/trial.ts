/**
 * Trial helpers — 30-day free trial, full Pro access.
 */

export interface TrialInfo {
  isOnTrial: boolean;       // trial active and not expired
  isExpired: boolean;       // trial was set but has expired
  trialEndsAt: string | null;
  daysLeft: number;         // 0 if expired
  hoursLeft: number;        // within last 24 hours
}

export function getTrialInfo(trialEndsAt: string | null | undefined): TrialInfo {
  if (!trialEndsAt) {
    return { isOnTrial: false, isExpired: false, trialEndsAt: null, daysLeft: 0, hoursLeft: 0 };
  }
  const now   = Date.now();
  const end   = new Date(trialEndsAt).getTime();
  const msLeft = end - now;

  if (msLeft <= 0) {
    return { isOnTrial: false, isExpired: true, trialEndsAt, daysLeft: 0, hoursLeft: 0 };
  }

  const daysLeft  = Math.floor(msLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { isOnTrial: true, isExpired: false, trialEndsAt, daysLeft, hoursLeft };
}

/** True if user has access to Pro features (on trial OR paid plan) */
export function hasProAccess(plan: string, trialEndsAt: string | null | undefined): boolean {
  if (plan === "pro" || plan === "business") return true;
  const { isOnTrial } = getTrialInfo(trialEndsAt);
  return isOnTrial;
}

export function trialBadgeText(trial: TrialInfo): string {
  if (!trial.isOnTrial) return "";
  if (trial.daysLeft === 0) return `Trial expires in ${trial.hoursLeft}h`;
  if (trial.daysLeft === 1) return "Trial expires tomorrow";
  return `${trial.daysLeft} days left in trial`;
}

export function trialUrgency(trial: TrialInfo): "normal" | "warning" | "critical" {
  if (!trial.isOnTrial) return "normal";
  if (trial.daysLeft <= 3) return "critical";
  if (trial.daysLeft <= 7) return "warning";
  return "normal";
}
