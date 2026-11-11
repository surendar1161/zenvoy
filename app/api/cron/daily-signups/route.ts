import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/**
 * Daily founder digest: emails the list of users who signed up during the
 * previous calendar day in IST (Asia/Kolkata, UTC+5:30, no DST).
 *
 * Required env: SUPABASE_SERVICE_ROLE_KEY (auth.admin needs it), RESEND_API_KEY,
 * ADMIN_REPORT_EMAIL (recipient). Optional: RESEND_FROM_EMAIL, CRON_SECRET.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const PER_PAGE = 1000;
const MAX_PAGES = 20;

function esc(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

/** Start/end (UTC ms) of yesterday in IST, plus its YYYY-MM-DD label. */
function yesterdayWindowIST(nowMs: number) {
  const istNow = nowMs + IST_OFFSET_MS;
  const todayStartIst = istNow - (istNow % DAY_MS);
  const startIst = todayStartIst - DAY_MS;
  return {
    startMs: startIst - IST_OFFSET_MS,
    endMs: todayStartIst - IST_OFFSET_MS,
    label: new Date(startIst).toISOString().slice(0, 10),
  };
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_REPORT_EMAIL;
  if (!serviceKey || !resendKey || !to) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY or ADMIN_REPORT_EMAIL" },
      { status: 500 },
    );
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { startMs, endMs, label } = yesterdayWindowIST(Date.now());
  const signups: { email: string; at: string; provider: string }[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: PER_PAGE });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    for (const u of data.users) {
      const t = new Date(u.created_at).getTime();
      if (t >= startMs && t < endMs) {
        signups.push({
          email: u.email ?? "(no email)",
          at: new Date(t).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }),
          provider: u.app_metadata?.provider ?? "email",
        });
      }
    }
    if (data.users.length < PER_PAGE) break;
  }

  signups.sort((a, b) => a.at.localeCompare(b.at));

  const rows = signups
    .map(s => `<tr><td style="padding:4px 12px 4px 0">${esc(s.email)}</td><td style="padding:4px 12px 4px 0">${esc(s.provider)}</td><td>${esc(s.at)} IST</td></tr>`)
    .join("");
  const html = signups.length
    ? `<p><b>${signups.length}</b> new sign-up${signups.length === 1 ? "" : "s"} on ${label}:</p><table style="font-size:14px">${rows}</table>`
    : `<p>No new sign-ups on ${label}.</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `DealPilot <${process.env.RESEND_FROM_EMAIL || "notifications@dealpilot.app"}>`,
      to: [to],
      subject: `DealPilot sign-ups ${label}: ${signups.length}`,
      html,
    }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: `Email provider returned ${res.status}` }, { status: 502 });
  }
  return NextResponse.json({ ok: true, date: label, count: signups.length });
}
