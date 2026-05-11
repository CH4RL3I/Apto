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
  // query param (set by the login page the user came from) decides which
  // role to grant. A single auth.user can now hold both 'student' and
  // 'company' — if an existing user signs in via the *other* role's login
  // page, we ADD that role rather than bouncing them around.
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, role, roles")
    .eq("id", user.id)
    .maybeSingle();

  const destinationFor = (role: "student" | "company") =>
    role === "company" ? "/portal" : next;

  if (!existingUser) {
    await supabase.from("users").insert({
      id: user.id,
      email: user.email!,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        null,
      avatar_url: user.user_metadata?.avatar_url || null,
      role: requestedRole, // legacy mirror
      roles: [requestedRole], // new multi-role field
    });
    if (requestedRole === "student") {
      await supabase.from("profiles").insert({ user_id: user.id });
    }
    return redirectTo(destinationFor(requestedRole));
  }

  // Existing user. If they're trying to act in a role they don't yet have,
  // grant it. Fall back to the legacy single `role` column if `roles` is
  // missing (e.g. row predates the migration trigger backfill).
  const currentRoles: string[] = Array.isArray(existingUser.roles)
    ? (existingUser.roles as string[])
    : existingUser.role
      ? [existingUser.role as string]
      : [];
  if (!currentRoles.includes(requestedRole)) {
    const newRoles = [...currentRoles, requestedRole];
    await supabase
      .from("users")
      .update({ roles: newRoles })
      .eq("id", user.id);
    if (requestedRole === "student") {
      // Ensure a profiles row exists so the student-side dashboard works.
      await supabase
        .from("profiles")
        .upsert({ user_id: user.id }, { onConflict: "user_id" });
    }
  }

  return redirectTo(destinationFor(requestedRole));
}
