"use client";

import type { PricingTier } from "@/lib/types";

interface Props {
  tiers: PricingTier[];
  currency: string;
  onChange: (tiers: PricingTier[]) => void;
}

export default function PricingTiersEditor({ tiers, currency, onChange }: Props) {
  function update(id: string, field: keyof PricingTier, value: unknown) {
    onChange(tiers.map(t => t.id === id ? { ...t, [field]: value } : t));
  }

  function updateFeature(tierId: string, idx: number, val: string) {
    const tier = tiers.find(t => t.id === tierId)!;
    const features = [...tier.features];
    features[idx] = val;
    update(tierId, "features", features);
  }

  function addFeature(tierId: string) {
    const tier = tiers.find(t => t.id === tierId)!;
    update(tierId, "features", [...tier.features, ""]);
  }

  function removeFeature(tierId: string, idx: number) {
    const tier = tiers.find(t => t.id === tierId)!;
    update(tierId, "features", tier.features.filter((_, i) => i !== idx));
  }

  function setRecommended(id: string) {
    onChange(tiers.map(t => ({ ...t, recommended: t.id === id })));
  }

  const colors = ["border-gray-200", "border-brand-400", "border-purple-400"];
  const badges = ["🥉 Good", "🥈 Better", "🥇 Best"];

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Set three package tiers. Clients can choose their preferred tier directly in the proposal.
        The matching Stripe payment link is auto-generated.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiers.map((tier, i) => (
          <div key={tier.id} className={`rounded-xl border-2 p-4 overflow-hidden ${colors[i]} ${tier.recommended ? "ring-2 ring-brand-300" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase">{badges[i]}</span>
              <button
                type="button"
                onClick={() => setRecommended(tier.id)}
                className={`text-xs rounded-full px-2 py-0.5 font-medium transition-all ${
                  tier.recommended
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-brand-100 hover:text-brand-700"
                }`}
              >
                {tier.recommended ? "⭐ Recommended" : "Set recommended"}
              </button>
            </div>

            <input
              className="input text-sm font-semibold mb-2"
              placeholder="e.g. Starter"
              value={tier.name}
              onChange={e => update(tier.id, "name", e.target.value)}
            />
            <input
              className="input text-xs mb-3 w-full"
              placeholder="Tagline…"
              value={tier.tagline}
              onChange={e => update(tier.id, "tagline", e.target.value)}
            />

            <div className="flex gap-2 mb-4 min-w-0">
              <div className="flex-1 min-w-0">
                <label className="text-xs text-gray-500 mb-1 block">Price ({currency})</label>
                <input
                  className="input text-sm font-bold"
                  type="number"
                  min={0}
                  value={tier.price}
                  onChange={e => update(tier.id, "price", Number(e.target.value))}
                />
              </div>
              <div className="w-24 flex-shrink-0">
                <label className="text-xs text-gray-500 mb-1 block truncate">Deposit %</label>
                <select className="input text-xs" value={tier.depositPercent}
                  onChange={e => update(tier.id, "depositPercent", Number(e.target.value))}>
                  {[25, 30, 40, 50, 60].map(p => <option key={p}>{p}%</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Features included</label>
              <div className="space-y-1.5">
                {tier.features.map((f, idx) => (
                  <div key={idx} className="flex gap-1">
                    <input
                      className="input text-xs flex-1 py-1.5"
                      value={f}
                      placeholder="Feature…"
                      onChange={e => updateFeature(tier.id, idx, e.target.value)}
                    />
                    <button type="button" onClick={() => removeFeature(tier.id, idx)}
                      className="text-gray-400 hover:text-red-500 px-1 text-sm">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => addFeature(tier.id)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  + Add feature
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Client-facing interactive pricing table (F07) ────────────
interface ViewProps {
  tiers: PricingTier[];
  currency: string;
  selected: string;
  onSelect: (id: string) => void;
}

export function PricingTiersView({ tiers, currency, selected, onSelect }: ViewProps) {
  const colors = [
    "border-gray-200 hover:border-gray-400",
    "border-brand-400 hover:border-brand-500",
    "border-purple-400 hover:border-purple-500",
  ];
  const bgColors = ["bg-white", "bg-brand-50", "bg-purple-50"];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Package</h2>
      <p className="text-sm text-gray-600 mb-5">Select the option that best fits your needs. Your Stripe payment link updates automatically.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiers.map((tier, i) => {
          const isSelected = selected === tier.id;
          const deposit = Math.round(tier.price * tier.depositPercent / 100);
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              className={`relative text-left rounded-xl border-2 p-5 transition-all ${colors[i]} ${bgColors[i]} ${
                isSelected ? "ring-2 ring-brand-500 ring-offset-2 scale-[1.02]" : ""
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-brand-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</div>
              )}
              <div className="font-bold text-gray-900 text-lg mb-0.5">{tier.name}</div>
              <div className="text-xs text-gray-500 mb-3">{tier.tagline}</div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {currency} {tier.price.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Deposit: {currency} {deposit.toLocaleString()} ({tier.depositPercent}%)
              </div>
              <ul className="space-y-1.5">
                {tier.features.filter(Boolean).map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
