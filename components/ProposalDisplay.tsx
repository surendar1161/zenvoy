"use client";

import { useEffect, useState } from "react";
import { Button, Segmented } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { PricingTier, AddOn, Milestone } from "@/lib/types";
import type { BrandKit } from "@/lib/brand";
import { PricingTiersView } from "@/components/PricingTiersEditor";
import { AddOnsView } from "@/components/AddOnsPanel";
import { MilestonesView } from "@/components/MilestoneBuilder";
import DocumentEditor from "@/components/DocumentEditor";

interface Props {
  proposal: string;
  loading: boolean;
  paymentLink: string | null;
  loadingPayment: boolean;
  depositAmount: number;
  currency: string;
  freelancerEmail: string;
  tone?: string;
  freelancerName?: string;
  clientName?: string;
  // F07 / F08 / F09
  tiers?: PricingTier[];
  addOns?: AddOn[];
  milestones?: Milestone[];
  totalBudget?: number;
  // F16 / F18
  brand?: BrandKit;
  proposalId?: string | null;
  onBack: () => void;
}

// ── Section parsing ──────────────────────────────────────────
interface Section {
  id: string;
  title: string;       // e.g. "Executive Summary"
  heading: string;     // e.g. "## Executive Summary"
  content: string;     // everything after the heading until next heading
}

function parseSections(text: string): Section[] {
  if (!text.trim()) return [];
  const lines = text.split("\n");
  const sections: Section[] = [];
  // eslint-disable-next-line prefer-const
  let current: { id: string; title: string; heading: string; content: string } | null = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h1 = line.match(/^#\s+(.+)$/);
    const match = h2 || h1;
    if (match) {
      if (current !== null) {
        sections.push({ id: current.id, title: current.title, heading: current.heading, content: current.content.trim() });
      }
      const title = match[1].trim();
      current = { id: title.toLowerCase().replace(/[^a-z0-9]/g, "-"), title, heading: line, content: "" };
    } else if (current !== null) {
      current.content += line + "\n";
    } else if (line.trim()) {
      current = { id: "intro", title: "Introduction", heading: "", content: line + "\n" };
    }
  }
  if (current !== null) {
    sections.push({ id: current.id, title: current.title, heading: current.heading, content: current.content.trim() });
  }
  return sections;
}

// ── Inline markdown renderer ──────────────────────────────────
function md(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^[-•]\s+(.+)$/gm, '<li class="ml-5 mb-1 list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, "<br/>");
}

// ── Section Regeneration Panel ────────────────────────────────
interface RegeneratePanelProps {
  section: Section;
  fullProposal: string;
  tone: string;
  freelancerName: string;
  clientName: string;
  onApply: (sectionId: string, newContent: string) => void;
  onClose: () => void;
}

