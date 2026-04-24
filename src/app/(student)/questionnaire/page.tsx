import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuestionnaireForm from "./QuestionnaireForm";

export default async function QuestionnairePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("completed_at")
    .eq("user_id", user.id)
    .single();

  if (profile?.completed_at) redirect("/results");

  return <QuestionnaireForm />;
}
