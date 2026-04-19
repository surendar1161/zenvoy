import { requireAuth } from "@/lib/api-auth";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const { sectionTitle, currentContent, fullProposal, tone, freelancerName, clientName } =
    await req.json();

  const toneGuide = {
    professional: "formal, polished, and business-like",
    friendly: "warm, approachable, and conversational",
    bold: "confident, direct, and results-focused with bold statements",
  }[tone as string] ?? "professional";

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    system: `You are an expert freelance proposal writer. Tone: ${toneGuide}.
Generate 3 distinct alternatives for a specific section of a proposal.
Return ONLY valid JSON — no markdown fences, no commentary outside the JSON.`,
    messages: [
      {
        role: "user",
        content: `Generate 3 distinct, high-quality alternatives for the "${sectionTitle}" section of this proposal.

Freelancer: ${freelancerName}
Client: ${clientName}
Tone: ${toneGuide}

Current section content:
${currentContent}

Full proposal context (for coherence):
${fullProposal.slice(0, 2000)}...

Return this exact JSON structure:
{
  "alternatives": [
    { "label": "Alternative 1 — [brief descriptor e.g. 'Results-focused']", "content": "full section text here" },
    { "label": "Alternative 2 — [brief descriptor e.g. 'Story-led']", "content": "full section text here" },
    { "label": "Alternative 3 — [brief descriptor e.g. 'Data-driven']", "content": "full section text here" }
  ]
}

Each alternative must be meaningfully different in approach, not just word choice. Keep the same section heading.`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "{}";

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return NextResponse.json(JSON.parse(match[0]));
    return NextResponse.json({ error: "Failed to generate alternatives" }, { status: 500 });
  }
}
