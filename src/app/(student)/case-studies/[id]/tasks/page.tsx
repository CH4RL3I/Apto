import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { ChallengeTasksShell } from "./ChallengeTasksShell";

export default async function CaseStudyTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cs = CASE_STUDIES.find((c) => c.id === id);
  if (!cs) redirect("/results");

  if (!cs.tasks || cs.tasks.length === 0) {
    redirect(`/case-studies/${cs.id}/exam`);
  }

  return <ChallengeTasksShell caseStudy={cs} />;
}
