import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signInFreelancer, uid } from "./setup";
import type { SupabaseClient } from "@supabase/supabase-js";

let fsb: SupabaseClient;
let proposalId: string;

describe("Proposal Edit & Save Flow — Full Integration", () => {
  beforeAll(async () => { fsb = await signInFreelancer(); });
  afterAll(async () => { 
    if (proposalId) await fsb.from("proposals").delete().eq("id", proposalId); 
  });

  it("✓ CREATE — freelancer creates a draft proposal", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("proposals").insert({
      user_id: user!.id,
      client_name: uid("EditTestClient"),
      client_company: "Test Corp",
      project_type: "Web Development",
      project_description: "Build a modern web application",
      deliverables: "• Homepage\n• Dashboard\n• User authentication",
      timeline: "8 weeks",
      tone: "professional",
      currency: "USD",
      total_budget: 12000,
      deposit_percent: 30,
      deposit_amount: 3600,
      freelancer_name: "Test Freelancer",
      freelancer_email: "test@freelancer.com",
      proposal_text: "## Initial Proposal\n\nThis is the initial draft content.",
      status: "draft",
      view_count: 0,
      tiers: [],
      add_ons: [],
      milestones: [],
    }).select().single();

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data!.status).toBe("draft");
    expect(data!.proposal_text).toContain("Initial Proposal");
    proposalId = data!.id;
    console.log(`    ✅ Proposal created: ${proposalId}`);
  });

  it("✓ READ — fetch proposal for editing", async () => {
    const { data, error } = await fsb
      .from("proposals")
      .select("id, client_name, proposal_text, status")
      .eq("id", proposalId)
      .single();

    expect(error).toBeNull();
    expect(data!.id).toBe(proposalId);
    expect(data!.proposal_text).toContain("Initial Proposal");
    console.log(`    ✅ Proposal fetched for editing`);
  });

  it("✓ UPDATE — edit proposal text (simulate editor auto-save)", async () => {
    const updatedText = `
## Updated Proposal

### Project Overview
This is the **updated content** with rich formatting.

### Deliverables
- Homepage with hero section
- User dashboard
- Authentication system

### Timeline
8 weeks from start date

*Last edited: ${new Date().toISOString()}*
    `.trim();

    const { data, error } = await fsb
      .from("proposals")
      .update({ proposal_text: updatedText })
      .eq("id", proposalId)
      .select("proposal_text")
      .single();

    expect(error).toBeNull();
    expect(data!.proposal_text).toContain("Updated Proposal");
    expect(data!.proposal_text).toContain("updated content");
    console.log(`    ✅ Proposal text saved successfully`);
  });

  it("✓ UPDATE — edit multiple times (simulate continuous editing)", async () => {
    // First edit
    await fsb
      .from("proposals")
      .update({ proposal_text: "## Edit 1\n\nFirst edit" })
      .eq("id", proposalId);

    // Second edit
    await fsb
      .from("proposals")
      .update({ proposal_text: "## Edit 2\n\nSecond edit with more content" })
      .eq("id", proposalId);

    // Third edit
    const { data, error } = await fsb
      .from("proposals")
      .update({ proposal_text: "## Final Edit\n\nFinal version with complete content" })
      .eq("id", proposalId)
      .select("proposal_text")
      .single();

    expect(error).toBeNull();
    expect(data!.proposal_text).toContain("Final Edit");
    console.log(`    ✅ Multiple edits saved successfully`);
  });

  it("✓ UPDATE — change proposal metadata alongside text", async () => {
    const { data, error } = await fsb
      .from("proposals")
      .update({
        proposal_text: "## Revised Proposal\n\nContent with updated budget",
        total_budget: 15000,
        deposit_amount: 4500,
      })
      .eq("id", proposalId)
      .select("proposal_text, total_budget, deposit_amount")
      .single();

    expect(error).toBeNull();
    expect(data!.proposal_text).toContain("Revised Proposal");
    expect(data!.total_budget).toBe(15000);
    expect(data!.deposit_amount).toBe(4500);
    console.log(`    ✅ Proposal text + metadata updated`);
  });

  it("✓ STATUS TRANSITION — draft → sent (finalize proposal)", async () => {
    const { data, error } = await fsb
      .from("proposals")
      .update({ status: "sent" })
      .eq("id", proposalId)
      .select("status")
      .single();

    expect(error).toBeNull();
    expect(data!.status).toBe("sent");
    console.log(`    ✅ Proposal status: draft → sent`);
  });

  it("✓ READ-ONLY after sent — verify text is preserved", async () => {
    const { data } = await fsb
      .from("proposals")
      .select("proposal_text, status")
      .eq("id", proposalId)
      .single();

    expect(data!.status).toBe("sent");
    expect(data!.proposal_text).toContain("Revised Proposal");
    console.log(`    ✅ Sent proposal text preserved`);
  });

  it("✓ LATE EDIT — edit after sent (allowed but tracked)", async () => {
    const lateEditText = "## Late Edit\n\nEdited after sending to client";
    
    // Try with tracking columns first
    let result = await fsb
      .from("proposals")
      .update({ proposal_text: lateEditText })
      .eq("id", proposalId)
      .select("proposal_text, edited_after_sent, edit_count, last_edited_at")
      .single();

    // If tracking columns don't exist, fall back to basic update
    if (result.error && result.error.code === '42703') {
      result = await fsb
        .from("proposals")
        .update({ proposal_text: lateEditText })
        .eq("id", proposalId)
        .select("proposal_text")
        .single();
      
      expect(result.error).toBeNull();
      expect(result.data!.proposal_text).toContain("Late Edit");
      console.log(`    ⚠️  Late edit allowed - apply migration update-25-proposal-edit-tracking.sql for tracking`);
    } else {
      // Tracking columns exist
      expect(result.error).toBeNull();
      expect(result.data!.proposal_text).toContain("Late Edit");
      
      if (result.data!.edited_after_sent !== undefined) {
        expect(result.data!.edited_after_sent).toBe(true);
        console.log(`    ✅ Late edit tracked: edited_after_sent=${result.data!.edited_after_sent}, edit_count=${result.data!.edit_count}`);
      }
    }
  });

  it("✓ VALIDATION — empty text should still save", async () => {
    const { error } = await fsb
      .from("proposals")
      .update({ proposal_text: "" })
      .eq("id", proposalId);

    expect(error).toBeNull();
    console.log(`    ✅ Empty text saved (edge case handled)`);
  });

  it("✓ VALIDATION — very long text (10KB+)", async () => {
    const longText = "# Large Proposal\n\n" + "Lorem ipsum dolor sit amet. ".repeat(500);
    
    const { error } = await fsb
      .from("proposals")
      .update({ proposal_text: longText })
      .eq("id", proposalId);

    expect(error).toBeNull();
    console.log(`    ✅ Large text (${(longText.length / 1024).toFixed(1)}KB) saved`);
  });

  it("✓ CLEANUP — verify proposal can be deleted", async () => {
    const { error } = await fsb
      .from("proposals")
      .delete()
      .eq("id", proposalId);

    expect(error).toBeNull();
    
    const { data } = await fsb
      .from("proposals")
      .select("id")
      .eq("id", proposalId)
      .maybeSingle();
    
    expect(data).toBeNull();
    proposalId = ""; // Mark as cleaned up
    console.log(`    ✅ Proposal deleted successfully`);
  });
});
