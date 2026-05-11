import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";

interface RecentSub {
  id: string;
  case_study_id: string;
  score: number | null;
  status: string;
  submitted_at: string | null;
  is_multi_task: boolean | null;
  task_scores: { overall?: number } | null;
  users: { name: string | null; email: string } | null;
}

const TOP_THRESHOLD_MULTI = 80;
const TOP_THRESHOLD_SINGLE = 8.5;

function effectiveScore(sub: RecentSub): number {
  if (sub.is_multi_task && typeof sub.task_scores?.overall === "number") {
    return sub.task_scores.overall;
  }
  return typeof sub.score === "number" ? sub.score : 0;
}

function isTopTen(sub: RecentSub): boolean {
  if (sub.is_multi_task) {
    const overall = sub.task_scores?.overall;
    return typeof overall === "number" && overall >= TOP_THRESHOLD_MULTI;
  }
  return typeof sub.score === "number" && sub.score >= TOP_THRESHOLD_SINGLE * 10;
}

export default async function CompanyPortalLandingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("users")
    .select("role, roles, name")
    .eq("id", user.id)
    .single();

  // Multi-role: render portal if the user has 'company' in their roles array
  // (falling back to the legacy role column). A student-only user gets
  // bounced to /dashboard; a user with neither role goes to /login.
  const roles: string[] = Array.isArray((userRow as { roles?: unknown })?.roles)
    ? ((userRow as { roles: string[] }).roles)
    : userRow?.role
      ? [userRow.role as string]
      : [];
  if (!roles.includes("company")) {
    if (roles.includes("student")) redirect("/dashboard");
    redirect("/login");
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (!company) redirect("/dashboard");

  const isAdmin = (company as { is_admin?: boolean }).is_admin === true;

  const baseCs = supabase.from("case_studies").select("id, title");
  const { data: caseStudies } = await (
    isAdmin ? baseCs : baseCs.eq("company_id", company.id)
  );
  const csTitles = new Map(
    (caseStudies || []).map((c: { id: string; title: string }) => [c.id, c.title]),
  );
  const csIds = [...csTitles.keys()];

  let allSubs: RecentSub[] = [];
  if (csIds.length > 0) {
    const { data: subs } = await supabase
      .from("submissions")
      .select(
        "id, case_study_id, score, status, submitted_at, is_multi_task, task_scores, users(*)",
      )
      .in("case_study_id", csIds)
      .in("status", ["scored", "submitted", "reviewed", "shortlisted"]);
    allSubs = (subs || []) as unknown as RecentSub[];
  }

  const total = allSubs.length;
  const topCount = allSubs.filter(isTopTen).length;

  const { data: invs } = await supabase
    .from("invitations")
    .select("status")
    .eq("company_id", company.id);
  const pendingInvites = (invs || []).filter(
    (i: { status: string }) => i.status === "pending",
  ).length;

  const recent = [...allSubs]
    .sort(
      (a, b) =>
        new Date(b.submitted_at || 0).getTime() -
        new Date(a.submitted_at || 0).getTime(),
    )
    .slice(0, 10);

  const greeting = userRow?.name
    ? `Welcome back, ${(userRow.name as string).split(" ")[0]}`
    : "Welcome back";

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center">
            <Logo height={28} priority />
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/portal/submissions"
              className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
            >
              Submissions
            </Link>
            <Link
              href="/portal/case-studies"
              className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
            >
              Case studies
            </Link>
            <Pill variant="coral" size="sm">Company</Pill>
            <span className="text-sm text-charcoal-2">{company.name}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-start gap-4">
          {typeof company.logo_url === "string" && company.logo_url && (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-chalk shadow-1">
              <Image
                src={company.logo_url}
                alt={`${company.name} logo`}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}
          <div>
            <div className="eyebrow mb-2">Hiring portal</div>
            <h1 className="text-3xl font-bold text-charcoal tracking-tight">
              {greeting} — {company.name}
            </h1>
            <p className="text-charcoal-2 mt-1">
              See who completed your case studies and invite top performers to interview.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-chalk rounded-[14px] shadow-1 p-5">
            <div className="text-3xl font-bold text-charcoal stat-num">{total}</div>
            <div className="eyebrow mt-1">Total submissions</div>
          </div>
          <Link
            href="/portal/submissions?tab=top"
            className="bg-chalk rounded-[14px] shadow-1 p-5 hover:bg-pale-sage transition-colors"
          >
            <div className="text-3xl font-bold text-sage stat-num">{topCount}</div>
            <div className="eyebrow mt-1">Top 10% submissions</div>
          </Link>
          <Link
            href="/portal/submissions?tab=pending"
            className="bg-chalk rounded-[14px] shadow-1 p-5 hover:bg-pale-sage transition-colors"
          >
            <div className="text-3xl font-bold text-coral stat-num">{pendingInvites}</div>
            <div className="eyebrow mt-1">Pending invitations</div>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-charcoal">Recent submissions</h2>
          {total > 0 && (
            <ButtonLink href="/portal/submissions" variant="ghost" size="sm">
              View all
            </ButtonLink>
          )}
        </div>

        {total === 0 ? (
          <div className="bg-chalk rounded-[14px] shadow-1 p-12 text-center">
            <h3 className="font-semibold text-charcoal mb-2">No submissions yet</h3>
            <p className="text-charcoal-2 text-sm">
              No one has submitted to your case studies yet. Share{" "}
              <code className="text-xs bg-pale-sage px-1.5 py-0.5 rounded">
                /companies/&lt;your-slug&gt;
              </code>{" "}
              to invite candidates.
            </p>
          </div>
        ) : recent.length === 0 ? (
          <div className="bg-chalk rounded-[14px] shadow-1 p-12 text-center">
            <p className="text-sm text-charcoal-2">No recent submissions.</p>
          </div>
        ) : (
          <div className="bg-chalk rounded-[14px] shadow-1 overflow-hidden">
            <ul className="divide-y divide-sage-mist-2">
              {recent.map((sub) => {
                const score = effectiveScore(sub);
                return (
                  <li key={sub.id}>
                    <Link
                      href={`/portal/submissions/${sub.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-pale-sage transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-charcoal text-sm">
                          {sub.users?.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-charcoal-2">
                          {csTitles.get(sub.case_study_id) ?? "Case study"} •{" "}
                          {sub.submitted_at
                            ? new Date(sub.submitted_at).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold stat-num ${
                          score >= 80
                            ? "text-sage"
                            : score >= 60
                            ? "text-charcoal-2"
                            : "text-coral-700"
                        }`}
                      >
                        {Math.round(score)}/100
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
