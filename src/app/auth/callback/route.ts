import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/upload-cv";

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
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

  // OAuth path: ensure a public.users + profiles row exists. We always
  // default to role='student' for OAuth — companies sign up via the
  // /signup/company form which uses email + password.
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
      role: "student",
    });
    await supabase.from("profiles").insert({ user_id: user.id });
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (existingUser.role === "company") {
    return NextResponse.redirect(`${origin}/portal`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("completed_at, cv_url")
    .eq("user_id", user.id)
    .single();

  if (profile?.completed_at) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }
  return NextResponse.redirect(
    `${origin}${profile?.cv_url ? "/questionnaire" : "/upload-cv"}`,
  );
}
