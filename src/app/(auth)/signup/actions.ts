"use server";

import { createClient } from "@/lib/supabase/server";

interface SignupResult {
  ok: boolean;
  error?: string;
  redirect?: string;
}

export async function signupStudent(formData: FormData): Promise<SignupResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password || password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, role: "student" } },
  });
  if (error) return { ok: false, error: error.message };

  if (!data.session) {
    return { ok: false, error: "Sign-up succeeded but no user was returned. Check your email if confirmation is required." };
  }

  return { ok: true, redirect: "/upload-cv" };
}

export async function signupCompany(formData: FormData): Promise<SignupResult> {
  const companyName = String(formData.get("companyName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (companyName.length < 2) {
    return { ok: false, error: "Company name is required." };
  }
  if (!email || !password || password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: companyName,
        company_name: companyName,
        role: "company",
      },
    },
  });
  if (error) return { ok: false, error: error.message };

  if (!data.session) {
    return { ok: false, error: "Sign-up succeeded but no user was returned. Check your email if confirmation is required." };
  }

  return { ok: true, redirect: "/portal" };
}
