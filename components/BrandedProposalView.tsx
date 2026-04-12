"use client";

import { useEffect, useState } from "react";
import type { BrandKit } from "@/lib/brand";
import type { PricingTier, AddOn, Milestone } from "@/lib/types";
import ProposalCover from "@/components/ProposalCover";
import { PricingTiersView } from "@/components/PricingTiersEditor";
import { AddOnsView } from "@/components/AddOnsPanel";
import { MilestonesView } from "@/components/MilestoneBuilder";
import SignatureBlock from "@/components/SignatureBlock";

export interface ProposalData {
  id: string;
  createdAt: string;
  proposalText: string;
  freelancerName: string;
  freelancerTitle: string;
  freelancerEmail: string;
  clientName: string;
  clientCompany: string;
  projectType: string;
  currency: string;
  totalBudget: number;
  depositAmount: number;
  paymentLink: string | null;
  tiers: PricingTier[];
  addOns: AddOn[];
  milestones: Milestone[];
  brand: BrandKit;
  // Extended
  expiresAt?: string;
  alreadySigned?: boolean;
  signedAt?: string;
  signerName?: string;
}

interface Props {
  data: ProposalData;
}

// Parse markdown into sections
function parseSections(text: string) {
  const lines = text.split("\n");
  const sections: { title: string; heading: string; content: string }[] = [];
  let current: { title: string; heading: string; content: string } | null = null;
  for (const line of lines) {
    const m = line.match(/^#{1,2}\s+(.+)$/);
    if (m) {
      if (current) sections.push({ ...current, content: current.content.trim() });
      current = { title: m[1].trim(), heading: line, content: "" };
    } else if (current) {
      current.content += line + "\n";
    }
  }
  if (current) sections.push({ ...current, content: current.content.trim() });
  return sections;
}

function parseMarkdownTable(block: string): string | null {
  const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
  // Need at least header + separator + 1 data row
  if (lines.length < 3) return null;
  // Separator line must be all dashes/pipes/colons
  const sep = lines[1];
  if (!/^[\|\-:\s]+$/.test(sep)) return null;
  // Parse header
  const headers = lines[0].split("|").map(h => h.trim()).filter(Boolean);
  if (!headers.length) return null;

  const headerHtml = headers
    .map(h => `<th style="padding:10px 16px;text-align:left;font-size:13px;font-weight:700;color:#475569;background:#f8fafc;border-bottom:2px solid #e2e8f0;white-space:nowrap">${inlineMd(h)}</th>`)
    .join("");

  const rowsHtml = lines.slice(2).map((row, ri) => {
    const cells = row.split("|").map(c => c.trim()).filter(Boolean);
    const cellsHtml = cells
      .map((c, ci) => `<td style="padding:10px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f1f5f9;vertical-align:top;${ci === 0 ? "font-weight:600;" : ""}">${inlineMd(c)}</td>`)
      .join("");
    return `<tr style="background:${ri % 2 === 0 ? "#fff" : "#f8fafc"}">${cellsHtml}</tr>`;
  }).join("");

  return `<div style="overflow-x:auto;margin:16px 0;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,0.04)">
<table style="width:100%;border-collapse:collapse;font-family:inherit">
<thead><tr>${headerHtml}</tr></thead>
<tbody>${rowsHtml}</tbody>
</table></div>`;
}

function inlineMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px'>$1</code>");
}

function renderMd(text: string): string {
  // Split into blocks by double newline
  const blocks = text.split(/\n\n+/);
  return blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";

    // Table block — must have pipe chars and a separator line
    if (trimmed.includes("|") && trimmed.split("\n").length >= 3) {
      const table = parseMarkdownTable(trimmed);
      if (table) return table;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const content = trimmed.replace(/^> /gm, "");
      return `<blockquote style="border-left:4px solid #0ea5e9;background:#f0f9ff;margin:12px 0;padding:12px 18px;border-radius:0 8px 8px 0;color:#0369a1;font-style:italic;font-size:14px">${inlineMd(content)}</blockquote>`;
    }

    // Bullet list
    if (/^[-•*]\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter(l => /^[-•*]\s/.test(l.trim()));
      const lis = items.map(l => `<li style="margin-bottom:6px">${inlineMd(l.replace(/^[-•*]\s+/, ""))}</li>`).join("");
      return `<ul style="margin:8px 0;padding-left:22px;list-style:disc">${lis}</ul>`;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter(l => /^\d+\.\s/.test(l.trim()));
      const lis = items.map(l => `<li style="margin-bottom:6px">${inlineMd(l.replace(/^\d+\.\s+/, ""))}</li>`).join("");
      return `<ol style="margin:8px 0;padding-left:22px">${lis}</ol>`;
    }

    // Default paragraph
    return `<p style="margin:0 0 12px;line-height:1.75">${inlineMd(trimmed.replace(/\n/g, "<br/>"))}</p>`;
  }).join("\n");
}

