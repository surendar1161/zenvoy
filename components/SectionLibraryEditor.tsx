"use client";

import { useState } from "react";
import type { ProposalSection } from "@/lib/types";
import type { ProposalFormData } from "@/lib/types";

interface Props {
  sections: ProposalSection[];
  onChange: (sections: ProposalSection[]) => void;
  formData: ProposalFormData;
}

export default function SectionLibraryEditor({ sections, onChange, formData }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);

  function toggle(id: string) {
    onChange(sections.map(s => s.id === id && !s.locked ? { ...s, included: !s.included } : s));
  }

  function updateContent(id: string, content: string) {
    onChange(sections.map(s => s.id === id ? { ...s, content } : s));
  }

  async function generateContent(section: ProposalSection) {
    setGenerating(section.id);
    try {
      const res = await fetch("/api/generate-section-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: section.id,
          sectionTitle: section.title,
          formData,
          tone: formData.tone,
        }),
      });
      if (res.ok) {
        const { content } = await res.json();
        updateContent(section.id, content);
      }
    } finally {
      setGenerating(null);
    }
  }

  const included = sections.filter(s => s.included);
  const excluded = sections.filter(s => !s.included);

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Toggle sections on/off, edit content, or let AI write each one individually.
        Locked sections (🔒) are required for a complete proposal.
      </p>

      {/* Included sections */}
      <div className="space-y-2">
        {included.map((section, idx) => (
          <SectionRow
            key={section.id}
            section={section}
            index={idx + 1}
            generating={generating === section.id}
            onToggle={() => toggle(section.id)}
            onContentChange={(c) => updateContent(section.id, c)}
            onGenerate={() => generateContent(section)}
          />
        ))}
      </div>

      {/* Excluded sections */}
      {excluded.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Not included</p>
          <div className="space-y-1">
            {excluded.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-all"
              >
                <span className="text-lg text-gray-300">○</span>
                <span>{section.title}</span>
                <span className="ml-auto text-xs text-brand-500">+ Add</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionRow({
  section, index, generating, onToggle, onContentChange, onGenerate
}: {
  section: ProposalSection;
  index: number;
  generating: boolean;
  onToggle: () => void;
  onContentChange: (c: string) => void;
  onGenerate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${expanded ? "border-brand-200 bg-brand-50/30" : "border-gray-200 bg-white"}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-xs font-bold text-gray-400 w-5 text-center">{index}</span>
        <button type="button" onClick={() => setExpanded(e => !e)}
          className="flex-1 text-left text-sm font-medium text-gray-800 hover:text-brand-700 flex items-center gap-2">
          {section.title}
          {section.locked && <span title="Required" className="text-xs">🔒</span>}
          {section.content && <span className="text-xs text-green-600 font-normal">✓ content ready</span>}
          <span className="ml-auto text-gray-400">{expanded ? "▲" : "▼"}</span>
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0"
          title="AI-write this section"
        >
          {generating ? <span className="animate-spin inline-block">⚡</span> : "⚡ AI Write"}
        </button>
        {!section.locked && (
          <button type="button" onClick={onToggle}
            className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 px-1" title="Remove section">
            ✕
          </button>
        )}
      </div>

      {/* Editable content */}
      {expanded && (
        <div className="px-4 pb-4">
          <textarea
            className="input min-h-[120px] text-sm font-mono"
            placeholder={`Write the ${section.title} section here, or click ⚡ AI Write to generate it automatically…`}
            value={section.content}
            onChange={e => onContentChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
