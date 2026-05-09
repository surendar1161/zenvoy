import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { renderInvoicePdf } from "@/lib/pdf/render";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = await createClient();
  const { data: inv } = await db
    .from("invoices")
    .select("*, clients(name,company,email,phone,address)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const meta = user.user_metadata ?? {};
  const freelancer = {
    full_name: (meta.full_name as string) ?? "",
    email: user.email ?? "",
    company: (meta.company as string) ?? "",
  };

  const buf = renderInvoicePdf(inv, freelancer);
  const filename = `invoice-${inv.invoice_number ?? inv.id}.pdf`;

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buf.length),
    },
  });
}
