import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { Pill } from "@/components/ui/Pill";
import { StudentShell } from "@/components/StudentSidebar";

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim().toLowerCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const allChallenges = [...CASE_STUDIES].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const challenges = q
    ? allChallenges.filter((cs) => {
        const blob = `${cs.companyName ?? ""} ${cs.matchesRoles.join(" ")} ${cs.title} ${cs.skillsTested.join(" ")}`.toLowerCase();
        return blob.includes(q);
      })
    : allChallenges;

  return (
    <StudentShell active="challenges">
      <header className="mb-6">
        <div className="eyebrow mb-2">All challenges</div>
        <h1 className="text-3xl font-bold text-charcoal tracking-tight">
          Browse every case study
        </h1>
        <p className="text-charcoal-2 mt-1">
          {allChallenges.length} real-world challenges from{" "}
          {new Set(allChallenges.map((c) => c.companyName)).size} companies.
        </p>
      </header>

      {/* Search */}
      <form action="/challenges" method="get" className="mb-7 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-3 pointer-events-none" />
          <input
            type="text"
            name="q"
            defaultValue={rawQ ?? ""}
            placeholder="Search by company or role…"
            className="w-full rounded-[12px] border border-sage-mist-2 bg-chalk pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal-3 focus:outline-none focus:ring-2 focus:ring-sage shadow-1"
          />
        </div>
        <button
          type="submit"
          className="focus-ring rounded-[12px] bg-sage px-5 py-2.5 text-sm font-semibold text-chalk shadow-1 hover:bg-sage-700 transition-colors"
        >
          Search
        </button>
      </form>

      {challenges.length === 0 ? (
        <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-10 text-center shadow-1">
          <h3 className="font-bold text-charcoal mb-2">No matches.</h3>
          <p className="text-sm text-charcoal-2">
            Try a different company name or role.
          </p>
        </div>
      ) : (
        <>
          {q && (
            <p className="text-xs text-charcoal-3 mb-4">
              {challenges.length} {challenges.length === 1 ? "result" : "results"} for &ldquo;{rawQ}&rdquo;
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((cs) => (
              <Link
                key={cs.id}
                href={`/case-studies/${cs.id}`}
                className="group block rounded-[14px] bg-chalk shadow-1 hover:shadow-2 transition-shadow p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-pale-sage shadow-1">
                    <Image
                      src={cs.logoUrl}
                      alt={`${cs.companyName ?? "Company"} logo`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="eyebrow truncate">{cs.companyName ?? "Company"}</div>
                    <h2 className="font-bold text-charcoal tracking-tight group-hover:text-sage transition-colors leading-snug">
                      {cs.title}
                    </h2>
                  </div>
                </div>

                {/* Roles */}
                {cs.matchesRoles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {cs.matchesRoles.slice(0, 2).map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-pale-sage px-2 py-0.5 text-[10px] font-semibold text-sage-700"
                      >
                        {role}
                      </span>
                    ))}
                    {cs.matchesRoles.length > 2 && (
                      <span className="rounded-full bg-pale-sage px-2 py-0.5 text-[10px] font-semibold text-charcoal-3">
                        +{cs.matchesRoles.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  <Pill variant="mist" size="sm" icon={<Clock className="w-3 h-3" strokeWidth={1.75} />}>
                    {cs.estimatedMinutes} min
                  </Pill>
                  <Pill variant="mist" size="sm">
                    <span className="capitalize">{cs.cluster.replace(/_/g, " ")}</span>
                  </Pill>
                  <Pill variant="sage" size="sm">
                    <span className="capitalize">{cs.duration}</span>
                  </Pill>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </StudentShell>
  );
}
