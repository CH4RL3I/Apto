import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { withPersistentMaxAge } from "@/lib/supabase/cookies";

// Same fallback pattern as supabase/{client,server}.ts — keeps preview
// builds without env vars from blowing up.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "placeholder-anon-key";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Only honor an in-app absolute path; reject protocol-relative ("//evil.com")
  // and external URLs. Default students to /dashboard (FR-6).
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";
  const requestedRole: "student" | "company" =
    searchParams.get("role") === "company" ? "company" : "student";

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Bind the Supabase client to a single response object so the session
  // cookies set by exchangeCodeForSession land on the exact redirect we
  // return. Setting them via cookies() from next/headers raced with the
  // middleware on the destination route and bounced users back to /login —
  // the "log in twice" symptom for Google OAuth.
  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, withPersistentMaxAge(options)),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Resolve the destination, then redirect *the same response object* so the
  // cookies set above stay attached. Mutating Location is the supported way
  // to do this — building a new NextResponse.redirect would drop them.
  const redirectTo = (path: string) => {
    response.headers.set("Location", `${origin}${path}`);
    return response;
  };

  // OAuth path: ensure a public.users + profiles row exists. The `role`
  // query param (set by the login page the user came from) decides whether
  // the new row is a student or a company — this fixes the bug where a
  // Google sign-in from /login/company was silently created as a student
  // and bounced into /upload-cv.
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingUser) {
    await supabase.from("users").insert({
      id: user.id,
      email: user.email!,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        null,
      avatar_url: user.user_metadata?.avatar_url || null,
      role: requestedRole,
    });
    if (requestedRole === "student") {
      await supabase.from("profiles").insert({ user_id: user.id });
    }
    return redirectTo(requestedRole === "company" ? "/portal" : next);
  }

  if (existingUser.role === "company") {
    return redirectTo("/portal");
  }

  return redirectTo(next);
}
