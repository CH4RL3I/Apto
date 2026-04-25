import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COMPANY_COOKIE = "apto_pending_company_signup";

interface PendingCompany {
  name?: string;
  email?: string;
  ts?: number;
}

function readPendingCompany(value: string | undefined): PendingCompany | null {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as PendingCompany;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = searchParams.get("role");
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

  const cookieStore = await cookies();

  if (role === "company") {
    const pending = readPendingCompany(cookieStore.get(COMPANY_COOKIE)?.value);
    const companyName = pending?.name?.trim() || user.email?.split("@")[0] || "Company";

    const { data: existingUser } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (!existingUser) {
      await supabase.from("users").insert({
        id: user.id,
        email: user.email!,
        name: companyName,
        avatar_url: user.user_metadata?.avatar_url || null,
        role: "company",
      });
    } else if (existingUser.role !== "company") {
      await supabase.from("users").update({ role: "company" }).eq("id", user.id);
    }

    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingCompany) {
      await supabase.from("companies").insert({
        user_id: user.id,
        name: companyName,
        contact_email: user.email!,
        logo_url: null,
      });
    }

    cookieStore.delete(COMPANY_COOKIE);
    return NextResponse.redirect(`${origin}/portal`);
  }

  // Student path
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, role")
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

    await supabase.from("profiles").insert({ user_id: user.id });
  } else if (existingUser.role === "company") {
    return NextResponse.redirect(`${origin}/portal`);
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("completed_at")
      .eq("user_id", user.id)
      .single();

    if (profile?.completed_at) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
