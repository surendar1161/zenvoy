/**
 * Functional Tests — Clients Tab (Freelancer access)
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signInFreelancer, signInClient, uid } from "./setup";
import type { SupabaseClient } from "@supabase/supabase-js";

let fsb: SupabaseClient;
let csb: SupabaseClient;
let clientId: string;
const NAME = uid("Client");

describe("Clients — freelancer CRUD", () => {
  beforeAll(async () => { fsb = await signInFreelancer(); csb = await signInClient(); });
  afterAll(async () => {
    if (clientId) await fsb.from("clients").delete().eq("id", clientId);
  });

  it("POST — freelancer creates a client", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("clients").insert({
      user_id: user!.id, name: NAME, company: "Test Corp",
      email: "testclient@corp.com", status: "active",
      avatar_color: "#0ea5e9", tags: ["test"],
    }).select().single();
    expect(error).toBeNull();
    expect(data!.name).toBe(NAME);
    clientId = data!.id;
    console.log(`    ✅ Created client: ${NAME} (${clientId})`);
  });

  it("GET — freelancer lists clients (sees own data)", async () => {
    const { data, error } = await fsb.from("clients").select("id,name").order("created_at", { ascending: false });
    expect(error).toBeNull();
    expect(data!.find(c => c.id === clientId)).not.toBeUndefined();
    console.log(`    ✅ Freelancer sees ${data!.length} client(s)`);
  });

  it("GET — client user CANNOT see clients table (RLS)", async () => {
    const { data, error } = await csb.from("clients").select("id").limit(5);
    // Should return empty array (RLS filters to user_id = their id, and they have none)
    expect(error).toBeNull();
    expect(data!.length).toBe(0);
    console.log(`    ✅ Client user sees 0 clients (RLS enforced)`);
  });

  it("PATCH — freelancer updates client status", async () => {
    const { data, error } = await fsb.from("clients")
      .update({ status: "inactive" }).eq("id", clientId).select().single();
    expect(error).toBeNull();
    expect(data!.status).toBe("inactive");
    console.log(`    ✅ Status updated → inactive`);
  });
});