function RegeneratePanel({ section, fullProposal, tone, freelancerName, clientName, onApply, onClose }: RegeneratePanelProps) {
  const [loading, setLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<{ label: string; content: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    generate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    setAlternatives([]);
    setSelected(null);
    try {
      const res = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionTitle: section.title,
          currentContent: section.content,
          fullProposal,
          tone,
          freelancerName,
          clientName,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAlternatives(data.alternatives ?? []);
    } catch {
      setError("Couldn't generate alternatives. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Regenerate: {section.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">3 distinct alternatives — pick the one you prefer</p>
          </div>
          <div className="flex gap-2">
            <button onClick={generate} disabled={loading}
              className="btn-secondary text-xs py-1.5 px-3">
              🔄 Retry
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100">✕</button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {loading && (
            <div className="flex items-center gap-3 py-8 justify-center text-brand-600 animate-pulse">
              <span className="text-2xl animate-spin inline-block">⚡</span>
              <span className="font-medium">Writing 3 alternatives with Claude…</span>
            </div>
          )}
          {error && <p className="text-sm text-red-600 text-center py-4">{error}</p>}
          {alternatives.map((alt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                selected === i
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selected === i ? "border-brand-500 bg-brand-500" : "border-gray-300"
                }`}>
                  {selected === i && <span className="text-white text-xs">✓</span>}
                </span>
                <span className="text-xs font-semibold text-gray-600">{alt.label}</span>
              </div>
              <div
                className="text-sm text-gray-700 leading-relaxed line-clamp-6"
                dangerouslySetInnerHTML={{ __html: `<p>${md(alt.content)}</p>` }}
              />
            </button>
          ))}
        </div>

        {alternatives.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={() => {
                if (selected !== null) {
                  onApply(section.id, alternatives[selected].content);
                  onClose();
                }
              }}
              disabled={selected === null}
              className="btn-primary flex-1 justify-center"
            >
              Apply Alternative
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ProposalDisplay ──────────────────────────────────────
export default function ProposalDisplay({
  proposal,
  loading,
  paymentLink,
  loadingPayment,
  depositAmount,
  currency,
  freelancerEmail,
  tone = "professional",
  freelancerName = "",
  clientName = "",
  tiers = [],
  addOns = [],
  milestones = [],
  totalBudget = 0,
  brand,
  proposalId,
  onBack,
}: Props) {
  const primaryColor = brand?.primaryColor ?? "#0ea5e9";
  const [viewMode, setViewMode] = useState<"preview" | "editor">("preview");
  const [sections, setSections] = useState<Section[]>([]);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [regenerating, setRegenerating] = useState<Section | null>(null);
  // F07 — selected pricing tier
  const [selectedTier, setSelectedTier] = useState<string>(tiers.find(t => t.recommended)?.id ?? tiers[0]?.id ?? "");
  // F08 — selected add-ons
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // When tier changes, show the matching Stripe payment link
  const activeTier = tiers.find(t => t.id === selectedTier);
  const addOnTotal = addOns.filter(a => selectedAddOns.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const effectivePaymentLink = activeTier?.paymentLink ?? null;

  useEffect(() => {
    if (!loading && proposal) {
      setSections(parseSections(proposal));
    }
  }, [loading, proposal]);

  function applyOverride(sectionId: string, newContent: string) {
    setOverrides((prev) => ({ ...prev, [sectionId]: newContent }));
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, content: newContent } : s))
    );
  }

  function copyProposal() {
    const text = sections
      .map((s) => (s.heading ? `${s.heading}\n\n` : "") + (overrides[s.id] ?? s.content))
      .join("\n\n");
    navigator.clipboard.writeText(text);
    alert("Proposal copied to clipboard!");
  }

  const isStreaming = loading && proposal.length > 0;
  const showSections = !loading && sections.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Regenerate modal */}
      {regenerating && (
        <RegeneratePanel
          section={regenerating}
          fullProposal={proposal}
          tone={tone}
          freelancerName={freelancerName}
          clientName={clientName}
          onApply={applyOverride}
          onClose={() => setRegenerating(null)}
        />
      )}

      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <button onClick={onBack} className="btn-secondary text-sm">← Edit Details</button>
        <div className="flex gap-3 flex-wrap items-center">
          {showSections && (
            <>
              {/* View / Edit toggle */}
              <Segmented
                size="small"
                value={viewMode}
                onChange={(v) => setViewMode(v as "preview" | "editor")}
                options={[
                  { value: "preview", label: <span><EyeOutlined style={{ marginRight: 4 }} />Preview</span> },
                  { value: "editor", label: <span><EditOutlined style={{ marginRight: 4 }} />Edit</span> },
                ]}
                style={{ borderRadius: 8 }}
              />
              {proposalId && (
                <a href={`/proposal/${proposalId}`} target="_blank" rel="noopener noreferrer"
                  className="btn-primary text-sm gap-1.5"
                  style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: "white" }}>
                  🔗 Web View
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* F18 web proposal banner */}
      {showSections && proposalId && (
        <div className="mb-5 rounded-xl border px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
          style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}30` }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: primaryColor }}>
              🌐 Your proposal has a shareable web link
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Share it with your client — loads instantly in browser, mobile-friendly, with interactive pricing and payment.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/proposal/${proposalId}`); alert("Link copied!"); }}
              className="btn-secondary text-xs py-1.5 px-3"
            >📋 Copy Link</button>
            <a href={`/proposal/${proposalId}`} target="_blank" rel="noopener noreferrer"
              className="btn-primary text-xs py-1.5 px-3"
              style={{ backgroundColor: primaryColor, color: "white" }}>
              Open →
            </a>
          </div>
        </div>
      )}

      {/* F04 hint */}
      {showSections && Object.keys(overrides).length === 0 && (
        <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3">
          <span className="text-xl">✨</span>
          <p className="text-sm text-amber-800">
            <strong>Tip:</strong> Hover over any section and click <strong>🔄 Regenerate</strong> to get 3 AI alternatives for just that block.
          </p>
        </div>
      )}

      {/* ── EDITOR MODE ─────────────────────────────────────── */}
      {viewMode === "editor" && showSections && (
        <div style={{ height: "calc(100vh - 180px)", borderRadius: 16, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 24 }}>
          <DocumentEditor
            content={proposal}
            documentId={proposalId}
            documentType="proposal"
            title={`Proposal for ${clientName}`}
            onSave={async (html) => {
              if (!proposalId) return;
              const { createClient } = await import("@/lib/supabase/client");
              const supabase = createClient();
              await supabase
                .from("proposals")
                .update({ proposal_text: html })
                .eq("id", proposalId);
            }}
          />
        </div>
      )}

      {/* ── PREVIEW MODE ─────────────────────────────────────── */}
      {viewMode === "preview" && (<>

      {/* Payment link banner */}
      {(paymentLink || loadingPayment) && (
        <div className="mb-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-green-800 mb-1 flex items-center gap-2">💳 Stripe Payment Link Ready</h3>
              {loadingPayment ? (
                <p className="text-sm text-green-600 animate-pulse">Generating payment link…</p>
              ) : (
                <>
                  <p className="text-sm text-green-700 mb-3">
                    Deposit: <strong>{currency} {depositAmount.toLocaleString()}</strong> — share this link so the client pays instantly.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <a href={paymentLink!} target="_blank" rel="noopener noreferrer"
                      className="btn-primary text-sm bg-green-600 hover:bg-green-700 focus-visible:outline-green-600">
                      🔗 Open Payment Link
                    </a>
                    <button onClick={() => { navigator.clipboard.writeText(paymentLink!); alert("Copied!"); }}
                      className="btn-secondary text-sm">Copy Link</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Streaming — show raw text while generating */}
      {isStreaming && (
        <div className="card">
          <div className="flex items-center gap-3 text-brand-600 animate-pulse mb-4">
            <span className="text-2xl animate-spin inline-block">⚡</span>
            <span className="font-medium">Claude is writing your proposal…</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
            {proposal}
          </pre>
        </div>
      )}

      {/* Initial loading */}
      {loading && !proposal && (
        <div className="card flex items-center gap-3 py-12 justify-center text-brand-600 animate-pulse">
          <span className="text-3xl animate-spin inline-block">⚡</span>
          <span className="font-medium text-lg">Claude is writing your proposal…</span>
        </div>
      )}

      {/* F07 — Interactive pricing tiers (shown after proposal streams) */}
      {showSections && tiers.length > 0 && tiers.some(t => t.price > 0) && (
        <div className="card mb-6">
          <PricingTiersView
            tiers={tiers}
            currency={currency}
            selected={selectedTier}
            onSelect={setSelectedTier}
          />
          {(effectivePaymentLink || loadingPayment) && (
            <div className="mt-5 rounded-xl bg-green-50 border border-green-200 px-4 py-4">
              {loadingPayment ? (
                <p className="text-sm text-green-600 animate-pulse">⚡ Generating payment links for all tiers…</p>
              ) : (
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      💳 {activeTier?.name} — Deposit:{" "}
                      {currency} {Math.round((activeTier?.price ?? 0) * (activeTier?.depositPercent ?? 50) / 100).toLocaleString()}
                      {addOnTotal > 0 && <span className="ml-1 text-brand-700">+ {currency} {addOnTotal.toLocaleString()} add-ons</span>}
                    </p>
                    <p className="text-xs text-green-700 mt-0.5">Click to pay deposit via Stripe</p>
                  </div>
                  <a href={effectivePaymentLink!} target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-sm bg-green-600 hover:bg-green-700 focus-visible:outline-green-600">
                    🔗 Pay Deposit Now
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* F08 — Add-ons checklist */}
      {showSections && addOns.some(a => a.name) && (
        <div className="card mb-6">
          <AddOnsView
            addOns={addOns}
            currency={currency}
            selected={selectedAddOns}
            onToggle={(id) => setSelectedAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          />
        </div>
      )}

      {/* Sectioned proposal — F04 */}
      {showSections && (
        <div className="space-y-1">
          {sections.map((section) => {
            const content = overrides[section.id] ?? section.content;
            const isOverridden = !!overrides[section.id];
            return (
              <div
                key={section.id}
                className={`group relative rounded-xl transition-all ${
                  isOverridden
                    ? "ring-2 ring-brand-300 bg-brand-50/30"
                    : "hover:bg-gray-50"
                } p-5`}
              >
                {/* Section header */}
                {section.heading && (
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {isOverridden && (
                        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                          edited
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setRegenerating(section)}
                        className="flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm hover:border-brand-400 hover:text-brand-600 transition-all"
                      >
                        🔄 Regenerate
                      </button>
                    </div>
                  </div>
                )}

                {/* Section content */}
                <div
                  className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-[15px]"
                  dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${md(content)}</p>` }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* F09 — Milestone payment schedule */}
      {showSections && milestones.length > 0 && totalBudget > 0 && (
        <div className="card mt-6">
          <MilestonesView milestones={milestones} totalBudget={totalBudget} currency={currency} />
        </div>
      )}

      {/* Footer */}
      {showSections && (
        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-5">
          <p className="text-sm text-gray-600 mb-2 font-medium">📧 Next steps:</p>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Switch to <strong>Edit mode</strong> to refine any part of the proposal</li>
            <li>Client selects their pricing tier and checks any add-ons</li>
            <li>Client pays their chosen milestone via Stripe — no invoice chasing</li>
            <li>Copy or print as PDF, then email from <strong>{freelancerEmail}</strong></li>
          </ol>
        </div>
      )}

      </>)} {/* end preview mode */}
    </div>
  );
}
