import { requireAuth } from "@/lib/api-auth";
import { completeWithFallback } from "@/lib/ai-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const { jobPost } = await req.json();
  if (!jobPost?.trim()) return NextResponse.json({ error: "No job post provided" }, { status: 400 });

  const systemPrompt = `You are a proposal assistant. Extract structured information from a freelance job post or client brief.
Return ONLY valid JSON — no markdown, no commentary.`;

  const userPrompt = `Extract key proposal details from this job post. Return JSON with these fields:
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
${jobPost}`;

  const text = await completeWithFallback(systemPrompt, userPrompt, 1024);

  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return NextResponse.json(JSON.parse(match[0]));
    return NextResponse.json({ error: "Failed to parse job post" }, { status: 500 });
  }
}
