/**
 * Supabase database helpers — proposals, contracts, brand kit, countries
 */
import { createClient } from "@/lib/supabase/client";

// ── Proposals ─────────────────────────────────────────────────

export async function saveProposal(data: {
  clientName: string;
  clientCompany?: string;
  projectType?: string;
  projectDescription?: string;
  deliverables?: string;
  timeline?: string;
  tone?: string;
  currency?: string;
  totalBudget?: number;
  depositPercent?: number;
  depositAmount?: number;
  freelancerName?: string;
  freelancerTitle?: string;
  freelancerEmail?: string;
  proposalText: string;
  paymentLink?: string | null;
  tiers?: object[];
  addOns?: object[];
  milestones?: object[];
  brandSnapshot?: object;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row, error } = await supabase
    .from("proposals")
    .insert({
      user_id: user.id,
      client_name: data.clientName,
      client_company: data.clientCompany ?? null,
      project_type: data.projectType ?? null,
      project_description: data.projectDescription ?? null,
      deliverables: data.deliverables ?? null,
      timeline: data.timeline ?? null,
      tone: data.tone ?? "professional",
      currency: data.currency ?? "USD",
      total_budget: data.totalBudget ?? null,
      deposit_percent: data.depositPercent ?? 50,
      deposit_amount: data.depositAmount ?? null,
      freelancer_name: data.freelancerName ?? null,
      freelancer_title: data.freelancerTitle ?? null,
      freelancer_email: data.freelancerEmail ?? null,
      proposal_text: data.proposalText,
      payment_link: data.paymentLink ?? null,
      tiers: data.tiers ?? [],
      add_ons: data.addOns ?? [],
      milestones: data.milestones ?? [],
      brand_snapshot: data.brandSnapshot ?? null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) { console.error("saveProposal:", error.message); return null; }
  return row?.id as string;
}

export async function listProposals() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("proposals")
    .select("id, client_name, client_company, project_type, currency, total_budget, status, created_at, proposal_text")
    .order("created_at", { ascending: false });
  if (error) { console.error("listProposals:", error.message); return []; }
  return data ?? [];
}

export async function deleteProposal(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) console.error("deleteProposal:", error.message);
}

export async function updateProposalPaymentLink(id: string, paymentLink: string) {
  const supabase = createClient();
  await supabase.from("proposals").update({ payment_link: paymentLink }).eq("id", id);
}

// ── Contracts ─────────────────────────────────────────────────

export async function saveContract(data: {
  contractTypeId: string;
  contractTypeName: string;
  category?: string;
  governingLaw: string;        // full jurisdiction string
  governingCountry?: string;   // ISO 2-letter
  governingState?: string;     // US state if applicable
  partyAName: string;
  partyARole?: string;
  partyAAddress?: string;
  partyBName: string;
  partyBRole?: string;
  partyBAddress?: string;
  contractFields: Record<string, string>;
  contractText: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row, error } = await supabase
    .from("contracts")
    .insert({
      user_id: user.id,
      contract_type_id: data.contractTypeId,
      contract_type_name: data.contractTypeName,
      category: data.category ?? null,
      governing_law: data.governingLaw,
      governing_country: data.governingCountry ?? null,
      governing_state: data.governingState ?? null,
      party_a_name: data.partyAName,
      party_a_role: data.partyARole ?? null,
      party_a_address: data.partyAAddress ?? null,
      party_b_name: data.partyBName,
      party_b_role: data.partyBRole ?? null,
      party_b_address: data.partyBAddress ?? null,
      contract_fields: data.contractFields,
      contract_text: data.contractText,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) { console.error("saveContract:", error.message); return null; }
  return row?.id as string;
}

export async function listContracts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("id, contract_type_name, contract_type_id, category, governing_law, party_a_name, party_a_role, party_b_name, party_b_role, status, signed_at, signer_name, created_at, contract_text")
    .order("created_at", { ascending: false });
  if (error) { console.error("listContracts:", error.message); return []; }
  return data ?? [];
}

export async function getContract(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) { console.error("getContract:", error.message); return null; }
  return data;
}

export async function signContract(id: string, opts: {
  signerName: string;
  signerEmail?: string;
  signatureData: string;
  signatureType: "typed";
  signatureIp?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contracts")
    .update({
      status: "signed",
      signer_name: opts.signerName,
      signer_email: opts.signerEmail ?? null,
      signature_data: opts.signatureData,
      signature_type: opts.signatureType,
      signature_ip: opts.signatureIp ?? null,
      signed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error("signContract:", error.message); return null; }
  return data;
}

export async function updateContractStatus(id: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase.from("contracts").update({ status }).eq("id", id);
  if (error) console.error("updateContractStatus:", error.message);
}

export async function deleteContract(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("contracts").delete().eq("id", id);
  if (error) console.error("deleteContract:", error.message);
}

// ── Brand Kit ─────────────────────────────────────────────────

export async function loadBrandFromDB() {
  const supabase = createClient();
  const { data } = await supabase.from("brand_kits").select("*").maybeSingle();
  return data;
}

export async function saveBrandToDB(brand: {
  logoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  companyName: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("brand_kits").upsert({
    user_id: user.id,
    logo_url: brand.logoUrl ?? null,
    primary_color: brand.primaryColor,
    secondary_color: brand.secondaryColor,
    font_family: brand.fontFamily,
    company_name: brand.companyName,
  }, { onConflict: "user_id" });
}

// ── Countries ─────────────────────────────────────────────────

export interface Country {
  code: string;
  name: string;
  region: string;
  currency: string;
  phone_code: string;
  flag_emoji: string;
}

let _countriesCache: Country[] | null = null;

export async function loadCountries(): Promise<Country[]> {
  if (_countriesCache) return _countriesCache;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("countries")
    .select("code, name, region, currency, phone_code, flag_emoji")
    .order("name");
  if (error) { console.error("loadCountries:", error.message); return []; }
  _countriesCache = data as Country[];
  return _countriesCache;
}

export async function loadUSStates(): Promise<{ code: string; name: string }[]> {
  const supabase = createClient();
  const { data } = await supabase.from("us_states").select("code, name").order("name");
  return data ?? [];
}
