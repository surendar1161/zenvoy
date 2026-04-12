/**
 * Convert AI-generated markdown text to clean HTML for TipTap.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Horizontal rule
    .replace(/^---+$/gm, "<hr>")
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Numbered lists — group consecutive items
    .replace(/^\d+\.\s+(.+)$/gm, "<li-ordered>$1</li-ordered>")
    // Bullet lists
    .replace(/^[-•*]\s+(.+)$/gm, "<li-bullet>$1</li-bullet>");

  // Wrap ordered list items
  html = html.replace(
    /(<li-ordered>.+<\/li-ordered>\n?)+/g,
    (match) => "<ol>" + match.replace(/<li-ordered>/g, "<li>").replace(/<\/li-ordered>/g, "</li>") + "</ol>"
  );
  // Wrap bullet list items
  html = html.replace(
    /(<li-bullet>.+<\/li-bullet>\n?)+/g,
    (match) => "<ul>" + match.replace(/<li-bullet>/g, "<li>").replace(/<\/li-bullet>/g, "</li>") + "</ul>"
  );

  // Paragraphs — blank-line separated blocks that aren't already block elements
  const blockElements = ["<h1","<h2","<h3","<ul","<ol","<hr","<blockquote"];
  html = html
    .split(/\n\n+/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      const isBlock = blockElements.some(tag => trimmed.startsWith(tag));
      return isBlock ? trimmed : `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return html;
}

/** Get plain text from HTML (for word count etc.) */
export function htmlToPlainText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
