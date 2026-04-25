import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES, type CaseStudy } from "@/lib/questionnaire/case-studies";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";

interface CompanyEntry {
  name: string;
  logoUrl: string;
  cases: CaseStudy[];
}

function groupByCompany(): CompanyEntry[] {
  const map = new Map<string, CompanyEntry>();
  for (const cs of CASE_STUDIES) {
    const name = cs.companyName ?? "Unknown company";
    const existing = map.get(name);
    if (existing) {
      existing.cases.push(cs);
    } else {
      map.set(name, {
        name,
        logoUrl: cs.logoUrl,
        cases: [cs],
      });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default async function CompaniesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companies = groupByCompany();

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center">
            <Logo height={28} priority />
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
          >
            &larr; Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <div className="eyebrow mb-2">Hosting companies</div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">
            Companies on Apto
          </h1>
          <p className="text-charcoal-2 mt-1">
            {companies.length} companies host {CASE_STUDIES.length} case studies in total.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => {
            const firstCase = company.cases[0];
            return (
              <Link
                key={company.name}
                href={`/case-studies/${firstCase.id}`}
                className="group block rounded-[14px] bg-chalk shadow-1 hover:shadow-2 transition-shadow p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-pale-sage shadow-1">
                    <Image
                      src={company.logoUrl}
                      alt={`${company.name} logo`}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-charcoal tracking-tight group-hover:text-sage transition-colors leading-snug">
                      {company.name}
                    </h2>
                    <div className="text-xs text-charcoal-2 mt-1">
                      {company.cases.length} case stud{company.cases.length === 1 ? "y" : "ies"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {company.cases.slice(0, 2).map((cs) => (
                    <Pill key={cs.id} variant="mist" size="sm">
                      <span className="capitalize">{cs.cluster.replace(/_/g, " ")}</span>
                    </Pill>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
