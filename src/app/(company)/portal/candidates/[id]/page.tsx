import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, FileText } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { ReviewControls } from "./ReviewControls";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userRow?.role !== "company") redirect("/dashboard");

  const { data: company } = await supabase
    .from("companies")
    .select("id, is_admin")
    .eq("user_id", user.id)
    .single();

  if (!company) redirect("/dashboard");

  const isAdmin = (company as { is_admin?: boolean }).is_admin === true;

  const { data: submission } = await supabase
    .from("submissions")
    .select("*, users(*)")
    .eq("id", id)
    .single();

  if (!submission) redirect("/portal");

  const sub = submission as Record<string, unknown>;
  const studentUser = sub.users as Record<string, unknown> | null;
  const integrity = sub.integrity_signals as Record<string, number> | null;
  const rawBreakdown = sub.score_breakdown as Record<string, unknown> | null;

  // Two shapes coexist:
  //   New (LLM): { criteria: { name -> n }, strengths, improvements, writtenFeedback, ... }
  //   Legacy (mock): { name -> n } (flat numbers)
  // Detect by presence of `criteria` (or any non-number value).
  const isNewShape =
    rawBreakdown !== null &&
    (typeof rawBreakdown.criteria === "object" || typeof rawBreakdown.writtenFeedback === "string");
  const criteriaMap = (
    isNewShape ? (rawBreakdown!.criteria as Record<string, number> | null) : (rawBreakdown as Record<string, number> | null)
  ) ?? null;
  const writtenFeedback = isNewShape ? (rawBreakdown!.writtenFeedback as string | undefined) : undefined;
  const strengths = isNewShape ? ((rawBreakdown!.strengths as string[]) ?? []) : [];
  const improvements = isNewShape ? ((rawBreakdown!.improvements as string[]) ?? []) : [];

  const csQuery = supabase
    .from("case_studies")
    .select("id, title, career:careers(title)")
    .eq("id", sub.case_study_id as string);
  const { data: caseStudy } = await (
    isAdmin ? csQuery.maybeSingle() : csQuery.eq("company_id", company.id).maybeSingle()
  );

  if (!caseStudy) redirect("/portal");

  const rawCaseStudy = caseStudy as unknown as {
    id: string;
    title: string;
    career: { title: string } | { title: string }[] | null;
  };
  const cs = {
    id: rawCaseStudy.id,
    title: rawCaseStudy.title,
    career: Array.isArray(rawCaseStudy.career)
      ? rawCaseStudy.career[0] ?? null
      : rawCaseStudy.career,
  };

  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_parsed, cv_skills, cv_url")
    .eq("user_id", sub.user_id as string)
    .single();

  const cvParsed = profile?.cv_parsed as Record<string, unknown> | null;
  const cvSkills = (profile?.cv_skills as string[]) || [];

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
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-chalk shadow-1">
              <Image
                src={`/company-logos/${cs.id}.png`}
                alt={`${cs.title} logo`}
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div>
              <div className="eyebrow mb-1">Candidate</div>
              <h1 className="text-3xl font-bold text-charcoal tracking-tight">
                {(studentUser?.name as string) || "Anonymous candidate"}
              </h1>
              <p className="text-charcoal-2 mt-1">{studentUser?.email as string}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Pill variant="mist" size="md">{cs.title}</Pill>
                {cs.career && (
                  <Pill variant="sageSolid" size="md">{cs.career.title}</Pill>
                )}
              </div>
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
            {criteriaMap && Object.keys(criteriaMap).length > 0 && (
              <div className="bg-chalk rounded-[14px] shadow-1 p-6">
                <h2 className="eyebrow mb-4">Score breakdown</h2>
                <div className="space-y-3">
                  {Object.entries(criteriaMap).map(([criterion, value]) => (
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

            {/* LLM reviewer notes (only present on the new score_breakdown shape) */}
            {writtenFeedback && (
              <div className="bg-chalk rounded-[14px] shadow-1 p-6">
                <h2 className="eyebrow mb-3">Reviewer notes (LLM)</h2>
                <p className="text-sm text-charcoal-2 leading-relaxed mb-5">{writtenFeedback}</p>

                {(strengths.length > 0 || improvements.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-5">
                    {strengths.length > 0 && (
                      <div>
                        <div className="eyebrow mb-2 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-sage" strokeWidth={2} />
                          Strengths
                        </div>
                        <ul className="space-y-1.5">
                          {strengths.map((s, i) => (
                            <li key={i} className="text-sm text-charcoal-2 flex gap-2">
                              <span className="text-sage mt-0.5">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {improvements.length > 0 && (
                      <div>
                        <div className="eyebrow mb-2 flex items-center gap-1.5">
                          <ArrowUpRight className="w-3.5 h-3.5 text-coral" strokeWidth={2} />
                          Areas to improve
                        </div>
                        <ul className="space-y-1.5">
                          {improvements.map((s, i) => (
                            <li key={i} className="text-sm text-charcoal-2 flex gap-2">
                              <span className="text-coral mt-0.5">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
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
            <ReviewControls
              submissionId={sub.id as string}
              initialNotes={(sub.reviewer_notes as string) ?? ""}
              initialStatus={sub.status as string}
            />

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
                <form action="/portal/invite" method="post">
                  <input type="hidden" name="submissionId" value={sub.id as string} />
                  <Button type="submit" variant="primary" size="md" className="w-full">
                    Send interview invite
                  </Button>
                </form>
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
