/**
 * Edge Function: parse-job-post
 * Uses Claude to extract structured fields from a pasted job post.
 */
import { corsHeaders, handleCors } from "../_shared/cors.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  const { jobPost } = await req.json();
  if (!jobPost?.trim()) {
    return new Response(JSON.stringify({ error: "No job post provided" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key":         ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type":      "application/json",
    },
    body: JSON.stringify({
      model:      "claude-opus-4-6",
      max_tokens: 1024,
      system:     "You are a proposal assistant. Extract structured info from a job post. Return ONLY valid JSON, no markdown.",
      messages: [{
        role: "user",
        content: `Extract proposal details from this job post. Return JSON:
{
  "projectType": "matching type from: Web Design & Development | Mobile App | Branding | SEO & Content | Social Media | Copywriting | Video Production | UI/UX Design | Consulting | Other",
  "clientCompany": "company name if mentioned else empty string",
  "projectDescription": "2-3 sentence summary mirroring client language",
  "deliverables": "bullet list starting with •",
  "timeline": "timeline if mentioned else estimate",
  "budget": number or 0,
  "painPoints": "comma-separated key client goals"
}

Job post:
${jobPost}`,
      }],
    }),
  });

  const data = await res.json();
  const text = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "{}";
  try {
    const parsed = JSON.parse(text);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    const result = match ? JSON.parse(match[0]) : {};
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
