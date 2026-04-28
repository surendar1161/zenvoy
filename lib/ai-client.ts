/**
 * Unified AI client — OpenAI primary (via raw fetch), Claude fallback.
 *
 * Strategy:
 *  1. If OPENAI_API_KEY is set, try OpenAI (gpt-4o) up to 2 times (8s timeout each).
 *  2. If OpenAI is not configured OR fails → fall back to Claude (claude-opus-4-6).
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
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), OPENAI_TIMEOUT);
  try {
    const res = await fetch(OPENAI_BASE, {
      method:  "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body:    JSON.stringify({ model: OPENAI_MODEL, max_tokens: maxTokens, stream, messages }),
      signal:  ctrl.signal,
    });
    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new Error(`OpenAI ${res.status}: ${err}`);
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
 * Claude streaming with proper error propagation.
 * Uses a single iterator to avoid the double-consumption bug.
 * Pre-awaits the first event so auth/API errors throw before the Response
 * is sent (allowing the route try/catch to return a proper 500).
 */
async function claudeStreamInternal(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  const msgStream = anthropic.messages.stream({
    model:      ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    thinking:   { type: "adaptive" } as any,
    system:     systemPrompt,
    messages:   [{ role: "user", content: userPrompt }],
  });

  // Use ONE iterator throughout — critical to avoid double-consumption
  const iterator = msgStream[Symbol.asyncIterator]();

  // Await the first event BEFORE returning the ReadableStream.
  // If the API key is invalid or Anthropic is down, the error throws here
  // and is caught by the route's try/catch → proper 500 response.
  const first = await Promise.race<IteratorResult<Anthropic.MessageStreamEvent>>([
    iterator.next(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Claude connection timeout (20s)")), 20000)
    ),
  ]);

  // Connection confirmed — return the ReadableStream, continuing
  // from the SAME iterator so no events are lost or replayed.
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Process the first event we already fetched
        if (!first.done) {
          const c = first.value;
          if (c.type === "content_block_delta" && c.delta?.type === "text_delta") {
            controller.enqueue(encoder.encode(c.delta.text));
          }
        }

        // Continue with the same iterator
        while (true) {
          const { done, value } = await iterator.next();
          if (done) break;
          if (value.type === "content_block_delta" && value.delta?.type === "text_delta") {
            controller.enqueue(encoder.encode(value.delta.text));
          }
        }

        controller.close();
      } catch (err) {
        console.error("[AI] Claude stream error:", (err as Error).message);
        controller.error(err);
      }
    },
    cancel() {
      try { msgStream.abort(); } catch { /* ignore */ }
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

export async function streamWithFallback(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096,
): Promise<ReadableStream<Uint8Array>> {
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user",   content: userPrompt },
  ];

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
    console.log("[AI] OPENAI_API_KEY not set — using Claude");
  }

  console.log("[AI] Streaming via Claude");
  return claudeStreamInternal(systemPrompt, userPrompt, maxTokens);
}

export async function completeWithFallback(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 2048,
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user",   content: userPrompt },
  ];

  if (hasOpenAI()) {
    try {
      const res = await withOpenAIRetry(
        () => openAIFetch(messages, maxTokens, false),
        "OpenAI complete",
      );
      const data = await res.json();
      console.log("[AI] Completion via OpenAI");
      return data.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      console.warn("[AI] OpenAI failed — falling back to Claude:", (err as Error).message);
    }
  } else {
    console.log("[AI] OPENAI_API_KEY not set — using Claude");
  }

  console.log("[AI] Completion via Claude");
  return claudeCompleteInternal(systemPrompt, userPrompt, maxTokens);
}
