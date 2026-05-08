import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { Pill } from "@/components/ui/Pill";
import { StudentShell } from "@/components/StudentSidebar";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractCompanyDescription(body: string): string {
  const match = body.match(/##\s*Context\s*\n+([\s\S]*?)(?=\n##\s)/);
  if (!match) return "";
  const section = match[1]
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*/g, "")
    .trim();
  return section.split(/\n\n/)[0]?.trim() ?? "";
}

function tierLabel(d: "short" | "medium" | "long"): string {
  return d === "short" ? "Taster" : d === "long" ? "Deep dive" : "Mid-form";
}

function clusterLabel(cluster: string): string {
  return cluster.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyCases = CASE_STUDIES.filter(
    (cs) => cs.companyName && slugify(cs.companyName) === slug
  );
  if (companyCases.length === 0) notFound();

  const companyName = companyCases[0].companyName!;
  const logoUrl = companyCases[0].logoUrl;
  const description = extractCompanyDescription(companyCases[0].body);

  const industries = Array.from(
    new Set(companyCases.flatMap((cs) => cs.matchesIndustries))
  );
  const fields = Array.from(
    new Set(companyCases.flatMap((cs) => cs.matchesFields))
  );

  return (
    <StudentShell active="companies">
      <div className="mb-6">
        <Link
          href="/companies"
          className="text-sm text-charcoal-2 hover:text-charcoal transition-colors"
        >
          ← All companies
        </Link>
      </div>

      {/* Company header */}
      <div className="rounded-[16px] bg-chalk border border-sage-mist-2 shadow-1 p-7 mb-8">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-pale-sage shadow-1">
            <Image
              src={logoUrl}
              alt={`${companyName} logo`}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-charcoal tracking-tight mb-1">
              {companyName}
            </h1>

            {(industries.length > 0 || fields.length > 0) && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {industries.map((ind) => (
                  <Pill key={ind} variant="mist" size="sm">
                    {ind}
                  </Pill>
                ))}
                {fields.map((field) => (
                  <Pill key={field} size="sm">
                    {field}
                  </Pill>
                ))}
              </div>
            )}

            {description && (
              <p className="text-charcoal-2 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Case studies */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-charcoal tracking-tight">
          Case studies
          <span className="ml-2 text-charcoal-3 font-normal text-base">
            · {companyCases.length}
          </span>
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companyCases.map((cs) => (
          <Link
            key={cs.id}
            href={`/case-studies/${cs.id}`}
            className="focus-ring group rounded-[16px] border border-sage-mist-2 bg-chalk p-5 shadow-1 transition-all hover:-translate-y-0.5 hover:shadow-2 flex flex-col"
          >
            <div className="text-[10px] uppercase tracking-[0.14em] text-charcoal-3 mb-2">
              {clusterLabel(cs.cluster)}
            </div>
            <h3 className="text-base font-bold leading-snug tracking-tight text-charcoal group-hover:text-sage transition-colors flex-1 mb-3">
              {cs.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <Pill
                variant="mist"
                size="sm"
                icon={<Clock className="w-3 h-3" strokeWidth={1.75} />}
              >
                {tierLabel(cs.duration)} · {cs.estimatedMinutes} min
              </Pill>
            </div>
            {cs.skillsTested.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {cs.skillsTested.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-pale-sage px-2 py-0.5 text-[10px] font-semibold text-sage-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </StudentShell>
  );
}
