import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { sendTestNotificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  if (!user.email) {
    return NextResponse.json({ ok: false, error: "No email address on your account." }, { status: 400 });
  }

  const result = await sendTestNotificationEmail(user.id, user.email);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
