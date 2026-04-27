"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { track } from "@/lib/posthog";
import type { Answers } from "@/lib/questionnaire/questions";

export async function submitQuestionnaire(answers: Answers) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({
      questionnaire_answers: answers,
      completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  await track(user.id, "questionnaire_completed", {
    fields_count: answers.fields?.length ?? 0,
    industries_count: answers.industries?.length ?? 0,
  });

  redirect("/results");
}

export async function resetQuestionnaire() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({
      questionnaire_answers: {},
      completed_at: null,
    })
    .eq("user_id", user.id);

  redirect("/questionnaire");
}
