"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { Button, ButtonLink } from "@/components/ui/Button";

interface SubmissionRow {
  id: string;
  user_id: string;
  answer: string | null;
  score: number | null;
  status: string;
  submitted_at: string | null;
  integrity_signals: Record<string, number> | null;
  cv_snapshot_url: string | null;
  case_study: { id: string; title: string } | null;
  users: { name: string | null; email: string; avatar_url: string | null } | null;
}

export default function CompanyPortalPage() {
  const supabase = createClient();
  const router = useRouter();

  const [company, setCompany] = useState<Record<string, unknown> | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const [minScore, setMinScore] = useState(0);
  const [hasCV, setHasCV] = useState(false);
  const [topOnly, setTopOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "date">("score");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: comp } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!comp) { setLoading(false); return; }
      setCompany(comp);

      const { data: caseStudies } = await supabase
        .from("case_studies")
        .select("id")
        .eq("company_id", comp.id);

      const csIds = (caseStudies || []).map((cs: Record<string, unknown>) => cs.id as string);

      if (csIds.length > 0) {
        const { data: subs } = await supabase
          .from("submissions")
          .select("*, case_study:case_studies(id, title), users(*)")
          .in("case_study_id", csIds)
          .in("status", ["scored", "submitted", "reviewed"])
          .order("score", { ascending: false, nullsFirst: false });

        setSubmissions((subs || []) as SubmissionRow[]);
      }

      const { data: invs } = await supabase
        .from("invitations")
        .select("submission_id")
        .eq("company_id", comp.id);

      setInvitedIds(new Set((invs || []).map((i: Record<string, unknown>) => i.submission_id as string)));
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function sendInvite(sub: SubmissionRow) {
    if (!company) return;
    await supabase.from("invitations").insert({
      submission_id: sub.id,
      user_id: sub.user_id,
      company_id: company.id as string,
      status: "pending",
      message: "We were impressed by your case study submission and would like to invite you for an interview!",
    });
    await supabase.from("submissions").update({ status: "reviewed" }).eq("id", sub.id);
    setInvitedIds((prev) => new Set([...prev, sub.id]));
  }

  const filtered = submissions
    .filter((s) => (s.score || 0) >= minScore)
    .filter((s) => !hasCV || !!s.cv_snapshot_url)
    .filter((s) => {
      if (!topOnly || submissions.length === 0) return true;
      const threshold = Math.max(...submissions.map((x) => x.score || 0)) * 0.9;
      return (s.score || 0) >= threshold;
    })
    .sort((a, b) => {
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      return new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime();
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-pale-sage flex items-center justify-center">
        <div className="text-charcoal-2">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <div className="flex items-center gap-3">
            <Pill variant="coral" size="sm">Company</Pill>
            <span className="text-sm text-charcoal-2">{company?.name as string}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="eyebrow mb-2">Hiring portal</div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">Candidate submissions</h1>
          <p className="text-charcoal-2 mt-1">Review and invite top performers.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-chalk rounded-[14px] shadow-1 p-5">
            <div className="text-3xl font-bold text-charcoal stat-num">{submissions.length}</div>
            <div className="eyebrow mt-1">Total submissions</div>
          </div>
          <div className="bg-chalk rounded-[14px] shadow-1 p-5">
            <div className="text-3xl font-bold text-charcoal stat-num">
              {submissions.filter((s) => (s.score || 0) >= 80).length}
            </div>
            <div className="eyebrow mt-1">Score 80+</div>
          </div>
          <div className="bg-chalk rounded-[14px] shadow-1 p-5">
            <div className="text-3xl font-bold text-charcoal stat-num">
              {submissions.filter((s) => s.cv_snapshot_url).length}
            </div>
            <div className="eyebrow mt-1">With CV</div>
          </div>
          <div className="bg-chalk rounded-[14px] shadow-1 p-5">
            <div className="text-3xl font-bold text-sage stat-num">{invitedIds.size}</div>
            <div className="eyebrow mt-1">Invites sent</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-chalk rounded-[14px] shadow-1 p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-charcoal-2 font-medium">Min score:</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="text-sm border border-sage-mist-2 rounded-lg px-3 py-1.5 bg-chalk text-charcoal focus:outline-none focus:border-sage"
            >
              <option value={0}>Any</option>
              <option value={60}>60+</option>
              <option value={70}>70+</option>
              <option value={80}>80+</option>
              <option value={90}>90+</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={hasCV}
              onChange={(e) => setHasCV(e.target.checked)}
              className="rounded border-sage-mist-2 text-sage focus:ring-sage"
            />
            Has CV
          </label>

          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={topOnly}
              onChange={(e) => setTopOnly(e.target.checked)}
              className="rounded border-sage-mist-2 text-sage focus:ring-sage"
            />
            Top 10% only
          </label>

          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-charcoal-2 font-medium">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "date")}
              className="text-sm border border-sage-mist-2 rounded-lg px-3 py-1.5 bg-chalk text-charcoal focus:outline-none focus:border-sage"
            >
              <option value="score">By score</option>
              <option value="date">By date</option>
            </select>
          </div>

          <span className="text-xs text-charcoal-3">
            Showing {filtered.length} of {submissions.length}
          </span>
        </div>

        {/* Submissions table */}
        {filtered.length === 0 ? (
          <div className="bg-chalk rounded-[14px] shadow-1 p-12 text-center">
            <h3 className="font-semibold text-charcoal mb-2">No matching submissions</h3>
            <p className="text-charcoal-2 text-sm">Try adjusting your filters, or check back later.</p>
          </div>
        ) : (
          <div className="bg-chalk rounded-[14px] shadow-1 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sage-mist-2 bg-chalk-2">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Candidate</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Case study</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Score</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Integrity</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">CV</th>
                  <th className="text-right px-6 py-3 text-[11px] font-semibold text-charcoal-2 uppercase tracking-[0.14em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-mist-2">
                {filtered.map((sub) => {
                  const integrity = sub.integrity_signals;
                  const invited = invitedIds.has(sub.id);
                  const score = sub.score || 0;

                  return (
                    <tr key={sub.id} className="hover:bg-pale-sage transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-charcoal text-sm">
                          {sub.users?.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-charcoal-2">{sub.users?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal-2">
                        {sub.case_study?.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold stat-num ${
                          score >= 80 ? "text-sage" : score >= 60 ? "text-charcoal-2" : "text-coral-700"
                        }`}>
                          {sub.score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {integrity && (integrity.tab_switches > 0 || integrity.paste_count > 0) ? (
                            <>
                              {integrity.tab_switches > 0 && (
                                <Pill variant="coral" size="sm">
                                  {integrity.tab_switches} tabs
                                </Pill>
                              )}
                              {integrity.paste_count > 0 && (
                                <Pill variant="coral" size="sm">
                                  {integrity.paste_count} pastes
                                </Pill>
                              )}
                            </>
                          ) : (
                            <Pill variant="sage" size="sm">Clean</Pill>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {sub.cv_snapshot_url ? (
                          <Pill variant="mist" size="sm">Attached</Pill>
                        ) : (
                          <span className="text-xs text-charcoal-3">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ButtonLink
                            href={`/portal/candidates/${sub.id}`}
                            variant="ghost"
                            size="sm"
                          >
                            View
                          </ButtonLink>
                          {invited ? (
                            <Pill variant="sage" size="sm">Invited</Pill>
                          ) : (
                            <Button
                              onClick={() => sendInvite(sub)}
                              variant="primary"
                              size="sm"
                            >
                              Send invite
                            </Button>
                          )}
                        </div>
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
