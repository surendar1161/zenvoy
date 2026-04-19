import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Freelancer-only routes (clients get redirected away)
const FREELANCER_ONLY = [
  "/dashboard", "/generate", "/proposals", "/clients", "/projects",
  "/contracts", "/templates", "/analytics", "/content-library",
  "/brand", "/subscription", "/portals", "/settings", "/pipeline", "/invoices", "/editor", "/api/seed-demo", "/api/delete-demo",
];

// Client-accessible routes
const CLIENT_ROUTES = ["/my-portal", "/portal"];

// Public routes (no auth needed)
const PUBLIC = ["/", "/pricing", "/sign-in", "/sign-up", "/auth", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ── Unauthenticated ──────────────────────────────────────────
  const isFreelancerRoute = FREELANCER_ONLY.some(r => path.startsWith(r));
  const isClientRoute     = CLIENT_ROUTES.some(r => path.startsWith(r));

  if (!user && (isFreelancerRoute || isClientRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // ── Authenticated — check role ───────────────────────────────
  if (user) {
    // Fetch role from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role ?? "freelancer";

    // Redirect authenticated users away from auth pages
    if (path === "/sign-in" || path === "/sign-up") {
      const url = request.nextUrl.clone();
      url.pathname = role === "client" ? "/my-portal" : "/dashboard";
      return NextResponse.redirect(url);
    }

    // Client trying to access freelancer-only routes → redirect to their portal
    if (role === "client" && isFreelancerRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/my-portal";
      return NextResponse.redirect(url);
    }

    // Freelancer trying to access /my-portal → redirect to dashboard
    if (role === "freelancer" && path.startsWith("/my-portal")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
