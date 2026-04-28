/**
 * Edge Function: parse-job-post
 * Extracts structured fields from a pasted job post.
 * Primary: OpenAI gpt-4o  →  3 retries  →  Fallback: Claude claude-opus-4-6
 */
import { corsHeaders, handleCors } from "../_shared/cors.ts";

const OPENAI_API_KEY    = Deno.env.get("OPENAI_API_KEY")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const OPENAI_MODEL      = "gpt-4o";
const ANTHROPIC_MODEL   = "claude-opus-4-6";
const MAX_ATTEMPTS      = 3;

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function completeOpenAI(system: string, user: string, maxTokens: number): Promise<string> {
  let lastErr: unknown;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          model:      OPENAI_MODEL,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: system },
            { role: "user",   content: user },
          ],
        }),
      });
      if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      lastErr = err;
      console.warn(`[AI] OpenAI attempt ${i + 1}/${MAX_ATTEMPTS}:`, (err as Error).message);
      if (i < MAX_ATTEMPTS - 1) await sleep(200 * Math.pow(2, i));
    }
  }
  throw lastErr;
}

async function completeAnthropic(system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key":         ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type":      "application/json",
    },
    body: JSON.stringify({
      model:      ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
}

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  const { jobPost } = await req.json();
  if (!jobPost?.trim()) {
    return new Response(JSON.stringify({ error: "No job post provided" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const system = "You are a proposal assistant. Extract structured info from a job post. Return ONLY valid JSON, no markdown.";
  const user   = `Extract proposal details from this job post. Return JSON:
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
${jobPost}`;

  let text: string;
  try {
    text = await completeOpenAI(system, user, 1024);
  } catch (openaiErr) {
    console.warn("[AI] OpenAI failed 3 times — falling back to Claude:", (openaiErr as Error).message);
    try {
      text = await completeAnthropic(system, user, 1024);
    } catch (claudeErr) {
      return new Response(JSON.stringify({ error: `AI failed: ${(claudeErr as Error).message}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

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
