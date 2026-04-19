"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";

// Extensions installed via package.json — available in production
// Using require with try/catch to avoid build errors if not yet installed locally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TextStyle: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Color: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let FontFamily: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TableExt: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TableRow: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TableCell: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TableHeader: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Subscript: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Superscript: any = null;

try { TextStyle  = require("@tiptap/extension-text-style").default; } catch {}
try { Color      = require("@tiptap/extension-color").default; } catch {}
try { FontFamily = require("@tiptap/extension-font-family").default; } catch {}
try { TableExt   = require("@tiptap/extension-table").default; } catch {}
try { TableRow   = require("@tiptap/extension-table-row").default; } catch {}
try { TableCell  = require("@tiptap/extension-table-cell").default; } catch {}
try { TableHeader= require("@tiptap/extension-table-header").default; } catch {}
try { Subscript  = require("@tiptap/extension-subscript").default; } catch {}
try { Superscript= require("@tiptap/extension-superscript").default; } catch {}

import { markdownToHtml, htmlToPlainText } from "@/lib/markdown-to-html";
import { Divider, Tooltip, message } from "antd";
import {
  BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined,
  OrderedListOutlined, UnorderedListOutlined, AlignLeftOutlined,
  AlignCenterOutlined, AlignRightOutlined,
  UndoOutlined, RedoOutlined, HighlightOutlined, PrinterOutlined,
  CopyOutlined, DownloadOutlined, SaveOutlined, CheckCircleOutlined,
  LoadingOutlined, ArrowLeftOutlined, FullscreenOutlined, FullscreenExitOutlined,
  LinkOutlined, TableOutlined, BookOutlined, SearchOutlined,
} from "@ant-design/icons";
import NextLink from "next/link";

interface Props {
  content: string;
  documentId?: string | null;
  documentType?: "proposal" | "contract";
  onSave?: (html: string) => Promise<void>;
  title?: string;
  backHref?: string;
  backLabel?: string;
  readOnly?: boolean;
}

type SaveState = "idle" | "saving" | "saved" | "error";

const FONTS = ["Inter","Georgia","Arial","Times New Roman","Courier New","Trebuchet MS","Verdana"];
const FONT_SIZES = ["10","11","12","13","14","16","18","20","24","28","32","36","48"];
const COLORS = [
  "#000000","#1a1a1a","#374151","#6b7280","#9ca3af",
  "#ef4444","#f59e0b","#10b981","#0ea5e9","#8b5cf6",
  "#dc2626","#d97706","#059669","#0284c7","#7c3aed",
  "#ffffff","#fef3c7","#dbeafe","#d1fae5","#ede9fe",
];
const HIGHLIGHT_COLORS = ["#fef08a","#bbf7d0","#bfdbfe","#fecaca","#e9d5ff","transparent"];

