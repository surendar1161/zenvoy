import { PDFBuilder } from "./core";

interface InvoiceData {
  invoice_number: string | null;
  title: string;
  line_items: { description: string; quantity: number; unit_price: number; amount: number }[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  currency: string;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
  footer: string | null;
  is_recurring: boolean;
  recurrence: string | null;
  created_at: string;
  clients?: {
    name: string; company: string | null; email: string | null;
    phone: string | null; address: string | null;
  } | null;
}

interface FreelancerInfo {
  full_name: string;
  email: string;
  company: string;
}

export function renderInvoicePdf(inv: InvoiceData, freelancer: FreelancerInfo): Buffer {
  const pdf = new PDFBuilder();
  const fmt = (n: number) => `${inv.currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  pdf.addColorBand("#0c4a6e", 80, [
    { text: "INVOICE", font: { name: "Helvetica-Bold", size: 28, color: "1 1 1" } },
    { text: inv.invoice_number ?? "", font: { name: "Helvetica", size: 12, color: "1 1 1" } },
  ]);

  pdf.addSpace(16);

  // From / To
  pdf.addText("FROM", { font: { name: "Helvetica-Bold", size: 9, color: "0.4 0.4 0.4" } });
  pdf.addText(freelancer.full_name, { font: { name: "Helvetica-Bold", size: 10, color: "0 0 0" } });
  if (freelancer.company) pdf.addText(freelancer.company);
  pdf.addText(freelancer.email);

  pdf.addSpace(12);
  pdf.addText("BILL TO", { font: { name: "Helvetica-Bold", size: 9, color: "0.4 0.4 0.4" } });
  if (inv.clients) {
    pdf.addText(inv.clients.name, { font: { name: "Helvetica-Bold", size: 10, color: "0 0 0" } });
    if (inv.clients.company) pdf.addText(inv.clients.company);
    if (inv.clients.email) pdf.addText(inv.clients.email);
    if (inv.clients.address) pdf.addText(inv.clients.address);
  }

  pdf.addSpace(8);
  const dateFmt = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
  pdf.addKeyValue("Date:", dateFmt(inv.created_at));
  pdf.addKeyValue("Due:", dateFmt(inv.due_date));
  pdf.addKeyValue("Status:", inv.status.toUpperCase());
  if (inv.paid_at) pdf.addKeyValue("Paid:", dateFmt(inv.paid_at));
  if (inv.is_recurring) pdf.addKeyValue("Recurring:", inv.recurrence ?? "Yes");

  pdf.addSpace(8);
  pdf.addLine();
  pdf.addSpace(4);

  // Line items table
  const headers = ["Description", "Qty", "Rate", "Amount"];
  const colW = [270, 55, 100, 70.28];
  const rows = inv.line_items.map(li => [
    li.description, String(li.quantity), fmt(li.unit_price), fmt(li.amount),
  ]);
  pdf.addTable(headers, rows, colW);

  // Totals
  pdf.addSpace(4);
  pdf.addLine();
  pdf.addKeyValue("Subtotal:", fmt(inv.subtotal), 280);
  if (inv.tax_rate > 0) {
    pdf.addKeyValue(`Tax (${inv.tax_rate}%):`, fmt(inv.tax_amount), 280);
  }
  if (inv.discount > 0) {
    pdf.addKeyValue("Discount:", `- ${fmt(inv.discount)}`, 280);
  }
  pdf.addSpace(4);
  pdf.addText(`Total: ${fmt(inv.total)}`, { font: { name: "Helvetica-Bold", size: 14, color: "0 0 0" }, indent: 280 });

  // Notes
  if (inv.notes) {
    pdf.addSpace(16);
    pdf.addHeading("Notes", 3);
    pdf.addParagraph(inv.notes);
  }
  if (inv.footer) {
    pdf.addSpace(8);
    pdf.addText(inv.footer, { font: { name: "Helvetica", size: 8, color: "0.5 0.5 0.5" } });
  }

  return pdf.build();
}

interface ProposalRow {
  id: string;
  created_at: string;
  proposal_text: string;
  freelancer_name: string;
  freelancer_title: string;
  freelancer_email: string;
  client_name: string;
  client_company: string;
  project_type: string;
  currency: string;
  total_budget: number;
  deposit_amount: number;
  tiers: { name: string; tagline: string; price: number; features: string[]; recommended: boolean }[] | null;
  add_ons: { name: string; price: number; description: string }[] | null;
  milestones: { name: string; description: string; percentage: number; dueLabel: string }[] | null;
  brand_snapshot: { primaryColor?: string; companyName?: string } | null;
  signed_at: string | null;
  signer_name: string | null;
  accepted_at: string | null;
}

export function renderProposalPdf(p: ProposalRow): Buffer {
  const pdf = new PDFBuilder();
  const primary = p.brand_snapshot?.primaryColor ?? "#0ea5e9";
  const brandName = p.brand_snapshot?.companyName || p.freelancer_name;
  const fmt = (n: number) => `${p.currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

  // Cover page
  pdf.addColorBand(primary, 100, [
    { text: brandName, font: { name: "Helvetica-Bold", size: 14, color: "1 1 1" } },
    { text: `Proposal for ${p.client_name}`, font: { name: "Helvetica-Bold", size: 24, color: "1 1 1" } },
    { text: p.project_type, font: { name: "Helvetica", size: 12, color: "1 1 1" } },
  ]);

  pdf.addSpace(16);
  pdf.addKeyValue("Prepared by:", p.freelancer_name);
  if (p.freelancer_title) pdf.addKeyValue("Title:", p.freelancer_title);
  pdf.addKeyValue("Email:", p.freelancer_email);
  pdf.addKeyValue("Prepared for:", `${p.client_name}${p.client_company ? ` — ${p.client_company}` : ""}`);
  pdf.addKeyValue("Date:", new Date(p.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  pdf.addKeyValue("Investment:", fmt(p.total_budget));

  pdf.addSpace(12);
  pdf.addLine();

  // Proposal body (markdown)
  if (p.proposal_text) {
    pdf.addMarkdown(p.proposal_text);
  }

  // Pricing tiers
  const tiers = p.tiers ?? [];
  if (tiers.length > 0) {
    pdf.addPageBreak();
    pdf.addHeading("Investment Options", 1);
    for (const tier of tiers) {
      pdf.addHeading(`${tier.name}${tier.recommended ? " (Recommended)" : ""}`, 3);
      pdf.addText(tier.tagline, { font: { name: "Helvetica", size: 10, color: "0.4 0.4 0.4" } });
      pdf.addText(fmt(tier.price), { font: { name: "Helvetica-Bold", size: 14, color: "0 0 0" } });
      pdf.addSpace(4);
      for (const f of tier.features) {
        pdf.addBullet(f);
      }
      pdf.addSpace(8);
    }
  }

  // Add-ons
  const addOns = p.add_ons ?? [];
  if (addOns.length > 0) {
    pdf.addHeading("Optional Add-Ons", 2);
    const aoRows = addOns.map(a => [a.name, a.description, fmt(a.price)]);
    pdf.addTable(["Add-On", "Description", "Price"], aoRows, [160, 235.28, 100]);
  }

  // Milestones
  const milestones = p.milestones ?? [];
  if (milestones.length > 0) {
    pdf.addHeading("Payment Schedule", 2);
    const msRows = milestones.map(m => [m.name, m.dueLabel, `${m.percentage}%`, fmt(p.total_budget * m.percentage / 100)]);
    pdf.addTable(["Milestone", "Due", "%", "Amount"], msRows, [130, 175.28, 50, 140]);
  }

  // Signature block
  if (p.signed_at || p.accepted_at) {
    pdf.addSpace(20);
    pdf.addLine();
    pdf.addHeading("Accepted", 3);
    pdf.addKeyValue("Signed by:", p.signer_name ?? "Client");
    pdf.addKeyValue("Date:", new Date(p.signed_at ?? p.accepted_at!).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  }

  return pdf.build();
}

interface ContractRow {
  id: string;
  contract_type_name: string;
  governing_law: string;
  party_a_name: string; party_a_role: string | null; party_a_address: string | null;
  party_b_name: string; party_b_role: string | null; party_b_address: string | null;
  contract_text: string;
  status: string;
  signed_at: string | null; signer_name: string | null;
  created_at: string;
}

export function renderContractPdf(c: ContractRow): Buffer {
  const pdf = new PDFBuilder();

  pdf.addColorBand("#1e293b", 80, [
    { text: c.contract_type_name.toUpperCase(), font: { name: "Helvetica-Bold", size: 22, color: "1 1 1" } },
    { text: `Effective ${new Date(c.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, font: { name: "Helvetica", size: 11, color: "1 1 1" } },
  ]);

  pdf.addSpace(16);

  // Parties
  pdf.addHeading("Parties", 2);
  pdf.addText(`Party A: ${c.party_a_name}${c.party_a_role ? ` (${c.party_a_role})` : ""}`, { font: { name: "Helvetica-Bold", size: 10, color: "0 0 0" } });
  if (c.party_a_address) pdf.addText(c.party_a_address, { indent: 8 });
  pdf.addSpace(6);
  pdf.addText(`Party B: ${c.party_b_name}${c.party_b_role ? ` (${c.party_b_role})` : ""}`, { font: { name: "Helvetica-Bold", size: 10, color: "0 0 0" } });
  if (c.party_b_address) pdf.addText(c.party_b_address, { indent: 8 });

  pdf.addSpace(8);
  pdf.addKeyValue("Governing Law:", c.governing_law);
  pdf.addLine();

  // Contract body
  if (c.contract_text) {
    pdf.addMarkdown(c.contract_text);
  }

  // Signature
  if (c.signed_at) {
    pdf.addSpace(24);
    pdf.addLine();
    pdf.addSpace(8);
    pdf.addHeading("Signatures", 2);
    pdf.addKeyValue("Signed by:", c.signer_name ?? "—");
    pdf.addKeyValue("Date:", new Date(c.signed_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    pdf.addKeyValue("Status:", "SIGNED");
  }

  return pdf.build();
}
