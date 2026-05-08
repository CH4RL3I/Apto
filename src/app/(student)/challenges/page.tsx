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
        <ChallengesClient cases={cases} />
      </Suspense>
    </StudentShell>
  );
}
