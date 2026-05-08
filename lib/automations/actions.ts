import { createClient } from "@supabase/supabase-js";
import { sendNotificationEmail } from "@/lib/email";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export type ActionType = "send_email" | "create_notification" | "update_status" | "create_invoice" | "create_task";

interface ActionConfig {
  type: string;
  config: Record<string, unknown>;
}

interface ActionResult {
  type: string;
  success: boolean;
  error?: string;
}

export async function executeAction(
  userId: string,
  action: ActionConfig,
  triggerData: Record<string, unknown>,
): Promise<ActionResult> {
  const db = getAdmin();

  switch (action.type) {
    case "send_email": {
      const emailType = (action.config.notification_type as string) ?? "proposal_viewed";
      try {
        await sendNotificationEmail(userId, emailType as Parameters<typeof sendNotificationEmail>[1], triggerData);
        return { type: action.type, success: true };
      } catch (err) {
        return { type: action.type, success: false, error: (err as Error).message };
      }
    }

    case "create_notification": {
      const title = replaceVars(action.config.title as string ?? "Automation triggered", triggerData);
      const body = replaceVars(action.config.body as string ?? "", triggerData);
      try {
        await db.from("notifications").insert({
          user_id: userId,
          type: "automation",
          title,
          body,
          document_id: triggerData.documentId as string ?? null,
          document_type: triggerData.documentType as string ?? null,
        });
        return { type: action.type, success: true };
      } catch (err) {
        return { type: action.type, success: false, error: (err as Error).message };
      }
    }

    case "update_status": {
      const table = action.config.table as string;
      const newStatus = action.config.status as string;
      const docId = triggerData.documentId as string;
      if (!table || !newStatus || !docId) {
        return { type: action.type, success: false, error: "Missing table, status, or documentId" };
      }
      try {
        await db.from(table).update({ status: newStatus }).eq("id", docId).eq("user_id", userId);
        return { type: action.type, success: true };
      } catch (err) {
        return { type: action.type, success: false, error: (err as Error).message };
      }
    }

    case "create_invoice": {
      const clientId = triggerData.clientId as string ?? action.config.client_id as string;
      const title = replaceVars(action.config.title as string ?? "Auto-generated Invoice", triggerData);
      const amount = Number(action.config.amount ?? triggerData.amount ?? 0);
      try {
        const { count } = await db.from("invoices").select("id", { count: "exact", head: true }).eq("user_id", userId);
        const invNum = `INV-${String((count ?? 0) + 1).padStart(4, "0")}`;
        await db.from("invoices").insert({
          user_id: userId,
          client_id: clientId ?? null,
          invoice_number: invNum,
          title,
          line_items: [{ description: title, quantity: 1, unit_price: amount, amount }],
          subtotal: amount,
          tax_rate: 0,
          tax_amount: 0,
          discount: 0,
          total: amount,
          currency: (action.config.currency as string) ?? "USD",
          status: "draft",
        });
        return { type: action.type, success: true };
      } catch (err) {
        return { type: action.type, success: false, error: (err as Error).message };
      }
    }

    case "create_task": {
      const taskTitle = replaceVars(action.config.title as string ?? "Follow up", triggerData);
      try {
        await db.from("tasks").insert({
          user_id: userId,
          title: taskTitle,
          status: "todo",
          project_id: triggerData.projectId as string ?? null,
        });
        return { type: action.type, success: true };
      } catch (err) {
        return { type: action.type, success: false, error: (err as Error).message };
      }
    }

    default:
      return { type: action.type, success: false, error: `Unknown action type: ${action.type}` };
  }
}

function replaceVars(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? ""));
}
