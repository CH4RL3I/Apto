"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface ProfileEditInput {
  name: string;
  education: string;
  experience: string[];
  skills: string[];
}

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

  await supabase
    .from("profiles")
    .update({
      cv_parsed: nextCvParsed,
      cv_skills: cleanSkills,
    })
    .eq("user_id", user.id);

  if (cleanName) {
    await supabase
      .from("users")
      .update({ name: cleanName })
      .eq("id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile/edit");
}
