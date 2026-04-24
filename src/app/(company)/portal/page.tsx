import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CompanyPortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get company for this user
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get case studies for this company
  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("*")
    .eq("company_id", company?.id);

  const caseStudyIds = (caseStudies || []).map((cs: Record<string, unknown>) => cs.id);

  // Get all submissions for company's case studies
  const { data: submissions } = caseStudyIds.length > 0
    ? await supabase
        .from("submissions")
        .select("*, case_study:case_studies(*), users(*)")
        .in("case_study_id", caseStudyIds)
        .in("status", ["scored", "submitted", "reviewed"])
        .order("score", { ascending: false, nullsFirst: false })
    : { data: [] };

  // Get already-invited submission IDs
  const { data: existingInvitations } = await supabase
    .from("invitations")
    .select("submission_id")
    .eq("company_id", company?.id);

  const invitedSubIds = new Set(
    (existingInvitations || []).map((i: Record<string, unknown>) => i.submission_id)
  );

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">apto</Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
              Company
            </span>
            <span className="text-sm text-muted">{company?.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900">Candidate Submissions</h1>
          <p className="text-muted mt-1">Review and invite top performers.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="text-2xl font-bold text-slate-900">{submissions?.length || 0}</div>
            <div className="text-sm text-muted">Total submissions</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="text-2xl font-bold text-slate-900">
              {submissions?.filter((s: Record<string, unknown>) => (s.score as number) >= 80).length || 0}
            </div>
            <div className="text-sm text-muted">Score 80+</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="text-2xl font-bold text-primary">{invitedSubIds.size}</div>
            <div className="text-sm text-muted">Invites sent</div>
          </div>
        </div>

        {/* Submissions list */}
        {!submissions || submissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <h3 className="font-semibold text-slate-900 mb-2">No submissions yet</h3>
            <p className="text-muted text-sm">
              Candidates are solving your case studies. Check back soon!
            </p>
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
                  <th className="text-right px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub: Record<string, unknown>) => {
                  const integrity = sub.integrity_signals as Record<string, number> | null;
                  const studentUser = sub.users as Record<string, unknown> | null;
                  const cs = sub.case_study as Record<string, unknown> | null;
                  const invited = invitedSubIds.has(sub.id as string);

                  return (
                    <tr key={sub.id as string} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 text-sm">
                          {(studentUser?.name as string) || (studentUser?.email as string) || "Anonymous"}
                        </div>
                        <div className="text-xs text-muted">{studentUser?.email as string}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {cs?.title as string}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${(sub.score as number) >= 80 ? "text-green-600" : (sub.score as number) >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                          {sub.score as number}/100
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {integrity && (integrity.tab_switches > 0 || integrity.paste_count > 0) ? (
                            <>
                              {integrity.tab_switches > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                  {integrity.tab_switches} tab switches
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
                      <td className="px-6 py-4 text-right">
                        {invited ? (
                          <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                            Invited
                          </span>
                        ) : (
                          <Link
                            href={`/portal/invite?submission=${sub.id}&user=${sub.user_id}&company=${company?.id}`}
                            className="text-xs px-3 py-1.5 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                          >
                            Send Invite
                          </Link>
                        )}
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
