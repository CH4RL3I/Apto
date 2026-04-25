import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { Markdown } from "@/lib/markdown";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";

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
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <Link href="/results" className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors">
            &larr; Back to matches
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-6">
          <div className="eyebrow mb-2">Case study</div>
          <h1 className="text-3xl md:text-[34px] font-bold text-charcoal tracking-tight" style={{ textWrap: "balance" }}>{cs.title}</h1>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Pill variant="mist" size="md" icon={<Clock className="w-3.5 h-3.5" strokeWidth={1.75} />}>
            {cs.estimatedMinutes} minutes
          </Pill>
          <Pill variant="mist" size="md">{tierLabel}</Pill>
          <Pill variant="mist" size="md"><span className="capitalize">{cs.cluster.replace(/_/g, " ")}</span></Pill>
        </div>

        {/* Brief (full markdown body) */}
        <div className="bg-chalk rounded-[14px] shadow-1 p-8 mb-6">
          <Markdown source={cs.body} />
        </div>

        {/* Skills tested */}
        {cs.skillsTested.length > 0 && (
          <div className="bg-chalk rounded-[14px] shadow-1 p-6 mb-4">
            <h2 className="eyebrow mb-3">Skills tested</h2>
            <div className="flex flex-wrap gap-2">
              {cs.skillsTested.map((skill) => (
                <Pill key={skill} variant="mist" size="md">{skill}</Pill>
              ))}
            </div>
          </div>
        )}

        {/* Roles this fits */}
        {cs.matchesRoles.length > 0 && (
          <div className="bg-chalk rounded-[14px] shadow-1 p-6 mb-8">
            <h2 className="eyebrow mb-3">Roles this case fits</h2>
            <div className="flex flex-wrap gap-2">
              {cs.matchesRoles.map((role) => (
                <Pill key={role} variant="sage" size="md">{role}</Pill>
              ))}
            </div>
          </div>
        )}

        {/* Start exam CTA */}
        <div className="text-center bg-pale-sage border border-sage-mist-2 rounded-[20px] p-10 shadow-1">
          <h2 className="text-xl md:text-2xl font-bold text-charcoal mb-2 tracking-tight">
            Ready to prove yourself?
          </h2>
          <p className="text-charcoal-2 mb-6 leading-relaxed max-w-md mx-auto">
            You&apos;ll have {cs.estimatedMinutes} minutes in a focused exam environment.
            Your work auto-saves every 10 seconds.
          </p>
          <ButtonLink
            href={`/case-studies/${cs.id}/exam`}
            variant="primary"
            size="lg"
          >
            Start case study &rarr;
          </ButtonLink>
          <p className="text-xs text-charcoal-3 mt-4">
            Timer starts when you click. Your work is auto-saved.
          </p>
        </div>
      </div>
    </div>
  );
}
