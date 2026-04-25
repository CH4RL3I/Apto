import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { Markdown } from "@/lib/markdown";

export default async function CaseStudyBriefPage({
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

  const tierLabel =
    cs.duration === "short"
      ? "Taster"
      : cs.duration === "long"
      ? "Deep dive"
      : "Mid-form";

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">apto</Link>
          <Link href="/results" className="text-sm text-muted hover:text-slate-900">
            &larr; Back to matches
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{cs.title}</h1>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {cs.estimatedMinutes} minutes
          </span>
          <span className="text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
            {tierLabel}
          </span>
          <span className="text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 capitalize">
            {cs.cluster.replace(/_/g, " ")}
          </span>
        </div>

        {/* Brief (full markdown body) */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8">
          <Markdown source={cs.body} />
        </div>

        {/* Skills tested */}
        {cs.skillsTested.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-8 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Skills tested</h2>
            <div className="flex flex-wrap gap-2">
              {cs.skillsTested.map((skill) => (
                <span key={skill} className="text-sm px-3 py-1.5 rounded-full border border-border text-slate-600">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Roles this fits */}
        {cs.matchesRoles.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-8 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Roles this case fits</h2>
            <div className="flex flex-wrap gap-2">
              {cs.matchesRoles.map((role) => (
                <span key={role} className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Start exam CTA */}
        <div className="text-center bg-white rounded-2xl border border-border p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Ready to prove yourself?
          </h2>
          <p className="text-muted mb-6">
            You&apos;ll have {cs.estimatedMinutes} minutes in a focused exam environment.
            Your work auto-saves every 10 seconds.
          </p>
          <Link
            href={`/case-studies/${cs.id}/exam`}
            className="inline-block bg-primary text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
          >
            Start Case Study &rarr;
          </Link>
          <p className="text-xs text-muted mt-4">
            Timer starts when you click. Your work is auto-saved.
          </p>
        </div>
      </div>
    </div>
  );
}
