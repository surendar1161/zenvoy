/**
 * Unified AI client — OpenAI primary (via raw fetch), Claude fallback.
 *
 * Strategy:
 *  1. Try OpenAI (gpt-4o) up to 3 times with exponential backoff.
 *  2. If all 3 attempts fail, fall back to Claude (claude-opus-4-6).
 *
 * No openai npm package needed — uses fetch directly against the REST API.
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic       = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const OPENAI_API_KEY  = process.env.OPENAI_API_KEY ?? "";
const OPENAI_BASE     = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL    = "gpt-4o";
const ANTHROPIC_MODEL = "claude-opus-4-6";
const MAX_ATTEMPTS    = 3;

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

// ── OpenAI helpers (raw fetch) ─────────────────────────────────────────────────

async function openAIRequest(
  messages: ChatMessage[],
  maxTokens: number,
  stream: true,
): Promise<Response>;
async function openAIRequest(
  messages: ChatMessage[],
  maxTokens: number,
  stream: false,
): Promise<string>;
async function openAIRequest(
  messages: ChatMessage[],
  maxTokens: number,
  stream: boolean,
): Promise<Response | string> {
  const res = await fetch(OPENAI_BASE, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({ model: OPENAI_MODEL, max_tokens: maxTokens, stream, messages }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI ${res.status}: ${errText}`);
  }

  if (stream) return res as Response;

  const data = await res.json();
  return (data.choices?.[0]?.message?.content ?? "") as string;
}

async function withOpenAIRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.warn(`[AI] ${label} attempt ${i + 1}/${MAX_ATTEMPTS} failed:`, (err as Error).message);
      if (i < MAX_ATTEMPTS - 1) await sleep(200 * Math.pow(2, i));
    }
  }
  throw lastErr;
}

/** Convert OpenAI SSE stream → plain-text ReadableStream<Uint8Array> */
function openAIStreamToText(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();

  (async () => {
    const reader = body.getReader();
    let buf = "";
    try {
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
          } catch { /* ignore parse errors */ }
        }
      }
    } finally {
      await writer.close();
    }
  })();

  return readable;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Stream text — OpenAI primary (3 retries), Claude fallback.
 * Returns a ReadableStream<Uint8Array> of raw text chunks.
 */
export async function streamWithFallback(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096,
): Promise<ReadableStream<Uint8Array>> {
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user",   content: userPrompt },
  ];

  // ── Try OpenAI ──────────────────────────────────────────────────────────────
  try {
    const res = await withOpenAIRetry(
      () => openAIRequest(messages, maxTokens, true),
      "OpenAI stream",
    );
    return openAIStreamToText(res.body!);

  } catch (openaiErr) {
    console.warn("[AI] OpenAI failed 3 times — falling back to Claude:", (openaiErr as Error).message);
  }

  // ── Claude fallback ─────────────────────────────────────────────────────────
  const encoder = new TextEncoder();
  const stream  = await anthropic.messages.stream({
    model:      ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    thinking:   { type: "adaptive" },
    system:     systemPrompt,
    messages:   [{ role: "user", content: userPrompt }],
  });

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}

/**
 * Non-streaming completion — OpenAI primary (3 retries), Claude fallback.
 * Returns the full response as a plain string.
 */
export async function completeWithFallback(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 2048,
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user",   content: userPrompt },
  ];

  // ── Try OpenAI ──────────────────────────────────────────────────────────────
  try {
    return await withOpenAIRetry(
      () => openAIRequest(messages, maxTokens, false),
      "OpenAI complete",
    );
  } catch (openaiErr) {
    console.warn("[AI] OpenAI failed 3 times — falling back to Claude:", (openaiErr as Error).message);
  }

  // ── Claude fallback ─────────────────────────────────────────────────────────
  const response = await anthropic.messages.create({
    model:      ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    thinking:   { type: "adaptive" },
    system:     systemPrompt,
    messages:   [{ role: "user", content: userPrompt }],
  });

  return response.content.find(b => b.type === "text")?.text ?? "";
}
