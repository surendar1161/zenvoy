import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { calculateNextDate, cloneInvoiceData, generateInvoiceNumber } from "@/lib/recurring";
import type { Recurrence, InvoiceRow } from "@/lib/recurring";
import { sendNotificationEmail } from "@/lib/email";
import { executeAutomations } from "@/lib/automations/engine";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdmin();
  const now = new Date().toISOString();
  let created = 0;
  let errors = 0;
  let overdueCount = 0;

  // 1. Process recurring invoices that are due
  const { data: dueInvoices } = await db
    .from("invoices")
    .select("*")
    .eq("is_recurring", true)
    .lte("next_invoice_at", now)
    .order("next_invoice_at", { ascending: true })
    .limit(100);

  for (const inv of (dueInvoices ?? []) as InvoiceRow[]) {
    try {
      // Idempotency: check if an invoice was already created from this parent in the last 24h
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      const { count } = await db
        .from("invoices")
        .select("id", { count: "exact", head: true })
        .eq("parent_invoice_id", inv.id)
        .gte("created_at", oneDayAgo);

      if ((count ?? 0) > 0) continue;

      // Count existing invoices for this user to generate number
      const { count: totalCount } = await db
        .from("invoices")
        .select("id", { count: "exact", head: true })
        .eq("user_id", inv.user_id);

      const invNum = generateInvoiceNumber(totalCount ?? 0);
      const cloned = cloneInvoiceData(inv, invNum);

      const { error: insertErr } = await db.from("invoices").insert(cloned);
      if (insertErr) {
        console.error(`[cron] Failed to clone invoice ${inv.id}:`, insertErr.message);
        errors++;
        continue;
      }

      // Advance next_invoice_at on the parent
      const nextDate = calculateNextDate(
        new Date(inv.next_invoice_at!),
        inv.recurrence as Recurrence,
      );
      await db
        .from("invoices")
        .update({ next_invoice_at: nextDate.toISOString() })
        .eq("id", inv.id);

      // Notify the user
      sendNotificationEmail(inv.user_id, "invoice_sent", {
        invoiceNumber: invNum,
        amount: `${inv.currency} ${inv.total}`,
      }).catch(console.error);

      created++;
    } catch (err) {
      console.error(`[cron] Error processing invoice ${inv.id}:`, err);
      errors++;
    }
  }

  // 2. Detect overdue invoices and update status
  const { data: overdueInvoices } = await db
    .from("invoices")
    .select("id, user_id, invoice_number, total, currency, due_date, client_id, clients(name)")
    .in("status", ["sent", "viewed"])
    .lt("due_date", now)
    .limit(200);

  for (const inv of overdueInvoices ?? []) {
    try {
      await db.from("invoices").update({ status: "overdue" }).eq("id", inv.id);

      const daysPastDue = Math.floor((Date.now() - new Date(inv.due_date).getTime()) / 86400000);
      const clients = inv.clients as { name: string }[] | { name: string } | null;
      const clientName = Array.isArray(clients) ? clients[0]?.name ?? "Client" : clients?.name ?? "Client";

      sendNotificationEmail(inv.user_id, "invoice_overdue", {
        clientName,
        invoiceNumber: inv.invoice_number ?? "",
        amount: `${inv.currency} ${inv.total}`,
        daysPastDue,
      }).catch(console.error);

      executeAutomations(inv.user_id, "invoice_overdue", {
        clientName,
        invoiceNumber: inv.invoice_number ?? "",
        amount: `${inv.currency} ${inv.total}`,
        daysPastDue,
        documentId: inv.id,
      }).catch(console.error);

      overdueCount++;
    } catch (err) {
      console.error(`[cron] Overdue update failed for ${inv.id}:`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    recurring: { created, errors, checked: dueInvoices?.length ?? 0 },
    overdue: { updated: overdueCount },
  });
}
