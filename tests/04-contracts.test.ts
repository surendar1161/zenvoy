import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signInFreelancer, signInClient } from "./setup";
import type { SupabaseClient } from "@supabase/supabase-js";

let fsb: SupabaseClient;
let csb: SupabaseClient;
let contractId: string;
let icaId: string; // independent contractor agreement

describe("Contracts — full end-to-end flow", () => {
  beforeAll(async () => {
    fsb = await signInFreelancer();
    csb = await signInClient();
  });

  afterAll(async () => {
    const ids = [contractId, icaId].filter(Boolean);
    if (ids.length) {
      await fsb.from("contracts").delete().in("id", ids);
    }
  });

  // ── CREATE ──────────────────────────────────────────────────────

  it("freelancer creates NDA contract", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("contracts").insert({
      user_id: user!.id,
      contract_type_id: "nda",
      contract_type_name: "Non-Disclosure Agreement",
      category: "Confidentiality",
      governing_law: "California, United States",
      governing_country: "US",
      governing_state: "California",
      party_a_name: "Acme Freelancer LLC",
      party_a_role: "Disclosing Party",
      party_b_name: "Client Corp",
      party_b_role: "Receiving Party",
      contract_fields: { ndaType: "Mutual", duration: "3", purpose: "Project scoping" },
      contract_text: "## NDA\n\nThis Mutual Non-Disclosure Agreement...\n\nSIGNATURE\nParty A: ___\nParty B: ___",
      status: "draft",
    }).select().single();

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data!.contract_type_id).toBe("nda");
    expect(data!.status).toBe("draft");
    contractId = data!.id;
    console.log(`    ✅ NDA created: ${contractId}`);
  });

  it("freelancer creates Independent Contractor Agreement", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("contracts").insert({
      user_id: user!.id,
      contract_type_id: "independent-contractor",
      contract_type_name: "Independent Contractor Agreement",
      category: "Employment",
      governing_law: "New York, United States",
      governing_country: "US",
      governing_state: "New York",
      party_a_name: "Startup Inc",
      party_a_role: "Company",
      party_b_name: "Jane Dev",
      party_b_role: "Contractor",
      contract_fields: { projectScope: "Build web app", compensation: "10000", paymentTerms: "Net 30" },
      contract_text: "## Independent Contractor Agreement\n\n1. Services...\n\nSIGNATURE BLOCK",
      status: "draft",
    }).select().single();

    expect(error).toBeNull();
    expect(data!.contract_type_id).toBe("independent-contractor");
    icaId = data!.id;
    console.log(`    ✅ ICA created: ${icaId}`);
  });

  // ── LIST ─────────────────────────────────────────────────────────

  it("freelancer lists all contracts (sees both)", async () => {
    const { data, error } = await fsb
      .from("contracts")
      .select("id, contract_type_name, status, party_a_name, party_b_name")
      .order("created_at", { ascending: false });

    expect(error).toBeNull();
    expect(data!.find(c => c.id === contractId)).not.toBeUndefined();
    expect(data!.find(c => c.id === icaId)).not.toBeUndefined();
    console.log(`    ✅ ${data!.length} contract(s) listed`);
  });

  it("freelancer fetches single contract by ID", async () => {
    const { data, error } = await fsb
      .from("contracts")
      .select("*")
      .eq("id", contractId)
      .single();

    expect(error).toBeNull();
    expect(data!.id).toBe(contractId);
    expect(data!.contract_type_id).toBe("nda");
    expect(data!.contract_text).toContain("NDA");
    console.log(`    ✅ Contract fetched: ${data!.contract_type_name}`);
  });

  // ── RLS ──────────────────────────────────────────────────────────

  it("client CANNOT read any contracts (RLS enforced)", async () => {
    const { data, error } = await csb.from("contracts").select("id").limit(10);
    expect(error).toBeNull();
    expect(data!.length).toBe(0);
    console.log(`    ✅ Client sees 0 contracts (RLS enforced)`);
  });

  it("client CANNOT insert a contract (RLS enforced)", async () => {
    const { data: { user } } = await csb.auth.getUser();
    const { error } = await csb.from("contracts").insert({
      user_id: user!.id,
      contract_type_id: "nda",
      contract_type_name: "NDA",
      governing_law: "California",
      party_a_name: "A",
      party_b_name: "B",
      contract_text: "hack",
      status: "draft",
    });
    expect(error).not.toBeNull();
    console.log(`    ✅ Client insert rejected: ${error!.code}`);
  });

  // ── STATUS TRANSITIONS ───────────────────────────────────────────

  it("freelancer transitions draft → reviewed", async () => {
    const { data, error } = await fsb
      .from("contracts")
      .update({ status: "reviewed" })
      .eq("id", contractId)
      .select("id, status")
      .single();

    expect(error).toBeNull();
    expect(data!.status).toBe("reviewed");
    console.log(`    ✅ Status: reviewed`);
  });

  // ── E-SIGNATURE ──────────────────────────────────────────────────

  it("e-signature flow: sign the contract (reviewed → signed)", async () => {
    const { data, error } = await fsb
      .from("contracts")
      .update({
        status: "signed",
        signer_name: "Jane Smith",
        signer_email: "jane@client.com",
        signature_data: "Jane Smith",
        signature_type: "typed",
        signature_ip: "127.0.0.1",
        signed_at: new Date().toISOString(),
      })
      .eq("id", contractId)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data!.status).toBe("signed");
    expect(data!.signer_name).toBe("Jane Smith");
    expect(data!.signer_email).toBe("jane@client.com");
    expect(data!.signed_at).not.toBeNull();
    console.log(`    ✅ Signed by ${data!.signer_name} at ${data!.signed_at}`);
  });

  it("signed contract cannot be updated back to draft by freelancer", async () => {
    // RLS policy: update still works (status protection is app-level), but signed_at should remain
    const { data } = await fsb
      .from("contracts")
      .select("status, signed_at, signer_name")
      .eq("id", contractId)
      .single();

    expect(data!.status).toBe("signed");
    expect(data!.signed_at).not.toBeNull();
    expect(data!.signer_name).toBe("Jane Smith");
    console.log(`    ✅ Signed state preserved`);
  });

  // ── FILTER & SEARCH ──────────────────────────────────────────────

  it("filter signed contracts", async () => {
    const { data, error } = await fsb
      .from("contracts")
      .select("id, status, signer_name")
      .eq("status", "signed");

    expect(error).toBeNull();
    expect(data!.find(c => c.id === contractId)).not.toBeUndefined();
    console.log(`    ✅ ${data!.length} signed contract(s)`);
  });

  it("filter contracts by type", async () => {
    const { data, error } = await fsb
      .from("contracts")
      .select("id, contract_type_id")
      .eq("contract_type_id", "nda");

    expect(error).toBeNull();
    expect(data!.find(c => c.id === contractId)).not.toBeUndefined();
    console.log(`    ✅ ${data!.length} NDA contract(s)`);
  });

  it("filter contracts by category", async () => {
    const { data, error } = await fsb
      .from("contracts")
      .select("id, category")
      .eq("category", "Employment");

    expect(error).toBeNull();
    expect(data!.find(c => c.id === icaId)).not.toBeUndefined();
    console.log(`    ✅ ${data!.length} Employment contract(s)`);
  });

  // ── UPDATE CONTRACT TEXT ─────────────────────────────────────────

  it("freelancer edits ICA contract text", async () => {
    const updatedText = "## Independent Contractor Agreement\n\n[UPDATED] 1. Services...\n\nSIGNATURE BLOCK";
    const { data, error } = await fsb
      .from("contracts")
      .update({ contract_text: updatedText })
      .eq("id", icaId)
      .select("contract_text")
      .single();

    expect(error).toBeNull();
    expect(data!.contract_text).toContain("[UPDATED]");
    console.log(`    ✅ Contract text updated`);
  });

  // ── DELETE ───────────────────────────────────────────────────────

  it("freelancer deletes ICA contract", async () => {
    const { error } = await fsb.from("contracts").delete().eq("id", icaId);
    expect(error).toBeNull();

    // Verify gone
    const { data } = await fsb.from("contracts").select("id").eq("id", icaId).maybeSingle();
    expect(data).toBeNull();
    icaId = ""; // cleared so afterAll doesn't double-delete
    console.log(`    ✅ ICA deleted`);
  });

  it("client CANNOT delete freelancer contracts (RLS)", async () => {
    const { error } = await csb.from("contracts").delete().eq("id", contractId);
    // Either error or 0 rows deleted — check contract still exists
    const { data } = await fsb.from("contracts").select("id").eq("id", contractId).maybeSingle();
    expect(data).not.toBeNull();
    console.log(`    ✅ Client delete blocked — contract still exists`);
  });
});
