import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { CaseStudy, Company, Career } from "@/types";

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

  const { data } = await supabase
    .from("case_studies")
    .select("*, company:companies(*), career:careers(*)")
    .eq("id", id)
    .single();

  if (!data) redirect("/results");

  const cs = data as CaseStudy & { company: Company; career: Career };

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">apto</Link>
          <Link href={`/careers/${cs.career_id}`} className="text-sm text-muted hover:text-slate-900">
            &larr; Back to {cs.career?.title || "career"}
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Company header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: cs.career?.color || "#6366f1" }}
          >
            {cs.company?.name?.charAt(0) || "T"}
          </div>
          <div>
            <div className="text-sm text-muted">{cs.company?.name}</div>
            <h1 className="text-2xl font-bold text-slate-900">{cs.title}</h1>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {cs.time_minutes} minutes
          </span>
          <span className="text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 capitalize">
            {cs.difficulty}
          </span>
          <span className="text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 capitalize">
            {cs.deliverable_format} format
          </span>
        </div>

        {/* Brief */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">The Brief</h2>
          <div className="text-slate-600 leading-relaxed whitespace-pre-line">
            {cs.brief}
          </div>
        </div>

        {/* Rubric */}
        {cs.rubric && cs.rubric.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-8 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Evaluation Criteria
            </h2>
            <div className="space-y-4">
              {cs.rubric.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-sm font-bold text-primary w-12 flex-shrink-0">
                    {Math.round(item.weight * 100)}%
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">
                      {item.criterion}
                    </div>
                    <div className="text-sm text-muted mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills tested */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Skills Tested</h2>
          <div className="flex flex-wrap gap-2">
            {cs.skills_tested?.map((skill) => (
              <span key={skill} className="text-sm px-3 py-1.5 rounded-full border border-border text-slate-600">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Start exam CTA */}
        <div className="text-center bg-white rounded-2xl border border-border p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Ready to prove yourself?
          </h2>
          <p className="text-muted mb-6">
            You&apos;ll have {cs.time_minutes} minutes in a focused exam environment.
            Your submission will be scored and visible to {cs.company?.name || "the company"}.
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
