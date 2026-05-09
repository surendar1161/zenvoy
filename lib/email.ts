import { createClient } from "@supabase/supabase-js";
import * as templates from "./email-templates";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dealpilot.app";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

async function sendViaResend(to: string, from: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  return res.ok;
}

type NotificationType =
  | "proposal_viewed" | "proposal_signed" | "proposal_accepted" | "proposal_declined"
  | "proposal_follow_up"
  | "contract_signed"
  | "invoice_sent" | "invoice_paid" | "invoice_overdue"
  | "payment_received" | "payment_failed"
  | "portal_file_uploaded" | "portal_message_received";

async function getOrCreatePreferences(userId: string) {
  const db = getAdmin();
  const { data } = await db.from("notification_preferences").select("*").eq("user_id", userId).maybeSingle();
  if (data) return data;

  const { data: created } = await db.from("notification_preferences")
    .insert({ user_id: userId })
    .select("*")
    .single();
  return created;
}

function isTypeEnabled(prefs: Record<string, unknown>, type: NotificationType): boolean {
  if (prefs.email_enabled === false) return false;
  const key = type as string;
  return prefs[key] !== false;
}

export async function sendNotificationEmail(
  userId: string,
  type: NotificationType,
  data: Record<string, unknown>,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const db = getAdmin();

  try {
    const prefs = await getOrCreatePreferences(userId);
    if (!prefs || !isTypeEnabled(prefs, type)) return;

    // Debounce "viewed" emails: skip if one was sent for this document < 1 hour ago
    if (type === "proposal_viewed" && data.documentId) {
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      const { count } = await db.from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("type", "proposal_viewed")
        .eq("document_id", data.documentId as string)
        .eq("email_sent", true)
        .gte("created_at", oneHourAgo);
      if ((count ?? 0) > 0) return;
    }

    // Get user email
    const { data: userData } = await db.auth.admin.getUserById(userId);
    const email = userData?.user?.email;
    if (!email) return;

    const unsubscribeUrl = `${APP_URL}/api/unsubscribe?token=${prefs.unsubscribe_token}&type=${type}`;
    const enrichedData = { ...data, unsubscribeUrl } as Record<string, string>;

    let emailContent: { subject: string; html: string } | null = null;

    switch (type) {
      case "proposal_viewed":
        emailContent = templates.proposalViewedEmail({
          clientName: (data.clientName as string) ?? "Someone",
          documentId: data.documentId as string,
          documentType: (data.documentType as string) ?? "proposal",
          unsubscribeUrl,
        });
        break;
      case "proposal_signed":
        emailContent = templates.proposalSignedEmail({
          signerName: (data.signerName as string) ?? "Client",
          documentId: data.documentId as string,
          documentType: (data.documentType as string) ?? "proposal",
          signedAt: (data.signedAt as string) ?? new Date().toISOString(),
          unsubscribeUrl,
        });
        break;
      case "proposal_accepted":
        emailContent = templates.proposalAcceptedEmail({
          acceptorName: (data.acceptorName as string) ?? "Client",
          documentId: data.documentId as string,
          documentType: (data.documentType as string) ?? "proposal",
          unsubscribeUrl,
        });
        break;
      case "contract_signed":
        emailContent = templates.contractSignedEmail({
          signerName: (data.signerName as string) ?? "Client",
          documentId: data.documentId as string,
          signedAt: (data.signedAt as string) ?? new Date().toISOString(),
          unsubscribeUrl,
        });
        break;
      case "payment_failed":
        emailContent = templates.paymentFailedEmail({ unsubscribeUrl });
        break;
      case "payment_received":
        emailContent = templates.paymentReceivedEmail({
          amount: data.amount as string | undefined,
          unsubscribeUrl,
        });
        break;
      case "proposal_follow_up":
        emailContent = templates.proposalFollowUpEmail({
          clientName: (data.clientName as string) ?? "your client",
          proposalTitle: (data.proposalTitle as string) ?? "Untitled Proposal",
          daysSinceSent: (data.daysSinceSent as number) ?? 0,
          documentId: data.documentId as string,
          unsubscribeUrl,
        });
        break;
      case "invoice_overdue":
        emailContent = templates.invoiceOverdueEmail({
          clientName: (data.clientName as string) ?? "Client",
          invoiceNumber: (data.invoiceNumber as string) ?? "",
          amount: (data.amount as string) ?? "$0",
          daysPastDue: (data.daysPastDue as number) ?? 0,
          unsubscribeUrl,
        });
        break;
      case "portal_file_uploaded":
        emailContent = templates.portalFileUploadedEmail({
          clientName: (data.clientName as string) ?? "Client",
          fileName: (data.fileName as string) ?? "file",
          portalTitle: (data.portalTitle as string) ?? "Portal",
          portalId: (data.portalId as string) ?? "",
          unsubscribeUrl,
        });
        break;
      case "portal_message_received":
        emailContent = templates.portalMessageReceivedEmail({
          clientName: (data.clientName as string) ?? "Client",
          messagePreview: (data.messagePreview as string) ?? "",
          portalTitle: (data.portalTitle as string) ?? "Portal",
          portalId: (data.portalId as string) ?? "",
          unsubscribeUrl,
        });
        break;
      default:
        return;
    }

    if (!emailContent) return;

    const fromEmail = process.env.RESEND_FROM_EMAIL || "notifications@dealpilot.app";

    await sendViaResend(email, `DealPilot <${fromEmail}>`, emailContent.subject, emailContent.html);

    // Mark the most recent notification as emailed
    if (data.documentId) {
      await db.from("notifications")
        .update({ email_sent: true })
        .eq("user_id", userId)
        .eq("type", type)
        .eq("document_id", data.documentId as string)
        .order("created_at", { ascending: false })
        .limit(1);
    }
  } catch (err) {
    console.error(`[email] Failed to send ${type} notification to user ${userId}:`, err);
  }
}

export async function sendPortalClientEmail(
  clientEmail: string,
  event: string,
  data: Record<string, string>,
): Promise<void> {
  if (!process.env.RESEND_API_KEY || !clientEmail) return;

  try {
    const unsubscribeUrl = `${APP_URL}/api/unsubscribe?email=${encodeURIComponent(clientEmail)}&type=portal`;

    let emailContent: { subject: string; html: string } | null = null;

    switch (event) {
      case "freelancer_file_uploaded":
        emailContent = templates.clientFileSharedEmail({
          freelancerName: data.freelancerName ?? "Your team",
          fileName: data.fileName ?? "file",
          portalToken: data.portalToken ?? "",
          unsubscribeUrl,
        });
        break;
      case "freelancer_message":
        emailContent = templates.clientMessageReceivedEmail({
          freelancerName: data.freelancerName ?? "Your team",
          messagePreview: data.messagePreview ?? "",
          portalToken: data.portalToken ?? "",
          unsubscribeUrl,
        });
        break;
      case "invoice_sent":
        emailContent = templates.clientInvoiceSentEmail({
          freelancerName: data.freelancerName ?? "Your team",
          invoiceTitle: data.invoiceTitle ?? "Invoice",
          amount: data.amount ?? "",
          portalToken: data.portalToken ?? "",
          unsubscribeUrl,
        });
        break;
      default:
        return;
    }

    if (!emailContent) return;

    const fromEmail = process.env.RESEND_FROM_EMAIL || "notifications@dealpilot.app";
    await sendViaResend(clientEmail, `DealPilot <${fromEmail}>`, emailContent.subject, emailContent.html);
  } catch (err) {
    console.error(`[email] Failed to send portal email to ${clientEmail}:`, err);
  }
}
