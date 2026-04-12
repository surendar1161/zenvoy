import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getContractType } from "@/lib/contract-types";
import { createClient } from "@/lib/supabase/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { contractTypeId, state, partyA, partyB, fields } = await req.json();

  const contractType = getContractType(contractTypeId);
  if (!contractType) return new Response("Invalid contract type", { status: 400 });

  const fieldsSummary = Object.entries(fields as Record<string, string>)
    .filter(([, v]) => v && v !== "false")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const legalContext = contractType.legalNotes.join(" ");

  const systemPrompt = `You are an expert US contract attorney. Draft professional, legally sound ${contractType.name} documents.
Apply the correct legal framework for ${state}.
Auto-include required statutory provisions (DTSA notices, FLSA notes, UCC Article 2 where applicable).
Use clear, professional legal language appropriate for the document type.
Format with clear section headings and numbered clauses.
Include a signature block at the end.
IMPORTANT: Always add a note at the end: "This document is AI-generated for informational purposes. Have it reviewed by a licensed attorney before signing."`;

  const userPrompt = `Draft a complete ${contractType.name} with the following details:

STATE / GOVERNING LAW: ${state}

PARTY A (${partyA.role}): ${partyA.name}, ${partyA.address}
PARTY B (${partyB.role}): ${partyB.name}, ${partyB.address}

CONTRACT-SPECIFIC DETAILS:
${fieldsSummary}

LEGAL CONTEXT TO APPLY:
${legalContext}

CONTRACT FEATURES TO INCLUDE:
${contractType.features.join("\n")}

Draft the complete, full contract with all necessary clauses, definitions, and provisions.
Use proper legal numbering (1.0, 1.1, 2.0, 2.1, etc.).
Include: Recitals / Background, Definitions, main operative clauses, Representations & Warranties, Limitation of Liability, Governing Law, Dispute Resolution, Miscellaneous (integration, severability, waiver, notices), Signature Block.`;

  const stream = await client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
