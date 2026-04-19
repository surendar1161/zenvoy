"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, Select, Space, Tag, Tooltip, Typography, message } from "antd";
import { BookOutlined, ThunderboltOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { ProposalSection, ProposalFormData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const { Text } = Typography;

interface LibraryItem {
  id: string; title: string; content: string; category: string; tags: string[]; use_count: number;
}

interface Props {
  sections: ProposalSection[];
  onChange: (sections: ProposalSection[]) => void;
  formData: ProposalFormData;
}

export default function SectionLibraryEditor({ sections, onChange, formData }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategory, setLibraryCategory] = useState<string | null>(null);
  const [msgApi, ctx] = message.useMessage();

  const CATEGORIES = ["General", "About Me", "Case Study", "Scope of Work", "Terms & Conditions", "Why Choose Me", "Pricing", "Timeline", "Testimonials"];

  async function loadLibrary() {
    const supabase = createClient();
    const { data } = await supabase.from("content_library").select("*").order("use_count", { ascending: false });
    setLibraryItems((data ?? []) as LibraryItem[]);
  }

  function openLibraryPicker(sectionId: string) {
    setTargetSectionId(sectionId);
    setLibrarySearch("");
    setLibraryCategory(null);
    setLibraryOpen(true);
    loadLibrary();
  }

  async function insertFromLibrary(item: LibraryItem) {
    if (!targetSectionId) return;
    onChange(sections.map(s => s.id === targetSectionId ? { ...s, content: (s.content ? s.content + "\n\n" : "") + item.content } : s));

    // Increment use_count
    const supabase = createClient();
    await supabase.from("content_library").update({ use_count: item.use_count + 1 }).eq("id", item.id);
    setLibraryItems(prev => prev.map(i => i.id === item.id ? { ...i, use_count: i.use_count + 1 } : i));

    msgApi.success(`"${item.title}" inserted into section`);
    setLibraryOpen(false);
  }

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
        body: JSON.stringify({ sectionId: section.id, sectionTitle: section.title, formData, tone: formData.tone }),
      });
      if (res.ok) {
        const { content } = await res.json();
        updateContent(section.id, content);
      }
    } finally { setGenerating(null); }
  }

  const included = sections.filter(s => s.included);
  const excluded = sections.filter(s => !s.included);

  const filteredLibrary = libraryItems.filter(i => {
    const matchSearch = !librarySearch || i.title.toLowerCase().includes(librarySearch.toLowerCase()) || i.content.toLowerCase().includes(librarySearch.toLowerCase());
    const matchCat = !libraryCategory || i.category === libraryCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-3">
      {ctx}
      <p className="text-xs text-gray-500">
        Toggle sections on/off, edit content, or let AI write each one. Click <BookOutlined style={{ fontSize: 11 }} /> to insert from your Content Library.
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
            onContentChange={c => updateContent(section.id, c)}
            onGenerate={() => generateContent(section)}
            onOpenLibrary={() => openLibraryPicker(section.id)}
          />
        ))}
      </div>

      {/* Excluded sections */}
      {excluded.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Not included</p>
          <div className="space-y-1">
            {excluded.map(section => (
              <button key={section.id} type="button" onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-all">
                <span className="text-lg text-gray-300">○</span>
                <span>{section.title}</span>
                <span className="ml-auto text-xs text-brand-500">+ Add</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Library Picker Modal */}
      <Modal
        open={libraryOpen}
        onCancel={() => setLibraryOpen(false)}
        title={<Space><BookOutlined style={{ color: "#0ea5e9" }} />Insert from Content Library</Space>}
        width={680}
        footer={[
          <Button key="cancel" onClick={() => setLibraryOpen(false)}>Cancel</Button>,
          <a key="manage" href="/content-library" target="_blank" rel="noopener noreferrer">
            <Button icon={<PlusOutlined />}>Manage Library</Button>
          </a>,
        ]}
      >
        <Space style={{ width: "100%", marginBottom: 16 }} size={8}>
          <Input
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            placeholder="Search library…" value={librarySearch}
            onChange={e => setLibrarySearch(e.target.value)}
            style={{ width: 240, borderRadius: 8 }} allowClear
          />
          <Select placeholder="Category" allowClear value={libraryCategory ?? undefined}
            onChange={v => setLibraryCategory(v ?? null)} style={{ width: 160 }}
            options={CATEGORIES.map(c => ({ value: c, label: c }))} />
        </Space>

        {filteredLibrary.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
            <BookOutlined style={{ fontSize: 40, marginBottom: 12 }} />
            <div>No library items yet.{" "}
              <a href="/content-library" target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9" }}>
                Add some →
              </a>
            </div>
          </div>
        ) : (
          <div style={{ maxHeight: 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredLibrary.map(item => (
              <div key={item.id} style={{
                border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px",
                cursor: "pointer", transition: "all 0.15s",
              }}
                onClick={() => insertFromLibrary(item)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#0ea5e9"; e.currentTarget.style.background = "#f0f9ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
                  <Space size={6}>
                    <Tag style={{ borderRadius: 20, fontSize: 11 }}>{item.category}</Tag>
                    {item.use_count > 0 && <Text type="secondary" style={{ fontSize: 11 }}>Used {item.use_count}×</Text>}
                  </Space>
                </div>
                <Text type="secondary" style={{ fontSize: 12, display: "block", lineHeight: 1.6 }}>
                  {item.content.replace(/<[^>]+>/g, " ").slice(0, 150)}…
                </Text>
                {item.tags?.length > 0 && (
                  <Space wrap style={{ marginTop: 6 }}>
                    {item.tags.slice(0, 4).map(t => <Tag key={t} style={{ borderRadius: 20, fontSize: 10, padding: "0 6px" }}>{t}</Tag>)}
                  </Space>
                )}
                <div style={{ marginTop: 8, textAlign: "right" }}>
                  <Button size="small" type="primary" style={{ borderRadius: 6, fontSize: 12 }}>
                    Insert into section
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

function SectionRow({
  section, index, generating, onToggle, onContentChange, onGenerate, onOpenLibrary
}: {
  section: ProposalSection; index: number; generating: boolean;
  onToggle: () => void; onContentChange: (c: string) => void;
  onGenerate: () => void; onOpenLibrary: () => void;
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

        {/* Library insert button */}
        <Tooltip title="Insert from Content Library">
          <button type="button" onClick={onOpenLibrary}
            className="btn-secondary text-xs py-1.5 px-2 flex-shrink-0 flex items-center gap-1"
            title="Insert from Content Library">
            <BookOutlined style={{ fontSize: 12 }} /> Library
          </button>
        </Tooltip>

        {/* AI write */}
        <button type="button" onClick={onGenerate} disabled={generating}
          className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0" title="AI-write this section">
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
            placeholder={`Write the ${section.title} section here, click ⚡ AI Write to generate, or 📚 Library to insert saved content…`}
            value={section.content}
            onChange={e => onContentChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
