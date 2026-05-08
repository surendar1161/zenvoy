import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@supabase/supabase-js";
import { renderInvoicePdf } from "@/lib/pdf/render";
import { NextRequest, NextResponse } from "next/server";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = getAdmin();
  const { data: inv } = await db
    .from("invoices")
    .select("*, clients(name,company,email,phone,address)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: userData } = await db.auth.admin.getUserById(user.id);
  const meta = userData?.user?.user_metadata ?? {};
  const freelancer = {
    full_name: (meta.full_name as string) ?? "",
    email: userData?.user?.email ?? "",
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
