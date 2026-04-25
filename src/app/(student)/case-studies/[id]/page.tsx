import { redirect } from "next/navigation";
import Image from "next/image";
import { Clock, Sun } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { daySnapshot } from "@/lib/questionnaire/matching";
import { Markdown } from "@/lib/markdown";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";
import { StudentShell } from "@/components/StudentSidebar";

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

  // The seeded body still contains a leading <img> tag from the original
  // markdown source. We render the company logo separately above, so strip it.
  const cleanBody = cs.body.replace(/^\s*<img\b[^>]*>\s*\n?/i, "");

  const dayLine = daySnapshot(cs);

  return (
    <StudentShell active="challenges">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="eyebrow mb-2">Case study</div>
          <h1 className="text-3xl md:text-[34px] font-bold text-charcoal tracking-tight" style={{ textWrap: "balance" }}>{cs.title}</h1>
          {cs.companyName && (
            <div className="mt-3 inline-flex items-center gap-2 bg-chalk border border-sage-mist-2 rounded-full pl-1 pr-3 py-1 shadow-1">
              <span className="w-7 h-7 rounded-full bg-pale-sage overflow-hidden flex items-center justify-center">
                <Image
                  src={cs.logoUrl}
                  alt={`${cs.companyName} logo`}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </span>
              <span className="text-xs text-charcoal-2">
                Hosted by <strong className="text-charcoal font-semibold">{cs.companyName}</strong>
              </span>
            </div>
          )}
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
          <Markdown source={cleanBody} />
        </div>

        {/* Daily routine */}
        <div className="bg-chalk rounded-[14px] shadow-1 p-6 mb-4">
          <h2 className="eyebrow mb-3 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-sage" strokeWidth={1.75} />
            What a typical day looks like
          </h2>
          <p className="text-sm text-charcoal-2 leading-relaxed">{dayLine}</p>
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
    </StudentShell>
  );
}
