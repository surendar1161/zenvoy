import { requireAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getEmailFromAddress, isEmailDeliveryConfigured } from "@/lib/email";

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  const db = await createClient();
  const { data: prefs } = await db.from("notification_preferences")
    .select("email_enabled")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    configured: isEmailDeliveryConfigured(),
    fromEmail: getEmailFromAddress(),
    emailEnabled: prefs?.email_enabled !== false,
    userEmail: user.email ?? null,
  });
}
