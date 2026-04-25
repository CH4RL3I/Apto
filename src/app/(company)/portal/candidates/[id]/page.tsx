import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, FileText } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_parsed, cv_skills, cv_url")
    .eq("user_id", sub.user_id as string)
    .single();

  const cvParsed = profile?.cv_parsed as Record<string, unknown> | null;
  const cvSkills = (profile?.cv_skills as string[]) || [];

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

  const score = sub.score as number;
  const scoreCircleClass =
    score >= 80 ? "bg-sage text-chalk" : score >= 60 ? "bg-sage-300 text-chalk" : "bg-coral-100 text-coral-700";

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <Link href="/portal" className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors">&larr; Back to submissions</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="eyebrow mb-1">Candidate</div>
            <h1 className="text-3xl font-bold text-charcoal tracking-tight">
              {(studentUser?.name as string) || "Anonymous candidate"}
            </h1>
            <p className="text-charcoal-2 mt-1">{studentUser?.email as string}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Pill variant="mist" size="md">{cs?.title as string}</Pill>
              {career && (
                <Pill variant="sageSolid" size="md">{career.title as string}</Pill>
              )}
            </div>
          </div>

          <div className="text-center flex-shrink-0">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-1 ${scoreCircleClass} stat-num`}>
              {score}
            </div>
            <div className="eyebrow mt-2">Overall</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Score breakdown */}
            {scoreBreakdown && (
              <div className="bg-chalk rounded-[14px] shadow-1 p-6">
                <h2 className="eyebrow mb-4">Score breakdown</h2>
                <div className="space-y-3">
                  {Object.entries(scoreBreakdown).map(([criterion, value]) => (
                    <div key={criterion}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-charcoal-2">{criterion}</span>
                        <span className="font-semibold text-charcoal stat-num">{value}/100</span>
                      </div>
                      <div className="h-2 bg-pale-sage rounded-full">
                        <div
                          className={`h-full rounded-full ${value >= 80 ? "bg-sage" : value >= 60 ? "bg-sage-300" : "bg-coral"}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solution */}
            <div className="bg-chalk rounded-[14px] shadow-1 p-6">
              <h2 className="eyebrow mb-4">Submission</h2>
              <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
                {(sub.answer as string) || "No answer provided."}
              </div>
            </div>

            {/* Integrity report */}
            <div className="bg-chalk rounded-[14px] shadow-1 p-6">
              <h2 className="eyebrow mb-4">Integrity report</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 rounded-[10px] bg-pale-sage">
                  <div className={`text-2xl font-bold stat-num ${integrity?.tab_switches ? "text-coral-700" : "text-sage"}`}>
                    {integrity?.tab_switches || 0}
                  </div>
                  <div className="eyebrow mt-1">Tab switches</div>
                </div>
                <div className="text-center p-4 rounded-[10px] bg-pale-sage">
                  <div className={`text-2xl font-bold stat-num ${integrity?.paste_count ? "text-coral-700" : "text-sage"}`}>
                    {integrity?.paste_count || 0}
                  </div>
                  <div className="eyebrow mt-1">Paste events</div>
                </div>
                <div className="text-center p-4 rounded-[10px] bg-pale-sage">
                  <div className={`text-2xl font-bold stat-num ${integrity?.fullscreen_exits ? "text-coral-700" : "text-sage"}`}>
                    {integrity?.fullscreen_exits || 0}
                  </div>
                  <div className="eyebrow mt-1">Fullscreen exits</div>
                </div>
                <div className="text-center p-4 rounded-[10px] bg-pale-sage">
                  <div className="text-2xl font-bold text-charcoal stat-num">
                    {integrity?.time_spent_seconds ? `${Math.round(integrity.time_spent_seconds / 60)}m` : "N/A"}
                  </div>
                  <div className="eyebrow mt-1">Time spent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Invite action */}
            <div className="bg-chalk rounded-[14px] shadow-1 p-5">
              {invited ? (
                <div className="text-center">
                  <div className="w-10 h-10 bg-pale-sage rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 text-sage" strokeWidth={1.75} />
                  </div>
                  <p className="font-semibold text-sage text-sm">Interview invite sent</p>
                </div>
              ) : (
                <ButtonLink
                  href={`/portal/invite?submission=${sub.id}&user=${sub.user_id}&company=${company?.id}`}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Send interview invite
                </ButtonLink>
              )}
            </div>

            {/* CV */}
            {cvParsed && Object.keys(cvParsed).length > 0 ? (
              <div className="bg-chalk rounded-[14px] shadow-1 p-5">
                <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sage" strokeWidth={1.75} />
                  CV summary
                </h3>
                {typeof cvParsed.education === "string" && cvParsed.education && (
                  <div className="mb-3">
                    <div className="text-xs text-charcoal-3 mb-1">Education</div>
                    <div className="text-sm text-charcoal">{cvParsed.education}</div>
                  </div>
                )}
                {Array.isArray(cvParsed.experience) && cvParsed.experience.length > 0 && (
                  <div className="mb-1">
                    <div className="text-xs text-charcoal-3 mb-1">Experience</div>
                    <ul className="space-y-1">
                      {(cvParsed.experience as string[]).map((exp, i) => (
                        <li key={i} className="text-sm text-charcoal-2">{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-chalk rounded-[14px] shadow-1 p-5 text-center">
                <p className="text-sm text-charcoal-2">No CV uploaded</p>
              </div>
            )}

            {/* Skills */}
            {cvSkills.length > 0 && (
              <div className="bg-chalk rounded-[14px] shadow-1 p-5">
                <h3 className="eyebrow mb-3">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cvSkills.map((skill, i) => (
                    <Pill key={i} variant="sage" size="sm">{skill}</Pill>
                  ))}
                </div>
              </div>
            )}

            {/* Submission meta */}
            <div className="bg-chalk rounded-[14px] shadow-1 p-5">
              <h3 className="eyebrow mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-2">Status</span>
                  <span className="font-medium text-charcoal capitalize">{(sub.status as string).replace("_", " ")}</span>
                </div>
                {typeof sub.submitted_at === "string" && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-2">Submitted</span>
                    <span className="text-charcoal">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                  </div>
                )}
                {typeof sub.cv_snapshot_url === "string" && sub.cv_snapshot_url && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-2">CV</span>
                    <span className="text-sage font-medium">Attached</span>
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
