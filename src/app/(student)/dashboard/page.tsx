import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check user role
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // If company user, redirect to portal
  if (userData?.role === "company") redirect("/portal");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile?.completed_at) redirect("/questionnaire");

  // Get submissions with case study and company info
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, case_study:case_studies(*, company:companies(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get invitations
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, company:companies(*), submission:submissions(*, case_study:case_studies(*))")
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false });

  const statusColors: Record<string, string> = {
    in_progress: "bg-yellow-100 text-yellow-700",
    submitted: "bg-blue-100 text-blue-700",
    scored: "bg-green-100 text-green-700",
    reviewed: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <div className="flex items-center gap-4">
            <Link href="/results" className="text-sm text-muted hover:text-slate-900">Explore Careers</Link>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-muted hover:text-slate-900">Sign out</button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{userData?.name ? `, ${userData.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted mt-1">Track your progress and invitations here.</p>
        </div>

        {/* Invitations */}
        {invitations && invitations.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Invitations</h2>
            <div className="space-y-4">
              {invitations.map((inv: Record<string, unknown>) => (
                <div
                  key={inv.id as string}
                  className="bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-6 fade-in"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-primary">New Invitation</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {(inv.company as Record<string, unknown>)?.name as string} wants to interview you!
                      </h3>
                      {typeof inv.message === "string" && inv.message && (
                        <p className="text-muted text-sm mt-2">{inv.message}</p>
                      )}
                      <p className="text-xs text-muted mt-2">
                        Based on your submission to &quot;
                        {((inv.submission as Record<string, unknown>)?.case_study as Record<string, unknown>)?.title as string}
                        &quot;
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                      {inv.status as string}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submissions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Your Submissions</h2>
            <Link href="/results" className="text-sm text-primary font-medium hover:underline">
              Try another case study &rarr;
            </Link>
          </div>

          {!submissions || submissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">No submissions yet</h3>
              <p className="text-muted text-sm mb-6">
                Complete a case study to see your submissions here.
              </p>
              <Link
                href="/results"
                className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Explore Careers
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub: Record<string, unknown>) => {
                const cs = sub.case_study as Record<string, unknown> | null;
                const company = cs?.company as Record<string, unknown> | null;
                return (
                  <div key={sub.id as string} className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-muted mb-1">{company?.name as string}</div>
                        <h3 className="font-semibold text-slate-900">{cs?.title as string}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[sub.status as string] || "bg-slate-100 text-slate-600"}`}>
                            {(sub.status as string).replace("_", " ")}
                          </span>
                          {sub.score !== null && (
                            <span className="text-sm font-semibold text-primary">
                              Score: {sub.score as number}/100
                            </span>
                          )}
                        </div>
                      </div>
                      {sub.status === "in_progress" && (
                        <Link
                          href={`/case-studies/${sub.case_study_id as string}/exam`}
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          Resume &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
