"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
