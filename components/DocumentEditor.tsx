"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import { Button, Divider, Space, Tooltip, Typography as AntTypo, message, Tag } from "antd";
import {
  BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined,
  OrderedListOutlined, UnorderedListOutlined, AlignLeftOutlined,
  AlignCenterOutlined, AlignRightOutlined, UndoOutlined, RedoOutlined,
  HighlightOutlined, PrinterOutlined, CopyOutlined, DownloadOutlined,
  SaveOutlined, CheckCircleOutlined, LoadingOutlined,
  MinusOutlined, LineOutlined,
} from "@ant-design/icons";
import { markdownToHtml, htmlToPlainText } from "@/lib/markdown-to-html";

const { Text } = AntTypo;

interface Props {
  /** Initial content — can be raw markdown or HTML */
  content: string;
  /** Unique ID for saving (proposal or contract UUID) */
  documentId?: string | null;
  /** "proposal" | "contract" */
  documentType?: "proposal" | "contract";
  /** Called with updated HTML whenever auto-save fires */
  onSave?: (html: string) => Promise<void>;
  /** Title shown in top bar */
  title?: string;
  readOnly?: boolean;
}

type SaveState = "idle" | "saving" | "saved" | "error";

const TOOLBAR_GROUPS = [
  { name: "history" },
  { name: "format" },
  { name: "headings" },
  { name: "lists" },
  { name: "align" },
  { name: "misc" },
];

