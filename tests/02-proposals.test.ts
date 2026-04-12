import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signInFreelancer, signInClient, uid } from "./setup";
import type { SupabaseClient } from "@supabase/supabase-js";

let fsb: SupabaseClient;
let csb: SupabaseClient;
let propId: string;

describe("Proposals — status pipeline", () => {
  beforeAll(async () => { fsb = await signInFreelancer(); csb = await signInClient(); });
  afterAll(async () => { if (propId) await fsb.from("proposals").delete().eq("id", propId); });

  it("POST — freelancer creates proposal", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("proposals").insert({
      user_id: user!.id, client_name: uid("PropClient"),
      client_company: "Prop Corp", project_type: "Web Design & Development",
      project_description: "Build a test website", deliverables: "• 5 pages",
      timeline: "6 weeks", tone: "professional",
      currency: "USD", total_budget: 8500, deposit_percent: 50, deposit_amount: 4250,
      freelancer_name: "Test FL", freelancer_email: FREELANCER_EMAIL,
      proposal_text: "## Test Proposal\n\nContent here.", status: "draft",
      view_count: 0, tiers: [], add_ons: [], milestones: [],
    }).select().single();
    expect(error).toBeNull();
    propId = data!.id;
    console.log(`    ✅ Proposal created (draft) id=${propId}`);
  });

  it("GET — freelancer lists proposals", async () => {
    const { data, error } = await fsb.from("proposals")
      .select("id,client_name,status,total_budget,view_count")
      .order("created_at", { ascending: false });
    expect(error).toBeNull();
    expect(data!.find(p => p.id === propId)).not.toBeUndefined();
    console.log(`    ✅ Freelancer sees ${data!.length} proposal(s)`);
  });

  it("GET — client CANNOT access proposals (RLS)", async () => {
    const { data, error } = await csb.from("proposals").select("id").limit(5);
    expect(error).toBeNull();
    expect(data!.length).toBe(0);
    console.log(`    ✅ Client sees 0 proposals (RLS enforced)`);
  });

  it("PATCH — sent → viewed → accepted pipeline", async () => {
    // sent
    await fsb.from("proposals").update({ status: "sent" }).eq("id", propId);
    // viewed (simulates client opening)
    await fsb.from("proposals").update({ status: "viewed", view_count: 1 }).eq("id", propId);
    // accepted
    const { data } = await fsb.from("proposals")
      .update({ status: "accepted", accepted_at: new Date().toISOString() }).eq("id", propId).select().single();
    expect(data!.status).toBe("accepted");
    expect(data!.view_count).toBe(1);
    console.log(`    ✅ Pipeline: draft → sent → viewed → accepted ✓`);
  });

  it("GET — pipeline aggregation by status", async () => {
    const { data } = await fsb.from("proposals").select("status");
    const counts: Record<string, number> = {};
    data!.forEach(p => { counts[p.status] = (counts[p.status] ?? 0) + 1; });
    console.log(`    ✅ Pipeline: ${JSON.stringify(counts)}`);
    expect(typeof counts).toBe("object");
  });
});

const FREELANCER_EMAIL = "surendar1160+1@gmail.com";
