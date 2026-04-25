import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Career, CaseStudy } from "@/types";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";

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
    <div className="min-h-screen bg-pale-sage">
      {/* Nav */}
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <div className="flex items-center gap-6">
            <Link href="/results" className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors">&larr; Back to matches</Link>
            <Link href="/dashboard" className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="border-b border-sage-mist-2 bg-pale-sage">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{c.icon}</span>
            <div>
              <div className="eyebrow mb-1">Career</div>
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">{c.title}</h1>
              <p className="text-charcoal-2 text-lg mt-1">{c.one_liner}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-chalk rounded-[10px] shadow-1 px-4 py-3">
              <div className="eyebrow mb-1">Salary range</div>
              <div className="font-semibold text-charcoal stat-num">
                {c.salary_range?.currency === "EUR" ? "€" : "$"}
                {(c.salary_range?.min / 1000).toFixed(0)}k &ndash;{" "}
                {(c.salary_range?.max / 1000).toFixed(0)}k
              </div>
            </div>
            <div className="bg-chalk rounded-[10px] shadow-1 px-4 py-3">
              <div className="eyebrow mb-1">Growth</div>
              <div className="font-semibold text-charcoal">{c.growth_outlook}</div>
            </div>
            <div className="bg-chalk rounded-[10px] shadow-1 px-4 py-3">
              <div className="eyebrow mb-1">Case studies</div>
              <div className="font-semibold text-charcoal stat-num">{cases.length} available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">A day in the life</h2>
              <p className="text-charcoal-2 leading-relaxed whitespace-pre-line">{c.day_in_the_life}</p>
            </section>

            {c.sample_schedule && c.sample_schedule.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">Sample schedule</h2>
                <div className="space-y-3">
                  {c.sample_schedule.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-sm font-mono text-sage font-semibold w-16 flex-shrink-0">{item.time}</span>
                      <span className="text-charcoal-2 text-sm leading-relaxed">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">Typical tasks</h2>
              <ul className="space-y-2">
                {c.typical_tasks?.map((task, i) => (
                  <li key={i} className="flex items-start gap-3 text-charcoal-2 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-sage" />
                    {task}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">Real case studies</h2>
              {cases.length === 0 ? (
                <p className="text-charcoal-2">No case studies available yet.</p>
              ) : (
                <div className="space-y-3">
                  {cases.map((cs) => (
                    <Link key={cs.id} href={`/case-studies/${cs.id}`} className="block">
                      <div className="bg-chalk rounded-[14px] shadow-1 hover:shadow-2 p-5 transition-shadow group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="eyebrow mb-1">
                              {cs.company?.name || "Company"}
                            </div>
                            <h3 className="font-semibold text-charcoal group-hover:text-sage transition-colors">
                              {cs.title}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              <Pill variant="mist" size="sm">{cs.time_minutes} min</Pill>
                              <Pill variant="mist" size="sm"><span className="capitalize">{cs.difficulty}</span></Pill>
                              <Pill variant="mist" size="sm"><span className="capitalize">{cs.deliverable_format}</span></Pill>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {cs.skills_tested?.map((skill) => (
                                <Pill key={skill} variant="sage" size="sm">{skill}</Pill>
                              ))}
                            </div>
                          </div>
                          <span className="text-sage text-sm font-semibold group-hover:translate-x-1 transition-transform whitespace-nowrap">
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
          <div className="space-y-4">
            <div className="bg-chalk rounded-[14px] shadow-1 p-5">
              <h3 className="eyebrow mb-3">Required skills</h3>
              <div className="flex flex-wrap gap-2">
                {c.required_skills?.map((skill) => (
                  <Pill key={skill} variant="mist" size="sm">{skill}</Pill>
                ))}
              </div>
            </div>

            <div className="bg-chalk rounded-[14px] shadow-1 p-5">
              <h3 className="eyebrow mb-3">Common tools</h3>
              <div className="flex flex-wrap gap-2">
                {c.tools?.map((tool) => (
                  <Pill key={tool} variant="mist" size="sm">{tool}</Pill>
                ))}
              </div>
            </div>

            {c.salary_range?.source && (
              <p className="text-xs text-charcoal-3">
                Salary data: {c.salary_range.source}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
