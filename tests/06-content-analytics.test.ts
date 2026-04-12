import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signInFreelancer, signInClient, uid } from "./setup";
import type { SupabaseClient } from "@supabase/supabase-js";

let fsb: SupabaseClient;
let csb: SupabaseClient;
let libId: string;
let notifId: string;

describe("Content Library & Analytics", () => {
  beforeAll(async () => { fsb = await signInFreelancer(); csb = await signInClient(); });
  afterAll(async () => {
    if (libId)   await fsb.from("content_library").delete().eq("id", libId);
    if (notifId) await fsb.from("notifications").delete().eq("id", notifId);
  });

  it("POST — save section to content library", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("content_library").insert({
      user_id: user!.id, title: uid("About Me"),
      content: "<p>I'm a developer with 8 years experience.</p>",
      category: "About Me", tags: ["intro"], use_count: 0,
    }).select().single();
    expect(error).toBeNull();
    libId = data!.id;
    console.log(`    ✅ Saved: "${data!.title}"`);
  });

  it("GET — list library items by category", async () => {
    const { data, error } = await fsb.from("content_library").select("*").eq("category", "About Me");
    expect(error).toBeNull();
    expect(data!.find(i => i.id === libId)).not.toBeUndefined();
    console.log(`    ✅ ${data!.length} "About Me" section(s)`);
  });

  it("GET — client CANNOT access content library (RLS)", async () => {
    const { data } = await csb.from("content_library").select("id").limit(5);
    expect(data!.length).toBe(0);
    console.log(`    ✅ Client: content library blocked ✓`);
  });

  it("POST — notification created on proposal view", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("notifications").insert({
      user_id: user!.id, type: "proposal_viewed",
      title: "Client viewed your proposal", message: "2 min ago", read: false,
    }).select().single();
    expect(error).toBeNull();
    notifId = data!.id;
    console.log(`    ✅ Notification: "${data!.title}"`);
  });

  it("GET — unread notifications count", async () => {
    const { data, error } = await fsb.from("notifications").select("*").eq("read", false);
    expect(error).toBeNull();
    expect(data!.find(n => n.id === notifId)).not.toBeUndefined();
    console.log(`    ✅ ${data!.length} unread notification(s)`);
  });

  it("GET — countries table: 100+ global records exist", async () => {
    const { data } = await fsb.from("countries").select("code,name,region");
    expect(data!.length).toBeGreaterThan(100);
    expect(data!.find(c => c.code === "US")).not.toBeUndefined();
    expect(data!.find(c => c.code === "IN")).not.toBeUndefined();
    console.log(`    ✅ Countries: ${data!.length} records`);
  });
});
