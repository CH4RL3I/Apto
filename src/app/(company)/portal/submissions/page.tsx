import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import {
  integrityVerdict,
  INTEGRITY_LABEL,
  type IntegritySignals,
} from "@/lib/integrity";

type Tab = "all" | "top" | "pending";
type SortKey = "score" | "date" | "name";

interface SearchParams {
  tab?: string;
  caseStudy?: string;
  minScore?: string;
  hasCv?: string;
  topOnly?: string;
  sort?: string;
}

const TOP_THRESHOLD_MULTI = 80;
const TOP_THRESHOLD_SINGLE = 8.5;

interface SubmissionRow {
  id: string;
  user_id: string;
  case_study_id: string;
  score: number | null;
  status: string;
  submitted_at: string | null;
  is_multi_task: boolean | null;
  task_scores: { overall?: number } | null;
  cv_snapshot_url: string | null;
  integrity_signals: IntegritySignals | null;
  users: { name: string | null; email: string } | null;
}

function effectiveScore(sub: SubmissionRow): number {
  if (sub.is_multi_task && typeof sub.task_scores?.overall === "number") {
    return sub.task_scores.overall;
  }
  return typeof sub.score === "number" ? sub.score : 0;
}

function isTopTen(sub: SubmissionRow): boolean {
  if (sub.is_multi_task) {
    const overall = sub.task_scores?.overall;
    return typeof overall === "number" && overall >= TOP_THRESHOLD_MULTI;
  }
  return typeof sub.score === "number" && sub.score >= TOP_THRESHOLD_SINGLE * 10;
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (userRow?.role !== "company") redirect("/dashboard");

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
  const caseStudyTitles = new Map(
    (caseStudies || []).map((cs: { id: string; title: string }) => [
      cs.id,
      cs.title,
    ]),
  );
  const csIds = [...caseStudyTitles.keys()];

  let submissions: SubmissionRow[] = [];
  if (csIds.length > 0) {
    const { data: subs } = await supabase
      .from("submissions")
      .select(
        "id, user_id, case_study_id, score, status, submitted_at, is_multi_task, task_scores, cv_snapshot_url, integrity_signals, users(*)",
      )
      .in("case_study_id", csIds)
      .in("status", ["scored", "submitted", "reviewed", "shortlisted", "rejected"]);
    submissions = (subs || []) as unknown as SubmissionRow[];
  }

  const { data: invs } = await supabase
    .from("invitations")
    .select("submission_id, status")
    .eq("company_id", company.id);
  const invitedIds = new Set(
    (invs || []).map((i: { submission_id: string }) => i.submission_id),
  );
  const pendingInviteCount = (invs || []).filter(
    (i: { status: string }) => i.status === "pending",
  ).length;

  const tab: Tab =
    params.tab === "top" || params.tab === "pending" ? params.tab : "all";
  const caseStudyFilter = params.caseStudy ?? "all";
  const minScore = Number(params.minScore ?? 0);
  const hasCv = params.hasCv === "1";
  const topOnly = params.topOnly === "1";
  const sort: SortKey =
    params.sort === "date" || params.sort === "name" ? params.sort : "score";

  const filtered = submissions
    .filter((s) => {
      if (tab === "top") return isTopTen(s);
      if (tab === "pending") return invitedIds.has(s.id);
      return s.status !== "rejected";
    })
    .filter((s) => caseStudyFilter === "all" || s.case_study_id === caseStudyFilter)
    .filter((s) => effectiveScore(s) >= minScore)
    .filter((s) => !hasCv || !!s.cv_snapshot_url)
    .filter((s) => !topOnly || isTopTen(s))
    .sort((a, b) => {
      if (sort === "date") {
        return (
          new Date(b.submitted_at || 0).getTime() -
          new Date(a.submitted_at || 0).getTime()
        );
      }
      if (sort === "name") {
        return (a.users?.name ?? "").localeCompare(b.users?.name ?? "");
      }
      return effectiveScore(b) - effectiveScore(a);
    });

  function tabHref(next: Tab) {
    const sp = new URLSearchParams();
    if (next !== "all") sp.set("tab", next);
    if (caseStudyFilter !== "all") sp.set("caseStudy", caseStudyFilter);
    if (minScore) sp.set("minScore", String(minScore));
    if (hasCv) sp.set("hasCv", "1");
    if (topOnly) sp.set("topOnly", "1");
    if (sort !== "score") sp.set("sort", sort);
    const q = sp.toString();
    return q ? `/portal/submissions?${q}` : "/portal/submissions";
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: submissions.filter((s) => s.status !== "rejected").length },
    { key: "top", label: "Top 10%", count: submissions.filter(isTopTen).length },
    { key: "pending", label: "Pending invitations", count: pendingInviteCount },
  ];

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center">
            <Logo height={28} priority />
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/portal"
              className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
            >
              Overview
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
        <div className="mb-6">
          <div className="eyebrow mb-2">Submissions</div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">
            All candidate submissions
          </h1>
          <p className="text-charcoal-2 mt-1">
            Filter, sort, and review every candidate that completed your case studies.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={tabHref(t.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                tab === t.key
                  ? "bg-sage text-chalk"
                  : "bg-chalk text-charcoal-2 border border-sage-mist-2 hover:bg-pale-sage"
              }`}
            >
              {t.label}
              <span className="ml-1 opacity-70">({t.count})</span>
            </Link>
          ))}
        </div>

        {/* Filters (server-side: GET form) */}
        <form
          method="get"
          action="/portal/submissions"
          className="bg-chalk rounded-[14px] shadow-1 p-4 mb-6 flex flex-wrap items-center gap-4"
        >
          {tab !== "all" && <input type="hidden" name="tab" value={tab} />}

          <div className="flex items-center gap-2">
            <label className="text-sm text-charcoal-2 font-medium" htmlFor="caseStudy">
              Case study:
            </label>
            <select
              id="caseStudy"
              name="caseStudy"
              defaultValue={caseStudyFilter}
              className="text-sm border border-sage-mist-2 rounded-lg px-3 py-1.5 bg-chalk text-charcoal focus:outline-none focus:border-sage"
            >
              <option value="all">All</option>
              {[...caseStudyTitles.entries()].map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-charcoal-2 font-medium" htmlFor="minScore">
              Min score:
            </label>
            <select
              id="minScore"
              name="minScore"
              defaultValue={String(minScore)}
              className="text-sm border border-sage-mist-2 rounded-lg px-3 py-1.5 bg-chalk text-charcoal focus:outline-none focus:border-sage"
            >
              <option value="0">Any</option>
              <option value="60">60+</option>
              <option value="70">70+</option>
              <option value="80">80+</option>
              <option value="90">90+</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              name="hasCv"
              value="1"
              defaultChecked={hasCv}
              className="rounded border-sage-mist-2 text-sage focus:ring-sage"
            />
            Has CV
          </label>

          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              name="topOnly"
              value="1"
              defaultChecked={topOnly}
              className="rounded border-sage-mist-2 text-sage focus:ring-sage"
            />
            Top 10% only
          </label>

          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-charcoal-2 font-medium" htmlFor="sort">
              Sort:
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="text-sm border border-sage-mist-2 rounded-lg px-3 py-1.5 bg-chalk text-charcoal focus:outline-none focus:border-sage"
            >
              <option value="score">Score (desc)</option>
              <option value="date">Date</option>
              <option value="name">Candidate name</option>
            </select>
          </div>

          <button
            type="submit"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sage text-chalk hover:bg-sage-700 transition-colors"
          >
            Apply
          </button>
        </form>

        {/* Table */}
        {submissions.length === 0 ? (
          <div className="bg-chalk rounded-[14px] shadow-1 p-12 text-center">
            <h3 className="font-semibold text-charcoal mb-2">No submissions yet</h3>
            <p className="text-charcoal-2 text-sm">
              No one has submitted to your case studies yet. Share your company page to invite candidates.
            </p>
          </div>
        ) : tab === "top" && filtered.length === 0 ? (
          <div className="bg-chalk rounded-[14px] shadow-1 p-12 text-center">
            <h3 className="font-semibold text-charcoal mb-2">No top-10% submissions yet</h3>
            <p className="text-charcoal-2 text-sm">
              No top-10% submissions yet — they need a multi-task overall ≥ 80 or single-task score ≥ 8.5.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-chalk rounded-[14px] shadow-1 p-12 text-center">
            <h3 className="font-semibold text-charcoal mb-2">No matching submissions</h3>
            <p className="text-charcoal-2 text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="bg-chalk rounded-[14px] shadow-1 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sage-mist-2 bg-chalk-2">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Candidate</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Case study</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Score</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Status</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Integrity</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-mist-2">
                {filtered.map((sub) => {
                  const score = effectiveScore(sub);
                  const integrity = sub.integrity_signals ?? null;
                  const verdict = integrityVerdict(integrity);
                  const variant =
                    verdict === "green"
                      ? "sage"
                      : verdict === "yellow"
                      ? "coral"
                      : "coralSolid";
                  const tabSwitches = integrity?.tab_switches ?? 0;
                  const pasteCount = integrity?.paste_count ?? 0;
                  const fsExits = integrity?.fullscreen_exits ?? 0;
                  const hasIntegrity = integrity !== null;

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-pale-sage transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/portal/submissions/${sub.id}`}
                          className="block"
                        >
                          <div className="font-semibold text-charcoal text-sm">
                            {sub.users?.name || "Anonymous"}
                          </div>
                          <div className="text-xs text-charcoal-2">
                            {sub.users?.email}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal-2">
                        {caseStudyTitles.get(sub.case_study_id) ?? "Case study"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-bold stat-num ${
                            score >= 80
                              ? "text-sage"
                              : score >= 60
                              ? "text-charcoal-2"
                              : "text-coral-700"
                          }`}
                        >
                          {sub.is_multi_task ? `${score}/100` : `${sub.score ?? "–"}/100`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Pill variant="mist" size="sm">
                          <span className="capitalize">
                            {sub.status.replace("_", " ")}
                          </span>
                        </Pill>
                      </td>
                      <td className="px-6 py-4">
                        {hasIntegrity ? (
                          <div className="flex items-center gap-1.5">
                            <Pill variant={variant} size="sm">
                              {INTEGRITY_LABEL[verdict]}
                            </Pill>
                            <span className="text-xs text-charcoal-3">
                              {tabSwitches}t / {pasteCount}p / {fsExits}f
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-charcoal-3">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-charcoal-2">
                        {sub.submitted_at
                          ? new Date(sub.submitted_at).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
