export type Plan = "free" | "pro" | "business";

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

export interface ProposalRow {
  id: string;
  client_name: string;
  project_type: string | null;
  status: string;
  currency: string | null;
  total_budget: number | null;
  view_count: number;
  created_at: string;
  proposal_text?: string | null;
  client_company?: string | null;
}

export interface ClientRow {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  status: string;
  created_at: string;
}

export interface InvoiceRow {
  id: string;
  title: string | null;
  status: string;
  amount: number | null;
  currency: string | null;
  due_date: string | null;
  created_at: string;
}

export interface ContractRow {
  id: string;
  contract_type_name: string | null;
  status: string;
  created_at: string;
}

export interface ProjectRow {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export interface PortalRow {
  id: string;
  title: string;
  token: string;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

export const PROPOSAL_STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  sent: "#0ea5e9",
  viewed: "#06b6d4",
  accepted: "#10b981",
  signed: "#10b981",
  declined: "#ef4444",
  expired: "#f59e0b",
};
