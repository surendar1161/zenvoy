/**
 * Seed Script — populates the database with realistic sample data.
 * Run once: npx tsx tests/07-seed-data.ts
 *
 * Creates:
 *   3 clients → 2 proposals each → 1 project each → 3 tasks each → 1 portal each
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://ubutaehhczggyhyjgqjp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidXRhZWhoY3pnZ3loeWpncWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjcwNjcsImV4cCI6MjA5MTMwMzA2N30.V44I9WPTDB8HucV7IPBiP5PVHI1uZq3LWHR1VWqgTek";

const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

const EMAIL    = process.env.TEST_EMAIL    ?? "test@dealpilot.co.in";
const PASSWORD = process.env.TEST_PASSWORD ?? "TestPassword123!";

const SAMPLE_CLIENTS = [
  { name: "Sarah Chen",    company: "TechStart Inc",     email: "sarah@techstart.io",  status: "active",   avatar_color: "#0ea5e9", source: "Referral",    tags: ["startup","tech"] },
  { name: "Marcus Brown",  company: "Creative Agency",   email: "marcus@creative.co",  status: "active",   avatar_color: "#7c3aed", source: "LinkedIn",    tags: ["design","agency"] },
  { name: "Priya Sharma",  company: "GlobalCorp Ltd",    email: "priya@globalcorp.com",status: "lead",     avatar_color: "#10b981", source: "Upwork",      tags: ["enterprise"] },
];

const PROPOSAL_TEXT = `## Executive Summary

We are excited to present this proposal for your project. Our team brings deep expertise and a proven track record of delivering exceptional results.

## Understanding Your Project

Based on our initial conversations, we understand you need a comprehensive solution that addresses your specific business challenges.

## Proposed Solution

We will deliver a tailored solution using modern best practices and cutting-edge technologies.

## Timeline

The project will be delivered in 6 weeks across 3 phases.

## Investment

The total investment for this project is outlined below. A 50% deposit is required to begin work.

## Next Steps

Review this proposal, then click the payment link below to pay your deposit and get started immediately.`;

async function seed() {
  console.log("\n🌱 DealPilot — Seed Script\n");

  // Sign in
  const { data: auth, error: authErr } = await sb.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
  if (authErr) { console.error("❌ Auth failed:", authErr.message); process.exit(1); }
  const userId = auth.user!.id;
  console.log(`✅ Signed in as ${auth.user!.email}\n`);

  for (const clientData of SAMPLE_CLIENTS) {
    // Create client
    const { data: client, error: ce } = await sb.from("clients").insert({ ...clientData, user_id: userId }).select().single();
    if (ce) { console.error("  ❌ Client:", ce.message); continue; }
    console.log(`👤 Client: ${client.name} (${client.company})`);

    // Create 2 proposals
    for (let pi = 1; pi <= 2; pi++) {
      const budget = pi === 1 ? 6500 : 12000;
      const status = pi === 1 ? "sent" : "draft";
      const { data: prop, error: pe } = await sb.from("proposals").insert({
        user_id:             userId,
        client_name:         client.name,
        client_company:      client.company,
        client_id:           client.id,
        project_type:        pi === 1 ? "Web Design & Development" : "Branding & Identity",
        project_description: `Complete ${pi === 1 ? "website" : "branding"} project for ${client.company}`,
        deliverables:        pi === 1 ? "• 5-page website\n• CMS\n• SEO setup" : "• Logo\n• Brand guidelines\n• Stationery",
        timeline:            pi === 1 ? "6 weeks" : "4 weeks",
        tone:                "professional",
        currency:            "USD",
        total_budget:        budget,
        deposit_percent:     50,
        deposit_amount:      budget / 2,
        freelancer_name:     "Test Freelancer",
        freelancer_email:    EMAIL,
        proposal_text:       PROPOSAL_TEXT,
        status,
        view_count:          status === "sent" ? Math.floor(Math.random() * 5) : 0,
        tiers: [], add_ons: [], milestones: [],
      }).select().single();
      if (pe) { console.error("    ❌ Proposal:", pe.message); continue; }
      console.log(`  📄 Proposal ${pi}: ${prop.project_type} — $${budget} [${status}]`);
    }

    // Create 1 project
    const { data: proj, error: prje } = await sb.from("projects").insert({
      user_id:     userId,
      client_id:   client.id,
      name:        `${client.company} — Website Redesign`,
      description: `Full website redesign project for ${client.company}`,
      color:       clientData.avatar_color,
      status:      "active",
      due_date:    new Date(Date.now() + 45 * 86400000).toISOString(),
      budget:      8500,
      currency:    "USD",
      tags:        clientData.tags,
    }).select().single();
    if (prje) { console.error("    ❌ Project:", prje.message); continue; }
    console.log(`  📁 Project: ${proj.name}`);

    // Create 3 tasks
    const taskStatuses = ["done", "in_progress", "todo"];
    const taskTitles   = ["Project setup & kickoff", "Design mockups", "Development & testing"];
    for (let ti = 0; ti < 3; ti++) {
      await sb.from("tasks").insert({
        user_id:      userId,
        project_id:   proj.id,
        client_id:    client.id,
        title:        taskTitles[ti],
        status:       taskStatuses[ti],
        priority:     ["low","high","medium"][ti],
        position:     ti,
        completed_at: taskStatuses[ti] === "done" ? new Date().toISOString() : null,
      });
    }
    console.log(`  ✅ 3 tasks created (1 done, 1 in progress, 1 todo)`);

    // Create portal
    const { data: portal, error: porte } = await sb.from("client_portals").insert({
      user_id:         userId,
      client_id:       client.id,
      client_name:     client.name,
      client_email:    client.email,
      title:           `${client.company} — Project Hub`,
      welcome_message: `Hi ${client.name.split(" ")[0]}, welcome to your project portal! Find files, invoices, and message us here.`,
      is_active:       true,
      brand_override: { primaryColor: clientData.avatar_color, secondaryColor: "#0369a1", fontFamily: "Inter", companyName: "Test Studio", logoUrl: null },
    }).select().single();
    if (porte) { console.error("    ❌ Portal:", porte.message); continue; }
    console.log(`  🌐 Portal: /portal/${portal.token.slice(0,8)}…`);

    // Add portal invoice
    await sb.from("portal_invoices").insert({
      portal_id: portal.id, user_id: userId,
      invoice_number: "INV-001", title: "Project Deposit",
      line_items: [{ description: "50% project deposit", quantity: 1, unit_price: 4250, amount: 4250 }],
      subtotal: 4250, tax_rate: 0, tax_amount: 0, total: 4250, currency: "USD", status: "sent",
      due_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
    console.log(`  💰 Invoice added to portal\n`);
  }

  console.log("✅ Seed complete! Refresh the app to see your data.\n");
  console.log("  → Clients:   http://localhost:3000/clients");
  console.log("  → Projects:  http://localhost:3000/projects");
  console.log("  → Proposals: http://localhost:3000/proposals");
  console.log("  → Portals:   http://localhost:3000/portals\n");
}

seed().catch(console.error);
