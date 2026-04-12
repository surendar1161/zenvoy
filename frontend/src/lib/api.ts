/**
 * API client — calls Supabase Edge Functions (backend).
 * All AI, payment, and webhook logic lives in /backend/supabase/functions/.
 */
import { supabase } from "./supabase";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/** Build the Edge Function URL */
function fnUrl(name: string) {
  return `${SUPABASE_URL}/functions/v1/${name}`;
}

/** Authenticated fetch to an Edge Function */
async function callFn(
  name: string,
  body: unknown,
  opts: { stream?: boolean } = {}
): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(fnUrl(name), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON,
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok && !opts.stream) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `Edge function ${name} returned ${res.status}`);
  }
  return res;
}

// ── Proposal generation (streaming) ──────────────────────────
export async function generateProposalStream(payload: unknown) {
  return callFn("generate-proposal", payload, { stream: true });
}

// ── Contract generation (streaming) ──────────────────────────
export async function generateContractStream(payload: unknown) {
  return callFn("generate-contract", payload, { stream: true });
}

// ── Parse job post ────────────────────────────────────────────
export async function parseJobPost(jobPost: string) {
  const res = await callFn("parse-job-post", { jobPost });
  return res.json();
}

// ── Regenerate section (3 alternatives) ──────────────────────
export async function regenerateSection(payload: unknown) {
  const res = await callFn("regenerate-section", payload);
  return res.json();
}

// ── Stripe payment link ───────────────────────────────────────
export async function createPaymentLink(payload: unknown): Promise<{ url: string }> {
  const res = await callFn("create-payment-link", payload);
  return res.json();
}

// ── Stripe milestone links ────────────────────────────────────
export async function createMilestoneLinks(payload: unknown): Promise<{ milestones: unknown[] }> {
  const res = await callFn("create-milestone-links", payload);
  return res.json();
}

// ── Chargebee checkout ────────────────────────────────────────
export async function createChargebeeCheckout(payload: unknown): Promise<{ url: string }> {
  const res = await callFn("chargebee-checkout", payload);
  return res.json();
}

// ── Track proposal view ───────────────────────────────────────
export async function trackView(payload: unknown): Promise<void> {
  await callFn("track-view", payload).catch(() => {});
}

// ── Sign document ─────────────────────────────────────────────
export async function signDocument(payload: unknown) {
  const res = await callFn("sign-document", payload);
  return res.json();
}
