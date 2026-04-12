/**
 * Functional Tests — Client Portals
 * Tests both freelancer (full access) and client (portal-only access)
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signInFreelancer, signInClient, CLIENT_EMAIL, uid } from "./setup";
import type { SupabaseClient } from "@supabase/supabase-js";

let fsb: SupabaseClient;
let csb: SupabaseClient;
let portalId: string;
let portalToken: string;
let invoiceId: string;
let fileId: string;

describe("Client Portals — access control", () => {
  beforeAll(async () => { fsb = await signInFreelancer(); csb = await signInClient(); });
  afterAll(async () => {
    if (invoiceId) await fsb.from("portal_invoices").delete().eq("id", invoiceId);
    if (fileId)    await fsb.from("portal_files").delete().eq("id", fileId);
    // clean messages
    if (portalId) {
      await fsb.from("portal_messages").delete().eq("portal_id", portalId);
      await fsb.from("client_portals").delete().eq("id", portalId);
    }
  });

  // ── Freelancer creates the portal ─────────────────────────

  it("POST — freelancer creates portal linked to client email", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("client_portals").insert({
      user_id: user!.id,
      title: uid("Portal"),
      client_name: "Test Client",
      client_email: CLIENT_EMAIL,   // ← links this portal to the client user
      welcome_message: "Welcome to your portal!",
      is_active: true,
      brand_override: { primaryColor: "#0ea5e9", companyName: "Test Studio" },
    }).select().single();
    expect(error).toBeNull();
    portalId    = data!.id;
    portalToken = data!.token;
    console.log(`    ✅ Portal created for ${CLIENT_EMAIL} — token ${portalToken.slice(0,8)}…`);
  });

  it("GET — freelancer sees portal in their list", async () => {
    const { data, error } = await fsb.from("client_portals").select("id,client_email").order("created_at", { ascending: false });
    expect(error).toBeNull();
    expect(data!.find(p => p.id === portalId)).not.toBeUndefined();
    console.log(`    ✅ Freelancer sees ${data!.length} portal(s)`);
  });

  // ── Freelancer adds files + invoice ────────────────────────

  it("POST — freelancer adds a file to portal", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("portal_files").insert({
      portal_id: portalId, user_id: user!.id,
      name: "Project Brief.pdf", size_bytes: 204800,
      mime_type: "application/pdf", category: "document",
      storage_path: `${portalId}/brief.pdf`,
      storage_url: "https://example.com/brief.pdf",
      uploaded_by: "freelancer",
    }).select().single();
    expect(error).toBeNull();
    fileId = data!.id;
    console.log(`    ✅ File added: ${data!.name}`);
  });

  it("POST — freelancer creates invoice in portal", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("portal_invoices").insert({
      portal_id: portalId, user_id: user!.id,
      invoice_number: "INV-001", title: "Phase 1 Deposit",
      line_items: [{ description: "Deposit", quantity: 1, unit_price: 4250, amount: 4250 }],
      subtotal: 4250, tax_rate: 0, tax_amount: 0, total: 4250,
      currency: "USD", status: "sent",
      due_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    }).select().single();
    expect(error).toBeNull();
    invoiceId = data!.id;
    console.log(`    ✅ Invoice created: ${data!.invoice_number} — $${data!.total}`);
  });

  // ── Client access (READ their portal) ─────────────────────

  it("GET — client sees portal (by email match via RLS)", async () => {
    const { data, error } = await csb.from("client_portals")
      .select("id,title,client_email").eq("is_active", true);
    expect(error).toBeNull();
    const found = data!.find(p => p.id === portalId);
    expect(found).not.toBeUndefined();
    console.log(`    ✅ Client sees portal: "${found!.title}"`);
  });

  it("GET — client sees files in their portal", async () => {
    const { data, error } = await csb.from("portal_files").select("id,name").eq("portal_id", portalId);
    expect(error).toBeNull();
    expect(data!.length).toBe(1);
    expect(data![0].name).toBe("Project Brief.pdf");
    console.log(`    ✅ Client sees ${data!.length} file(s)`);
  });

  it("GET — client sees invoices in their portal", async () => {
    const { data, error } = await csb.from("portal_invoices").select("id,total,status").eq("portal_id", portalId);
    expect(error).toBeNull();
    expect(data!.length).toBe(1);
    expect(data![0].total).toBe(4250);
    console.log(`    ✅ Client sees ${data!.length} invoice(s) — total $${data![0].total}`);
  });

  // ── Chat (bidirectional) ───────────────────────────────────

  it("POST — freelancer sends a message", async () => {
    const { data, error } = await fsb.from("portal_messages").insert({
      portal_id: portalId, sender: "freelancer",
      sender_name: "Test Studio", content: "Hi! Your portal is ready.",
      read_by_client: false,
    }).select().single();
    expect(error).toBeNull();
    console.log(`    ✅ Freelancer message sent`);
  });

  it("POST — client replies (RLS allows client INSERT)", async () => {
    const { data, error } = await csb.from("portal_messages").insert({
      portal_id: portalId, sender: "client",
      sender_name: "Test Client", content: "Great, thank you!",
      read_by_freelancer: false,
    }).select().single();
    expect(error).toBeNull();
    console.log(`    ✅ Client replied: "${data!.content}"`);
  });

  it("GET — both users see full chat history", async () => {
    const [{ data: fd }, { data: cd }] = await Promise.all([
      fsb.from("portal_messages").select("sender,content").eq("portal_id", portalId).order("created_at"),
      csb.from("portal_messages").select("sender,content").eq("portal_id", portalId).order("created_at"),
    ]);
    expect(fd!.length).toBe(2);
    expect(cd!.length).toBe(2);
    expect(fd![0].sender).toBe("freelancer");
    expect(fd![1].sender).toBe("client");
    console.log(`    ✅ Both users see ${fd!.length} messages in correct order`);
  });

  // ── Client CANNOT access other freelancer data ─────────────

  it("GET — client CANNOT access proposals (RLS)", async () => {
    const { data } = await csb.from("proposals").select("id").limit(5);
    expect(data!.length).toBe(0);
    console.log(`    ✅ Client: proposals blocked ✓`);
  });

  it("GET — client CANNOT access another portal (wrong email)", async () => {
    // A portal with a DIFFERENT client_email should not be visible
    const { data: { user } } = await fsb.auth.getUser();
    const { data: otherPortal } = await fsb.from("client_portals").insert({
      user_id: user!.id, client_name: "Other Client",
      client_email: "other@different.com",   // ← different email
      is_active: true,
    }).select().single();

    if (otherPortal) {
      const { data: clientView } = await csb.from("client_portals").select("id").eq("id", otherPortal.id);
      expect(clientView!.length).toBe(0);
      await fsb.from("client_portals").delete().eq("id", otherPortal!.id);
      console.log(`    ✅ Client cannot see portals belonging to other emails ✓`);
    }
  });

  // ── Token-based public access ──────────────────────────────

  it("GET — portal accessible by token without auth (public page)", async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const anon = createClient(
      "https://ubutaehhczggyhyjgqjp.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidXRhZWhoY3pnZ3loeWpncWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjcwNjcsImV4cCI6MjA5MTMwMzA2N30.V44I9WPTDB8HucV7IPBiP5PVHI1uZq3LWHR1VWqgTek"
    );
    const { data } = await anon.from("client_portals").select("id,title,client_name").eq("token", portalToken).maybeSingle();
    expect(data).not.toBeNull();
    expect(data!.id).toBe(portalId);
    console.log(`    ✅ Public token access works: "${data!.title}"`);
  });
});
