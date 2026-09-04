import { supabase } from "./supabase";
import { config } from "./config";

export interface DealPilotClientConfig {
  appUrl?: string;
}

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function createDealPilotClient(options?: DealPilotClientConfig) {
  const baseUrl = (options?.appUrl ?? config.appUrl).replace(/\/$/, "");

  async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getAccessToken();
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error((err as { error?: string }).error ?? "Request failed");
    }
    return res.json() as Promise<T>;
  }

  async function apiText(path: string, init?: RequestInit): Promise<string> {
    const token = await getAccessToken();
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) throw new Error("Request failed");
    return res.text();
  }

  return {
    getUsage: () => api<import("../types").UsageSummary>("/api/usage"),
    getEmailHealth: () => api<{
      configured: boolean;
      fromEmail: string;
      emailEnabled: boolean;
      userEmail: string | null;
    }>("/api/notifications/email-health"),
    sendTestEmail: () => api<{ ok: boolean }>("/api/notifications/test-email", { method: "POST" }),
    parseJobPost: (jobPost: string) =>
      api<Record<string, unknown>>("/api/parse-job-post", {
        method: "POST",
        body: JSON.stringify({ jobPost }),
      }),
    generateProposal: (data: Record<string, unknown>) =>
      apiText("/api/generate-proposal", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    trackView: (documentId: string, documentType: string) =>
      fetch(`${baseUrl}/api/track-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, documentType, durationSec: 0 }),
      }),
  };
}

export const api = createDealPilotClient();
