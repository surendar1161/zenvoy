import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signInFreelancer, signInClient, uid } from "./setup";
import type { SupabaseClient } from "@supabase/supabase-js";

let fsb: SupabaseClient;
let csb: SupabaseClient;
let projId: string;
const taskIds: string[] = [];

describe("Projects & Tasks", () => {
  beforeAll(async () => { fsb = await signInFreelancer(); csb = await signInClient(); });
  afterAll(async () => {
    for (const id of taskIds) await fsb.from("tasks").delete().eq("id", id);
    if (projId) await fsb.from("projects").delete().eq("id", projId);
  });

  it("POST — freelancer creates project", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    const { data, error } = await fsb.from("projects").insert({
      user_id: user!.id, name: uid("Project"), color: "#7c3aed",
      status: "active", budget: 10000, currency: "USD",
      due_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    }).select().single();
    expect(error).toBeNull();
    projId = data!.id;
    console.log(`    ✅ Project created: ${data!.name}`);
  });

  it("POST — creates 3 tasks (todo/in_progress/done)", async () => {
    const { data: { user } } = await fsb.auth.getUser();
    for (const [i, s] of (["todo","in_progress","done"] as const).entries()) {
      const { data, error } = await fsb.from("tasks").insert({
        user_id: user!.id, project_id: projId,
        title: `Task ${i+1} — ${s}`, status: s,
        priority: ["low","medium","high"][i],
        position: i,
        completed_at: s === "done" ? new Date().toISOString() : null,
      }).select().single();
      expect(error).toBeNull();
      taskIds.push(data!.id);
    }
    console.log(`    ✅ 3 tasks created`);
  });

  it("GET — lists tasks for project", async () => {
    const { data, error } = await fsb.from("tasks").select("*").eq("project_id", projId);
    expect(error).toBeNull();
    expect(data!.length).toBe(3);
    console.log(`    ✅ 3 tasks listed`);
  });

  it("GET — progress = 1/3 done = 33%", async () => {
    const { data } = await fsb.from("tasks").select("status").eq("project_id", projId);
    const done = data!.filter(t => t.status === "done").length;
    expect(Math.round(done / data!.length * 100)).toBe(33);
    console.log(`    ✅ Progress: ${done}/3 = 33%`);
  });

  it("PATCH — update todo task to done", async () => {
    const { data } = await fsb.from("tasks").update({ status: "done", completed_at: new Date().toISOString() })
      .eq("id", taskIds[0]).select().single();
    expect(data!.status).toBe("done");
    console.log(`    ✅ Task → done (progress now 67%)`);
  });

  it("GET — client CANNOT access projects (RLS)", async () => {
    const { data } = await csb.from("projects").select("id").limit(5);
    expect(data!.length).toBe(0);
    console.log(`    ✅ Client sees 0 projects (RLS enforced)`);
  });
});
