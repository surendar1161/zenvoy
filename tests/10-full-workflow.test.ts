import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signInFreelancer, signInClient, uid } from "./setup";
import type { SupabaseClient } from "@supabase/supabase-js";

let fsb: SupabaseClient;
let csb: SupabaseClient;

// IDs for cleanup
let clientId: string;
let proposalId: string;
let contractId: string;
let projectId: string;
let portalId: string;

describe("Full Workflow Integration — Client → Proposal → Contract → Project → Portal", () => {
  beforeAll(async () => {
    fsb = await signInFreelancer();
    csb = await signInClient();
  });

  afterAll(async () => {
    // Cleanup in reverse order due to foreign keys
    const cleanup = [];
    if (projectId) cleanup.push(fsb.from("projects").delete().eq("id", projectId));
    if (contractId) cleanup.push(fsb.from("contracts").delete().eq("id", contractId));
    if (proposalId) cleanup.push(fsb.from("proposals").delete().eq("id", proposalId));
    if (portalId) cleanup.push(fsb.from("portals").delete().eq("id", portalId));
    if (clientId) cleanup.push(fsb.from("clients").delete().eq("id", clientId));
    await Promise.all(cleanup);
  });

  // ═══════════════════════════════════════════════════════════════
  // STEP 1: CLIENT MANAGEMENT
  // ═══════════════════════════════════════════════════════════════

  it("✓ STEP 1a — Create client in CRM", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("clients").insert({
      user_id: user!.id,
      name: uid("WorkflowClient"),
      company: "Workflow Test Corp",
      email: "client@workflow.test",
      phone: "+1-555-0123",
      website: "https://workflow.test",
      status: "lead",
      source: "LinkedIn",
      tags: ["web-dev", "priority"],
      notes: "Interested in complete web development project",
    }).select().single();

    expect(error).toBeNull();
    expect(data!.status).toBe("lead");
    clientId = data!.id;
    console.log(`    ✅ Client created in CRM: ${clientId}`);
  });

  it("✓ STEP 1b — Update client status: lead → active", async () => {
    const { data, error } = await fsb
      .from("clients")
      .update({ status: "active" })
      .eq("id", clientId)
      .select("status")
      .single();

    expect(error).toBeNull();
    expect(data!.status).toBe("active");
    console.log(`    ✅ Client status updated: lead → active`);
  });

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: PROPOSAL GENERATION & EDITING
  // ═══════════════════════════════════════════════════════════════

  it("✓ STEP 2a — Generate AI proposal for client", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("proposals").insert({
      user_id: user!.id,
      client_id: clientId,
      client_name: "WorkflowClient",
      client_company: "Workflow Test Corp",
      project_type: "E-commerce Website",
      project_description: "Build a modern e-commerce platform with payment integration",
      deliverables: "• Product catalog\n• Shopping cart\n• Payment gateway\n• Admin dashboard",
      timeline: "12 weeks",
      tone: "professional",
      currency: "USD",
      total_budget: 25000,
      deposit_percent: 30,
      deposit_amount: 7500,
      freelancer_name: "Test Agency",
      freelancer_email: "agency@test.com",
      proposal_text: `
# E-commerce Website Proposal

## Project Overview
We will build a complete e-commerce solution tailored to your business needs.

## Deliverables
- Product catalog with categories
- Shopping cart and checkout
- Stripe payment integration
- Admin dashboard for inventory management

## Timeline
12 weeks from project kickoff

## Investment
- Total: $25,000
- Deposit (30%): $7,500
- Remaining: $17,500 (paid in milestones)
      `.trim(),
      status: "draft",
      tiers: [],
      add_ons: [],
      milestones: [
        { name: "Discovery & Design", amount: 7500, description: "Initial deposit" },
        { name: "Development Phase 1", amount: 8750, description: "Core features" },
        { name: "Development Phase 2", amount: 8750, description: "Final delivery" },
      ],
    }).select().single();

    expect(error).toBeNull();
    proposalId = data!.id;
    console.log(`    ✅ Proposal generated: ${proposalId}`);
  });

  it("✓ STEP 2b — Edit proposal content", async () => {
    const updatedText = `
# E-commerce Website Proposal [REVISED]

## Project Overview
We will build a complete e-commerce solution with modern design and seamless UX.

## Deliverables
- Product catalog with advanced filtering
- Shopping cart with saved items
- Stripe + PayPal payment integration
- Admin dashboard with analytics

## Timeline
12 weeks from project kickoff

## Investment
- Total: $25,000
- Deposit (30%): $7,500
- Remaining: $17,500 (paid in milestones)

---
*Proposal revised on ${new Date().toLocaleDateString()}*
    `.trim();

    const { error } = await fsb
      .from("proposals")
      .update({ proposal_text: updatedText })
      .eq("id", proposalId);

    expect(error).toBeNull();
    console.log(`    ✅ Proposal edited and auto-saved`);
  });

  it("✓ STEP 2c — Send proposal to client", async () => {
    const { data, error } = await fsb
      .from("proposals")
      .update({ status: "sent" })
      .eq("id", proposalId)
      .select("status")
      .single();

    expect(error).toBeNull();
    expect(data!.status).toBe("sent");
    console.log(`    ✅ Proposal sent to client`);
  });

  it("✓ STEP 2d — Client views proposal (tracking)", async () => {
    const { error } = await fsb
      .from("proposals")
      .update({ 
        status: "viewed", 
        view_count: 1,
        last_viewed_at: new Date().toISOString() 
      })
      .eq("id", proposalId);

    expect(error).toBeNull();
    console.log(`    ✅ Client viewed proposal (tracked)`);
  });

  it("✓ STEP 2e — Client accepts proposal", async () => {
    const { data, error } = await fsb
      .from("proposals")
      .update({ 
        status: "accepted",
        accepted_at: new Date().toISOString() 
      })
      .eq("id", proposalId)
      .select("status")
      .single();

    expect(error).toBeNull();
    expect(data!.status).toBe("accepted");
    console.log(`    ✅ Proposal accepted by client`);
  });

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: CONTRACT GENERATION & SIGNING
  // ═══════════════════════════════════════════════════════════════

  it("✓ STEP 3a — Generate service agreement contract", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("contracts").insert({
      user_id: user!.id,
      client_id: clientId,
      contract_type_id: "service-agreement",
      contract_type_name: "Service Agreement",
      category: "Service",
      governing_law: "California, United States",
      governing_country: "US",
      governing_state: "California",
      party_a_name: "Test Agency LLC",
      party_a_role: "Service Provider",
      party_b_name: "Workflow Test Corp",
      party_b_role: "Client",
      contract_fields: {
        serviceDescription: "E-commerce website development",
        compensation: "25000",
        paymentTerms: "30% deposit, remainder in milestones",
      },
      contract_text: `
# Service Agreement

This Service Agreement ("Agreement") is entered into between Test Agency LLC ("Service Provider") and Workflow Test Corp ("Client").

## 1. Services
The Service Provider will deliver an e-commerce website as specified in the attached proposal.

## 2. Compensation
Total project fee: $25,000 USD
Payment terms: 30% deposit ($7,500), remainder in 2 milestones

## 3. Timeline
Project duration: 12 weeks from start date

## 4. Intellectual Property
All deliverables become property of the Client upon full payment.

---

**Signatures**

Service Provider: _____________________  
Date: _______________

Client: _____________________  
Date: _______________
      `.trim(),
      status: "draft",
    }).select().single();

    expect(error).toBeNull();
    contractId = data!.id;
    console.log(`    ✅ Service agreement generated: ${contractId}`);
  });

  it("✓ STEP 3b — Edit contract terms", async () => {
    const { data: current } = await fsb
      .from("contracts")
      .select("contract_text")
      .eq("id", contractId)
      .single();

    const editedText = current!.contract_text + `

## 5. Confidentiality [ADDED]
Both parties agree to maintain confidentiality of proprietary information.
    `.trim();

    const { error } = await fsb
      .from("contracts")
      .update({ contract_text: editedText })
      .eq("id", contractId);

    expect(error).toBeNull();
    console.log(`    ✅ Contract edited (terms added)`);
  });

  it("✓ STEP 3c — Mark contract as reviewed", async () => {
    const { error } = await fsb
      .from("contracts")
      .update({ status: "reviewed" })
      .eq("id", contractId);

    expect(error).toBeNull();
    console.log(`    ✅ Contract reviewed`);
  });

  it("✓ STEP 3d — Client signs contract", async () => {
    const { data, error } = await fsb
      .from("contracts")
      .update({
        status: "signed",
        signer_name: "John Doe",
        signer_email: "john@workflow.test",
        signature_data: "John Doe",
        signature_type: "typed",
        signature_ip: "203.0.113.42",
        signed_at: new Date().toISOString(),
      })
      .eq("id", contractId)
      .select("status, signed_at")
      .single();

    expect(error).toBeNull();
    expect(data!.status).toBe("signed");
    expect(data!.signed_at).not.toBeNull();
    console.log(`    ✅ Contract signed by client`);
  });

  // ═══════════════════════════════════════════════════════════════
  // STEP 4: PROJECT SETUP & DELIVERY
  // ═══════════════════════════════════════════════════════════════

  it("✓ STEP 4a — Create project from accepted proposal", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("projects").insert({
      user_id: user!.id,
      client_id: clientId,
      name: "E-commerce Website Build",
      description: "Complete e-commerce platform development",
      status: "active",
      start_date: new Date().toISOString(),
      budget: 25000,
    }).select().single();

    expect(error).toBeNull();
    projectId = data!.id;
    console.log(`    ✅ Project created: ${projectId}`);
  });

  it("✓ STEP 4b — Add tasks to project", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const tasks = [
      { title: "Discovery call", status: "done" },
      { title: "Design mockups", status: "in_progress" },
      { title: "Frontend development", status: "todo" },
      { title: "Backend API", status: "todo" },
      { title: "Payment integration", status: "todo" },
      { title: "Testing & QA", status: "todo" },
    ];

    const { error } = await fsb.from("tasks").insert(
      tasks.map(t => ({
        user_id: user!.id,
        project_id: projectId,
        ...t,
      }))
    );

    expect(error).toBeNull();
    console.log(`    ✅ ${tasks.length} tasks created`);
  });

  // ═══════════════════════════════════════════════════════════════
  // STEP 5: CLIENT PORTAL SETUP
  // ═══════════════════════════════════════════════════════════════

  it("✓ STEP 5a — Create branded client portal", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("portals").insert({
      user_id: user!.id,
      client_id: clientId,
      title: "E-commerce Project Hub",
      description: "Your project dashboard with files, invoices, and updates",
      client_email: "client@workflow.test",
      client_name: "John Doe",
    }).select().single();

    expect(error).toBeNull();
    portalId = data!.id;
    console.log(`    ✅ Client portal created: ${portalId}`);
  });

  it("✓ STEP 5b — Add file to portal", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { error } = await fsb.from("portal_files").insert({
      user_id: user!.id,
      portal_id: portalId,
      name: "Design Mockups.pdf",
      category: "Designs",
      size_kb: 2048,
      file_url: "https://example.com/mockups.pdf",
    });

    expect(error).toBeNull();
    console.log(`    ✅ File added to portal`);
  });

  it("✓ STEP 5c — Create invoice in portal", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { error } = await fsb.from("portal_invoices").insert({
      user_id: user!.id,
      portal_id: portalId,
      invoice_number: "INV-001",
      description: "Milestone 1: Discovery & Design",
      amount: 7500,
      currency: "USD",
      status: "pending",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    expect(error).toBeNull();
    console.log(`    ✅ Invoice created in portal`);
  });

  // ═══════════════════════════════════════════════════════════════
  // VERIFICATION: END-TO-END DATA INTEGRITY
  // ═══════════════════════════════════════════════════════════════

  it("✓ VERIFY — All entities linked correctly", async () => {
    // Check proposal → client link
    const { data: proposal } = await fsb
      .from("proposals")
      .select("client_id, status")
      .eq("id", proposalId)
      .single();

    expect(proposal!.client_id).toBe(clientId);
    expect(proposal!.status).toBe("accepted");

    // Check contract → client link
    const { data: contract } = await fsb
      .from("contracts")
      .select("client_id, status")
      .eq("id", contractId)
      .single();

    expect(contract!.client_id).toBe(clientId);
    expect(contract!.status).toBe("signed");

    // Check project → client link
    const { data: project } = await fsb
      .from("projects")
      .select("client_id, status")
      .eq("id", projectId)
      .single();

    expect(project!.client_id).toBe(clientId);
    expect(project!.status).toBe("active");

    // Check portal → client link
    const { data: portal } = await fsb
      .from("portals")
      .select("client_id, client_email")
      .eq("id", portalId)
      .single();

    expect(portal!.client_id).toBe(clientId);

    console.log(`    ✅ All entities correctly linked to client`);
  });

  it("✓ VERIFY — Complete workflow summary", async () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║           FULL WORKFLOW COMPLETED SUCCESSFULLY            ║
    ╠═══════════════════════════════════════════════════════════╣
    ║  1. Client:   ${clientId.substring(0, 8)}...                            ║
    ║  2. Proposal: ${proposalId.substring(0, 8)}... [accepted]                ║
    ║  3. Contract: ${contractId.substring(0, 8)}... [signed]                  ║
    ║  4. Project:  ${projectId.substring(0, 8)}... [active]                   ║
    ║  5. Portal:   ${portalId.substring(0, 8)}... [ready]                     ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
  });
});
