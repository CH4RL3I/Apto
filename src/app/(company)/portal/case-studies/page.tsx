import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";
import { DeleteCaseStudyButton } from "./DeleteCaseStudyButton";

export default async function CaseStudiesListPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (userRow?.role !== "company") redirect("/dashboard");

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("user_id", user.id)
    .single();
  if (!company) redirect("/dashboard");

  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("id, title, time_minutes, difficulty, skills_tested, created_at")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  const csIds = (caseStudies ?? []).map((c: Record<string, unknown>) => c.id as string);
  const submissionCounts = new Map<string, number>();
  if (csIds.length > 0) {
    const { data: subs } = await supabase
      .from("submissions")
      .select("case_study_id")
      .in("case_study_id", csIds);
    for (const row of subs ?? []) {
      const cid = (row as Record<string, unknown>).case_study_id as string;
      submissionCounts.set(cid, (submissionCounts.get(cid) ?? 0) + 1);
    }
  }

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/portal" aria-label="Back to portal" className="inline-flex items-center gap-3">
            <Logo height={28} priority />
          </Link>
          <Link
            href="/portal"
            className="text-sm font-medium text-charcoal-2 hover:text-charcoal inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Back to candidates
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="eyebrow mb-1">{company.name}</div>
            <h1 className="text-3xl font-bold text-charcoal tracking-tight">Case studies</h1>
            <p className="text-charcoal-2 mt-1">Author the briefs candidates work on.</p>
          </div>
          <ButtonLink
            href="/portal/case-studies/new"
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" strokeWidth={1.75} />}
          >
            Create new
          </ButtonLink>
        </div>

        {!caseStudies || caseStudies.length === 0 ? (
          <div className="bg-chalk rounded-[14px] shadow-1 p-12 text-center">
            <h3 className="font-semibold text-charcoal mb-2">No case studies yet</h3>
            <p className="text-charcoal-2 text-sm mb-6">
              Create your first one for candidates to attempt.
            </p>
            <ButtonLink href="/portal/case-studies/new" variant="primary" size="md">
              Create case study
            </ButtonLink>
          </div>
        ) : (
          <div className="space-y-3">
            {caseStudies.map((cs: Record<string, unknown>) => {
              const id = cs.id as string;
              const count = submissionCounts.get(id) ?? 0;
              const skills = (cs.skills_tested as string[]) ?? [];
              return (
                <div
                  key={id}
                  className="bg-chalk rounded-[14px] shadow-1 hover:shadow-2 transition-shadow p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal mb-1">{cs.title as string}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Pill variant="mist" size="sm">
                          {cs.time_minutes as number} min
                        </Pill>
                        <Pill variant="sage" size="sm">
                          <span className="capitalize">{cs.difficulty as string}</span>
                        </Pill>
                        <Pill variant="sageSolid" size="sm">
                          {count} submission{count === 1 ? "" : "s"}
                        </Pill>
                        {skills.slice(0, 3).map((s) => (
                          <Pill key={s} variant="mist" size="sm">
                            {s}
                          </Pill>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ButtonLink
                        href={`/portal/case-studies/${id}/edit`}
                        variant="ghost"
                        size="sm"
                      >
                        Edit
                      </ButtonLink>
                      <DeleteCaseStudyButton id={id} title={cs.title as string} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
