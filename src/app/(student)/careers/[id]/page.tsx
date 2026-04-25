import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Career, CaseStudy } from "@/types";
import { Logo } from "@/components/Logo";

export default async function CareerDetailPage({
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

  const { data: career } = await supabase
    .from("careers")
    .select("*")
    .eq("id", id)
    .single();

  if (!career) redirect("/results");

  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("*, company:companies(*)")
    .eq("career_id", id);

  const c = career as Career;
  const cases = (caseStudies || []) as (CaseStudy & { company: { name: string; logo_url: string | null } })[];

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="border-b border-border bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <div className="flex items-center gap-4">
            <Link href="/results" className="text-sm text-muted hover:text-slate-900">&larr; Back to matches</Link>
            <Link href="/dashboard" className="text-sm text-muted hover:text-slate-900">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="border-b border-border" style={{ backgroundColor: c.color + "08" }}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{c.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{c.title}</h1>
              <p className="text-muted text-lg mt-1">{c.one_liner}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="bg-white rounded-xl border border-border px-4 py-3">
              <div className="text-sm text-muted">Salary Range</div>
              <div className="font-semibold text-slate-900">
                {c.salary_range?.currency === "EUR" ? "\u20ac" : "$"}
                {(c.salary_range?.min / 1000).toFixed(0)}k &ndash;{" "}
                {(c.salary_range?.max / 1000).toFixed(0)}k
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border px-4 py-3">
              <div className="text-sm text-muted">Growth</div>
              <div className="font-semibold text-slate-900">{c.growth_outlook}</div>
            </div>
            <div className="bg-white rounded-xl border border-border px-4 py-3">
              <div className="text-sm text-muted">Case Studies</div>
              <div className="font-semibold text-slate-900">{cases.length} available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Day in the life */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">A Day in the Life</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{c.day_in_the_life}</p>
            </section>

            {/* Sample schedule */}
            {c.sample_schedule && c.sample_schedule.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Sample Schedule</h2>
                <div className="space-y-3">
                  {c.sample_schedule.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-sm font-mono text-primary font-medium w-16 flex-shrink-0">{item.time}</span>
                      <span className="text-slate-600 text-sm">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Typical tasks */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Typical Tasks</h2>
              <ul className="space-y-2">
                {c.typical_tasks?.map((task, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: c.color }} />
                    {task}
                  </li>
                ))}
              </ul>
            </section>

            {/* Case Studies */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Real Case Studies</h2>
              {cases.length === 0 ? (
                <p className="text-muted">No case studies available yet.</p>
              ) : (
                <div className="space-y-4">
                  {cases.map((cs) => (
                    <Link key={cs.id} href={`/case-studies/${cs.id}`} className="block">
                      <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-slate-300 transition-all group">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs text-muted mb-1 uppercase tracking-wide">
                              {cs.company?.name || "Company"}
                            </div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                              {cs.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                              <span>{cs.time_minutes} min</span>
                              <span className="capitalize">{cs.difficulty}</span>
                              <span className="capitalize">{cs.deliverable_format}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {cs.skills_tested?.map((skill) => (
                                <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                            Start &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {c.required_skills?.map((skill) => (
                  <span key={skill} className="text-xs px-2.5 py-1 rounded-full border border-border text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Common Tools</h3>
              <div className="flex flex-wrap gap-2">
                {c.tools?.map((tool) => (
                  <span key={tool} className="text-xs px-2.5 py-1 rounded-full bg-slate-50 text-slate-600">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {c.salary_range?.source && (
              <p className="text-xs text-muted">
                Salary data: {c.salary_range.source}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
