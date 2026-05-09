import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { renderProposalPdf } from "@/lib/pdf/render";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = await createClient();
  const { data: proposal } = await db
    .from("proposals")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buf = renderProposalPdf(proposal);
  const clientSlug = (proposal.client_name ?? "proposal").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const filename = `proposal-${clientSlug}-${proposal.id.slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buf.length),
    },
  });
}