export default function BrandedProposalView({ data }: Props) {
  const { brand } = data;
  const [selectedTier, setSelectedTier] = useState(data.tiers.find(t => t.recommended)?.id ?? data.tiers[0]?.id ?? "");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [signed, setSigned] = useState(data.alreadySigned ?? false);
  const sections = parseSections(data.proposalText);

  const activeTier = data.tiers.find(t => t.id === selectedTier);
  const addOnTotal = data.addOns.filter(a => selectedAddOns.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const effectiveDeposit = activeTier
    ? Math.round(activeTier.price * activeTier.depositPercent / 100)
    : data.depositAmount;
  const effectivePaymentLink = activeTier?.paymentLink ?? data.paymentLink;

  // Load Google Font
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(brand.fontFamily)}:wght@400;600;700;800&display=swap`;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, [fontUrl]);

  return (
    <div style={{ fontFamily: `'${brand.fontFamily}', sans-serif` }} className="min-h-screen bg-white">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {brand.logoUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={brand.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
            : <span className="font-bold text-base" style={{ color: brand.primaryColor }}>
                {brand.companyName || data.freelancerName}
              </span>
          }
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary text-sm py-2">🖨️ Download PDF</button>
          {effectivePaymentLink && (
            <a href={effectivePaymentLink} target="_blank" rel="noopener noreferrer"
              className="btn-primary text-sm py-2"
              style={{ backgroundColor: brand.primaryColor, borderColor: brand.primaryColor }}>
              💳 Pay Deposit — {data.currency} {effectiveDeposit.toLocaleString()}{addOnTotal > 0 ? ` + ${data.currency} ${addOnTotal.toLocaleString()}` : ""}
            </a>
          )}
        </div>
      </div>

      {/* Cover page — F19 */}
      <ProposalCover
        clientName={data.clientName}
        clientCompany={data.clientCompany}
        projectType={data.projectType}
        freelancerName={data.freelancerName}
        freelancerTitle={data.freelancerTitle}
        brand={brand}
        date={new Date(data.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      />

      {/* F07 Pricing tiers */}
      {data.tiers.length > 0 && data.tiers.some(t => t.price > 0) && (
        <div className="print-break max-w-4xl mx-auto px-6 sm:px-10 py-16">
          <PricingTiersView
            tiers={data.tiers}
            currency={data.currency}
            selected={selectedTier}
            onSelect={setSelectedTier}
          />
          {effectivePaymentLink && (
            <div className="mt-6 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-4"
              style={{ backgroundColor: `${brand.primaryColor}15`, border: `1px solid ${brand.primaryColor}30` }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: brand.primaryColor }}>
                  {activeTier?.name} — Deposit: {data.currency} {effectiveDeposit.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Pay via Stripe — secure, instant confirmation</p>
              </div>
              <a href={effectivePaymentLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: brand.primaryColor }}>
                💳 Pay Deposit Now
              </a>
            </div>
          )}
        </div>
      )}

      {/* F08 Add-ons */}
      {data.addOns.some(a => a.name) && (
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8">
          <AddOnsView
            addOns={data.addOns}
            currency={data.currency}
            selected={selectedAddOns}
            onToggle={id => setSelectedAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          />
        </div>
      )}

      {/* Proposal sections */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 space-y-10">
        {sections.map((s, i) => (
          <div key={i} className={i > 0 ? "pt-8 border-t border-gray-100" : ""}>
            {s.heading && (
              <h2 className="text-2xl font-bold mb-4" style={{ color: brand.primaryColor }}>
                {s.title}
              </h2>
            )}
            <div
              className="text-gray-700 leading-relaxed text-[15px]"
              style={{ fontFamily: `'${brand.fontFamily}', sans-serif` }}
              dangerouslySetInnerHTML={{ __html: renderMd(s.content) }}
            />
          </div>
        ))}
      </div>

      {/* F09 Milestones */}
      {data.milestones.length > 0 && data.totalBudget > 0 && (
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 border-t border-gray-100">
          <MilestonesView milestones={data.milestones} totalBudget={data.totalBudget} currency={data.currency} />
        </div>
      )}

      {/* Signature block */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 border-t border-gray-100">
        <SignatureBlock
          documentId={data.id}
          documentType="proposal"
          freelancerName={data.freelancerName}
          clientName={data.clientName || data.clientCompany}
          alreadySigned={signed}
          signedAt={data.signedAt}
          signerName={data.signerName}
          primaryColor={brand.primaryColor}
          onSigned={() => setSigned(true)}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">
        <p>Prepared by <strong>{data.freelancerName}</strong> · {data.freelancerEmail}</p>
        <p className="mt-1">Generated {new Date(data.createdAt).toLocaleDateString()}</p>
        {data.expiresAt && (
          <p className="mt-1">This proposal expires on <strong>{new Date(data.expiresAt).toLocaleDateString()}</strong></p>
        )}
      </div>
    </div>
  );
}
