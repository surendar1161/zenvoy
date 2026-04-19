import { requireAuth } from "@/lib/api-auth";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Section-specific prompts
const SECTION_PROMPTS: Record<string, string> = {
  "executive-summary": "Write a compelling 2-3 paragraph Executive Summary that immediately hooks the client, shows you understand their specific challenge, and teases the solution. Reference their project explicitly.",
  "about-me": "Write a confident 'About Me' section (2-3 paragraphs) that establishes credibility, mentions 2-3 relevant wins or experience highlights, and feels human — not a LinkedIn bio.",
  "understanding": "Write an 'Understanding Your Project' section that shows deep comprehension of the client's problem, goals, and context. Mirror their language. Show, don't tell.",
  "scope-of-work": "Write a clear, professional Scope of Work that defines exactly what is — and isn't — included. Bullet points for clarity. Prevents scope creep.",
  "deliverables": "Write the Deliverables section as a clear bullet list of every tangible item the client receives, with enough detail to be unambiguous.",
  "timeline": "Write a Timeline section with 3-5 project phases, each with a name, what happens, and a timeframe. Use a table or structured list.",
  "pricing": "Write an Investment section that frames the price as an investment, breaks down the value, and reminds them of the payment terms (deposit + balance).",
  "why-me": "Write a 'Why Work With Me' section with 3 specific, concrete reasons — not generic claims. Reference relevant experience, a specific result, or a unique differentiator.",
  "terms": "Write professional Terms & Conditions covering: payment schedule, revision policy, ownership of deliverables, cancellation policy. Keep it clear and firm but not aggressive.",
  "next-steps": "Write a punchy Next Steps section with a clear CTA: pay the deposit → schedule kick-off call → start. Create urgency without pressure.",
};

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const { sectionId, sectionTitle, formData, tone } = await req.json();

  const toneGuide = {
    professional: "formal, polished, and business-like",
    friendly: "warm, approachable, and conversational",
    bold: "confident, direct, and results-focused",
  }[tone as string] ?? "professional";

  const sectionPrompt = SECTION_PROMPTS[sectionId] ?? `Write the "${sectionTitle}" section professionally.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1000,
    system: `You are an expert freelance proposal writer. Tone: ${toneGuide}.
Write ONLY the section content — no heading, no preamble. Use markdown formatting (bold, bullets) where appropriate.`,
    messages: [
      {
        role: "user",
        content: `Context:
Freelancer: ${formData.freelancerName} — ${formData.freelancerTitle}
Client: ${formData.clientName} (${formData.clientCompany || "no company"})
Project: ${formData.projectType}
Description: ${formData.projectDescription}
Deliverables: ${formData.deliverables}
Timeline: ${formData.timeline}
Budget: ${formData.currency} ${formData.totalBudget}
Deposit: ${formData.depositPercent}%

Task: ${sectionPrompt}`,
      },
    ],
  });

  const content = message.content.find((b) => b.type === "text")?.text ?? "";
  return NextResponse.json({ content });
}
