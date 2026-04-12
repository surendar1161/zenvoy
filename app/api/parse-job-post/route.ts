import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { jobPost } = await req.json();
  if (!jobPost?.trim()) return NextResponse.json({ error: "No job post provided" }, { status: 400 });

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system: `You are a proposal assistant. Extract structured information from a freelance job post or client brief.
Return ONLY valid JSON — no markdown, no commentary.`,
    messages: [
      {
        role: "user",
        content: `Extract key proposal details from this job post. Return JSON with these fields:
{
  "projectType": "best matching type from: Web Design & Development | Mobile App Development | Branding & Identity | SEO & Content Marketing | Social Media Management | Copywriting | Video Production | UI/UX Design | Data Analysis | Consulting | Other",
  "clientCompany": "company name if mentioned, else empty string",
  "projectDescription": "2-3 sentence summary of what the client needs, written to be used in a proposal. Mirror the client's language and pain points.",
  "deliverables": "bullet list of deliverables you can infer from the brief. Start each line with •",
  "timeline": "timeline if mentioned, else reasonable estimate e.g. '4-6 weeks'",
  "budget": "number only if explicitly mentioned, else 0",
  "painPoints": "comma-separated list of the client's 3 most important pain points or goals, quoted from or closely paraphrasing their words"
}

Job post:
${jobPost}`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "{}";

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    // Try to extract JSON from the response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return NextResponse.json(JSON.parse(match[0]));
    return NextResponse.json({ error: "Failed to parse job post" }, { status: 500 });
  }
}
