/**
 * Edge Function: generate-proposal
 * Streams an AI-generated proposal using Claude Opus 4.6.
 * Called by the React frontend via /functions/v1/generate-proposal
 */
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { extractJwt, userClient } from "../_shared/supabase.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  // Auth check
  const jwt = extractJwt(req);
  if (!jwt) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const sb = userClient(jwt);
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const body = await req.json();
  const { freelancerName, freelancerTitle, freelancerEmail, clientName, clientCompany,
          projectType, projectDescription, deliverables, timeline, tone,
          currency, totalBudget, depositPercent, sections } = body;

  const includedSections = (sections ?? []).filter((s: { included: boolean }) => s.included);

  const toneGuide: Record<string, string> = {
    professional: "formal, polished, and business-like.",
    friendly:     "warm, approachable, and conversational.",
    bold:         "confident, direct, and results-focused.",
  };

  const systemPrompt = `You are an expert freelance proposal writer. Tone: ${toneGuide[tone] ?? toneGuide.professional}
Write compelling, specific, persuasive proposals. Use markdown formatting.
Always include a signature block at the end. Never use placeholder text.`;

  const userPrompt = `Write a complete freelance proposal:

FREELANCER: ${freelancerName} — ${freelancerTitle} — ${freelancerEmail}
CLIENT: ${clientName}${clientCompany ? ` at ${clientCompany}` : ""}
PROJECT: ${projectType}
DESCRIPTION: ${projectDescription}
DELIVERABLES: ${deliverables}
TIMELINE: ${timeline}
PRICING: ${currency} ${totalBudget?.toLocaleString()} total, ${depositPercent}% deposit

${includedSections.length ? `SECTIONS TO INCLUDE:\n${includedSections.map((s: { title: string }) => `## ${s.title}`).join("\n")}` : "Include: Executive Summary, Scope, Deliverables, Timeline, Investment, Why Me, Next Steps."}

Write the complete proposal with all sections in full detail.`;

  // Stream from Anthropic
  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key":         ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type":      "application/json",
    },
    body: JSON.stringify({
      model:      "claude-opus-4-6",
      max_tokens: 4096,
      thinking:   { type: "adaptive" },
      stream:     true,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(err, { status: 500, headers: corsHeaders });
  }

  // Transform the Anthropic SSE stream into plain text chunks
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    const reader = anthropicRes.body!.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            await writer.write(encoder.encode(parsed.delta.text));
          }
        } catch { /* ignore parse errors */ }
      }
    }
    await writer.close();
  })();

  return new Response(readable, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
});