export default function DocumentEditor({
  content,
  documentId,
  documentType = "proposal",
  onSave,
  title,
  readOnly = false,
}: Props) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [wordCount, setWordCount] = useState(0);
  const [msgApi, ctx] = message.useMessage();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestHtml = useRef("");

  // Convert markdown to HTML on mount
  const initialHtml = content.trimStart().startsWith("<")
    ? content
    : markdownToHtml(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({ placeholder: "Start writing your document…" }),
      Typography,
      CharacterCount,
    ],
    content: initialHtml,
    editable: !readOnly,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      latestHtml.current = html;
      const plain = htmlToPlainText(html);
      setWordCount(plain.split(/\s+/).filter(Boolean).length);

      // Debounced auto-save (2s)
      if (onSave) {
        setSaveState("saving");
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          try {
            await onSave(html);
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 2500);
          } catch {
            setSaveState("error");
          }
        }, 2000);
      }
    },
  });

  // Update content if parent passes new content (e.g. streaming finishes)
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
    const plain = htmlToPlainText(editor?.getHTML() ?? "");
    navigator.clipboard.writeText(plain);
    msgApi.success("Copied to clipboard!");
  }

  function downloadTxt() {
    const plain = htmlToPlainText(editor?.getHTML() ?? "");
    const blob = new Blob([plain], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title ?? documentType).replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!editor) return null;

  const ToolBtn = ({
    onClick, active, disabled, icon, tip,
  }: { onClick: () => void; active?: boolean; disabled?: boolean; icon: React.ReactNode; tip: string }) => (
    <Tooltip title={tip} mouseEnterDelay={0.5}>
      <Button
        type={active ? "primary" : "text"}
        size="small"
        icon={icon}
        onClick={onClick}
        disabled={disabled}
        style={{
          borderRadius: 6,
          width: 32, height: 32,
          padding: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          ...(active ? {} : { color: "#374151" }),
        }}
      />
    </Tooltip>
  );

  const saveIcon = saveState === "saving"
    ? <LoadingOutlined spin style={{ fontSize: 12 }} />
    : saveState === "saved"
      ? <CheckCircleOutlined style={{ color: "#10b981", fontSize: 12 }} />
      : <SaveOutlined style={{ fontSize: 12 }} />;

  const saveLabel = saveState === "saving" ? "Saving…"
    : saveState === "saved" ? "Saved"
      : saveState === "error" ? "Save failed"
        : "Save";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {ctx}

      {/* ── Toolbar ───────────────────────────────────────────── */}
      <div
        className="doc-toolbar no-print"
        style={{
          position: "sticky", top: 0, zIndex: 20,
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "6px 16px",
          display: "flex", alignItems: "center",
          flexWrap: "wrap", gap: 2,
        }}
      >
        {/* History */}
        <ToolBtn tip="Undo (⌘Z)" icon={<UndoOutlined />} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
        <ToolBtn tip="Redo (⌘⇧Z)" icon={<RedoOutlined />} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />

        <Divider type="vertical" style={{ height: 20, margin: "0 4px" }} />

        {/* Text format */}
        <ToolBtn tip="Bold (⌘B)"      icon={<BoldOutlined />}          active={editor.isActive("bold")}      onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolBtn tip="Italic (⌘I)"    icon={<ItalicOutlined />}        active={editor.isActive("italic")}    onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolBtn tip="Underline (⌘U)" icon={<UnderlineOutlined />}     active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <ToolBtn tip="Strikethrough"  icon={<StrikethroughOutlined />} active={editor.isActive("strike")}    onClick={() => editor.chain().focus().toggleStrike().run()} />
        <ToolBtn tip="Highlight"      icon={<HighlightOutlined />}     active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} />

        <Divider type="vertical" style={{ height: 20, margin: "0 4px" }} />

        {/* Headings */}
        {([1, 2, 3] as const).map(level => (
          <ToolBtn
            key={level}
            tip={`Heading ${level}`}
            active={editor.isActive("heading", { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            icon={<span style={{ fontSize: 11, fontWeight: 700 }}>H{level}</span>}
          />
        ))}
        <ToolBtn tip="Paragraph" icon={<span style={{ fontSize: 11 }}>¶</span>} active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} />

        <Divider type="vertical" style={{ height: 20, margin: "0 4px" }} />

        {/* Lists */}
        <ToolBtn tip="Bullet list"   icon={<UnorderedListOutlined />} active={editor.isActive("bulletList")}  onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolBtn tip="Numbered list" icon={<OrderedListOutlined />}  active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolBtn tip="Blockquote" icon={<span style={{ fontSize: 13 }}>"</span>} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolBtn tip="Horizontal rule" icon={<MinusOutlined />} onClick={() => editor.chain().focus().setHorizontalRule().run()} />

        <Divider type="vertical" style={{ height: 20, margin: "0 4px" }} />

        {/* Align */}
        <ToolBtn tip="Align left"   icon={<AlignLeftOutlined />}   active={editor.isActive({ textAlign: "left" })}   onClick={() => editor.chain().focus().setTextAlign("left").run()} />
        <ToolBtn tip="Align center" icon={<AlignCenterOutlined />} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
        <ToolBtn tip="Align right"  icon={<AlignRightOutlined />}  active={editor.isActive({ textAlign: "right" })}  onClick={() => editor.chain().focus().setTextAlign("right").run()} />

        <div style={{ flex: 1 }} />

        {/* Actions */}
        <Space size={4}>
          <Tooltip title="Copy as plain text"><Button size="small" icon={<CopyOutlined />} onClick={copyText} style={{ borderRadius: 6 }}>Copy</Button></Tooltip>
          <Tooltip title="Download as .txt"><Button size="small" icon={<DownloadOutlined />} onClick={downloadTxt} style={{ borderRadius: 6 }}>Download</Button></Tooltip>
          <Tooltip title="Print / Save as PDF"><Button size="small" icon={<PrinterOutlined />} onClick={() => window.print()} style={{ borderRadius: 6 }}>Print</Button></Tooltip>
          {onSave && (
            <Button
              size="small"
              type={saveState === "saved" ? "default" : "primary"}
              icon={saveIcon}
              onClick={manualSave}
              loading={saveState === "saving"}
              style={{ borderRadius: 6, fontWeight: 600 }}
            >
              {saveLabel}
            </Button>
          )}
        </Space>
      </div>

      {/* Bubble menu removed — quick formatting available in top toolbar */}

      {/* ── Document page ─────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#f1f5f9",
          padding: "32px 24px",
        }}
      >
        <div
          className="document-page"
          style={{
            maxWidth: 860,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 4,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)",
            padding: "60px 72px",
            minHeight: 900,
          }}
        >
          <div className="document-editor">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* ── Status bar ────────────────────────────────────────── */}
      <div
        className="doc-status-bar no-print"
        style={{
          borderTop: "1px solid #e2e8f0",
          background: "#fff",
          padding: "5px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Space size={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {wordCount.toLocaleString()} words · {editor.storage.characterCount?.characters?.() ?? 0} characters
          </Text>
          {documentType && <Tag style={{ borderRadius: 20, fontSize: 11 }}>{documentType}</Tag>}
          {documentId && <Text type="secondary" style={{ fontSize: 11 }}>ID: {String(documentId).slice(0, 8)}…</Text>}
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {saveState === "saving" && "⏳ Saving…"}
          {saveState === "saved" && "✅ All changes saved"}
          {saveState === "error" && "❌ Save failed — retry"}
          {saveState === "idle" && !readOnly && "✏️ Click to edit"}
        </Text>
      </div>
    </div>
  );
}
