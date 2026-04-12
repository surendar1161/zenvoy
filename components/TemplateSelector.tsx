"use client";

import { useState } from "react";
import { industryGroups, type Template } from "@/lib/templates";

interface Props {
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export default function TemplateSelector({ onSelect, onClose }: Props) {
  const [activeIndustry, setActiveIndustry] = useState(industryGroups[0].industry);

  const activeGroup = industryGroups.find((g) => g.industry === activeIndustry)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Pre-filled with industry-standard scope, deliverables and pricing
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Industry sidebar */}
          <div className="w-52 flex-shrink-0 border-r border-gray-100 overflow-y-auto bg-gray-50 p-3 space-y-1">
            {industryGroups.map((group) => (
              <button
                key={group.industry}
                onClick={() => setActiveIndustry(group.industry)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeIndustry === group.industry
                    ? "bg-brand-600 text-white"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                <span className="text-lg">{group.icon}</span>
                <span className="leading-tight">{group.industry}</span>
              </button>
            ))}
          </div>

          {/* Templates grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {activeGroup.icon} {activeGroup.industry}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {activeGroup.templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => { onSelect(tpl); onClose(); }}
                  className="text-left rounded-xl border-2 border-gray-200 p-5 hover:border-brand-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{tpl.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                        {tpl.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{tpl.description}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-gray-400">💰</span>
                      <span>
                        {tpl.defaults.currency || "USD"}{" "}
                        {(tpl.defaults.totalBudget || 0).toLocaleString()} total
                        <span className="text-gray-400 mx-1">·</span>
                        {tpl.defaults.depositPercent}% deposit
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-gray-400">⏱️</span>
                      <span>{tpl.defaults.timeline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-gray-400">🎨</span>
                      <span className="capitalize">{tpl.defaults.tone} tone</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Use this template →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
