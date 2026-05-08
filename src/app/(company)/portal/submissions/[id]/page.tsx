import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import {
  integrityVerdict,
  INTEGRITY_LABEL,
  INTEGRITY_DESCRIPTION,
  type IntegritySignals,
} from "@/lib/integrity";
import { InviteModal } from "../InviteModal";
import { RejectButton } from "./RejectButton";

interface DimensionScore {
  name: string;
  score: number;
  feedback?: string;
}

interface TaskResponseEntry {
  taskIndex: number;
  taskType: string;
  response: unknown;
  submittedAt?: string;
}

function responseAsText(r: unknown): string {
  if (typeof r === "string") return r;
  if (r === null || r === undefined) return "(no response)";
  try {
    return JSON.stringify(r, null, 2);
  } catch {
    return String(r);
  }
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
    .select("id, name, contact_email, is_admin")
    .eq("user_id", user.id)
    .single();
  if (!company) redirect("/dashboard");

  const isAdmin = (company as { is_admin?: boolean }).is_admin === true;

  const { data: submission } = await supabase
    .from("submissions")
    .select("*, users(*)")
    .eq("id", id)
    .single();
  if (!submission) redirect("/portal/submissions");

  const sub = submission as Record<string, unknown>;
  const studentUser = sub.users as
    | { name: string | null; email: string }
    | null;

  // Server-side ownership re-check (RLS is the primary guard, this is belt-and-suspenders).
  const csQuery = supabase
    .from("case_studies")
    .select("id, title, career:careers(title), brief")
    .eq("id", sub.case_study_id as string);
  const { data: caseStudy } = await (
    isAdmin ? csQuery.maybeSingle() : csQuery.eq("company_id", company.id).maybeSingle()
  );
  if (!caseStudy) redirect("/portal/submissions");

  const cs = caseStudy as unknown as {
    id: string;
    title: string;
    brief: string | null;
    career: { title: string } | { title: string }[] | null;
  };
  const careerTitle = Array.isArray(cs.career) ? cs.career[0]?.title : cs.career?.title;

  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_parsed, cv_skills, cv_url")
    .eq("user_id", sub.user_id as string)
    .maybeSingle();

  const cvParsed = profile?.cv_parsed as Record<string, unknown> | null;
  const cvSkills = (profile?.cv_skills as string[]) || [];

  const { data: existingInvite } = await supabase
    .from("invitations")
    .select("id, status, sent_at")
    .eq("submission_id", id)
    .eq("company_id", company.id)
    .maybeSingle();

  const isMultiTask = sub.is_multi_task === true;
  const taskScores = sub.task_scores as
    | { overall?: number; dimensions?: DimensionScore[] }
    | null;
  const taskResponses = Array.isArray(sub.task_responses)
    ? (sub.task_responses as TaskResponseEntry[])
    : [];

  const overallScore = isMultiTask
    ? taskScores?.overall ?? 0
    : (sub.score as number | null) ?? 0;

  const rawBreakdown = sub.score_breakdown as Record<string, unknown> | null;
  const isNewShape =
    rawBreakdown !== null &&
    rawBreakdown !== undefined &&
    (typeof rawBreakdown.criteria === "object" ||
      typeof rawBreakdown.writtenFeedback === "string");
  const writtenFeedback = isNewShape
    ? (rawBreakdown!.writtenFeedback as string | undefined)
    : undefined;

  const integrity = sub.integrity_signals as IntegritySignals | null;
  const verdict = integrityVerdict(integrity);
  const verdictClass =
    verdict === "green"
      ? "bg-pale-sage border-sage text-sage-700"
      : verdict === "yellow"
      ? "bg-coral-100 border-coral text-coral-700"
      : "bg-coral-200 border-coral text-coral-800";
  const dotClass =
    verdict === "green" ? "bg-sage" : verdict === "yellow" ? "bg-coral" : "bg-coral-700";

  const scoreCircleClass =
    overallScore >= 80
      ? "bg-sage text-chalk"
      : overallScore >= 60
      ? "bg-sage-300 text-chalk"
      : "bg-coral-100 text-coral-700";

  const status = sub.status as string;
  const isRejected = status === "rejected";

  return (
    <div className="min-h-screen bg-pale-sage">
      <nav className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center">
            <Logo height={28} priority />
          </Link>
          <Link
            href="/portal/submissions"
            className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
          >
            &larr; Back to submissions
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="eyebrow mb-1">Candidate</div>
            <h1 className="text-3xl font-bold text-charcoal tracking-tight">
              {studentUser?.name || "Anonymous candidate"}
            </h1>
            <p className="text-charcoal-2 mt-1">{studentUser?.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Pill variant="mist" size="md">{cs.title}</Pill>
              {careerTitle && <Pill variant="sageSolid" size="md">{careerTitle}</Pill>}
              <Pill variant="mist" size="sm">
                <span className="capitalize">{status.replace("_", " ")}</span>
              </Pill>
              {existingInvite && (
                <Pill variant="sage" size="sm">
                  Invite {(existingInvite as { status: string }).status}
                </Pill>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center flex-shrink-0">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-1 ${scoreCircleClass} stat-num`}
              >
                {Math.round(overallScore)}
              </div>
              <div className="eyebrow mt-2">{isMultiTask ? "Overall" : "Score"}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {!existingInvite && !isRejected && (
            <InviteModal
              submissionId={id}
              candidateName={studentUser?.name ?? ""}
              caseStudyTitle={cs.title}
              recruiterName={(company as { name: string }).name ?? "the team"}
              companyName={(company as { name: string }).name ?? "us"}
              defaultContactEmail={
                (company as { contact_email: string | null }).contact_email ?? ""
              }
            />
          )}
          {!isRejected && <RejectButton submissionId={id} />}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Score breakdown */}
            <div className="bg-chalk rounded-[14px] shadow-1 p-6">
              <h2 className="eyebrow mb-4">Score breakdown</h2>
              {isMultiTask && taskScores?.dimensions && taskScores.dimensions.length > 0 ? (
                <div className="space-y-3">
                  {taskScores.dimensions.map((d) => (
                    <div key={d.name}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-charcoal-2">{d.name}</span>
                        <span className="font-semibold text-charcoal stat-num">
                          {d.score}/100
                        </span>
                      </div>
                      <div className="h-2 bg-pale-sage rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            d.score >= 80
                              ? "bg-sage"
                              : d.score >= 60
                              ? "bg-sage-300"
                              : "bg-coral"
                          }`}
                          style={{ width: `${Math.max(0, Math.min(100, d.score))}%` }}
                        />
                      </div>
                      {d.feedback && (
                        <p className="text-xs text-charcoal-3 mt-1">{d.feedback}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : !isMultiTask ? (
                <div>
                  <div className="text-sm text-charcoal-2 mb-2">
                    Single-task score:{" "}
                    <span className="font-semibold text-charcoal stat-num">
                      {sub.score as number | null ?? "—"}/100
                    </span>
                  </div>
                  {writtenFeedback && (
                    <p className="text-sm text-charcoal-2 leading-relaxed">{writtenFeedback}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-charcoal-3">No score breakdown available.</p>
              )}
            </div>

            {/* Solution */}
            <div className="bg-chalk rounded-[14px] shadow-1 p-6">
              <h2 className="eyebrow mb-4">Solution</h2>
              {isMultiTask && taskResponses.length > 0 ? (
                <div className="space-y-5">
                  {taskResponses.map((entry, i) => (
                    <div
                      key={`${entry.taskIndex}-${i}`}
                      className="rounded-[12px] border border-sage-mist-2 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-charcoal">
                          Task {entry.taskIndex + 1}
                        </div>
                        <Pill variant="mist" size="sm">{entry.taskType}</Pill>
                      </div>
                      <pre className="text-sm text-charcoal whitespace-pre-wrap font-sans leading-relaxed">
                        {responseAsText(entry.response)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
                  {(sub.answer as string) || "No answer provided."}
                </div>
              )}
            </div>

            {/* Integrity */}
            <div className="bg-chalk rounded-[14px] shadow-1 p-6">
              <h2 className="eyebrow mb-4">Integrity</h2>
              <div
                className={`mb-4 flex items-center gap-3 rounded-[12px] border-2 px-4 py-3 ${verdictClass}`}
              >
                <span className={`flex h-2.5 w-2.5 rounded-full ${dotClass}`} />
                <div>
                  <div className="text-sm font-bold tracking-tight">
                    {INTEGRITY_LABEL[verdict]}
                  </div>
                  <div className="text-xs opacity-80">{INTEGRITY_DESCRIPTION[verdict]}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Pill variant="mist" size="sm">
                  {integrity?.tab_switches ?? 0} tab switches
                </Pill>
                <Pill variant="mist" size="sm">
                  {integrity?.paste_count ?? 0} paste events
                </Pill>
                <Pill variant="mist" size="sm">
                  {integrity?.fullscreen_exits ?? 0} fullscreen exits
                </Pill>
                <Pill variant="mist" size="sm">
                  {integrity?.time_spent_seconds
                    ? `${Math.round(integrity.time_spent_seconds / 60)}m on task`
                    : "time on task: —"}
                </Pill>
              </div>
              <p className="text-xs text-charcoal-3 leading-relaxed">
                What this means: signals are heuristic. Tab switches and paste events
                during a proctored case study may indicate copy-pasting or external
                lookup, but a few are usually benign (e.g. checking notes from another
                tab). Treat <strong>red</strong> verdicts as a prompt to ask follow-up
                questions in the interview, not as an automatic disqualification.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-chalk rounded-[14px] shadow-1 p-5">
              <h3 className="eyebrow mb-3">Candidate</h3>
              <div className="text-sm text-charcoal font-semibold">
                {studentUser?.name || "Anonymous"}
              </div>
              <div className="text-xs text-charcoal-2 mb-3">{studentUser?.email}</div>

              {cvParsed && Object.keys(cvParsed).length > 0 && (
                <div className="space-y-2 border-t border-sage-mist-2 pt-3">
                  {typeof cvParsed.headline === "string" && cvParsed.headline && (
                    <div>
                      <div className="text-xs text-charcoal-3">Headline</div>
                      <div className="text-sm text-charcoal">
                        {cvParsed.headline as string}
                      </div>
                    </div>
                  )}
                  {typeof cvParsed.education === "string" && cvParsed.education && (
                    <div>
                      <div className="text-xs text-charcoal-3">Education</div>
                      <div className="text-sm text-charcoal">
                        {cvParsed.education as string}
                      </div>
                    </div>
                  )}
                  {Array.isArray(cvParsed.experience) &&
                    cvParsed.experience.length > 0 && (
                      <div>
                        <div className="text-xs text-charcoal-3">Experience</div>
                        <ul className="space-y-1">
                          {(cvParsed.experience as string[]).slice(0, 4).map((exp, i) => (
                            <li key={i} className="text-sm text-charcoal-2">
                              {exp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {typeof sub.cv_snapshot_url === "string" && sub.cv_snapshot_url && (
                <a
                  href={sub.cv_snapshot_url as string}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center text-sm font-semibold text-sage hover:underline"
                >
                  View full CV →
                </a>
              )}
            </div>

            {cvSkills.length > 0 && (
              <div className="bg-chalk rounded-[14px] shadow-1 p-5">
                <h3 className="eyebrow mb-3">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cvSkills.map((skill, i) => (
                    <Pill key={i} variant="sage" size="sm">
                      {skill}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-chalk rounded-[14px] shadow-1 p-5">
              <h3 className="eyebrow mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-2">Status</span>
                  <span className="font-medium text-charcoal capitalize">
                    {status.replace("_", " ")}
                  </span>
                </div>
                {typeof sub.submitted_at === "string" && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-2">Submitted</span>
                    <span className="text-charcoal">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-charcoal-2">Format</span>
                  <span className="text-charcoal">
                    {isMultiTask ? "Multi-task" : "Single-task"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
