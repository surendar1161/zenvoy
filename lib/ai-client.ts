/**
 * Unified AI client — OpenAI primary (via raw fetch), Claude fallback.
 *
 * Strategy:
 *  1. If OPENAI_API_KEY is set, try OpenAI (gpt-4o) up to 2 times (8s timeout each).
 *  2. If OpenAI is not configured OR all attempts fail → fall back to Claude.
 *
 * No openai npm package needed — uses fetch directly against the REST API.
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic       = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const OPENAI_API_KEY  = process.env.OPENAI_API_KEY ?? "";
const OPENAI_BASE     = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL    = "gpt-4o";
const ANTHROPIC_MODEL = "claude-opus-4-6";
const MAX_ATTEMPTS    = 2;
const OPENAI_TIMEOUT  = 8000;

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

const hasOpenAI = () => OPENAI_API_KEY.length > 10;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

// ── OpenAI (raw fetch) ─────────────────────────────────────────────────────────

async function openAIFetch(
  messages: ChatMessage[],
  maxTokens: number,
  stream: boolean,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPENAI_TIMEOUT);
  try {
    const res = await fetch(OPENAI_BASE, {
      method:  "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body:    JSON.stringify({ model: OPENAI_MODEL, max_tokens: maxTokens, stream, messages }),
      signal:  controller.signal,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`OpenAI ${res.status}: ${errText}`);
    }
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function withOpenAIRetry(fn: () => Promise<Response>, label: string): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.warn(`[AI] ${label} attempt ${i + 1}/${MAX_ATTEMPTS} failed:`, (err as Error).message);
      if (i < MAX_ATTEMPTS - 1) await sleep(300);
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
          } catch { /* ignore SSE parse errors */ }
        }
      }
    } catch (err) {
      console.error("[AI] OpenAI stream read error:", (err as Error).message);
    } finally {
      await writer.close().catch(() => {});
    }
  })();

  return readable;
}

// ── Claude (Anthropic SDK) ─────────────────────────────────────────────────────

/**
 * Claude streaming — properly propagates errors so the client
 * sees a real error instead of a silent empty response.
 */
async function claudeStreamInternal(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  // Initiate the stream — this starts the HTTP connection to Anthropic.
  // If the API key is invalid or the API is down, this will throw here
  // (before we return), so the caller can catch it properly.
  const stream = anthropic.messages.stream({
    model:      ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    thinking:   { type: "adaptive" } as any,
    system:     systemPrompt,
    messages:   [{ role: "user", content: userPrompt }],
  });

  // Trigger the first event to validate the connection before returning.
  // This ensures auth errors surface immediately rather than silently inside
  // the ReadableStream where they'd be hard to catch.
  const firstEvent = await Promise.race([
    stream[Symbol.asyncIterator]().next(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Claude connection timeout")), 15000)
    ),
  ]);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Emit the first event we already fetched
        const chunk = firstEvent.value;
        if (chunk && chunk.type === "content_block_delta" && chunk.delta?.type === "text_delta") {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }

        // Continue with the rest
        for await (const next of stream) {
          if (next.type === "content_block_delta" && next.delta?.type === "text_delta") {
            controller.enqueue(encoder.encode(next.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("[AI] Claude stream error:", (err as Error).message);
        controller.error(err);
      }
    },
  });
}

async function claudeCompleteInternal(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
): Promise<string> {
  const response = await anthropic.messages.create({
    model:      ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    thinking:   { type: "adaptive" } as any,
    system:     systemPrompt,
    messages:   [{ role: "user", content: userPrompt }],
  });
  return response.content.find(b => b.type === "text")?.text ?? "";
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Stream text — OpenAI primary (if configured), Claude fallback.
 * Returns a ReadableStream<Uint8Array> of raw text chunks.
 * Throws if both providers fail.
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

  // ── Try OpenAI (only if key is configured) ──────────────────────────────────
  if (hasOpenAI()) {
    try {
      const res = await withOpenAIRetry(
        () => openAIFetch(messages, maxTokens, true),
        "OpenAI stream",
      );
      console.log("[AI] Streaming via OpenAI");
      return openAIStreamToText(res.body!);
    } catch (err) {
      console.warn("[AI] OpenAI failed — falling back to Claude:", (err as Error).message);
    }
  } else {
    console.log("[AI] OPENAI_API_KEY not configured — using Claude");
  }

  // ── Claude fallback ─────────────────────────────────────────────────────────
  console.log("[AI] Streaming via Claude");
  return claudeStreamInternal(systemPrompt, userPrompt, maxTokens);
}

/**
 * Non-streaming completion — OpenAI primary (if configured), Claude fallback.
 * Returns the full response as a plain string.
 * Throws if both providers fail.
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

  // ── Try OpenAI (only if key is configured) ──────────────────────────────────
  if (hasOpenAI()) {
    try {
      const res = await withOpenAIRetry(
        () => openAIFetch(messages, maxTokens, false),
        "OpenAI complete",
      );
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      console.log("[AI] Completion via OpenAI");
      return text;
    } catch (err) {
      console.warn("[AI] OpenAI failed — falling back to Claude:", (err as Error).message);
    }
  } else {
    console.log("[AI] OPENAI_API_KEY not configured — using Claude");
  }

  // ── Claude fallback ─────────────────────────────────────────────────────────
  console.log("[AI] Completion via Claude");
  return claudeCompleteInternal(systemPrompt, userPrompt, maxTokens);
}
