"use client";

import { useState } from "react";
import type { AddOn } from "@/lib/types";

// ── Editor (freelancer configures add-ons) ──────────────────
interface EditorProps {
  addOns: AddOn[];
  currency: string;
  onChange: (addOns: AddOn[]) => void;
}

export function AddOnsEditor({ addOns, currency, onChange }: EditorProps) {
  function update(id: string, field: keyof AddOn, value: string | number) {
    onChange(addOns.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  function remove(id: string) {
    onChange(addOns.filter(a => a.id !== id));
  }

  function add() {
    onChange([
      ...addOns,
      { id: `addon-${Date.now()}`, name: "", price: 0, description: "" },
    ]);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Pre-define optional upsells. Clients can check boxes in the proposal — total auto-updates.
      </p>
      {addOns.map(addon => (
        <div key={addon.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
          <div className="flex-1 grid grid-cols-5 gap-2">
            <input className="input text-sm col-span-2" placeholder="Add-on name"
              value={addon.name} onChange={e => update(addon.id, "name", e.target.value)} />
            <input className="input text-sm" placeholder="Description"
              value={addon.description} onChange={e => update(addon.id, "description", e.target.value)} />
            <div className="flex items-center gap-1 col-span-1">
              <span className="text-xs text-gray-400">{currency}</span>
              <input className="input text-sm" type="number" min={0}
                value={addon.price} onChange={e => update(addon.id, "price", Number(e.target.value))} />
            </div>
            <div />
          </div>
          <button type="button" onClick={() => remove(addon.id)}
            className="text-gray-400 hover:text-red-500 text-sm flex-shrink-0">✕</button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="btn-secondary text-sm w-full justify-center">
        + Add Optional Add-on
      </button>
    </div>
  );
}

// ── Client view (interactive checklist) ────────────────────
interface ViewProps {
  addOns: AddOn[];
  currency: string;
  selected: string[];
  onToggle: (id: string) => void;
}

export function AddOnsView({ addOns, currency, selected, onToggle }: ViewProps) {
  if (!addOns.length) return null;
  const total = addOns.filter(a => selected.includes(a.id)).reduce((s, a) => s + a.price, 0);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Optional Add-ons</h2>
      <p className="text-sm text-gray-600 mb-4">Enhance your project with these optional extras. Check the ones you&apos;d like to include.</p>
      <div className="space-y-2">
        {addOns.filter(a => a.name).map(addon => {
          const checked = selected.includes(addon.id);
          return (
            <label key={addon.id}
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 cursor-pointer transition-all ${
                checked ? "border-brand-400 bg-brand-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded accent-brand-600 flex-shrink-0"
                checked={checked}
                onChange={() => onToggle(addon.id)}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">{addon.name}</div>
                {addon.description && <div className="text-xs text-gray-500 mt-0.5">{addon.description}</div>}
              </div>
              <div className="font-bold text-gray-900 flex-shrink-0">
                +{currency} {addon.price.toLocaleString()}
              </div>
            </label>
          );
        })}
      </div>
      {total > 0 && (
        <div className="mt-3 flex justify-end">
          <div className="rounded-lg bg-brand-50 border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-800">
            Add-ons total: {currency} {total.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
