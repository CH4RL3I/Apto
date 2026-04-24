import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/upload-cv";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user profile exists, create if not
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

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

          await supabase.from("profiles").insert({
            user_id: user.id,
          });
        } else {
          // Check if they've completed the questionnaire
          const { data: profile } = await supabase
            .from("profiles")
            .select("completed_at")
            .eq("user_id", user.id)
            .single();

          if (profile?.completed_at) {
            return NextResponse.redirect(`${origin}/dashboard`);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
