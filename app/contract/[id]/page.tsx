"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Result, Spin } from "antd";
import { PrinterOutlined, DownloadOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

interface Contract {
  id: string;
  contract_type_name: string;
  governing_law: string;
  party_a_name: string; party_a_role: string | null; party_a_address: string | null;
  party_b_name: string; party_b_role: string | null; party_b_address: string | null;
  contract_text: string;
  status: string;
  signed_at: string | null; signer_name: string | null;
  created_at: string;
}

// ── Markdown → styled HTML ────────────────────────────────────
function renderContractMd(text: string): string {
  const blocks = text.split(/\n\n+/);
  return blocks.map(block => {
    const t = block.trim();
    if (!t) return "";

    // Headings
    if (/^### /.test(t)) return `<h3 class="cv-h3">${t.replace(/^### /, "")}</h3>`;
    if (/^## /.test(t))  return `<h2 class="cv-h2">${t.replace(/^## /, "")}</h2>`;
    if (/^# /.test(t))   return `<h1 class="cv-h1">${t.replace(/^# /, "")}</h1>`;

    // Horizontal rule
    if (/^---+$/.test(t)) return `<hr class="cv-hr">`;

    // Table
    if (t.includes("|") && t.split("\n").length >= 3) {
      const lines = t.split("\n").filter(l => l.trim());
      if (lines[1] && /^[\|\-:\s]+$/.test(lines[1])) {
        const headers = lines[0].split("|").map(h => h.trim()).filter(Boolean);
        const rows = lines.slice(2);
        const th = headers.map(h => `<th class="cv-th">${inlineMd(h)}</th>`).join("");
        const tbody = rows.map((row, ri) => {
          const cells = row.split("|").map(c => c.trim()).filter(Boolean);
          const tds = cells.map((c, ci) => `<td class="cv-td${ci === 0 ? " cv-td-first" : ""}">${inlineMd(c)}</td>`).join("");
          return `<tr class="${ri % 2 === 0 ? "cv-tr-even" : "cv-tr-odd"}">${tds}</tr>`;
        }).join("");
        return `<div class="cv-table-wrap"><table class="cv-table"><thead><tr>${th}</tr></thead><tbody>${tbody}</tbody></table></div>`;
      }
    }

    // Blockquote
    if (t.startsWith("> ")) {
      return `<blockquote class="cv-bq">${inlineMd(t.replace(/^> /gm, ""))}</blockquote>`;
    }

    // Bullet list
    if (/^[-•*]\s/.test(t)) {
      const lis = t.split("\n").filter(l => /^[-•*]\s/.test(l.trim()))
        .map(l => `<li class="cv-li">${inlineMd(l.replace(/^[-•*]\s+/, ""))}</li>`).join("");
      return `<ul class="cv-ul">${lis}</ul>`;
    }

    // Numbered list
    if (/^\d+\.\s/.test(t)) {
      const lis = t.split("\n").filter(l => /^\d+\.\s/.test(l.trim()))
        .map(l => `<li class="cv-li">${inlineMd(l.replace(/^\d+\.\s+/, ""))}</li>`).join("");
      return `<ol class="cv-ol">${lis}</ol>`;
    }

    // Paragraph
    return `<p class="cv-p">${inlineMd(t.replace(/\n/g, "<br>"))}</p>`;
  }).join("\n");
}

function inlineMd(t: string): string {
  return t
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='cv-code'>$1</code>");
}

// ── Component ─────────────────────────────────────────────────
export default function ContractViewPage() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();
      if (!data) { setNotFound(true); setLoading(false); return; }
      setContract(data as Contract);
      setLoading(false);
    }
    load();
  }, [id]);

  function handlePrint() { window.print(); }

  function handleDownload() {
    if (!contract) return;
    const blob = new Blob([contract.contract_text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contract.contract_type_name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin size="large" />
    </div>
  );

  if (notFound || !contract) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Result status="404" title="Contract not found"
        subTitle="This contract may have been deleted or the link is invalid."
        extra={<Button href="/">Go to Zenvoy</Button>} />
    </div>
  );

  const rendered = renderContractMd(contract.contract_text);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Styles */}
      <style>{`
        /* Contract view styles */
        .cv-h1 { font-size: 28px; font-weight: 900; color: #0f172a; margin: 28px 0 10px; letter-spacing: -0.5px; border-bottom: 3px solid #0ea5e9; padding-bottom: 8px; }
        .cv-h2 { font-size: 18px; font-weight: 800; color: #0f172a; margin: 28px 0 8px; text-transform: uppercase; letter-spacing: 0.04em; }
        .cv-h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 20px 0 6px; }
        .cv-hr  { border: none; border-top: 1.5px solid #e2e8f0; margin: 20px 0; }
        .cv-p   { margin: 0 0 14px; line-height: 1.85; color: #334155; font-size: 14.5px; }
        .cv-ul, .cv-ol { margin: 8px 0 14px 22px; }
        .cv-li  { margin-bottom: 6px; line-height: 1.75; color: #334155; font-size: 14.5px; }
        .cv-bq  { border-left: 4px solid #0ea5e9; background: #f0f9ff; margin: 14px 0; padding: 12px 18px; border-radius: 0 8px 8px 0; color: #0369a1; font-style: italic; font-size: 14px; }
        .cv-code { background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
        .cv-table-wrap { overflow-x: auto; margin: 16px 0; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .cv-table { width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; }
        .cv-th { padding: 10px 16px; background: #f8fafc; font-size: 12px; font-weight: 700; color: #64748b; border-bottom: 2px solid #e2e8f0; text-align: left; white-space: nowrap; letter-spacing: 0.04em; text-transform: uppercase; }
        .cv-td { padding: 10px 16px; font-size: 13.5px; color: #374151; border-bottom: 1px solid #f1f5f9; vertical-align: top; line-height: 1.6; }
        .cv-td-first { font-weight: 600; color: #0f172a; }
        .cv-tr-even { background: #fff; }
        .cv-tr-odd  { background: #f9fafb; }
        @media print {
          .cv-no-print { display: none !important; }
          body { background: white !important; }
          .cv-page { box-shadow: none !important; border: none !important; border-radius: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="cv-no-print" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0", padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 16 }}>📄</span>
          </div>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{contract.contract_type_name}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#94a3b8" }}>{contract.governing_law}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {contract.status === "signed" && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "4px 14px", fontSize: 13, color: "#16a34a", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
              ✅ Signed{contract.signer_name ? ` by ${contract.signer_name}` : ""}
            </div>
          )}
          <Button icon={<DownloadOutlined />} onClick={handleDownload} style={{ fontFamily: "Inter, sans-serif" }}>Download</Button>
          <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}
            style={{ background: "#0ea5e9", borderColor: "#0ea5e9", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Contract document */}
      <div style={{ maxWidth: 860, margin: "40px auto", padding: "0 24px 60px" }}>
        <div className="cv-page" style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}>
          {/* Document header band */}
          <div style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0ea5e9 100%)", padding: "36px 48px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  Legal Document
                </div>
                <div style={{ color: "#fff", fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px", fontFamily: "Inter, sans-serif", lineHeight: 1.2 }}>
                  {contract.contract_type_name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "Inter, sans-serif", marginTop: 6 }}>
                  Governing Law: {contract.governing_law}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "14px 20px", minWidth: 180 }}>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Parties</div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "Inter, sans-serif" }}>{contract.party_a_role ?? "Party A"}</div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{contract.party_a_name}</div>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 8 }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "Inter, sans-serif" }}>{contract.party_b_role ?? "Party B"}</div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{contract.party_b_name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contract body */}
          <div style={{ padding: "40px 48px" }}
            dangerouslySetInnerHTML={{ __html: rendered }}
          />

          {/* Signed badge */}
          {contract.status === "signed" && contract.signer_name && (
            <div style={{ margin: "0 48px 40px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#16a34a", fontSize: 14, marginBottom: 4 }}>
                ✅ This contract was signed
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", color: "#374151", fontSize: 13 }}>
                Signed by <strong>{contract.signer_name}</strong>
                {contract.signed_at && ` on ${new Date(contract.signed_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}`}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 48px", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#94a3b8" }}>
              Generated by Zenvoy · {new Date(contract.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#cbd5e1" }}>
              ⚠️ AI-generated — have this reviewed by a licensed attorney before signing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
