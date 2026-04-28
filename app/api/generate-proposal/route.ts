import { requireAuth } from "@/lib/api-auth";
import { streamWithFallback } from "@/lib/ai-client";
import { NextRequest } from "next/server";
import type { ProposalFormData } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const data: ProposalFormData = await req.json();

  const depositAmount    = Math.round((data.totalBudget * data.depositPercent) / 100);
  const remainingAmount  = data.totalBudget - depositAmount;

  const toneGuide = {
    professional: "formal, polished, and business-like. Use clear corporate language.",
    friendly:     "warm, approachable, and conversational while remaining credible.",
    bold:         "confident, direct, and results-focused. Make bold statements about value delivered.",
  }[data.tone];

  const systemPrompt = `You are an expert freelance proposal writer. Your proposals consistently win clients.
Write compelling, specific, and persuasive proposals.
Tone: ${toneGuide}
Always structure with clear sections using markdown formatting.
Make the proposal feel personalised to this specific client and project — never generic.`;

  const userPrompt = `Write a complete freelance project proposal with these details:

FREELANCER:
- Name: ${data.freelancerName}
- Title: ${data.freelancerTitle}
- Email: ${data.freelancerEmail}

CLIENT:
- Name: ${data.clientName}
- Company: ${data.clientCompany}

PROJECT:
- Type: ${data.projectType}
- Description: ${data.projectDescription}
- Deliverables: ${data.deliverables}
- Timeline: ${data.timeline}

PRICING:
- Total: ${data.currency} ${data.totalBudget.toLocaleString()}
- Deposit: ${data.currency} ${depositAmount.toLocaleString()} (${data.depositPercent}% upfront)
- Remaining: ${data.currency} ${remainingAmount.toLocaleString()} on completion

Structure the proposal with these sections:
1. **Executive Summary** — hook the client immediately, reference their specific need
2. **Understanding Your Project** — show you truly understand their challenge
3. **Proposed Solution & Approach** — your methodology and why it works for them
4. **Deliverables** — clear bullet list of what they receive
5. **Timeline** — project phases with milestones
6. **Investment** — pricing breakdown, deposit, payment terms
7. **Why Work With Me** — 2-3 specific reasons, no fluff
8. **Next Steps** — clear CTA to pay the deposit and get started

End with a warm but action-oriented closing that creates urgency without being pushy.`;

  const stream = await streamWithFallback(systemPrompt, userPrompt, 4096);

  return new Response(stream, {
    headers: {
      "Content-Type":     "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