export default function RichEditor({
  content, documentId, documentType = "proposal",
  onSave, title, backHref, backLabel, readOnly = false,
}: Props) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [wordCount, setWordCount] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryItems, setLibraryItems] = useState<{id:string;title:string;content:string;category:string;use_count:number}[]>([]);
  const [librarySearch, setLibrarySearch] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [msgApi, ctx] = message.useMessage();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestHtml = useRef("");

  const initialHtml = content.trimStart().startsWith("<") ? content : markdownToHtml(content);

  // Build extensions array dynamically
  const extensions = [
    StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false }),
    Underline,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Highlight.configure({ multicolor: true }),
    Placeholder.configure({ placeholder: "Start writing…" }),
    CharacterCount,
    Link.configure({ openOnClick: false, autolink: true }),
    ...(TextStyle ? [TextStyle] : []),
    ...(Color && TextStyle ? [Color] : []),
    ...(FontFamily && TextStyle ? [FontFamily] : []),
    ...(TableExt ? [TableExt.configure({ resizable: true, allowTableNodeSelection: true })] : []),
    ...(TableRow ? [TableRow] : []),
    ...(TableCell ? [TableCell] : []),
    ...(TableHeader ? [TableHeader] : []),
    ...(Subscript ? [Subscript] : []),
    ...(Superscript ? [Superscript] : []),
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: initialHtml,
    editable: !readOnly,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      latestHtml.current = html;
      setWordCount(htmlToPlainText(html).split(/\s+/).filter(Boolean).length);
      if (onSave) {
        setSaveState("saving");
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          try { await onSave(html); setSaveState("saved"); setTimeout(() => setSaveState("idle"), 2500); }
          catch { setSaveState("error"); }
        }, 2000);
      }
    },
  });

  useEffect(() => {
    if (!editor || !content) return;
    const html = content.trimStart().startsWith("<") ? content : markdownToHtml(content);
    const current = editor.getHTML();
    if (html !== current && html.length > current.length) {
      editor.commands.setContent(html);
      latestHtml.current = html;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const manualSave = useCallback(async () => {
    if (!onSave || !editor) return;
    setSaveState("saving");
    try {
      await onSave(editor.getHTML());
      setSaveState("saved");
      msgApi.success("Document saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      msgApi.error("Save failed");
    }
  }, [editor, onSave, msgApi]);

  function copyText() {
    navigator.clipboard.writeText(htmlToPlainText(editor?.getHTML() ?? ""));
    msgApi.success("Copied!");
  }


  async function loadLibrary() {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase.from('content_library').select('*').order('use_count', { ascending: false });
    setLibraryItems((data ?? []) as typeof libraryItems);
  }

  async function insertFromLibrary(item: typeof libraryItems[0]) {
    if (!editor) return;
    const isHtml = item.content.trimStart().startsWith('<'); const html = isHtml ? item.content : item.content.split('\n').join('<br>');
    editor.chain().focus().insertContent(html).run();
    setShowLibrary(false);
    // increment use_count
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.from('content_library').update({ use_count: item.use_count + 1 }).eq('id', item.id);
    setLibraryItems(prev => prev.map(i => i.id === item.id ? { ...i, use_count: i.use_count + 1 } : i));
  }

  function downloadHtml() {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title ?? "Document"}</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 32px;line-height:1.8;color:#1a1a1a}h1,h2,h3{color:#0f172a}table{border-collapse:collapse;width:100%}td,th{border:1px solid #e2e8f0;padding:8px 12px}th{background:#f8fafc}</style></head><body>${editor?.getHTML() ?? ""}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${(title ?? documentType).replace(/\s+/g, "_")}.html`;
    a.click(); URL.revokeObjectURL(url);
  }

  function insertTable() {
    (editor as any)?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setShowTableMenu(false);
  }

  function setLink() {
    if (!linkUrl) { editor?.chain().focus().unsetLink().run(); setShowLinkInput(false); return; }
    editor?.chain().focus().setLink({ href: linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}` }).run();
    setLinkUrl(""); setShowLinkInput(false);
  }

  if (!editor) return null;

  const ToolBtn = ({ onClick, active, disabled, icon, tip, children }: {
    onClick: () => void; active?: boolean; disabled?: boolean;
    icon?: React.ReactNode; tip: string; children?: React.ReactNode;
  }) => (
    <Tooltip title={tip} mouseEnterDelay={0.6}>
      <button onClick={onClick} disabled={disabled} style={{
        border: "none", borderRadius: 5, cursor: disabled ? "not-allowed" : "pointer",
        padding: "0 7px", height: 28, minWidth: 28,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
        fontSize: 13, fontWeight: active ? 700 : 400,
        background: active ? "#dbeafe" : "transparent",
        color: active ? "#0369a1" : disabled ? "#cbd5e1" : "#374151",
        transition: "background 0.1s",
      }}
        onMouseEnter={e => { if (!disabled && !active) e.currentTarget.style.background = "#f1f5f9"; }}
        onMouseLeave={e => { e.currentTarget.style.background = active ? "#dbeafe" : "transparent"; }}
      >
        {icon}{children}
      </button>
    </Tooltip>
  );

  const Sep = () => <div style={{ width: 1, height: 22, background: "#e2e8f0", margin: "0 4px" }} />;

  const saveIcon = saveState === "saving" ? <LoadingOutlined spin />
    : saveState === "saved" ? <CheckCircleOutlined style={{ color: "#10b981" }} />
    : <SaveOutlined />;

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: fullscreen ? "100vh" : "100vh",
      position: fullscreen ? "fixed" : "relative",
      inset: fullscreen ? 0 : undefined,
      zIndex: fullscreen ? 1000 : 1,
      background: "#fff",
    }}>
      {ctx}

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "8px 16px", borderBottom: "1px solid #e2e8f0",
        background: "#fff", flexWrap: "wrap",
      }}>
        {backHref && (
          <NextLink href={backHref}>
            <button style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13, padding: "4px 0" }}>
              <ArrowLeftOutlined /> {backLabel ?? "Back"}
            </button>
          </NextLink>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            {saveState === "saving" && "⏳ Saving…"}
            {saveState === "saved" && "✅ Saved"}
            {saveState === "error" && "❌ Save failed"}
            {saveState === "idle" && (onSave ? "Auto-save on" : "Read only")}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <ToolBtn tip="Copy text" icon={<CopyOutlined />} onClick={copyText} />
          <ToolBtn tip="Download HTML" icon={<DownloadOutlined />} onClick={downloadHtml} />
          <ToolBtn tip="Print / Save PDF" icon={<PrinterOutlined />} onClick={() => window.print()} />
          {onSave && (
            <button onClick={manualSave} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "0 12px", height: 30,
              borderRadius: 7, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: saveState === "saved" ? "#f0fdf4" : "#0ea5e9",
              color: saveState === "saved" ? "#10b981" : "#fff",
            }}>
              {saveIcon} Save
            </button>
          )}
          <ToolBtn tip={fullscreen ? "Exit fullscreen" : "Fullscreen"} icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={() => setFullscreen(f => !f)} />
        </div>
      </div>

      {/* ── Formatting toolbar ── */}
      <div style={{
        display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2,
        padding: "5px 12px", borderBottom: "1px solid #e2e8f0",
        background: "#fafafa", position: "sticky", top: 0, zIndex: 10,
      }}>
        {/* Undo / Redo */}
        <ToolBtn tip="Undo (⌘Z)" icon={<UndoOutlined />} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
        <ToolBtn tip="Redo (⌘⇧Z)" icon={<RedoOutlined />} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
        <Sep />

        {/* Font family */}
        {FontFamily && (
          <select
            onChange={e => (editor as any).chain().focus().setFontFamily(e.target.value).run()}
            style={{ height: 26, borderRadius: 5, border: "1px solid #e2e8f0", fontSize: 12, padding: "0 4px", color: "#374151", background: "#fff", maxWidth: 130 }}
          >
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        )}

        {/* Font size */}
        <select
          onChange={e => {
            const size = e.target.value;
            if (editor && TextStyle) editor.chain().focus().setMark("textStyle", { fontSize: size + "px" }).run();
          }}
          style={{ height: 26, borderRadius: 5, border: "1px solid #e2e8f0", fontSize: 12, padding: "0 4px", color: "#374151", background: "#fff", width: 56 }}
        >
          {FONT_SIZES.map(s => <option key={s} value={s} selected={s === "14"}>{s}</option>)}
        </select>
        <Sep />

        {/* Headings */}
        <select
          value={editor.isActive("heading", { level: 1 }) ? "h1" : editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "p"}
          onChange={e => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(v[1]) as 1|2|3 }).run();
          }}
          style={{ height: 26, borderRadius: 5, border: "1px solid #e2e8f0", fontSize: 12, padding: "0 4px", color: "#374151", background: "#fff", width: 110 }}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <Sep />

        {/* Bold / Italic / Underline / Strike */}
        <ToolBtn tip="Bold (⌘B)" icon={<BoldOutlined />} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolBtn tip="Italic (⌘I)" icon={<ItalicOutlined />} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolBtn tip="Underline (⌘U)" icon={<UnderlineOutlined />} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <ToolBtn tip="Strikethrough" icon={<StrikethroughOutlined />} active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />
        {Subscript && <ToolBtn tip="Subscript" onClick={() => (editor as any).chain().focus().toggleSubscript().run()} active={(editor as any).isActive("subscript")}><span style={{ fontSize: 12 }}>x₂</span></ToolBtn>}
        {Superscript && <ToolBtn tip="Superscript" onClick={() => (editor as any).chain().focus().toggleSuperscript().run()} active={(editor as any).isActive("superscript")}><span style={{ fontSize: 12 }}>x²</span></ToolBtn>}
        <Sep />

        {/* Text color */}
        {Color && (
          <div style={{ position: "relative" }}>
            <Tooltip title="Text color">
              <button onClick={() => { setShowColorPicker(p => !p); setShowHighlightPicker(false); setShowTableMenu(false); }}
                style={{ border: "1px solid #e2e8f0", borderRadius: 5, padding: "0 6px", height: 28, cursor: "pointer", background: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>A</span>
                <span style={{ width: 14, height: 4, borderRadius: 2, background: editor.getAttributes("textStyle").color || "#000", display: "block" }} />
              </button>
            </Tooltip>
            {showColorPicker && (
              <div style={{ position: "absolute", top: 34, left: 0, zIndex: 100, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", width: 180 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4 }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => { (editor as any).chain().focus().setColor(c).run(); setShowColorPicker(false); }}
                      style={{ width: 26, height: 26, borderRadius: 4, background: c, border: c === "#ffffff" ? "1px solid #e2e8f0" : "none", cursor: "pointer" }} />
                  ))}
                </div>
                <button onClick={() => { (editor as any).chain().focus().unsetColor?.().run(); setShowColorPicker(false); }}
                  style={{ marginTop: 6, width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "4px 0", cursor: "pointer", fontSize: 12, color: "#64748b", background: "#f8fafc" }}>
                  Remove color
                </button>
              </div>
            )}
          </div>
        )}

        {/* Highlight */}
        <div style={{ position: "relative" }}>
          <Tooltip title="Highlight color">
            <button onClick={() => { setShowHighlightPicker(p => !p); setShowColorPicker(false); setShowTableMenu(false); }}
              style={{ border: "1px solid #e2e8f0", borderRadius: 5, padding: "0 6px", height: 28, cursor: "pointer", background: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
              <HighlightOutlined style={{ fontSize: 13, color: "#374151" }} />
              <span style={{ width: 14, height: 4, borderRadius: 2, background: "#fef08a", display: "block" }} />
            </button>
          </Tooltip>
          {showHighlightPicker && (
            <div style={{ position: "absolute", top: 34, left: 0, zIndex: 100, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {HIGHLIGHT_COLORS.map(c => (
                  <button key={c} onClick={() => {
                    if (c === "transparent") editor.chain().focus().unsetHighlight().run();
                    else editor.chain().focus().setHighlight({ color: c }).run();
                    setShowHighlightPicker(false);
                  }} style={{ width: 26, height: 26, borderRadius: 4, background: c, border: "1px solid #e2e8f0", cursor: "pointer" }} />
                ))}
              </div>
            </div>
          )}
        </div>
        <Sep />

        {/* Lists */}
        <ToolBtn tip="Bullet list" icon={<UnorderedListOutlined />} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolBtn tip="Numbered list" icon={<OrderedListOutlined />} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolBtn tip="Indent" onClick={() => editor.chain().focus().sinkListItem("listItem").run()}><span style={{ fontSize: 13 }}>⇥</span></ToolBtn>
        <ToolBtn tip="Outdent" onClick={() => editor.chain().focus().liftListItem("listItem").run()}><span style={{ fontSize: 13 }}>⇤</span></ToolBtn>
        <ToolBtn tip="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><span style={{ fontSize: 15, fontWeight: 700 }}>"</span></ToolBtn>
        <ToolBtn tip="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><span style={{ fontSize: 12, fontFamily: "monospace" }}>{`</>`}</span></ToolBtn>
        <ToolBtn tip="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><span style={{ fontSize: 13 }}>—</span></ToolBtn>
        <Sep />

        {/* Align */}
        <ToolBtn tip="Align left" icon={<AlignLeftOutlined />} active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
        <ToolBtn tip="Align center" icon={<AlignCenterOutlined />} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
        <ToolBtn tip="Align right" icon={<AlignRightOutlined />} active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
        <Sep />

        {/* Link */}
        <div style={{ position: "relative" }}>
          <ToolBtn tip="Insert link" icon={<LinkOutlined />} active={editor.isActive("link")} onClick={() => { setShowLinkInput(p => !p); setShowColorPicker(false); setShowHighlightPicker(false); }} />
          {showLinkInput && (
            <div style={{ position: "absolute", top: 34, left: 0, zIndex: 100, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", gap: 6, minWidth: 280 }}>
              <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && setLink()}
                placeholder="https://example.com"
                style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 10px", fontSize: 13, outline: "none" }} />
              <button onClick={setLink} style={{ border: "none", background: "#0ea5e9", color: "#fff", borderRadius: 6, padding: "0 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Set</button>
              <button onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }}
                style={{ border: "1px solid #e2e8f0", background: "#fff", borderRadius: 6, padding: "0 8px", cursor: "pointer", fontSize: 12, color: "#64748b" }}>Remove</button>
            </div>
          )}
        </div>

        {/* Table */}
        {TableExt && (
          <div style={{ position: "relative" }}>
            <ToolBtn tip="Table" icon={<TableOutlined />} active={editor.isActive("table")} onClick={() => { setShowTableMenu(p => !p); setShowColorPicker(false); setShowHighlightPicker(false); }} />
            {showTableMenu && (
              <div style={{ position: "absolute", top: 34, left: 0, zIndex: 100, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 200 }}>
                {[
                  { label: "Insert 3×3 table", action: insertTable },
                  { label: "Add column after", action: () => (editor as any).chain().focus().addColumnAfter().run() },
                  { label: "Add column before", action: () => (editor as any).chain().focus().addColumnBefore().run() },
                  { label: "Delete column", action: () => (editor as any).chain().focus().deleteColumn().run() },
                  { label: "Add row after", action: () => (editor as any).chain().focus().addRowAfter().run() },
                  { label: "Add row before", action: () => (editor as any).chain().focus().addRowBefore().run() },
                  { label: "Delete row", action: () => (editor as any).chain().focus().deleteRow().run() },
                  { label: "Delete table", action: () => (editor as any).chain().focus().deleteTable().run() },
                ].map(item => (
                  <button key={item.label} onClick={() => { item.action(); setShowTableMenu(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", border: "none", background: "transparent", padding: "6px 10px", cursor: "pointer", fontSize: 13, color: "#374151", borderRadius: 6 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>


        {/* Content Library insert */}
        <Sep />
        <div style={{ position: 'relative' }}>
          <ToolBtn tip="Insert from Content Library" icon={<BookOutlined />}
            onClick={() => { setShowLibrary(p => !p); loadLibrary(); setShowColorPicker(false); setShowHighlightPicker(false); setShowTableMenu(false); }} />
          {showLibrary && (
            <div style={{ position: 'absolute', top: 34, right: 0, zIndex: 100, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', width: 360, padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#0f172a' }}>📚 Content Library</div>
              <input placeholder="Search…" value={librarySearch} onChange={e => setLibrarySearch(e.target.value)}
                style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px', fontSize: 13, marginBottom: 10, outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {libraryItems.filter(i => !librarySearch || i.title.toLowerCase().includes(librarySearch.toLowerCase())).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: 13 }}>
                    No items. <a href="/content-library" target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9' }}>Add some →</a>
                  </div>
                ) : libraryItems.filter(i => !librarySearch || i.title.toLowerCase().includes(librarySearch.toLowerCase())).map(item => (
                  <div key={item.id} onClick={() => insertFromLibrary(item)}
                    style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.background = '#f0f9ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{item.category} {item.use_count > 0 ? `· Used ${item.use_count}×` : ''}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{item.content.replace(/<[^>]+>/g,' ').slice(0,80)}…</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      {/* ── Bubble menu (selection popup) ── */}
      {/* Bubble menu disabled - use toolbar instead */}

      {/* ── Editor canvas ── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#f1f5f9", padding: "32px 24px" }}
        onClick={() => { setShowColorPicker(false); setShowHighlightPicker(false); setShowTableMenu(false); }}>
        <div style={{
          maxWidth: 860, margin: "0 auto",
          background: "#fff", borderRadius: 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)",
          padding: "72px 88px", minHeight: 1050,
        }}>
          <style>{`
            .ProseMirror { outline: none; font-size: 14px; line-height: 1.85; color: #1a1a1a; font-family: 'Georgia', serif; }
            .ProseMirror h1 { font-size: 26px; font-weight: 900; margin: 24px 0 10px; color: #0f172a; }
            .ProseMirror h2 { font-size: 20px; font-weight: 800; margin: 20px 0 8px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
            .ProseMirror h3 { font-size: 16px; font-weight: 700; margin: 16px 0 6px; color: #1e293b; }
            .ProseMirror p { margin: 0 0 12px; }
            .ProseMirror ul, .ProseMirror ol { padding-left: 24px; margin: 8px 0 14px; }
            .ProseMirror li { margin-bottom: 5px; }
            .ProseMirror blockquote { border-left: 4px solid #0ea5e9; background: #f0f9ff; margin: 14px 0; padding: 12px 18px; border-radius: 0 8px 8px 0; color: #0369a1; font-style: italic; }
            .ProseMirror code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: monospace; }
            .ProseMirror pre { background: #1e293b; color: #e2e8f0; padding: 16px 20px; border-radius: 10px; overflow-x: auto; margin: 14px 0; font-family: monospace; font-size: 13px; }
            .ProseMirror hr { border: none; border-top: 2px solid #e2e8f0; margin: 20px 0; }
            .ProseMirror table { border-collapse: collapse; width: 100%; margin: 14px 0; }
            .ProseMirror td, .ProseMirror th { border: 1px solid #e2e8f0; padding: 9px 14px; vertical-align: top; font-size: 13.5px; }
            .ProseMirror th { background: #f8fafc; font-weight: 700; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
            .ProseMirror tr:nth-child(even) td { background: #f9fafb; }
            .ProseMirror .selectedCell { background: #dbeafe !important; }
            .ProseMirror a { color: #0ea5e9; text-decoration: underline; }
            .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #94a3b8; font-style: italic; pointer-events: none; float: left; height: 0; }
            @media print {
              .ProseMirror { font-size: 12pt; }
              .ProseMirror h1 { font-size: 18pt; }
              .ProseMirror h2 { font-size: 14pt; }
            }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{
        borderTop: "1px solid #e2e8f0", background: "#fafafa",
        padding: "5px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 16,
      }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>
          {wordCount.toLocaleString()} words · {editor.storage.characterCount?.characters?.() ?? 0} characters
          {documentId && ` · ID: ${String(documentId).slice(0, 8)}…`}
        </span>
        <span style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
          {documentType?.charAt(0).toUpperCase()}{documentType?.slice(1)} · Ctrl+S to save
        </span>
      </div>
    </div>
  );
}
