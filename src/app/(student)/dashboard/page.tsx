import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";

type StatusVariant = "mist" | "sage" | "sageSolid" | "coralSolid";
const statusVariant: Record<string, StatusVariant> = {
  in_progress: "mist",
  submitted: "sage",
  scored: "sageSolid",
  reviewed: "coralSolid",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userData?.role === "company") redirect("/portal");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile?.completed_at) redirect("/questionnaire");

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, company:companies(*), submission:submissions(*)")
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false });

  const caseStudyIds = new Set<string>();
  for (const sub of submissions ?? []) {
    if (typeof sub.case_study_id === "string") caseStudyIds.add(sub.case_study_id);
  }
  for (const inv of invitations ?? []) {
    const submission = inv.submission as Record<string, unknown> | null;
    if (typeof submission?.case_study_id === "string") {
      caseStudyIds.add(submission.case_study_id);
    }
  }

  const { data: dbCaseStudies } = caseStudyIds.size
    ? await supabase
        .from("case_studies")
        .select("id, title")
        .in("id", [...caseStudyIds])
    : { data: [] };

  const caseStudyTitles = new Map<string, string>();
  for (const cs of CASE_STUDIES) caseStudyTitles.set(cs.id, cs.title);
  for (const cs of dbCaseStudies ?? []) {
    caseStudyTitles.set(cs.id as string, cs.title as string);
  }

  const firstName = userData?.name ? userData.name.split(" ")[0] : null;

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <div className="flex items-center gap-6">
            <Link href="/results" className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors">Explore careers</Link>
            <form action="/auth/signout" method="post">
              <button className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors">Sign out</button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-[28px] md:text-3xl font-bold text-charcoal tracking-tight">
            Good to see you{firstName ? `, ${firstName}` : ""} <span className="font-normal">👋</span>
          </h1>
          <p className="text-charcoal-2 mt-1">Track your progress and invitations here.</p>
        </div>

        {/* Invitations */}
        {invitations && invitations.length > 0 && (
          <div className="mb-10">
            <div className="eyebrow mb-3">Invitations</div>
            <div className="space-y-4">
              {invitations.map((inv: Record<string, unknown>) => (
                <div
                  key={inv.id as string}
                  className="bg-pale-sage border border-sage rounded-[14px] p-6 fade-in shadow-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3">
                        <Pill variant="coralSolid" size="sm">New invitation</Pill>
                      </div>
                      <h3 className="text-lg font-bold text-charcoal tracking-tight">
                        {(inv.company as Record<string, unknown>)?.name as string} wants to interview you.
                      </h3>
                      {typeof inv.message === "string" && inv.message && (
                        <p className="text-charcoal-2 text-sm mt-2 leading-relaxed">{inv.message}</p>
                      )}
                      <p className="text-xs text-charcoal-2 mt-2">
                        Based on your submission to &ldquo;
                        {caseStudyTitles.get(
                          ((inv.submission as Record<string, unknown>)?.case_study_id as string) ?? "",
                        ) ?? "Case study"}
                        &rdquo;
                      </p>
                    </div>
                    <Pill variant="sage" size="sm">
                      <span className="capitalize">{inv.status as string}</span>
                    </Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submissions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="eyebrow">Your submissions</div>
            <Link href="/results" className="text-sm text-sage font-semibold hover:underline">
              Try another case study &rarr;
            </Link>
          </div>

          {!submissions || submissions.length === 0 ? (
            <div className="bg-chalk rounded-[14px] shadow-1 p-12 text-center">
              <div className="w-14 h-14 bg-pale-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-sage-300" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">No submissions yet</h3>
              <p className="text-charcoal-2 text-sm mb-6">
                Complete a case study to see your submissions here.
              </p>
              <ButtonLink href="/results" variant="primary" size="md">
                Explore careers
              </ButtonLink>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub: Record<string, unknown>) => {
                const status = sub.status as string;
                const caseStudyId = sub.case_study_id as string;
                return (
                  <div key={sub.id as string} className="bg-chalk rounded-[14px] shadow-1 hover:shadow-2 transition-shadow p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="eyebrow mb-1">Case study</div>
                        <h3 className="font-semibold text-charcoal">
                          {caseStudyTitles.get(caseStudyId) ?? "Case study"}
                        </h3>
                        <div className="flex items-center gap-3 mt-3">
                          <Pill variant={statusVariant[status] ?? "mist"} size="sm">
                            <span className="capitalize">{status.replace("_", " ")}</span>
                          </Pill>
                          {sub.score !== null && (
                            <span className="text-sm font-semibold text-sage stat-num">
                              {sub.score as number}/100
                            </span>
                          )}
                        </div>
                      </div>
                      {sub.status === "in_progress" && (
                        <Link
                          href={`/case-studies/${sub.case_study_id as string}/exam`}
                          className="text-sm text-sage font-semibold hover:underline whitespace-nowrap"
                        >
                          Resume &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
