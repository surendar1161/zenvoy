"use client";

import type { Milestone } from "@/lib/types";

// ── Editor ──────────────────────────────────────────────────
interface EditorProps {
  milestones: Milestone[];
  totalBudget: number;
  currency: string;
  onChange: (milestones: Milestone[]) => void;
}

export function MilestoneEditor({ milestones, totalBudget, currency, onChange }: EditorProps) {
  const totalPct = milestones.reduce((s, m) => s + m.percentage, 0);
  const balanced = totalPct === 100;

  function update(id: string, field: keyof Milestone, value: string | number) {
    onChange(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
  }

  function remove(id: string) {
    if (milestones.length <= 2) return;
    onChange(milestones.filter(m => m.id !== id));
  }

  function add() {
    if (milestones.length >= 4) return;
    onChange([
      ...milestones,
      { id: `m${Date.now()}`, name: "", description: "", percentage: 0, dueLabel: "" },
    ]);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Split the project into 2–4 payment milestones. Each gets its own Stripe payment link — no more chasing invoices.
        Percentages must add up to 100%.
      </p>

      <div className={`text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${
        balanced ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
      }`}>
        {balanced ? "✅" : "⚠️"} Total: {totalPct}% {!balanced && `— needs ${100 - totalPct}% more`}
      </div>

      <div className="space-y-2">
        {milestones.map((m, idx) => {
          const amount = Math.round(totalBudget * m.percentage / 100);
          return (
            <div key={m.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <input className="input text-sm flex-1" placeholder="Milestone name (e.g. Project Kick-off)"
                  value={m.name} onChange={e => update(m.id, "name", e.target.value)} />
                <div className="flex items-center gap-1 w-28 flex-shrink-0">
                  <input className="input text-sm w-16" type="number" min={0} max={100}
                    value={m.percentage} onChange={e => update(m.id, "percentage", Number(e.target.value))} />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                {milestones.length > 2 && (
                  <button type="button" onClick={() => remove(m.id)}
                    className="text-gray-400 hover:text-red-500 text-sm flex-shrink-0">✕</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="input text-xs" placeholder="Description (e.g. Deposit to begin work)"
                  value={m.description} onChange={e => update(m.id, "description", e.target.value)} />
                <input className="input text-xs" placeholder="Due (e.g. Day 1 — Before work begins)"
                  value={m.dueLabel} onChange={e => update(m.id, "dueLabel", e.target.value)} />
              </div>
              {m.percentage > 0 && (
                <div className="mt-2 text-xs text-brand-600 font-medium">
                  = {currency} {amount.toLocaleString()} — Stripe link auto-generated on proposal creation
                </div>
              )}
            </div>
          );
        })}
      </div>

      {milestones.length < 4 && (
        <button type="button" onClick={add} className="btn-secondary text-sm w-full justify-center">
          + Add Milestone (max 4)
        </button>
      )}
    </div>
  );
}

// ── Client view (milestone payment links) ────────────────────
interface ViewProps {
  milestones: Milestone[];
  totalBudget: number;
  currency: string;
}

export function MilestonesView({ milestones, totalBudget, currency }: ViewProps) {
  if (!milestones.length) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Schedule</h2>
      <p className="text-sm text-gray-600 mb-5">
        Your project is split into clear payment milestones. Each has its own secure payment link.
      </p>
      <div className="space-y-3">
        {milestones.map((m, idx) => {
          const amount = Math.round(totalBudget * m.percentage / 100);
          return (
            <div key={m.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{m.name || `Milestone ${idx + 1}`}</div>
                {m.description && <div className="text-xs text-gray-500 mt-0.5">{m.description}</div>}
                {m.dueLabel && (
                  <div className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                    📅 {m.dueLabel}
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-gray-900">
                  {currency} {amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">{m.percentage}% of total</div>
              </div>
              {m.paymentLink ? (
                <a
                  href={m.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm flex-shrink-0 bg-green-600 hover:bg-green-700 focus-visible:outline-green-600"
                >
                  💳 Pay Now
                </a>
              ) : (
                <div className="text-xs text-gray-400 flex-shrink-0 w-24 text-center">
                  Link generated on proposal send
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
          Total: {currency} {totalBudget.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
