const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dealpilot.app";

function layout(content: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
  <tr><td style="padding:0 0 24px;text-align:center">
    <span style="font-weight:800;font-size:20px;color:#0ea5e9;letter-spacing:-0.3px">⚡ DealPilot</span>
  </td></tr>
  <tr><td style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:32px 28px">
    ${content}
  </td></tr>
  <tr><td style="padding:24px 0;text-align:center;color:#94a3b8;font-size:12px;line-height:1.6">
    <a href="${APP_URL}" style="color:#94a3b8">DealPilot</a> · AI-Powered Proposals for Freelancers<br/>
    <a href="${unsubscribeUrl}" style="color:#94a3b8">Unsubscribe</a> from these notifications
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function btn(text: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td>
    <a href="${href}" style="display:inline-block;padding:12px 28px;background:#0ea5e9;color:#fff;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none">${text}</a>
  </td></tr></table>`;
}

export function proposalViewedEmail(data: { clientName: string; documentId: string; documentType: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `${data.clientName} viewed your ${data.documentType}`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0f172a">Your ${data.documentType} was viewed</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.clientName}</strong> just opened your ${data.documentType}.</p>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 16px">This is a great sign — they're reviewing your work. Consider following up if you don't hear back within 48 hours.</p>
      ${btn("View in Dashboard", `${APP_URL}/proposals`)}
    `, data.unsubscribeUrl),
  };
}

export function proposalSignedEmail(data: { signerName: string; documentId: string; documentType: string; signedAt: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `${data.signerName} signed your ${data.documentType}!`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0f172a">Your ${data.documentType} was signed</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.signerName}</strong> signed your ${data.documentType}.</p>
      <p style="color:#94a3b8;font-size:13px;margin:0">Signed at ${new Date(data.signedAt).toLocaleString()}</p>
      ${btn("View Document", `${APP_URL}/${data.documentType}/${data.documentId}`)}
    `, data.unsubscribeUrl),
  };
}

export function proposalAcceptedEmail(data: { acceptorName: string; documentId: string; documentType: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `${data.acceptorName} accepted your ${data.documentType}!`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#10b981">Deal Accepted!</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.acceptorName}</strong> accepted your ${data.documentType}. Congratulations!</p>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 16px">Time to send a contract and get the project started.</p>
      ${btn("View Details", `${APP_URL}/${data.documentType}/${data.documentId}`)}
    `, data.unsubscribeUrl),
  };
}

export function contractSignedEmail(data: { signerName: string; documentId: string; signedAt: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `${data.signerName} signed your contract!`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0f172a">Contract Signed</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.signerName}</strong> signed your contract.</p>
      <p style="color:#94a3b8;font-size:13px;margin:0">Signed at ${new Date(data.signedAt).toLocaleString()}</p>
      ${btn("View Contract", `${APP_URL}/contract/${data.documentId}`)}
    `, data.unsubscribeUrl),
  };
}

export function paymentFailedEmail(data: { unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: "Payment failed — action required",
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#ef4444">Payment Failed</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 16px">We were unable to process your subscription payment. Please update your payment method to continue using DealPilot.</p>
      ${btn("Update Payment Method", `${APP_URL}/subscription`)}
    `, data.unsubscribeUrl),
  };
}

