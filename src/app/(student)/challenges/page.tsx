import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { StudentShell } from "@/components/StudentSidebar";
import { ChallengesClient } from "./ChallengesClient";

export default async function ChallengesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Default sort: alphabetical (represents "Most popular" until view data is available).
  const cases = [...CASE_STUDIES].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  // Map each case study slug to the viewer's most-relevant submission status
  // so the Completed / In progress segments reflect real state.
  const { data: subs } = await supabase
    .from("submissions")
    .select("case_study_id, status")
    .eq("user_id", user.id);

  const statusRank: Record<string, number> = {
    in_progress: 1,
    submitted: 2,
    scored: 3,
    reviewed: 4,
    shortlisted: 5,
    rejected: 0,
  };
  const submissionStatuses: Record<string, string> = {};
  for (const row of subs ?? []) {
    const csId = row.case_study_id as string;
    const status = row.status as string;
    const incoming = statusRank[status] ?? -1;
    const current = statusRank[submissionStatuses[csId]] ?? -1;
    if (incoming > current) submissionStatuses[csId] = status;
  }

  return (
    <StudentShell active="challenges">
      <Suspense
        fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-64 rounded-lg bg-pale-sage" />
            <div className="h-10 w-80 rounded-xl bg-pale-sage" />
            <div className="h-10 w-72 rounded-xl bg-pale-sage" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 rounded-[14px] bg-pale-sage" />
              ))}
            </div>
          </div>
        }
      >
        <ChallengesClient cases={cases} submissionStatuses={submissionStatuses} />
      </Suspense>
    </StudentShell>
  );
}
