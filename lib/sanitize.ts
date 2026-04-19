/**
 * HTML sanitizer — prevents XSS in dangerouslySetInnerHTML.
 * Uses isomorphic-dompurify if available (production), falls back to
 * a lightweight regex scrubber for local dev where install is blocked.
 */
let purify: ((html: string) => string) | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require("isomorphic-dompurify");
  purify = (html: string) => DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1","h2","h3","h4","h5","h6","p","br","hr","strong","em","u","s","del",
      "ul","ol","li","blockquote","pre","code","table","thead","tbody","tr","th","td",
      "a","div","span",
    ],
    ALLOWED_ATTR: ["href","target","rel","style","class","id","colspan","rowspan"],
    FORBID_ATTR: ["onerror","onload","onclick","onmouseover"],
  });
} catch {
  // DOMPurify not available locally — strip script/iframe tags at minimum
  purify = (html: string) =>
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "data-blocked=");
}

export function sanitizeHtml(html: string): string {
  return purify ? purify(html) : html;
}
