import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES, type CaseStudy } from "@/lib/questionnaire/case-studies";
import { Pill } from "@/components/ui/Pill";
import { StudentShell } from "@/components/StudentSidebar";

const TIER_OPTIONS: { value: "all" | "taster" | "mid-form" | "deep-dive"; label: string; minutes: string }[] = [
  { value: "all", label: "All", minutes: "any length" },
  { value: "taster", label: "Taster", minutes: "10–25 min" },
  { value: "mid-form", label: "Mid-form", minutes: "40–60 min" },
  { value: "deep-dive", label: "Deep dive", minutes: "3–4 hr" },
];

const TIER_TO_DURATION: Record<"taster" | "mid-form" | "deep-dive", CaseStudy["duration"]> = {
  taster: "short",
  "mid-form": "medium",
  "deep-dive": "long",
};

function tierLabel(d: CaseStudy["duration"]): string {
  return d === "short" ? "Taster" : d === "long" ? "Deep dive" : "Mid-form";
}

function clusterLabel(cluster: string): string {
  return cluster
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function CaseStudiesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tier?: string; cluster?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const q = (params.q ?? "").trim().toLowerCase();
  const tier =
    params.tier === "taster" || params.tier === "mid-form" || params.tier === "deep-dive"
      ? params.tier
      : null;
  const cluster = params.cluster ?? null;

  // Distinct clusters for the chip nav.
  const clusters = Array.from(new Set(CASE_STUDIES.map((c) => c.cluster))).sort();

  const filtered = CASE_STUDIES.filter((cs) => {
    if (cluster && cs.cluster !== cluster) return false;
    if (tier && cs.duration !== TIER_TO_DURATION[tier]) return false;
    if (q) {
      const blob = `${cs.title} ${cs.companyName ?? ""} ${cs.skillsTested.join(" ")} ${cs.cluster}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });

  const buildHref = (next: { q?: string | null; tier?: string | null; cluster?: string | null }) => {
    const sp = new URLSearchParams();
    const merged = {
      q: next.q !== undefined ? next.q : q || null,
      tier: next.tier !== undefined ? next.tier : tier,
      cluster: next.cluster !== undefined ? next.cluster : cluster,
    };
    if (merged.q) sp.set("q", merged.q);
    if (merged.tier) sp.set("tier", merged.tier);
    if (merged.cluster) sp.set("cluster", merged.cluster);
    const qs = sp.toString();
    return qs ? `/case-studies?${qs}` : "/case-studies";
  };

  return (
    <StudentShell active="challenges">
      <div className="max-w-6xl mx-auto">
        <header className="mb-7">
          <div className="eyebrow mb-2">Library</div>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
            Browse all case studies
          </h1>
          <p className="mt-2 text-charcoal-2 max-w-xl">
            {CASE_STUDIES.length} cases across {clusters.length} clusters. Filter by length, cluster, or search a skill.
          </p>
        </header>

        {/* Search */}
        <form action="/case-studies" method="get" className="mb-5 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search title, company, or skill…"
            className="flex-1 rounded-[12px] border border-sage-mist-2 bg-chalk px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal-3 focus:outline-none focus:ring-2 focus:ring-sage shadow-1"
          />
          {tier && <input type="hidden" name="tier" value={tier} />}
          {cluster && <input type="hidden" name="cluster" value={cluster} />}
          <button
            type="submit"
            className="focus-ring rounded-[12px] bg-sage px-5 py-2.5 text-sm font-semibold text-chalk shadow-1 hover:bg-sage-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Tier filter */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-2 mr-1">
            Length:
          </span>
          {TIER_OPTIONS.map((opt) => {
            const isActive = opt.value === "all" ? !tier : tier === opt.value;
            const href = buildHref({ tier: opt.value === "all" ? null : opt.value });
            return (
              <Link
                key={opt.value}
                href={href}
                className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "border-sage bg-sage text-chalk shadow-1"
                    : "border-sage-mist-2 bg-chalk text-charcoal-2 hover:border-sage hover:text-charcoal"
                }`}
              >
                {opt.label}{" "}
                <span className={`font-normal ${isActive ? "text-pale-sage" : "text-charcoal-3"}`}>
                  · {opt.minutes}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Cluster filter */}
        <div className="mb-7 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-2 mr-1">
            Cluster:
          </span>
          <Link
            href={buildHref({ cluster: null })}
            className={`focus-ring rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              !cluster
                ? "border-sage bg-pale-sage text-sage-700"
                : "border-sage-mist-2 bg-chalk text-charcoal-2 hover:border-sage"
            }`}
          >
            All
          </Link>
          {clusters.map((c) => (
            <Link
              key={c}
              href={buildHref({ cluster: c })}
              className={`focus-ring rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                cluster === c
                  ? "border-sage bg-pale-sage text-sage-700"
                  : "border-sage-mist-2 bg-chalk text-charcoal-2 hover:border-sage"
              }`}
            >
              {clusterLabel(c)}
            </Link>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-10 text-center shadow-1">
            <h3 className="font-bold text-charcoal mb-2">No matches.</h3>
            <p className="text-sm text-charcoal-2">
              Broaden your filters or try a different search term.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-charcoal-3 mb-4">
              {filtered.length} {filtered.length === 1 ? "case" : "cases"}
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.id}`}
                  className="focus-ring group rounded-[16px] border border-sage-mist-2 bg-chalk p-5 shadow-1 transition-all hover:-translate-y-0.5 hover:shadow-2 flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-pale-sage shadow-1">
                      <Image
                        src={cs.logoUrl}
                        alt={`${cs.companyName ?? "Company"} logo`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </span>
                    <div className="min-w-0">
                      {cs.companyName && (
                        <div className="text-[11px] font-semibold text-charcoal-2 truncate">
                          {cs.companyName}
                        </div>
                      )}
                      <div className="text-[10px] uppercase tracking-[0.14em] text-charcoal-3">
                        {clusterLabel(cs.cluster)}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold leading-snug tracking-tight text-charcoal group-hover:text-sage transition-colors min-h-[60px]">
                    {cs.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Pill variant="mist" size="sm" icon={<Clock className="w-3 h-3" strokeWidth={1.75} />}>
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
          </>
        )}
      </div>
    </StudentShell>
  );
}
