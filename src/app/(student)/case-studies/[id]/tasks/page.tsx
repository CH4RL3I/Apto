import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { fetchTasksOverride } from "@/lib/admin/tasks-override";
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

  const override = await fetchTasksOverride(id);
  const merged = override
    ? {
        ...cs,
        tasks: override.tasks,
        desk: override.desk ?? cs.desk,
        companyBlock: override.company_block ?? cs.companyBlock,
      }
    : cs;

  if (!merged.tasks || merged.tasks.length === 0) {
    redirect(`/case-studies/${cs.id}/exam`);
  }

  return <ChallengeTasksShell caseStudy={merged} />;
}
