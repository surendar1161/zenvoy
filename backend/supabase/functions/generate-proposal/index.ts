/**
 * Edge Function: generate-proposal
 * Streams an AI-generated proposal.
 * Primary: OpenAI gpt-4o  →  3 retries  →  Fallback: Claude claude-opus-4-6
 */
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { extractJwt, userClient } from "../_shared/supabase.ts";

const OPENAI_API_KEY    = Deno.env.get("OPENAI_API_KEY")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const OPENAI_MODEL      = "gpt-4o";
const ANTHROPIC_MODEL   = "claude-opus-4-6";
const MAX_ATTEMPTS      = 3;

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

/** Try OpenAI streaming; returns Response or throws after MAX_ATTEMPTS. */
async function tryOpenAIStream(systemPrompt: string, userPrompt: string, maxTokens: number): Promise<Response> {
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
          stream:     true,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user",   content: userPrompt },
          ],
        }),
      });
      if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
      return res;
    } catch (err) {
      lastErr = err;
      console.warn(`[AI] OpenAI attempt ${i + 1}/${MAX_ATTEMPTS} failed:`, (err as Error).message);
      if (i < MAX_ATTEMPTS - 1) await sleep(200 * Math.pow(2, i));
    }
  }
  throw lastErr;
}

/** Transform OpenAI SSE stream into plain text chunks. */
function openAIStreamToText(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();

  (async () => {
    const reader = body.getReader();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          const text = parsed.choices?.[0]?.delta?.content;
          if (text) await writer.write(encoder.encode(text));
        } catch { /* ignore */ }
      }
    }
    await writer.close();
  })();

  return readable;
}

/** Anthropic streaming fallback — returns plain text ReadableStream. */
async function anthropicStream(systemPrompt: string, userPrompt: string, maxTokens: number): Promise<ReadableStream<Uint8Array>> {
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
      thinking:   { type: "adaptive" },
      stream:     true,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();

  (async () => {
    const reader = res.body!.getReader();
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
        } catch { /* ignore */ }
      }
    }
    await writer.close();
  })();

  return readable;
}

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

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

  let textStream: ReadableStream<Uint8Array>;

  try {
    const openAIRes = await tryOpenAIStream(systemPrompt, userPrompt, 4096);
    textStream = openAIStreamToText(openAIRes.body!);
  } catch (openaiErr) {
    console.warn("[AI] OpenAI failed 3 times — falling back to Claude:", (openaiErr as Error).message);
    try {
      textStream = await anthropicStream(systemPrompt, userPrompt, 4096);
    } catch (claudeErr) {
      return new Response(`AI generation failed: ${(claudeErr as Error).message}`, {
        status: 500, headers: corsHeaders,
      });
    }
  }

  return new Response(textStream, {
    headers: {
      ...corsHeaders,
      "Content-Type":     "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
});
