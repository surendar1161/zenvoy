/**
 * Minimal PDF 1.4 generator — zero dependencies.
 * Supports: text, headings, tables, page breaks, colors, lines.
 */

const PAGE_W = 595.28; // A4 points
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - 2 * MARGIN;

interface PDFFont { name: string; size: number; color: string; }

const FONTS = {
  heading1: { name: "Helvetica-Bold", size: 22, color: "0 0 0" } as PDFFont,
  heading2: { name: "Helvetica-Bold", size: 16, color: "0 0 0" } as PDFFont,
  heading3: { name: "Helvetica-Bold", size: 13, color: "0 0 0" } as PDFFont,
  body:     { name: "Helvetica", size: 10, color: "0 0 0" } as PDFFont,
  bold:     { name: "Helvetica-Bold", size: 10, color: "0 0 0" } as PDFFont,
  small:    { name: "Helvetica", size: 8, color: "0.4 0.4 0.4" } as PDFFont,
  label:    { name: "Helvetica-Bold", size: 9, color: "0.3 0.3 0.3" } as PDFFont,
};

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function escPdf(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function charWidth(font: PDFFont): number {
  const base = font.name.includes("Bold") ? 0.58 : 0.52;
  return font.size * base;
}

function wrapText(text: string, font: PDFFont, maxW: number): string[] {
  const cw = charWidth(font);
  const maxChars = Math.floor(maxW / cw);
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (test.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

export class PDFBuilder {
  private objects: string[] = [];
  private pages: number[] = [];
  private pageContents: string[][] = [];
  private currentPage: string[] = [];
  private cursorY = PAGE_H - MARGIN;
  private pageCount = 0;

  constructor() {
    this.objects.push(""); // 0-index placeholder
    this.newPage();
  }

  private newPage() {
    if (this.currentPage.length > 0) {
      this.pageContents.push(this.currentPage);
    }
    this.currentPage = [];
    this.cursorY = PAGE_H - MARGIN;
    this.pageCount++;
  }

  private ensureSpace(needed: number) {
    if (this.cursorY - needed < MARGIN) {
      this.newPage();
    }
  }

  addHeading(text: string, level: 1 | 2 | 3 = 1) {
    const font = level === 1 ? FONTS.heading1 : level === 2 ? FONTS.heading2 : FONTS.heading3;
    const spacing = level === 1 ? 28 : level === 2 ? 22 : 16;
    this.ensureSpace(spacing + font.size);
    this.cursorY -= spacing * 0.6;
    const lines = wrapText(text, font, CONTENT_W);
    for (const line of lines) {
      this.ensureSpace(font.size + 4);
      this.currentPage.push(
        `BT /${font.name} ${font.size} Tf ${font.color} rg ${MARGIN} ${this.cursorY.toFixed(2)} Td (${escPdf(line)}) Tj ET`
      );
      this.cursorY -= font.size + 4;
    }
    this.cursorY -= spacing * 0.4;
  }

  addText(text: string, opts?: { font?: PDFFont; indent?: number; maxWidth?: number }) {
    const font = opts?.font ?? FONTS.body;
    const indent = opts?.indent ?? 0;
    const maxW = opts?.maxWidth ?? CONTENT_W - indent;
    const lines = wrapText(text, font, maxW);
    for (const line of lines) {
      this.ensureSpace(font.size + 4);
      this.currentPage.push(
        `BT /${font.name} ${font.size} Tf ${font.color} rg ${(MARGIN + indent).toFixed(2)} ${this.cursorY.toFixed(2)} Td (${escPdf(line)}) Tj ET`
      );
      this.cursorY -= font.size + 4;
    }
  }

  addParagraph(text: string) {
    this.addText(text);
    this.cursorY -= 6;
  }

  addSpace(pts = 12) {
    this.cursorY -= pts;
  }

  addLine(color = "0.85 0.85 0.85", thickness = 0.5) {
    this.ensureSpace(8);
    this.currentPage.push(
      `${color} RG ${thickness} w ${MARGIN} ${this.cursorY.toFixed(2)} m ${(PAGE_W - MARGIN).toFixed(2)} ${this.cursorY.toFixed(2)} l S`
    );
    this.cursorY -= 8;
  }

  addColorBand(hex: string, height: number, textLines: { text: string; font: PDFFont; align?: "left" | "right" }[] = []) {
    this.ensureSpace(height);
    const rgb = hexToRgb(hex);
    const y = this.cursorY;
    this.currentPage.push(
      `${rgb} rg 0 ${(y - height).toFixed(2)} ${PAGE_W} ${height} re f`
    );
    let ty = y - 20;
    for (const tl of textLines) {
      const f = tl.font;
      let x = MARGIN;
      if (tl.align === "right") {
        x = PAGE_W - MARGIN - tl.text.length * charWidth(f);
      }
      this.currentPage.push(
        `BT /${f.name} ${f.size} Tf 1 1 1 rg ${x.toFixed(2)} ${ty.toFixed(2)} Td (${escPdf(tl.text)}) Tj ET`
      );
      ty -= f.size + 6;
    }
    this.cursorY -= height;
  }

  addTable(headers: string[], rows: string[][], colWidths?: number[]) {
    const font = FONTS.body;
    const headerFont = FONTS.bold;
    const cellPad = 6;
    const rowH = font.size + cellPad * 2;
    const cols = headers.length;
    const widths = colWidths ?? headers.map(() => CONTENT_W / cols);

    // Header
    this.ensureSpace(rowH * 2);
    let x = MARGIN;
    this.currentPage.push(
      `0.93 0.93 0.95 rg ${MARGIN} ${(this.cursorY - rowH).toFixed(2)} ${CONTENT_W} ${rowH} re f`
    );
    for (let i = 0; i < cols; i++) {
      const tx = x + cellPad;
      const ty = this.cursorY - cellPad - headerFont.size;
      const truncated = headers[i].substring(0, Math.floor(widths[i] / charWidth(headerFont)));
      this.currentPage.push(
        `BT /${headerFont.name} ${headerFont.size} Tf 0.2 0.2 0.2 rg ${tx.toFixed(2)} ${ty.toFixed(2)} Td (${escPdf(truncated)}) Tj ET`
      );
      x += widths[i];
    }
    this.cursorY -= rowH;

    // Rows
    for (let r = 0; r < rows.length; r++) {
      this.ensureSpace(rowH);
      x = MARGIN;
      if (r % 2 === 0) {
        this.currentPage.push(
          `0.98 0.98 0.99 rg ${MARGIN} ${(this.cursorY - rowH).toFixed(2)} ${CONTENT_W} ${rowH} re f`
        );
      }
      for (let i = 0; i < cols; i++) {
        const tx = x + cellPad;
        const ty = this.cursorY - cellPad - font.size;
        const val = (rows[r]?.[i] ?? "").substring(0, Math.floor(widths[i] / charWidth(font)));
        this.currentPage.push(
          `BT /${font.name} ${font.size} Tf 0 0 0 rg ${tx.toFixed(2)} ${ty.toFixed(2)} Td (${escPdf(val)}) Tj ET`
        );
        x += widths[i];
      }
      this.cursorY -= rowH;
    }
    this.cursorY -= 8;
  }

  addKeyValue(key: string, value: string, indent = 0) {
    this.ensureSpace(16);
    const x = MARGIN + indent;
    this.currentPage.push(
      `BT /${FONTS.label.name} ${FONTS.label.size} Tf ${FONTS.label.color} rg ${x.toFixed(2)} ${this.cursorY.toFixed(2)} Td (${escPdf(key)}) Tj ET`
    );
    const valX = x + key.length * charWidth(FONTS.label) + 8;
    this.currentPage.push(
      `BT /${FONTS.body.name} ${FONTS.body.size} Tf 0 0 0 rg ${valX.toFixed(2)} ${this.cursorY.toFixed(2)} Td (${escPdf(value)}) Tj ET`
    );
    this.cursorY -= 16;
  }

  addBullet(text: string, indent = 0) {
    this.addText(`•  ${text}`, { indent: indent + 8 });
  }

  addPageBreak() {
    this.newPage();
  }

  addMarkdown(md: string) {
    const lines = md.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { this.addSpace(4); continue; }
      if (trimmed.startsWith("### ")) { this.addHeading(trimmed.slice(4), 3); continue; }
      if (trimmed.startsWith("## ")) { this.addHeading(trimmed.slice(3), 2); continue; }
      if (trimmed.startsWith("# ")) { this.addHeading(trimmed.slice(2), 1); continue; }
      if (trimmed.startsWith("---")) { this.addLine(); continue; }
      if (/^[-*]\s/.test(trimmed)) { this.addBullet(trimmed.slice(2)); continue; }
      if (/^\d+\.\s/.test(trimmed)) { this.addBullet(trimmed.replace(/^\d+\.\s/, "")); continue; }
      // Bold text → use bold font
      const boldStripped = trimmed.replace(/\*\*(.+?)\*\*/g, "$1");
      const isBold = trimmed.startsWith("**") && trimmed.endsWith("**");
      this.addText(boldStripped, { font: isBold ? FONTS.bold : FONTS.body });
    }
  }

  build(): Buffer {
    // Finalize current page
    if (this.currentPage.length > 0) {
      this.pageContents.push(this.currentPage);
    }

    const totalPages = this.pageContents.length;
    const objs: { offset: number; content: string }[] = [];
    let objId = 1;

    // Obj 1: Catalog
    const catalogId = objId++;
    objs.push({ offset: 0, content: `${catalogId} 0 obj\n<< /Type /Catalog /Pages ${catalogId + 1} 0 R >>\nendobj\n` });

    // Obj 2: Pages
    const pagesId = objId++;
    const pageObjIds: number[] = [];
    for (let i = 0; i < totalPages; i++) {
      pageObjIds.push(pagesId + 1 + i * 2);
    }
    const kidsStr = pageObjIds.map(id => `${id} 0 R`).join(" ");
    objs.push({ offset: 0, content: `${pagesId} 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${totalPages} >>\nendobj\n` });

    // Page + Content stream pairs
    for (let i = 0; i < totalPages; i++) {
      const pageId = objId++;
      const contentId = objId++;
      const stream = this.pageContents[i].join("\n");
      const streamBytes = Buffer.from(stream, "latin1");

      objs.push({
        offset: 0,
        content: `${pageId} 0 obj\n<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentId} 0 R /Resources << /Font << /Helvetica ${objId} 0 R /Helvetica-Bold ${objId + 1} 0 R >> >> >>\nendobj\n`,
      });
      objs.push({
        offset: 0,
        content: `${contentId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream\nendobj\n`,
      });
    }

    // Font objects
    const fontHelv = objId++;
    objs.push({ offset: 0, content: `${fontHelv} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n` });
    const fontHelvBold = objId++;
    objs.push({ offset: 0, content: `${fontHelvBold} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n` });

    // Build final PDF
    let body = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    for (const obj of objs) {
      obj.offset = body.length;
      body += obj.content;
    }

    const xrefOffset = body.length;
    let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    for (const obj of objs) {
      xref += `${String(obj.offset).padStart(10, "0")} 00000 n \n`;
    }

    const trailer = `trailer\n<< /Size ${objs.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    return Buffer.from(body + xref + trailer, "latin1");
  }
}
