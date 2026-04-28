import { requireAuth } from "@/lib/api-auth";
import { completeWithFallback } from "@/lib/ai-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const { sectionTitle, currentContent, fullProposal, tone, freelancerName, clientName } =
    await req.json();

  const toneGuide = {
    professional: "formal, polished, and business-like",
    friendly:     "warm, approachable, and conversational",
    bold:         "confident, direct, and results-focused with bold statements",
  }[tone as string] ?? "professional";

  const systemPrompt = `You are an expert freelance proposal writer. Tone: ${toneGuide}.
Generate 3 distinct alternatives for a specific section of a proposal.
Return ONLY valid JSON — no markdown fences, no commentary outside the JSON.`;

  const userPrompt = `Generate 3 distinct, high-quality alternatives for the "${sectionTitle}" section of this proposal.

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

Each alternative must be meaningfully different in approach, not just word choice. Keep the same section heading.`;

  const text = await completeWithFallback(systemPrompt, userPrompt, 2048);

  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return NextResponse.json(JSON.parse(match[0]));
    return NextResponse.json({ error: "Failed to generate alternatives" }, { status: 500 });
  }
}
