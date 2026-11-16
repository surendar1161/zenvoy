/**
 * Splits proposal markdown into titled sections for the client view.
 *
 * Why this exists: the AI does not always use the same heading level. The
 * original parser only recognised `#` and `##`, so a proposal written with
 * `###` headings produced zero sections and the client saw a blank page.
 *
 * Rules:
 *  1. If the text has any `#` or `##` heading, split on those (the old behaviour;
 *     `###` and deeper stay inside their section as sub-headings).
 *  2. Otherwise split on `###` and `####` headings.
 *  3. If there are no headings at all, return the whole text as one untitled
 *     section so the client still sees the content.
 * Text before the first heading is dropped, as before. A trailing horizontal
 * rule (`---`) at the end of a section is removed.
 */
export interface ProposalSection {
  title: string;
  heading: string;
  content: string;
}

const TOP_HEADING = /^#{1,2}\s+(.+)$/;
const DEEP_HEADING = /^#{3,4}\s+(.+)$/;

function cleanContent(raw: string): string {
  return raw.trim().replace(/(?:\n\s*)?-{3,}\s*$/, "").trim();
}

export function parseSections(text: string): ProposalSection[] {
  const lines = (text ?? "").split("\n");
  const hasTop = lines.some(l => TOP_HEADING.test(l));
  const pattern = hasTop ? TOP_HEADING : DEEP_HEADING;

  const sections: ProposalSection[] = [];
  let current: ProposalSection | null = null;

  for (const line of lines) {
    const m = line.match(pattern);
    if (m) {
      if (current) sections.push({ ...current, content: cleanContent(current.content) });
      current = { title: m[1].trim(), heading: line, content: "" };
    } else if (current) {
      current.content += line + "\n";
    }
  }
  if (current) sections.push({ ...current, content: cleanContent(current.content) });

  if (sections.length === 0 && (text ?? "").trim()) {
    return [{ title: "", heading: "", content: cleanContent(text) }];
  }
  return sections;
}
