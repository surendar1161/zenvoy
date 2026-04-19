/**
 * Seed realistic demo data for Zenvoy demo recording
 * Run: npx tsx scripts/seed-demo.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EMAIL    = process.env.DEMO_EMAIL    ?? "surendar1160@gmail.com";
const PASSWORD = process.env.DEMO_PASSWORD ?? "";

async function seed() {
  console.log("\n🎬 Zenvoy Demo Data Seeder\n");

  if (!PASSWORD) {
    console.error("❌ Set DEMO_PASSWORD=your_password in .env.local or pass as env var");
    process.exit(1);
  }

  // Sign in
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
  if (authErr || !auth.user) { console.error("❌ Auth failed:", authErr?.message); process.exit(1); }
  const userId = auth.user.id;
  console.log(`✅ Signed in as ${EMAIL}`);

  // ── Clients ──────────────────────────────────────────────────
  console.log("\n👤 Seeding clients…");
  const clientData = [
    { name: "Sarah Chen",     company: "Acme Corp",        email: "sarah@acme.com",        phone: "+1 415 555 0101", status: "active",   avatar_color: "#0ea5e9" },
    { name: "Marcus Reid",    company: "Nova Labs",         email: "marcus@novalabs.io",     phone: "+1 212 555 0182", status: "active",   avatar_color: "#7c3aed" },
    { name: "Priya Sharma",   company: "Bloom Studio",      email: "priya@bloom.studio",     phone: "+44 20 7946 0201", status: "active",  avatar_color: "#10b981" },
    { name: "James Okafor",   company: "Titan Ventures",   email: "james@titanvc.com",      phone: "+1 310 555 0143", status: "inactive", avatar_color: "#f59e0b" },
    { name: "Elena Vasquez",  company: "PixelForge Agency", email: "elena@pixelforge.co",   phone: "+1 646 555 0167", status: "active",   avatar_color: "#ef4444" },
  ];

  const { data: clients } = await supabase.from("clients").insert(
    clientData.map(c => ({ ...c, user_id: userId }))
  ).select();
  console.log(`  ✅ ${clients?.length ?? 0} clients created`);

  const clientMap = Object.fromEntries((clients ?? []).map(c => [c.name, c.id]));

  // ── Proposals ─────────────────────────────────────────────────
  console.log("\n📄 Seeding proposals…");
  const proposals = [
    {
      client_name: "Sarah Chen", client_company: "Acme Corp",
      project_type: "Web Design & Development",
      project_description: "Full redesign of Acme Corp's customer-facing portal with React and a headless CMS. Mobile-first, WCAG 2.1 AA compliant.",
      deliverables: "• Responsive website (12 pages)\n• CMS integration (Contentful)\n• SEO optimisation\n• 3 rounds of revisions\n• Handover documentation",
      timeline: "May 1, 2026 → Jun 30, 2026",
      tone: "professional", currency: "USD",
      total_budget: 18500, deposit_percent: 50, deposit_amount: 9250,
      freelancer_name: "Surendar N", freelancer_title: "Full-Stack Developer",
      freelancer_email: EMAIL,
      proposal_text: `# Project Proposal\n## Web Portal Redesign — Acme Corp\n\n**Prepared for:** Sarah Chen | Acme Corp\n**Prepared by:** Surendar N\n**Date:** May 2026\n\n---\n\n## Executive Summary\n\nThis proposal outlines the complete redesign of Acme Corp's customer portal using a modern React stack with Contentful CMS integration. The result will be a fast, accessible, and maintainable web experience that reduces support requests and increases customer satisfaction.\n\n## Scope of Work\n\n1. Discovery & Architecture planning\n2. UI/UX design system creation\n3. React frontend development (12 pages)\n4. Contentful CMS integration\n5. Performance optimisation & SEO\n6. UAT and launch support\n\n## Investment\n\nTotal: USD 18,500\nDeposit (50%): USD 9,250 — due on contract signing`,
      status: "viewed", view_count: 4,
    },
    {
      client_name: "Marcus Reid", client_company: "Nova Labs",
      project_type: "Mobile App Development",
      project_description: "Cross-platform React Native app for Nova Labs' field service team. Offline-first, GPS tracking, work order management.",
      deliverables: "• iOS & Android app\n• REST API integration\n• Offline sync\n• Admin dashboard\n• App Store submissions",
      timeline: "Jun 1, 2026 → Sep 30, 2026",
      tone: "professional", currency: "USD",
      total_budget: 42000, deposit_percent: 30, deposit_amount: 12600,
      freelancer_name: "Surendar N", freelancer_title: "Full-Stack Developer",
      freelancer_email: EMAIL,
      proposal_text: `# Project Proposal\n## Field Service Mobile App — Nova Labs\n\n**Total Investment:** USD 42,000\n\n## Overview\n\nA React Native application enabling Nova Labs field engineers to manage work orders, track assets, and sync data offline. Built for iOS and Android with a Node.js API backend.\n\n## Key Features\n\n- Offline-first architecture with background sync\n- Real-time GPS tracking and route optimisation\n- Work order creation, assignment, and completion\n- Photo capture and document attachment\n- Push notifications for urgent assignments`,
      status: "accepted", view_count: 8,
    },
    {
      client_name: "Priya Sharma", client_company: "Bloom Studio",
      project_type: "Branding & Identity",
      project_description: "Complete brand identity for Bloom Studio — logo, typography, colour palette, brand guidelines document.",
      deliverables: "• Logo (3 concepts, 2 revision rounds)\n• Brand guidelines PDF\n• Typography system\n• Social media kit\n• Business card designs",
      timeline: "Apr 20, 2026 → May 20, 2026",
      tone: "friendly", currency: "GBP",
      total_budget: 3800, deposit_percent: 50, deposit_amount: 1900,
      freelancer_name: "Surendar N", freelancer_title: "Full-Stack Developer",
      freelancer_email: EMAIL,
      proposal_text: `# Brand Identity Proposal\n## Bloom Studio\n\n**Investment:** GBP 3,800\n\nA comprehensive brand identity package that captures Bloom Studio's creative spirit — modern, warm, and distinctly memorable.\n\n## Deliverables\n\n- 3 logo concepts with full rationale\n- Selected concept refined through 2 revision rounds\n- Brand guidelines (50+ page PDF)\n- Typography and colour system\n- Social media templates`,
      status: "draft", view_count: 0,
    },
    {
      client_name: "James Okafor", client_company: "Titan Ventures",
      project_type: "SEO & Content Marketing",
      project_description: "6-month SEO retainer for Titan Ventures' SaaS product blog. Keyword strategy, content calendar, monthly reports.",
      deliverables: "• Monthly keyword research report\n• 8 long-form articles/month\n• Technical SEO audit\n• Backlink outreach\n• Monthly analytics dashboard",
      timeline: "Jan 1, 2026 → Jun 30, 2026",
      tone: "professional", currency: "USD",
      total_budget: 12000, deposit_percent: 100, deposit_amount: 2000,
      freelancer_name: "Surendar N", freelancer_title: "Full-Stack Developer",
      freelancer_email: EMAIL,
      proposal_text: `# SEO Retainer Proposal\n## Titan Ventures — 6 Month Engagement\n\n**Monthly Retainer:** USD 2,000 | **Total:** USD 12,000\n\nA results-driven SEO programme targeting Titan's ICP keywords to drive qualified inbound traffic within 90 days.`,
      status: "declined", view_count: 2,
    },
    {
      client_name: "Elena Vasquez", client_company: "PixelForge Agency",
      project_type: "UI/UX Design",
      project_description: "UX audit and redesign of PixelForge's SaaS dashboard. User research, wireframes, high-fidelity Figma prototypes.",
      deliverables: "• UX audit report\n• User journey maps\n• 40+ screen wireframes\n• High-fidelity Figma prototype\n• Design handover to dev team",
      timeline: "May 15, 2026 → Jul 15, 2026",
      tone: "bold", currency: "USD",
      total_budget: 9500, deposit_percent: 40, deposit_amount: 3800,
      freelancer_name: "Surendar N", freelancer_title: "Full-Stack Developer",
      freelancer_email: EMAIL,
      proposal_text: `# UX Design Proposal\n## PixelForge SaaS Dashboard Redesign\n\n**Investment:** USD 9,500\n\nA research-led redesign that cuts onboarding time by 40% and reduces support tickets — backed by user interviews and usability testing.\n\n## Process\n\n1. UX audit & heuristic evaluation (Week 1)\n2. User interviews & journey mapping (Week 2–3)\n3. Wireframes & information architecture (Week 4–5)\n4. High-fidelity prototype in Figma (Week 6–7)\n5. Developer handover & QA support (Week 8)`,
      status: "sent", view_count: 1,
    },
  ];

  const { data: savedProposals } = await supabase.from("proposals").insert(
    proposals.map(p => ({ ...p, user_id: userId }))
  ).select();
  console.log(`  ✅ ${savedProposals?.length ?? 0} proposals created`);

  // ── Contracts ─────────────────────────────────────────────────
  console.log("\n📋 Seeding contracts…");
  const contracts = [
    {
      contract_type_id: "independent-contractor",
      contract_type_name: "Independent Contractor Agreement",
      category: "Employment",
      governing_law: "California, United States",
      governing_country: "US", governing_state: "California",
      party_a_name: "Surendar N", party_a_role: "Company",
      party_b_name: "Sarah Chen / Acme Corp", party_b_role: "Contractor",
      contract_fields: { projectScope: "Web portal redesign", compensation: "18500", paymentTerms: "Net 14" },
      contract_text: "## INDEPENDENT CONTRACTOR AGREEMENT\n\nThis agreement is entered into between Surendar N (\"Company\") and Sarah Chen / Acme Corp (\"Contractor\")...\n\n**SIGNED**\nParty A: Surendar N\nParty B: Sarah Chen",
      status: "signed",
      signer_name: "Sarah Chen",
      signer_email: "sarah@acme.com",
      signature_data: "Sarah Chen",
      signature_type: "typed",
      signed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      contract_type_id: "nda",
      contract_type_name: "Non-Disclosure Agreement",
      category: "Confidentiality",
      governing_law: "New York, United States",
      governing_country: "US", governing_state: "New York",
      party_a_name: "Surendar N", party_a_role: "Disclosing Party",
      party_b_name: "Marcus Reid / Nova Labs", party_b_role: "Receiving Party",
      contract_fields: { ndaType: "Mutual", duration: "2", purpose: "Mobile app development engagement" },
      contract_text: "## MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis NDA is entered into between Surendar N and Marcus Reid / Nova Labs...",
      status: "signed",
      signer_name: "Marcus Reid",
      signed_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      contract_type_id: "retainer",
      contract_type_name: "Retainer Agreement",
      category: "Services",
      governing_law: "England and Wales",
      governing_country: "GB",
      party_a_name: "Surendar N", party_a_role: "Service Provider",
      party_b_name: "Priya Sharma / Bloom Studio", party_b_role: "Client",
      contract_fields: { monthlyFee: "3800", hoursIncluded: "40", overageRate: "95" },
      contract_text: "## RETAINER AGREEMENT\n\nThis Retainer Agreement is made between Surendar N (\"Provider\") and Priya Sharma / Bloom Studio (\"Client\")...",
      status: "reviewed",
    },
  ];

  const { data: savedContracts } = await supabase.from("contracts").insert(
    contracts.map(c => ({ ...c, user_id: userId }))
  ).select();
  console.log(`  ✅ ${savedContracts?.length ?? 0} contracts created`);

  // ── Projects ──────────────────────────────────────────────────
  console.log("\n📁 Seeding projects…");
  const projects = [
    {
      name: "Acme Corp Portal Redesign",
      description: "Full redesign of the customer-facing portal",
      color: "#0ea5e9", status: "active",
      due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      budget: 18500, currency: "USD",
      client_id: clientMap["Sarah Chen"] ?? null,
      tags: ["web", "react", "cms"],
    },
    {
      name: "Nova Labs Field App",
      description: "React Native offline-first field service app",
      color: "#7c3aed", status: "active",
      due_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      budget: 42000, currency: "USD",
      client_id: clientMap["Marcus Reid"] ?? null,
      tags: ["mobile", "react-native"],
    },
    {
      name: "Bloom Studio Branding",
      description: "Complete brand identity package",
      color: "#10b981", status: "planning",
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      budget: 3800, currency: "GBP",
      client_id: clientMap["Priya Sharma"] ?? null,
      tags: ["branding", "design"],
    },
  ];

  const { data: savedProjects } = await supabase.from("projects").insert(
    projects.map(p => ({ ...p, user_id: userId }))
  ).select();
  console.log(`  ✅ ${savedProjects?.length ?? 0} projects created`);

  // ── Tasks ─────────────────────────────────────────────────────
  if (savedProjects?.length) {
    console.log("\n✅ Seeding tasks…");
    const acmeProject = savedProjects.find(p => p.name.includes("Acme"));
    const novaProject  = savedProjects.find(p => p.name.includes("Nova"));

    const tasks = [
      // Acme tasks
      ...(acmeProject ? [
        { title: "Discovery call & requirements sign-off",  status: "done",        priority: "high",   project_id: acmeProject.id, position: 0 },
        { title: "UI/UX wireframes — 12 page layouts",      status: "done",        priority: "high",   project_id: acmeProject.id, position: 1 },
        { title: "Design system & component library",       status: "in_progress", priority: "high",   project_id: acmeProject.id, position: 2 },
        { title: "Homepage & product pages development",    status: "in_progress", priority: "medium", project_id: acmeProject.id, position: 3 },
        { title: "Contentful CMS integration",             status: "todo",        priority: "medium", project_id: acmeProject.id, position: 4 },
        { title: "SEO metadata & sitemap",                 status: "todo",        priority: "low",    project_id: acmeProject.id, position: 5 },
        { title: "Client UAT & feedback round",            status: "todo",        priority: "high",   project_id: acmeProject.id, position: 6 },
        { title: "Launch & handover documentation",        status: "todo",        priority: "medium", project_id: acmeProject.id, position: 7 },
      ] : []),
      // Nova tasks
      ...(novaProject ? [
        { title: "Technical architecture & API design",    status: "done",        priority: "urgent", project_id: novaProject.id, position: 0 },
        { title: "React Native project scaffold",         status: "done",        priority: "high",   project_id: novaProject.id, position: 1 },
        { title: "Offline sync engine (WatermelonDB)",    status: "in_progress", priority: "urgent", project_id: novaProject.id, position: 2 },
        { title: "GPS tracking module",                   status: "todo",        priority: "high",   project_id: novaProject.id, position: 3 },
        { title: "Work order management screens",         status: "todo",        priority: "high",   project_id: novaProject.id, position: 4 },
        { title: "Admin dashboard (web)",                 status: "todo",        priority: "medium", project_id: novaProject.id, position: 5 },
      ] : []),
    ];

    const { data: savedTasks } = await supabase.from("tasks").insert(
      tasks.map(t => ({ ...t, user_id: userId }))
    ).select();
    console.log(`  ✅ ${savedTasks?.length ?? 0} tasks created`);
  }

  // ── Invoices ──────────────────────────────────────────────────
  console.log("\n💰 Seeding invoices…");
  const invoices = [
    {
      invoice_number: "INV-0001", title: "Acme Corp — Phase 1 Deposit",
      client_id: clientMap["Sarah Chen"] ?? null,
      line_items: [{ description: "Web portal redesign — 50% deposit", quantity: 1, unit_price: 9250, amount: 9250 }],
      subtotal: 9250, tax_rate: 0, tax_amount: 0, discount: 0, total: 9250,
      currency: "USD", status: "paid",
      due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      paid_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      invoice_number: "INV-0002", title: "Nova Labs — Project Deposit",
      client_id: clientMap["Marcus Reid"] ?? null,
      line_items: [{ description: "Mobile app development — 30% deposit", quantity: 1, unit_price: 12600, amount: 12600 }],
      subtotal: 12600, tax_rate: 0, tax_amount: 0, discount: 0, total: 12600,
      currency: "USD", status: "paid",
      due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      paid_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      invoice_number: "INV-0003", title: "Bloom Studio — Brand Identity",
      client_id: clientMap["Priya Sharma"] ?? null,
      line_items: [{ description: "Brand identity package — 50% deposit", quantity: 1, unit_price: 1900, amount: 1900 }],
      subtotal: 1900, tax_rate: 20, tax_amount: 380, discount: 0, total: 2280,
      currency: "GBP", status: "sent",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      invoice_number: "INV-0004", title: "PixelForge — UX Design Phase 1",
      client_id: clientMap["Elena Vasquez"] ?? null,
      line_items: [
        { description: "UX audit & research", quantity: 1, unit_price: 2500, amount: 2500 },
        { description: "Wireframe design (40 screens)", quantity: 1, unit_price: 1300, amount: 1300 },
      ],
      subtotal: 3800, tax_rate: 0, tax_amount: 0, discount: 0, total: 3800,
      currency: "USD", status: "overdue",
      due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const { data: savedInvoices } = await supabase.from("invoices").insert(
    invoices.map(i => ({ ...i, user_id: userId }))
  ).select();
  console.log(`  ✅ ${savedInvoices?.length ?? 0} invoices created`);

  // ── Content Library ───────────────────────────────────────────
  console.log("\n📚 Seeding content library…");
  const library = [
    {
      title: "About Me — Full-Stack Developer",
      category: "About Me",
      tags: ["bio", "intro", "developer"],
      content: "I'm a full-stack developer with 7+ years of experience building web and mobile products for startups and scale-ups. I specialise in React, Node.js, and cloud-native architectures. I've shipped products used by 500,000+ users and helped clients reduce time-to-market by an average of 40%.",
      use_count: 12,
    },
    {
      title: "Standard Revision Policy",
      category: "Terms & Conditions",
      tags: ["revisions", "terms", "policy"],
      content: "**Revision Policy**\n\nThis project includes 3 rounds of revisions at each milestone. A revision round consists of one consolidated feedback document — not multiple individual requests. Additional revisions beyond the included rounds are billed at my standard hourly rate of $95/hr.",
      use_count: 8,
    },
    {
      title: "Acme Corp — E-commerce Case Study",
      category: "Case Study",
      tags: ["ecommerce", "react", "performance"],
      content: "**Case Study: E-Commerce Platform Redesign**\n\nRedesigned Acme Corp's checkout flow, reducing cart abandonment by 34% and increasing average order value by 18%. Migrated from a legacy jQuery codebase to React in 8 weeks without downtime. Result: $2.1M additional revenue in the first 6 months post-launch.",
      use_count: 5,
    },
    {
      title: "Payment Terms — Net 14",
      category: "Terms & Conditions",
      tags: ["payment", "terms", "net14"],
      content: "**Payment Terms**\n\nInvoices are due within 14 days of issue. Late payments incur a 1.5% monthly interest charge. All work pauses on overdue invoices until payment is received. Payments accepted via Stripe (card) or bank transfer.",
      use_count: 15,
    },
    {
      title: "Why Work With Me",
      category: "Why Choose Me",
      tags: ["pitch", "value", "differentiator"],
      content: "**Why clients choose me:**\n\n• **Senior-only execution** — You work directly with me, not handed off to juniors\n• **Weekly demos** — You see real progress every Friday, not just a final reveal\n• **Fixed-price delivery** — No surprise invoices for scope that was always part of the project\n• **Post-launch support** — 30 days of bug-fix support included at no charge",
      use_count: 9,
    },
  ];

  const { data: savedLibrary } = await supabase.from("content_library").insert(
    library.map(l => ({ ...l, user_id: userId }))
  ).select();
  console.log(`  ✅ ${savedLibrary?.length ?? 0} content library items created`);

  // ── Summary ───────────────────────────────────────────────────
  console.log("\n🎬 Demo data seeded successfully!\n");
  console.log("  Clients:          5");
  console.log("  Proposals:        5  (draft / sent / viewed / accepted / declined)");
  console.log("  Contracts:        3  (signed / reviewed / draft)");
  console.log("  Projects:         3  (active / planning)");
  console.log("  Tasks:           14");
  console.log("  Invoices:         4  (paid / sent / overdue)");
  console.log("  Library items:    5");
  console.log("\n👉 Open http://localhost:3000/dashboard and start recording!\n");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
