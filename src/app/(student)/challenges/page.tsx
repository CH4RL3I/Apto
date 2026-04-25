import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { Pill } from "@/components/ui/Pill";
import { StudentShell } from "@/components/StudentSidebar";

export default async function ChallengesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const challenges = [...CASE_STUDIES].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return (
    <StudentShell active="challenges">
      <header className="mb-8">
        <div className="eyebrow mb-2">All challenges</div>
        <h1 className="text-3xl font-bold text-charcoal tracking-tight">
          Browse every case study
        </h1>
        <p className="text-charcoal-2 mt-1">
          {challenges.length} real-world challenges from {new Set(challenges.map((c) => c.companyName)).size} companies.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((cs) => (
          <Link
            key={cs.id}
            href={`/case-studies/${cs.id}`}
            className="group block rounded-[14px] bg-chalk shadow-1 hover:shadow-2 transition-shadow p-5"
          >
            <div className="flex items-start gap-3 mb-4">
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
    </StudentShell>
  );
}
