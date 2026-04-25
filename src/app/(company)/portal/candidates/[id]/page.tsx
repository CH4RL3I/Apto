import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get the submission with all related data
  const { data: submission } = await supabase
    .from("submissions")
    .select("*, case_study:case_studies(*, career:careers(*)), users(*)")
    .eq("id", id)
    .single();

  if (!submission) redirect("/portal");

  const sub = submission as Record<string, unknown>;
  const studentUser = sub.users as Record<string, unknown> | null;
  const cs = sub.case_study as Record<string, unknown> | null;
  const career = cs?.career as Record<string, unknown> | null;
  const integrity = sub.integrity_signals as Record<string, number> | null;
  const scoreBreakdown = sub.score_breakdown as Record<string, number> | null;

  // Get student profile for CV data
  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_parsed, cv_skills, cv_url")
    .eq("user_id", sub.user_id as string)
    .single();

  const cvParsed = profile?.cv_parsed as Record<string, unknown> | null;
  const cvSkills = (profile?.cv_skills as string[]) || [];

  // Check if already invited
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: existingInvite } = await supabase
    .from("invitations")
    .select("id")
    .eq("submission_id", id)
    .eq("company_id", company?.id)
    .single();

  const invited = !!existingInvite;

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <Link href="/portal" className="text-sm text-muted hover:text-slate-900">&larr; Back to submissions</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {(studentUser?.name as string) || "Anonymous Candidate"}
            </h1>
            <p className="text-muted mt-1">{studentUser?.email as string}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                {cs?.title as string}
              </span>
              {career && (
                <span className="text-sm px-3 py-1 rounded-full text-white" style={{ backgroundColor: career.color as string }}>
                  {career.title as string}
                </span>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
              (sub.score as number) >= 80 ? "bg-green-500" : (sub.score as number) >= 60 ? "bg-yellow-500" : "bg-red-500"
            }`}>
              {sub.score as number}
            </div>
            <div className="text-xs text-muted mt-1.5">Overall Score</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content - solution */}
          <div className="md:col-span-2 space-y-6">
            {/* Score breakdown */}
            {scoreBreakdown && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Score Breakdown</h2>
                <div className="space-y-3">
                  {Object.entries(scoreBreakdown).map(([criterion, value]) => (
                    <div key={criterion}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">{criterion}</span>
                        <span className="font-semibold text-slate-900">{value}/100</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className={`h-full rounded-full ${value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solution */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Submission</h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {(sub.answer as string) || "No answer provided."}
              </div>
            </div>

            {/* Integrity report */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Integrity Report</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-slate-50">
                  <div className={`text-2xl font-bold ${integrity?.tab_switches ? "text-amber-600" : "text-green-600"}`}>
                    {integrity?.tab_switches || 0}
                  </div>
                  <div className="text-xs text-muted mt-1">Tab Switches</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-50">
                  <div className={`text-2xl font-bold ${integrity?.paste_count ? "text-amber-600" : "text-green-600"}`}>
                    {integrity?.paste_count || 0}
                  </div>
                  <div className="text-xs text-muted mt-1">Paste Events</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-50">
                  <div className={`text-2xl font-bold ${integrity?.fullscreen_exits ? "text-amber-600" : "text-green-600"}`}>
                    {integrity?.fullscreen_exits || 0}
                  </div>
                  <div className="text-xs text-muted mt-1">Fullscreen Exits</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-50">
                  <div className="text-2xl font-bold text-slate-900">
                    {integrity?.time_spent_seconds ? `${Math.round(integrity.time_spent_seconds / 60)}m` : "N/A"}
                  </div>
                  <div className="text-xs text-muted mt-1">Time Spent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - candidate info */}
          <div className="space-y-6">
            {/* Invite action */}
            <div className="bg-white rounded-xl border border-border p-5">
              {invited ? (
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-medium text-green-700 text-sm">Interview invite sent</p>
                </div>
              ) : (
                <Link
                  href={`/portal/invite?submission=${sub.id}&user=${sub.user_id}&company=${company?.id}`}
                  className="block w-full text-center bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors text-sm"
                >
                  Send Interview Invite
                </Link>
              )}
            </div>

            {/* CV */}
            {cvParsed && Object.keys(cvParsed).length > 0 ? (
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  CV Summary
                </h3>
                {typeof cvParsed.education === "string" && cvParsed.education && (
                  <div className="mb-3">
                    <div className="text-xs text-muted mb-1">Education</div>
                    <div className="text-sm text-slate-900">{cvParsed.education}</div>
                  </div>
                )}
                {Array.isArray(cvParsed.experience) && cvParsed.experience.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-muted mb-1">Experience</div>
                    <ul className="space-y-1">
                      {(cvParsed.experience as string[]).map((exp, i) => (
                        <li key={i} className="text-sm text-slate-700">{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border p-5 text-center">
                <p className="text-sm text-muted">No CV uploaded</p>
              </div>
            )}

            {/* Skills */}
            {cvSkills.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cvSkills.map((skill, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Submission meta */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Status</span>
                  <span className="font-medium text-slate-900 capitalize">{(sub.status as string).replace("_", " ")}</span>
                </div>
                {typeof sub.submitted_at === "string" && (
                  <div className="flex justify-between">
                    <span className="text-muted">Submitted</span>
                    <span className="text-slate-900">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                  </div>
                )}
                {typeof sub.cv_snapshot_url === "string" && sub.cv_snapshot_url && (
                  <div className="flex justify-between">
                    <span className="text-muted">CV</span>
                    <span className="text-blue-600">Attached</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
