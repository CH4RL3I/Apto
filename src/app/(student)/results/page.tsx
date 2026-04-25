import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  getMatches,
  findCaseStudiesForJob,
  type ParsedCV,
} from "@/lib/questionnaire/matching";
import type { Answers } from "@/lib/questionnaire/questions";
import { resetQuestionnaire } from "../questionnaire/actions";
import { Pill } from "@/components/ui/Pill";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StudentShell } from "@/components/StudentSidebar";

export default async function ResultsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("questionnaire_answers, completed_at, cv_parsed")
    .eq("user_id", user.id)
    .single();

  if (!profile?.completed_at) redirect("/questionnaire");

  const answers = (profile.questionnaire_answers ?? {}) as Answers;
  const cv = (profile.cv_parsed ?? null) as ParsedCV | null;
  const matches = getMatches(answers, cv);
  const hasMatches = matches.length > 0 && matches[0].score > 0;
  const matchesWithCases = matches.map((m) => ({
    ...m,
    cases: findCaseStudiesForJob(m, 2),
  }));
  const topCaseId = matchesWithCases[0]?.cases[0]?.id;

  return (
    <StudentShell active="discover">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10 fade-in">
          <div className="eyebrow mb-3">Your matches</div>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight" style={{ textWrap: "balance" }}>
            {hasMatches ? "Your top matches" : "Let's broaden the search"}
          </h1>
          <p className="mt-3 text-charcoal-2 text-base leading-relaxed max-w-xl mx-auto">
            {hasMatches ? (
              <>
                Based on your answers, we picked {matches.length} roles for you
                — out of 27 jobs across industries. Each one comes with a case
                study that shows you what the day-to-day actually looks like.
              </>
            ) : (
              <>
                We couldn&apos;t find any strong matches. Try broadening your
                answers a little.
              </>
            )}
          </p>
        </header>

        {hasMatches ? (
          <div className="space-y-5">
            {matchesWithCases.map((job, index) => {
              const isTop = index === 0;
              const primaryCase = job.cases[0];
              return (
                <article
                  key={job.id}
                  className={`rounded-[14px] p-6 fade-in transition-shadow ${
                    isTop
                      ? "bg-chalk border-2 border-sage shadow-2"
                      : "bg-chalk shadow-1 hover:shadow-2"
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {primaryCase ? (
                        <Link
                          href={`/case-studies/${primaryCase.id}`}
                          className="group inline-block"
                        >
                          <h2 className="text-xl font-bold text-charcoal group-hover:text-sage transition-colors tracking-tight">
                            {job.title}
                          </h2>
                        </Link>
                      ) : (
                        <h2 className="text-xl font-bold text-charcoal tracking-tight">
                          {job.title}
                        </h2>
                      )}
                      <p className="text-sm text-charcoal-2 mt-1">{job.subtitle}</p>
                    </div>
                    <Pill variant="sage" size="md">
                      {job.matchPercent}% match
                    </Pill>
                  </div>

                  {job.reasons.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {job.reasons.slice(0, 3).map((reason, i) => (
                        <li
                          key={i}
                          className="text-sm text-charcoal-2 flex gap-2 items-start"
                        >
                          <span className="text-sage mt-0.5 font-bold">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {job.cases.length > 0 && (
                    <div className="mt-5 space-y-2">
                      <div className="eyebrow">Try a real case</div>
                      {job.cases.map((cs) => (
                        <Link
                          key={cs.id}
                          href={`/case-studies/${cs.id}`}
                          className="block rounded-[10px] bg-pale-sage hover:bg-chalk-2 px-4 py-3 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="w-10 h-10 rounded-md bg-chalk shadow-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <Image
                                src={cs.logoUrl}
                                alt={`${cs.companyName ?? "Company"} logo`}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-charcoal">
                                {cs.title}
                              </div>
                              <div className="text-xs text-charcoal-2 mt-0.5">
                                {cs.companyName && (
                                  <span className="font-medium text-charcoal">
                                    {cs.companyName}
                                  </span>
                                )}
                                {cs.companyName && " · "}
                                <span className="capitalize">
                                  {cs.duration} · {cs.estimatedMinutes} min
                                </span>
                              </div>
                            </div>
                            <span className="text-sage text-sm flex-shrink-0 self-center">
                              →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">
          <form action={resetQuestionnaire}>
            <Button type="submit" variant="ghost" size="md" className="w-full sm:w-auto">
              Start over
            </Button>
          </form>
          {hasMatches && topCaseId && (
            <ButtonLink
              href={`/case-studies/${topCaseId}`}
              variant="primary"
              size="md"
            >
              Open top case study →
            </ButtonLink>
          )}
        </div>
      </div>
    </StudentShell>
  );
}