export function paymentReceivedEmail(data: { amount?: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: "Payment received — thank you!",
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#10b981">Payment Received</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 16px">Thank you! Your payment${data.amount ? ` of ${data.amount}` : ""} has been processed successfully.</p>
      ${btn("Go to Dashboard", `${APP_URL}/dashboard`)}
    `, data.unsubscribeUrl),
  };
}

export function proposalFollowUpEmail(data: { clientName: string; proposalTitle: string; daysSinceSent: number; documentId: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `Reminder: ${data.clientName} hasn't opened your proposal yet`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#f59e0b">Proposal Still Unopened</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px">Your proposal <strong>"${data.proposalTitle}"</strong> sent to <strong>${data.clientName}</strong> hasn't been opened yet.</p>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 16px">It's been ${data.daysSinceSent} day${data.daysSinceSent !== 1 ? "s" : ""} since you sent it. A quick follow-up email to your client often helps — proposals that receive a nudge are 2x more likely to close.</p>
      ${btn("View Proposal", `${APP_URL}/proposals`)}
      <p style="color:#94a3b8;font-size:12px;margin:16px 0 0">💡 <strong>Tip:</strong> Resend the proposal with a brief personal message — "Just checking in" works well.</p>
    `, data.unsubscribeUrl),
  };
}

export function invoiceOverdueEmail(data: { clientName: string; invoiceNumber: string; amount: string; daysPastDue: number; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `Invoice ${data.invoiceNumber} is overdue (${data.daysPastDue} days)`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#f59e0b">Invoice Overdue</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px">Invoice <strong>${data.invoiceNumber}</strong> for <strong>${data.clientName}</strong> is ${data.daysPastDue} days past due.</p>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 16px">Amount: ${data.amount}</p>
      ${btn("View Invoice", `${APP_URL}/invoices`)}
    `, data.unsubscribeUrl),
  };
}

// ── Portal notification emails ──────────────────────────────────────

export function portalFileUploadedEmail(data: { clientName: string; fileName: string; portalTitle: string; portalId: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `${data.clientName} uploaded a file to "${data.portalTitle}"`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0f172a">New File from Client</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.clientName}</strong> uploaded <strong>${data.fileName}</strong> to the portal <strong>${data.portalTitle}</strong>.</p>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 16px">Review the file and approve or request revisions.</p>
      ${btn("View Portal", `${APP_URL}/portals/${data.portalId}`)}
    `, data.unsubscribeUrl),
  };
}

export function portalMessageReceivedEmail(data: { clientName: string; messagePreview: string; portalTitle: string; portalId: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `New message from ${data.clientName}`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0f172a">New Portal Message</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.clientName}</strong> sent a message in <strong>${data.portalTitle}</strong>:</p>
      <div style="background:#f1f5f9;border-radius:10px;padding:12px 16px;margin:12px 0;color:#334155;font-size:14px;line-height:1.5">${data.messagePreview}</div>
      ${btn("Reply in Portal", `${APP_URL}/portals/${data.portalId}`)}
    `, data.unsubscribeUrl),
  };
}

export function clientFileSharedEmail(data: { freelancerName: string; fileName: string; portalToken: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `${data.freelancerName} shared a file with you`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0f172a">New File Shared</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.freelancerName}</strong> shared <strong>${data.fileName}</strong> with you.</p>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 16px">View and download the file in your portal.</p>
      ${btn("View in Portal", `${APP_URL}/portal/${data.portalToken}`)}
    `, data.unsubscribeUrl),
  };
}

export function clientMessageReceivedEmail(data: { freelancerName: string; messagePreview: string; portalToken: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `New message from ${data.freelancerName}`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0f172a">You Have a New Message</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.freelancerName}</strong> sent you a message:</p>
      <div style="background:#f1f5f9;border-radius:10px;padding:12px 16px;margin:12px 0;color:#334155;font-size:14px;line-height:1.5">${data.messagePreview}</div>
      ${btn("Reply in Portal", `${APP_URL}/portal/${data.portalToken}`)}
    `, data.unsubscribeUrl),
  };
}

export function clientInvoiceSentEmail(data: { freelancerName: string; invoiceTitle: string; amount: string; portalToken: string; unsubscribeUrl: string }): { subject: string; html: string } {
  return {
    subject: `New invoice from ${data.freelancerName}`,
    html: layout(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0f172a">New Invoice</h2>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${data.freelancerName}</strong> sent you a new invoice: <strong>${data.invoiceTitle}</strong></p>
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:8px 0 16px">${data.amount}</p>
      ${btn("View & Pay", `${APP_URL}/portal/${data.portalToken}`)}
    `, data.unsubscribeUrl),
  };
}
