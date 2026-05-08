"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface ProfileEditInput {
  name: string;
  education: string;
  experience: string[];
  skills: string[];
  isPublic: boolean;
  username: string;
  headline: string;
}

const USERNAME_RE = /^[a-z0-9-]{3,30}$/;

export async function updateStudentProfile(input: ProfileEditInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cleanName = input.name.trim();
  const cleanEducation = input.education.trim();
  const cleanExperience = input.experience
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
  const cleanSkills = input.skills
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const cleanHeadline = input.headline.trim().slice(0, 200);
  const cleanUsername = input.username.trim().toLowerCase();

  if (input.isPublic) {
    if (!cleanUsername) {
      throw new Error("A username is required to make your profile public.");
    }
    if (!USERNAME_RE.test(cleanUsername)) {
      throw new Error(
        "Username must be 3–30 characters, lowercase letters, numbers, or hyphens.",
      );
    }
    const { data: taken } = await supabase
      .from("profiles")
      .select("user_id")
      .ilike("username", cleanUsername)
      .neq("user_id", user.id)
      .maybeSingle();
    if (taken) {
      throw new Error("That username is already taken.");
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_parsed")
    .eq("user_id", user.id)
    .single();

  const existing = (profile?.cv_parsed ?? {}) as Record<string, unknown>;
  const nextCvParsed = {
    ...existing,
    name: cleanName || null,
    education: cleanEducation || null,
    experience: cleanExperience,
    skills: cleanSkills,
  };

  const profileUpdate: Record<string, unknown> = {
    cv_parsed: nextCvParsed,
    cv_skills: cleanSkills,
    is_public: input.isPublic,
    headline: cleanHeadline || null,
  };
  if (input.isPublic) {
    profileUpdate.username = cleanUsername;
  } else if (cleanUsername) {
    profileUpdate.username = cleanUsername;
  } else {
    profileUpdate.username = null;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("user_id", user.id);
  if (updateError) throw new Error(updateError.message);

  if (cleanName) {
    await supabase
      .from("users")
      .update({ name: cleanName })
      .eq("id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile/edit");
  if (cleanUsername) revalidatePath(`/u/${cleanUsername}`);
}
