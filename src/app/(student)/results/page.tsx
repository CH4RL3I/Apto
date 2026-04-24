import { createClient } from "@/lib/supabase/server";
import { matchCareers } from "@/lib/matching/engine";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Career } from "@/types";

export default async function ResultsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("match_vector, completed_at, cv_skills")
    .eq("user_id", user.id)
    .single();

  if (!profile?.completed_at) redirect("/questionnaire");

  const { data: careers } = await supabase.from("careers").select("*");

  const matched = matchCareers(
    profile.match_vector as number[],
    (careers || []) as Career[],
    (profile.cv_skills as string[]) || undefined
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <nav className="border-b border-border bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-3xl font-bold text-slate-900">
            Your Career Matches
          </h1>
          <p className="mt-3 text-muted text-lg">
            Based on your answers, here are the careers that best fit your
            profile.
          </p>
        </div>

        <div className="space-y-6">
          {matched.map((career, index) => (
            <Link
              key={career.id}
              href={`/careers/${career.id}`}
              className="block fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:border-slate-300 transition-all group"
                style={{ borderLeftWidth: 4, borderLeftColor: career.color }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{career.icon}</span>
                      <h2 className="text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
                        {career.title}
                      </h2>
                    </div>
                    <p className="text-muted mb-3">{career.one_liner}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {career.explanation}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {career.tags?.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Match score */}
                  <div className="ml-6 text-center flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: career.color }}
                    >
                      {Math.round(career.matchScore * 100)}%
                    </div>
                    <div className="text-xs text-muted mt-1.5">Match</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted mb-4">
            Click a career to explore it and try a real case study
          </p>
          <Link
            href="/dashboard"
            className="text-sm text-primary font-medium hover:underline"
          >
            Go to Dashboard &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
