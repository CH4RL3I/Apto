import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMatches } from "@/lib/questionnaire/matching";
import type { Answers } from "@/lib/questionnaire/questions";
import { resetQuestionnaire } from "../questionnaire/actions";

export default async function ResultsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("questionnaire_answers, completed_at")
    .eq("user_id", user.id)
    .single();

  if (!profile?.completed_at) redirect("/questionnaire");

  const answers = (profile.questionnaire_answers ?? {}) as Answers;
  const matches = getMatches(answers);
  const hasMatches = matches.length > 0 && matches[0].score > 0;
  const topJobId = matches[0]?.id;

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            apto
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-slate-900"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="text-center mb-10 fade-in">
          <h1 className="text-3xl font-bold text-slate-900">
            Your top matches
          </h1>
          <p className="mt-3 text-muted text-base leading-relaxed max-w-xl mx-auto">
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
            {matches.map((job, index) => {
              const isTop = index === 0;
              return (
                <article
                  key={job.id}
                  className={`bg-white rounded-2xl p-6 fade-in transition-shadow hover:shadow-md ${
                    isTop
                      ? "border-2 border-primary shadow-sm"
                      : "border border-border"
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {job.title}
                      </h2>
                      <p className="text-sm text-muted mt-1">{job.subtitle}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
                      {job.matchPercent}% Match
                    </span>
                  </div>

                  {job.reasons.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {job.reasons.slice(0, 3).map((reason, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted flex gap-2 items-start"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 rounded-xl bg-surface px-4 py-3 text-sm text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900">
                      Case study:{" "}
                    </span>
                    {job.caseStudy}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">
          <form action={resetQuestionnaire}>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-slate-700 border border-border bg-white rounded-lg hover:border-slate-300 transition-colors"
            >
              Start over
            </button>
          </form>
          {hasMatches && topJobId && (
            <Link
              href={`/case-studies/${topJobId}`}
              className="px-8 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors text-center"
            >
              Open full case study →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
