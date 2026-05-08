export type Recurrence = "weekly" | "monthly" | "quarterly" | "yearly";

export function calculateNextDate(current: Date, recurrence: Recurrence): Date {
  const next = new Date(current);
  switch (recurrence) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

export function generateInvoiceNumber(existingCount: number): string {
  return `INV-${String(existingCount + 1).padStart(4, "0")}`;
}

export interface InvoiceRow {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  line_items: unknown;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  currency: string;
  notes: string | null;
  footer: string | null;
  payment_link: string | null;
  is_recurring: boolean;
  recurrence: string | null;
  next_invoice_at: string | null;
  recurring_series_id: string | null;
}

export function cloneInvoiceData(source: InvoiceRow, invoiceNumber: string): Record<string, unknown> {
  return {
    user_id: source.user_id,
    client_id: source.client_id,
    title: source.title,
    line_items: source.line_items,
    subtotal: source.subtotal,
    tax_rate: source.tax_rate,
    tax_amount: source.tax_amount,
    discount: source.discount,
    total: source.total,
    currency: source.currency,
    notes: source.notes,
    footer: source.footer,
    payment_link: source.payment_link,
    invoice_number: invoiceNumber,
    status: "sent",
    is_recurring: false,
    parent_invoice_id: source.id,
    recurring_series_id: source.recurring_series_id,
    due_date: new Date(Date.now() + 30 * 86400000).toISOString(),
  };
}
