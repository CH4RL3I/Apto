"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

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

  // Filters
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

  // Apply filters and sort
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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">Company</span>
            <span className="text-sm text-muted">{company?.name as string}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Candidate Submissions</h1>
          <p className="text-muted mt-1">Review and invite top performers.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="text-2xl font-bold text-slate-900">{submissions.length}</div>
            <div className="text-sm text-muted">Total submissions</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="text-2xl font-bold text-slate-900">
              {submissions.filter((s) => (s.score || 0) >= 80).length}
            </div>
            <div className="text-sm text-muted">Score 80+</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="text-2xl font-bold text-slate-900">
              {submissions.filter((s) => s.cv_snapshot_url).length}
            </div>
            <div className="text-sm text-muted">With CV</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="text-2xl font-bold text-primary">{invitedIds.size}</div>
            <div className="text-sm text-muted">Invites sent</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted">Min score:</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white"
            >
              <option value={0}>Any</option>
              <option value={60}>60+</option>
              <option value={70}>70+</option>
              <option value={80}>80+</option>
              <option value={90}>90+</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={hasCV}
              onChange={(e) => setHasCV(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Has CV
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={topOnly}
              onChange={(e) => setTopOnly(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Top 10% only
          </label>

          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-muted">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "date")}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="score">By score</option>
              <option value="date">By date</option>
            </select>
          </div>

          <span className="text-xs text-muted">
            Showing {filtered.length} of {submissions.length}
          </span>
        </div>

        {/* Submissions table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <h3 className="font-semibold text-slate-900 mb-2">No matching submissions</h3>
            <p className="text-muted text-sm">Try adjusting your filters, or check back later.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Candidate</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Case Study</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Score</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Integrity</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">CV</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((sub) => {
                  const integrity = sub.integrity_signals;
                  const invited = invitedIds.has(sub.id);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 text-sm">
                          {sub.users?.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-muted">{sub.users?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {sub.case_study?.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${
                          (sub.score || 0) >= 80 ? "text-green-600" : (sub.score || 0) >= 60 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {sub.score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {integrity && (integrity.tab_switches > 0 || integrity.paste_count > 0) ? (
                            <>
                              {integrity.tab_switches > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                  {integrity.tab_switches} tabs
                                </span>
                              )}
                              {integrity.paste_count > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                  {integrity.paste_count} pastes
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Clean</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {sub.cv_snapshot_url ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Attached</span>
                        ) : (
                          <span className="text-xs text-muted">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/portal/candidates/${sub.id}`}
                            className="text-xs px-3 py-1.5 rounded-full border border-border text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                          >
                            View
                          </Link>
                          {invited ? (
                            <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                              Invited
                            </span>
                          ) : (
                            <button
                              onClick={() => sendInvite(sub)}
                              className="text-xs px-3 py-1.5 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                            >
                              Send Invite
                            </button>
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
