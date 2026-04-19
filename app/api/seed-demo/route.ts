import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { createClient as createAdmin } from "@supabase/supabase-js";

function admin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;
  const userId = user.id;
  const db = admin();

  // Check if already seeded
  const { data: profile } = await db.from("profiles").select("has_demo_data").eq("id", userId).maybeSingle();
  if (profile?.has_demo_data) {
    return NextResponse.json({ ok: true, message: "Already seeded" });
  }

  // ── Clients ──────────────────────────────────────────────────
  const { data: clients } = await db.from("clients").insert([
    { user_id: userId, name: "Sarah Chen",    company: "Acme Corp",        email: "sarah@acme.com",      status: "active",   avatar_color: "#0ea5e9" },
    { user_id: userId, name: "Marcus Reid",   company: "Nova Labs",         email: "marcus@novalabs.io",  status: "active",   avatar_color: "#7c3aed" },
    { user_id: userId, name: "Priya Sharma",  company: "Bloom Studio",      email: "priya@bloom.studio",  status: "active",   avatar_color: "#10b981" },
    { user_id: userId, name: "Elena Vasquez", company: "PixelForge Agency", email: "elena@pixelforge.co", status: "active",   avatar_color: "#ef4444" },
    { user_id: userId, name: "James Okafor",  company: "Titan Ventures",    email: "james@titanvc.com",   status: "inactive", avatar_color: "#f59e0b" },
  ]).select();

  const clientMap: Record<string, string> = {};
  (clients ?? []).forEach(c => { clientMap[c.name] = c.id; });

  // ── Proposals ─────────────────────────────────────────────────
  await db.from("proposals").insert([
    { user_id: userId, client_name: "Sarah Chen",    client_company: "Acme Corp",        project_type: "Web Design & Development",  total_budget: 18500, deposit_percent: 50, deposit_amount: 9250,  currency: "USD", tone: "professional", status: "viewed",    view_count: 4, freelancer_name: user.user_metadata?.full_name ?? "Freelancer", freelancer_email: user.email, timeline: "May 1, 2026 → Jun 30, 2026",  proposal_text: "# Proposal\n## Web Portal Redesign — Acme Corp\n\nPrepared for Sarah Chen | Acme Corp\n\n---\n\n## Executive Summary\n\nFull redesign of Acme Corp's customer portal using React + Contentful CMS.\n\n## Investment\n\nTotal: USD 18,500 · Deposit: USD 9,250" },
    { user_id: userId, client_name: "Marcus Reid",   client_company: "Nova Labs",         project_type: "Mobile App Development",    total_budget: 42000, deposit_percent: 30, deposit_amount: 12600, currency: "USD", tone: "professional", status: "accepted",  view_count: 8, freelancer_name: user.user_metadata?.full_name ?? "Freelancer", freelancer_email: user.email, timeline: "Jun 1, 2026 → Sep 30, 2026",  proposal_text: "# Proposal\n## Field Service Mobile App — Nova Labs\n\n**Total:** USD 42,000\n\nReact Native offline-first app for iOS & Android with GPS tracking and work order management." },
    { user_id: userId, client_name: "Priya Sharma",  client_company: "Bloom Studio",      project_type: "Branding & Identity",       total_budget: 3800,  deposit_percent: 50, deposit_amount: 1900,  currency: "GBP", tone: "friendly",     status: "sent",      view_count: 1, freelancer_name: user.user_metadata?.full_name ?? "Freelancer", freelancer_email: user.email, timeline: "Apr 20, 2026 → May 20, 2026", proposal_text: "# Proposal\n## Brand Identity — Bloom Studio\n\n**Investment:** GBP 3,800\n\nComplete brand identity: logo, typography, colour palette, guidelines, and social media kit." },
    { user_id: userId, client_name: "Elena Vasquez", client_company: "PixelForge Agency", project_type: "UI/UX Design",              total_budget: 9500,  deposit_percent: 40, deposit_amount: 3800,  currency: "USD", tone: "bold",         status: "draft",     view_count: 0, freelancer_name: user.user_metadata?.full_name ?? "Freelancer", freelancer_email: user.email, timeline: "May 15, 2026 → Jul 15, 2026", proposal_text: "# Proposal\n## UX Dashboard Redesign — PixelForge\n\n**Investment:** USD 9,500\n\nResearch-led redesign: UX audit, user interviews, 40+ wireframes, Figma prototype." },
    { user_id: userId, client_name: "James Okafor",  client_company: "Titan Ventures",    project_type: "SEO & Content Marketing",   total_budget: 12000, deposit_percent: 100, deposit_amount: 2000, currency: "USD", tone: "professional", status: "declined",  view_count: 2, freelancer_name: user.user_metadata?.full_name ?? "Freelancer", freelancer_email: user.email, timeline: "Jan 1, 2026 → Jun 30, 2026",  proposal_text: "# Proposal\n## SEO Retainer — Titan Ventures\n\n**Monthly:** USD 2,000 · **Total:** USD 12,000\n\n6-month SEO programme: keyword strategy, 8 articles/month, technical audit." },
  ]);

  // ── Contracts ─────────────────────────────────────────────────
  await db.from("contracts").insert([
    { user_id: userId, contract_type_id: "independent-contractor", contract_type_name: "Independent Contractor Agreement", category: "Employment",      governing_law: "California, United States", governing_country: "US", governing_state: "California", party_a_name: user.user_metadata?.full_name ?? "Freelancer", party_a_role: "Company",          party_b_name: "Sarah Chen / Acme Corp",         party_b_role: "Contractor",     contract_fields: { projectScope: "Web portal redesign", compensation: "18500" }, contract_text: "## INDEPENDENT CONTRACTOR AGREEMENT\n\nThis agreement is entered into between the parties listed below.\n\n**Signed by:** Sarah Chen", status: "signed",   signer_name: "Sarah Chen",   signature_data: "Sarah Chen",   signature_type: "typed", signed_at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { user_id: userId, contract_type_id: "nda",                    contract_type_name: "Non-Disclosure Agreement",         category: "Confidentiality", governing_law: "New York, United States",    governing_country: "US", governing_state: "New York",   party_a_name: user.user_metadata?.full_name ?? "Freelancer", party_a_role: "Disclosing Party", party_b_name: "Marcus Reid / Nova Labs",         party_b_role: "Receiving Party", contract_fields: { ndaType: "Mutual", duration: "2" },           contract_text: "## MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis NDA is entered into between the parties below.", status: "signed",   signer_name: "Marcus Reid",  signature_data: "Marcus Reid",  signature_type: "typed", signed_at: new Date(Date.now() - 14 * 86400000).toISOString() },
    { user_id: userId, contract_type_id: "retainer",               contract_type_name: "Retainer Agreement",              category: "Services",        governing_law: "England and Wales",         governing_country: "GB",                                party_a_name: user.user_metadata?.full_name ?? "Freelancer", party_a_role: "Service Provider", party_b_name: "Priya Sharma / Bloom Studio",     party_b_role: "Client",         contract_fields: { monthlyFee: "3800" },                          contract_text: "## RETAINER AGREEMENT\n\nMonthly retainer for brand identity services.",                  status: "reviewed" },
  ]);

  // ── Projects ──────────────────────────────────────────────────
  const { data: projects } = await db.from("projects").insert([
    { user_id: userId, name: "Acme Corp Portal Redesign", description: "Full redesign of the customer-facing portal", color: "#0ea5e9", status: "active",   due_date: new Date(Date.now() + 60 * 86400000).toISOString(),  budget: 18500, currency: "USD", client_id: clientMap["Sarah Chen"]    ?? null, tags: ["web","react","cms"] },
    { user_id: userId, name: "Nova Labs Field App",       description: "React Native offline-first app",             color: "#7c3aed", status: "active",   due_date: new Date(Date.now() + 120 * 86400000).toISOString(), budget: 42000, currency: "USD", client_id: clientMap["Marcus Reid"]   ?? null, tags: ["mobile","react-native"] },
    { user_id: userId, name: "Bloom Studio Branding",    description: "Complete brand identity package",            color: "#10b981", status: "planning", due_date: new Date(Date.now() + 30 * 86400000).toISOString(),  budget: 3800,  currency: "GBP", client_id: clientMap["Priya Sharma"]  ?? null, tags: ["branding","design"] },
  ]).select();

  // ── Tasks ─────────────────────────────────────────────────────
  const acmeId = projects?.find(p => p.name.includes("Acme"))?.id;
  const novaId  = projects?.find(p => p.name.includes("Nova"))?.id;

  const taskRows = [
    ...(acmeId ? [
      { user_id: userId, project_id: acmeId, title: "Discovery call & requirements sign-off",  status: "done",        priority: "high",   position: 0 },
      { user_id: userId, project_id: acmeId, title: "UI/UX wireframes — 12 page layouts",      status: "done",        priority: "high",   position: 1 },
      { user_id: userId, project_id: acmeId, title: "Design system & component library",       status: "in_progress", priority: "high",   position: 2 },
      { user_id: userId, project_id: acmeId, title: "Homepage & product pages development",    status: "in_progress", priority: "medium", position: 3 },
      { user_id: userId, project_id: acmeId, title: "Contentful CMS integration",             status: "todo",        priority: "medium", position: 4 },
      { user_id: userId, project_id: acmeId, title: "Client UAT & feedback round",            status: "todo",        priority: "high",   position: 5 },
    ] : []),
    ...(novaId ? [
      { user_id: userId, project_id: novaId, title: "Technical architecture & API design",    status: "done",        priority: "urgent", position: 0 },
      { user_id: userId, project_id: novaId, title: "React Native project scaffold",         status: "done",        priority: "high",   position: 1 },
      { user_id: userId, project_id: novaId, title: "Offline sync engine",                   status: "in_progress", priority: "urgent", position: 2 },
      { user_id: userId, project_id: novaId, title: "GPS tracking module",                   status: "todo",        priority: "high",   position: 3 },
      { user_id: userId, project_id: novaId, title: "Work order management screens",         status: "todo",        priority: "high",   position: 4 },
    ] : []),
  ];
  if (taskRows.length) await db.from("tasks").insert(taskRows);

  // ── Invoices ──────────────────────────────────────────────────
  await db.from("invoices").insert([
    { user_id: userId, client_id: clientMap["Sarah Chen"]    ?? null, invoice_number: "INV-0001", title: "Acme Corp — Phase 1 Deposit",     line_items: [{ description: "Web portal redesign — 50% deposit", quantity: 1, unit_price: 9250, amount: 9250 }],    subtotal: 9250,  tax_rate: 0,  tax_amount: 0,   discount: 0, total: 9250,  currency: "USD", status: "paid",    due_date: new Date(Date.now() - 10 * 86400000).toISOString(), paid_at: new Date(Date.now() - 8 * 86400000).toISOString() },
    { user_id: userId, client_id: clientMap["Marcus Reid"]   ?? null, invoice_number: "INV-0002", title: "Nova Labs — Project Deposit",      line_items: [{ description: "Mobile app — 30% deposit", quantity: 1, unit_price: 12600, amount: 12600 }],          subtotal: 12600, tax_rate: 0,  tax_amount: 0,   discount: 0, total: 12600, currency: "USD", status: "paid",    due_date: new Date(Date.now() - 5 * 86400000).toISOString(),  paid_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { user_id: userId, client_id: clientMap["Priya Sharma"]  ?? null, invoice_number: "INV-0003", title: "Bloom Studio — Brand Identity",    line_items: [{ description: "Brand identity — 50% deposit", quantity: 1, unit_price: 1900, amount: 1900 }],        subtotal: 1900,  tax_rate: 20, tax_amount: 380, discount: 0, total: 2280,  currency: "GBP", status: "sent",    due_date: new Date(Date.now() + 7 * 86400000).toISOString() },
    { user_id: userId, client_id: clientMap["Elena Vasquez"] ?? null, invoice_number: "INV-0004", title: "PixelForge — UX Design Phase 1",   line_items: [{ description: "UX audit & wireframes", quantity: 1, unit_price: 3800, amount: 3800 }],               subtotal: 3800,  tax_rate: 0,  tax_amount: 0,   discount: 0, total: 3800,  currency: "USD", status: "overdue", due_date: new Date(Date.now() - 3 * 86400000).toISOString() },
  ]);

  // ── Content Library ───────────────────────────────────────────
  await db.from("content_library").insert([
    { user_id: userId, title: "About Me — Full-Stack Developer", category: "About Me",            tags: ["bio","intro"],            use_count: 0, content: "I'm a full-stack developer with 7+ years of experience building web and mobile products for startups and scale-ups. I specialise in React, Node.js, and cloud-native architectures. I've shipped products used by 500,000+ users and helped clients reduce time-to-market by an average of 40%." },
    { user_id: userId, title: "Standard Revision Policy",        category: "Terms & Conditions",  tags: ["revisions","terms"],      use_count: 0, content: "**Revision Policy:** This project includes 3 rounds of revisions. A revision round is one consolidated feedback document. Additional revisions are billed at my standard rate." },
    { user_id: userId, title: "Payment Terms — Net 14",          category: "Terms & Conditions",  tags: ["payment","net14"],        use_count: 0, content: "**Payment Terms:** Invoices are due within 14 days of issue. Late payments incur 1.5% monthly interest. All work pauses on overdue invoices." },
    { user_id: userId, title: "Why Work With Me",                category: "Why Choose Me",       tags: ["pitch","value"],          use_count: 0, content: "**Why clients choose me:**\n• Senior-only execution — you work directly with me\n• Weekly demos — real progress every Friday\n• Fixed-price delivery — no surprise invoices\n• 30 days post-launch bug-fix support included" },
    { user_id: userId, title: "Case Study Template",             category: "Case Study",          tags: ["case-study","results"],   use_count: 0, content: "**Case Study:** [Project Name]\n\nRedesigned [client]'s [product], reducing [metric] by [X]% and increasing [metric] by [Y]%. Migrated from [old] to [new] in [timeframe] without downtime. Result: [business outcome]." },
  ]);

  // ── Mark profile as seeded + ensure trial is set ─────────────
  const trialEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await db.from("profiles").upsert({
    id: userId,
    has_demo_data: true,
    demo_seeded_at: new Date().toISOString(),
    trial_ends_at: trialEnd,
  }, { onConflict: "id" });

  return NextResponse.json({ ok: true, message: "Demo data seeded" });
}
