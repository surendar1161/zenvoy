import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { renderContractPdf } from "@/lib/pdf/render";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = await createClient();
  const { data: contract } = await db
    .from("contracts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buf = renderContractPdf(contract);
  const typeSlug = (contract.contract_type_name ?? "contract").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const filename = `${typeSlug}-${contract.id.slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buf.length),
    },
  });
}
