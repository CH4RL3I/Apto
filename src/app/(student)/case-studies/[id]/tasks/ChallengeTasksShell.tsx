"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  CaseStudy,
  ChallengeTask,
  AnalysisTask,
  RecommendationTask,
  CurveballTask,
} from "@/lib/questionnaire/case-studies";
import { Logo } from "@/components/Logo";
import { Markdown } from "@/lib/markdown";
import { FromTheDesk } from "./FromTheDesk";
import { CompanyBrief } from "./CompanyBrief";
import {
  TaskAnalysis,
  computeAnalysisScores,
  type AnalysisAnswer,
} from "./TaskAnalysis";
import {
  TaskRecommendation,
  computeRecommendationScores,
  type RecommendationAnswer,
} from "./TaskRecommendation";
import {
  TaskCurveball,
  computeCurveballScores,
  type CurveballAnswer,
} from "./TaskCurveball";
import { FinalScoreCard } from "./FinalScoreCard";
import { CertificateBanner } from "./CertificateBanner";
import { ApplyWithCertificate } from "./ApplyWithCertificate";
import {
  startMultiTaskSubmission,
  saveTaskResponse,
  completeMultiTaskSubmission,
  type TaskScores,
} from "./actions";

interface SessionState {
  currentIndex: number;
  submitted: boolean[];
  analysis: AnalysisAnswer;
  recommendation: RecommendationAnswer;
  curveball: CurveballAnswer;
  completed: boolean;
}

const DEFAULT_STATE: SessionState = {
  currentIndex: 0,
  submitted: [false, false, false],
  analysis: { quizPick: null, text: "" },
  recommendation: { cityId: null, matches: {}, text: "" },
  curveball: { stanceId: null, text: "" },
  completed: false,
};

function storageKey(caseStudyId: string) {
  return `apto:tasks:${caseStudyId}`;
}

function loadState(caseStudyId: string): SessionState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(storageKey(caseStudyId));
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
  caseStudy: CaseStudy;
}

export function ChallengeTasksShell({ caseStudy }: Props) {
  const tasks = caseStudy.tasks ?? [];
  const [state, setState] = useState<SessionState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    (tasks[0]?.durationMin ?? 30) * 60,
  );
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [serverScores, setServerScores] = useState<TaskScores | null>(null);
  const [scoringError, setScoringError] = useState<string | null>(null);
  const [scoring, setScoring] = useState(false);
  const completionTriggered = useRef(false);

  useEffect(() => {
    setState(loadState(caseStudy.id));
    setHydrated(true);
  }, [caseStudy.id]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      try {
        const { submissionId: id } = await startMultiTaskSubmission(
          caseStudy.id,
        );
        if (!cancelled) setSubmissionId(id);
      } catch (err) {
        console.error("startMultiTaskSubmission failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, caseStudy.id]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        storageKey(caseStudy.id),
        JSON.stringify(state),
      );
    } catch {
      /* ignore quota */
    }
  }, [state, caseStudy.id, hydrated]);

  // Reset timer when current task changes (or after submit)
  const lastTimerKey = useRef<string>("");
  useEffect(() => {
    const current = tasks[state.currentIndex];
    if (!current) return;
    const key = `${state.currentIndex}:${state.submitted[state.currentIndex]}`;
    if (lastTimerKey.current === key) return;
    lastTimerKey.current = key;
    if (!state.submitted[state.currentIndex]) {
      setSecondsLeft(current.durationMin * 60);
    }
  }, [state.currentIndex, state.submitted, tasks]);

  // Timer tick
  useEffect(() => {
    const submitted = state.submitted[state.currentIndex];
    if (submitted || state.completed) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.currentIndex, state.submitted, state.completed]);

  function setCurrentIndex(idx: number) {
    setState((s) => ({ ...s, currentIndex: idx }));
    setShowResources(false);
  }

  function submitCurrent() {
    const idx = state.currentIndex;
    const task = tasks[idx];
    if (!task) return;
    const responsePayload =
      task.type === "analysis"
        ? state.analysis
        : task.type === "recommendation"
        ? state.recommendation
        : state.curveball;
    setState((s) => {
      const submitted = [...s.submitted];
      submitted[idx] = true;
      const completed = idx === tasks.length - 1;
      return { ...s, submitted, completed: completed ? true : s.completed };
    });
    if (submissionId) {
      saveTaskResponse(submissionId, idx, task.type, responsePayload).catch(
        (err) => console.error("saveTaskResponse failed", err),
      );
    }
  }

  function continueToNext() {
    setState((s) => ({
      ...s,
      currentIndex: Math.min(tasks.length - 1, s.currentIndex + 1),
    }));
    setShowResources(false);
  }

  // Compute running score preview
  const liveScores = useMemo(() => {
    const dimAcc: Record<string, { sum: number; count: number }> = {};
    function add(label: string, score: number) {
      if (!dimAcc[label]) dimAcc[label] = { sum: 0, count: 0 };
      dimAcc[label].sum += score;
      dimAcc[label].count += 1;
    }
    if (state.submitted[0] && tasks[0]?.type === "analysis") {
      const s = computeAnalysisScores(tasks[0] as AnalysisTask, state.analysis);
      add("Structure", s.structure);
      add("Judgment", s.judgment);
      add("Communication", s.communication);
    }
    if (state.submitted[1] && tasks[1]?.type === "recommendation") {
      const s = computeRecommendationScores(
        tasks[1] as RecommendationTask,
        state.recommendation,
      );
      add("Structure", s.structure);
      add("Judgment", s.judgment);
      add("Communication", s.communication);
    }
    if (state.submitted[2] && tasks[2]?.type === "curveball") {
      const s = computeCurveballScores(
        tasks[2] as CurveballTask,
        state.curveball,
      );
      add("Structure", s.structure);
      add("Judgment", s.judgment);
      add("Communication", s.communication);
      add("Composure", s.composure);
    }
    return dimAcc;
  }, [state, tasks]);

  function avgFor(label: string): number {
    const a = liveScores[label];
    return a && a.count > 0 ? Math.round(a.sum / a.count) : 0;
  }

  const localFinalDims = useMemo(() => {
    if (!state.completed) return null;
    const dims: { label: string; score: number; feedback: string }[] = [];
    const labels = ["Structure", "Judgment", "Communication", "Composure"];
    const feedback: Record<string, string> = {
      Structure:
        "Your analysis was structured — you picked relevant factors and compared them clearly.",
      Judgment:
        state.curveball.stanceId === "adapt"
          ? "Strongest signal — you held conviction while updating the approach. That's senior-level thinking."
          : state.curveball.stanceId === "delay"
          ? "Judgment was weak here — 'wait and see' doesn't answer the question asked."
          : "Decent judgment. Holding your recommendation shows conviction; just make sure the reasoning is tight.",
      Communication:
        "Writing was clear and direct. You led with a position rather than burying it.",
      Composure:
        state.curveball.stanceId === "delay"
          ? "Under pressure you hedged — understandable but not what the CEO needed."
          : "You responded quickly and clearly under time pressure. That's composure.",
    };
    for (const label of labels) {
      const v = avgFor(label);
      if (v > 0) {
        dims.push({ label, score: v, feedback: feedback[label] });
      }
    }
    return dims;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.completed, liveScores, state.curveball.stanceId]);

  useEffect(() => {
    if (!state.completed || !submissionId) return;
    if (completionTriggered.current) return;
    completionTriggered.current = true;
    setScoring(true);
    setScoringError(null);
    completeMultiTaskSubmission(submissionId)
      .then(({ scores }) => setServerScores(scores))
      .catch((err) => {
        console.error("completeMultiTaskSubmission failed", err);
        setScoringError(
          err instanceof Error ? err.message : "Scoring failed",
        );
      })
      .finally(() => setScoring(false));
  }, [state.completed, submissionId]);

  const finalDims = useMemo(() => {
    if (serverScores) {
      return serverScores.dimensions.map((d) => ({
        label: d.name,
        score: d.score,
        feedback: d.feedback,
      }));
    }
    return localFinalDims;
  }, [serverScores, localFinalDims]);

  const overall = serverScores
    ? (serverScores.overall / 10).toFixed(1)
    : finalDims && finalDims.length > 0
    ? (
        finalDims.reduce((acc, d) => acc + d.score, 0) /
        Math.max(1, finalDims.length) /
        10
      ).toFixed(1)
    : "—";

  const current = tasks[state.currentIndex];
  const initials =
    caseStudy.companyName
      ?.split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AP";

  const dimensionLabels = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => t.scoredOn.forEach((d) => set.add(d)));
    return Array.from(set);
  }, [tasks]);

  if (!hydrated || !current) {
    return null;
  }

  const brand = caseStudy.companyBlock?.brand;
  const companyLogoUrl = caseStudy.companyBlock?.logoUrl;
  const brandStyle = brand
    ? ({
        "--brand-primary": brand.primary,
        "--brand-primary-dark": brand.primaryDark,
        "--brand-accent": brand.accent,
        "--brand-bg": brand.bg,
      } as React.CSSProperties)
    : undefined;
  const rootBgClass = brand ? "" : "bg-pale-sage/30";
  const rootBgStyle = brand ? { backgroundColor: brand.bg } : undefined;

  return (
    <div
      className={`min-h-screen ${rootBgClass}`}
      style={{ ...brandStyle, ...rootBgStyle }}
    >
      {/* Top bar */}
      <nav className="sticky top-0 z-30 flex h-[52px] items-center justify-between bg-charcoal px-6">
        <Link href="/dashboard" className="focus-ring inline-flex">
          <Logo variant="dark" height={20} priority />
        </Link>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-chalk/10 bg-chalk/5 px-3 py-1 text-[13px] font-medium text-chalk">
            <span
              className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                brand ? "bg-[var(--brand-primary)]" : "bg-sage"
              }`}
            />
            <span className="font-mono">{formatTime(secondsLeft)}</span>
          </div>
        </div>
      </nav>

      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] min-h-[calc(100vh-52px)]">
        {/* Sidebar */}
        <aside className="border-r border-sage-mist-2 bg-chalk lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] lg:overflow-y-auto">
          <div className="border-b border-sage-mist-2 p-5">
            {companyLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={companyLogoUrl}
                alt={`${caseStudy.companyName ?? "Company"} logo`}
                className="mb-2.5 h-11 w-11 rounded-[10px] object-contain"
                style={brand ? { backgroundColor: brand.accent } : undefined}
              />
            ) : (
              <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-[10px] bg-charcoal text-sm font-bold text-sage tracking-wide">
                {initials}
              </div>
            )}
            <div className="text-[15px] font-semibold text-charcoal">
              {caseStudy.companyName ?? "Apto"}
            </div>
            <div className="text-[12px] text-charcoal-3 mb-2.5">
              {caseStudy.companyBlock?.tagline ?? caseStudy.cluster.replace(/_/g, " ")}
            </div>
            <div className="flex flex-wrap gap-1">
              {caseStudy.companyBlock?.primaryTag && (
                <span className="rounded-full border border-sage/25 bg-pale-sage px-2 py-0.5 text-[11px] font-medium text-sage-700">
                  {caseStudy.companyBlock.primaryTag}
                </span>
              )}
              {caseStudy.companyBlock?.secondaryTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-sage-mist-2 bg-pale-sage/50 px-2 py-0.5 text-[11px] font-medium text-charcoal-2"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-charcoal-3">
              Your tasks
            </div>
            {tasks.map((t, i) => {
              const done = state.submitted[i];
              const active = i === state.currentIndex;
              const locked = i > 0 && !state.submitted[i - 1];
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => !locked && setCurrentIndex(i)}
                  disabled={locked}
                  className={`mb-1 flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    active
                      ? brand
                        ? "border-[var(--brand-primary)] bg-[var(--brand-bg)]"
                        : "border-sage bg-pale-sage"
                      : "border-transparent hover:bg-pale-sage/40"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold ${
                      done
                        ? brand
                          ? "bg-[var(--brand-bg)] text-[var(--brand-primary-dark)]"
                          : "bg-pale-sage text-sage-700"
                        : active
                        ? brand
                          ? "bg-[var(--brand-primary)] text-chalk"
                          : "bg-sage text-chalk"
                        : "bg-pale-sage text-charcoal-2"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="flex-1 text-[13px] font-medium text-charcoal">
                    {t.title}
                  </span>
                  <span className="text-[11px] text-charcoal-3">
                    {done ? "Done" : `${t.durationMin} min`}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-sage-mist-2 p-5">
            <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-charcoal-3">
              Score dimensions
            </div>
            <div className="rounded-lg border border-sage-mist-2 bg-pale-sage/40 p-3">
              {dimensionLabels.length === 0 && (
                <div className="text-[11px] text-charcoal-3">No dimensions</div>
              )}
              {dimensionLabels.map((dim) => {
                const v = avgFor(dim);
                return (
                  <div
                    key={dim}
                    className="mb-1.5 flex items-center justify-between last:mb-0"
                  >
                    <span className="text-[12px] text-charcoal-2">{dim}</span>
                    <div className="h-1 w-20 overflow-hidden rounded-full bg-sage-mist-2">
                      <div
                        className={`h-full transition-all duration-700 ${
                          brand ? "bg-[var(--brand-primary)]" : "bg-sage"
                        }`}
                        style={{ width: `${v}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="mt-2 text-[11px] text-charcoal-3">
                {state.submitted.some(Boolean)
                  ? "Updates as you submit each task"
                  : "Complete tasks to see your score"}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="px-6 py-7 md:px-8 w-full">
         <div className="mx-auto w-full max-w-3xl">
          {/* Progress banner */}
          <div className="relative mb-5 flex items-center justify-between overflow-hidden rounded-[14px] bg-charcoal px-5 py-4">
            {brand && (
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] bg-[var(--brand-primary)]"
              />
            )}
            <div>
              <div className="text-[13px] text-chalk/70">
                <strong className="font-semibold text-chalk">
                  {caseStudy.companyName ?? "Apto"} Challenge
                </strong>{" "}
                — {caseStudy.matchesRoles[0] ?? "Analyst"}
              </div>
              <div className="mt-0.5 text-[13px] text-chalk/70">
                {state.completed
                  ? "All tasks complete · Certificate earned"
                  : `Task ${state.currentIndex + 1} of ${tasks.length} · Complete all tasks to earn your certificate`}
              </div>
            </div>
            <div className="flex gap-1.5">
              {tasks.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-7 rounded-full ${
                    state.submitted[i]
                      ? brand
                        ? "bg-[var(--brand-primary)]"
                        : "bg-sage"
                      : i === state.currentIndex
                      ? brand
                        ? "bg-[var(--brand-primary)]/50"
                        : "bg-sage/50"
                      : "bg-chalk/15"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Header (only on first task) */}
          {state.currentIndex === 0 && !state.completed && (
            <>
              <div className="mb-6">
                <div
                  className={`text-[11px] font-semibold uppercase tracking-[0.1em] mb-1.5 ${
                    brand ? "text-[var(--brand-primary)]" : "text-sage"
                  }`}
                >
                  {caseStudy.companyName ?? "Apto"} ·{" "}
                  {caseStudy.companyBlock?.primaryTag ?? "Challenge"}
                </div>
                <h1 className="text-2xl md:text-[26px] font-bold tracking-tight text-charcoal leading-tight">
                  {caseStudy.title}
                </h1>
                <p className="mt-2 text-sm text-charcoal-2">
                  You&apos;re a new {caseStudy.matchesRoles[0] ?? "analyst"}.
                  Three tasks. Take a position, back it up, handle the
                  curveball.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-sage/25 bg-pale-sage px-2.5 py-1 text-[11px] font-medium text-sage-700">
                    {caseStudy.matchesRoles[0]}
                  </span>
                  <span className="rounded-full border border-sage-mist-2 bg-chalk px-2.5 py-1 text-[11px] font-medium text-charcoal-2">
                    {tasks.length} tasks
                  </span>
                  <span className="rounded-full border border-sage-mist-2 bg-chalk px-2.5 py-1 text-[11px] font-medium text-charcoal-2">
                    {caseStudy.companyBlock?.totalTimeLabel ??
                      `~${caseStudy.estimatedMinutes} min total`}
                  </span>
                  <span className="rounded-full border border-sage-mist-2 bg-chalk px-2.5 py-1 text-[11px] font-medium text-charcoal-2">
                    Certificate on completion
                  </span>
                </div>
              </div>

              {caseStudy.desk && (
                <FromTheDesk
                  quote={caseStudy.desk.quote}
                  authorName={caseStudy.desk.authorName}
                  authorTitle={caseStudy.desk.authorTitle}
                  authorInitials={caseStudy.desk.authorInitials}
                />
              )}

              <CompanyBrief
                body={caseStudy.body}
                logoUrl={companyLogoUrl}
                companyName={caseStudy.companyName ?? undefined}
                initials={initials}
                insight={{
                  label: "How analysts approach this",
                  text: "Start by asking: which market is most ready, not which is biggest? Look at who already shops like your customer, not just population size. Use proxies — sustainability brand penetration, average online spend, competitor presence — to narrow down fast. Then pick one and defend it.",
                }}
              />
            </>
          )}

          {/* Compact header on later tasks */}
          {state.currentIndex > 0 && !state.completed && (
            <div className="mb-5 rounded-[14px] border border-sage-mist-2 bg-chalk px-5 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-sage mb-1">
                {caseStudy.companyName ?? "Apto"} · Continuing
              </div>
              <div className="text-base font-semibold text-charcoal">
                {caseStudy.title}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-[12px] font-medium text-charcoal-2 hover:text-sage">
                  View brief
                </summary>
                <div className="mt-2 text-[13px] leading-7 text-charcoal-2">
                  <Markdown source={caseStudy.body} />
                </div>
              </details>
            </div>
          )}

          {/* Active task */}
          {!state.completed && current.type === "analysis" && (
            <TaskAnalysis
              task={current as AnalysisTask}
              taskNumber={state.currentIndex + 1}
              answer={state.analysis}
              onAnswerChange={(a) => setState((s) => ({ ...s, analysis: a }))}
              submitted={state.submitted[state.currentIndex]}
              onSubmit={submitCurrent}
              onContinue={continueToNext}
              showResources={showResources}
              setShowResources={setShowResources}
            />
          )}
          {!state.completed && current.type === "recommendation" && (
            <TaskRecommendation
              task={current as RecommendationTask}
              taskNumber={state.currentIndex + 1}
              answer={state.recommendation}
              onAnswerChange={(a) =>
                setState((s) => ({ ...s, recommendation: a }))
              }
              submitted={state.submitted[state.currentIndex]}
              onSubmit={submitCurrent}
              onContinue={continueToNext}
              showResources={showResources}
              setShowResources={setShowResources}
            />
          )}
          {!state.completed && current.type === "curveball" && (
            <TaskCurveball
              task={current as CurveballTask}
              taskNumber={state.currentIndex + 1}
              answer={state.curveball}
              onAnswerChange={(a) => setState((s) => ({ ...s, curveball: a }))}
              submitted={state.submitted[state.currentIndex]}
              onSubmit={submitCurrent}
            />
          )}

          {/* Final completion screen */}
          {state.completed && finalDims && (
            <div className="space-y-4">
              {scoring && !serverScores && (
                <div className="rounded-[14px] border border-sage-mist-2 bg-chalk px-5 py-4 text-[12px] text-charcoal-2">
                  Scoring your submission…
                </div>
              )}
              {scoringError && (
                <div className="rounded-[14px] border border-coral-200 bg-coral-50 px-5 py-4 text-[12px] text-coral-700">
                  Scoring failed: {scoringError}. Showing preliminary scores.
                </div>
              )}
              <FinalScoreCard
                challengeTitle={caseStudy.companyName ?? "Apto"}
                roleLabel={caseStudy.matchesRoles[0] ?? "Analyst"}
                overall={overall}
                dims={finalDims}
              />
              <CertificateBanner
                challengeTitle={caseStudy.companyName ?? "Apto"}
                submissionId={serverScores ? submissionId : null}
              />
              <ApplyWithCertificate
                companyName={caseStudy.companyName ?? "Apto"}
                roleLabel={caseStudy.matchesRoles[0] ?? "Analyst"}
              />
              <div className="text-right">
                <Link
                  href="/results"
                  className="focus-ring inline-flex items-center gap-1 rounded-lg border border-sage-mist-2 bg-chalk px-4 py-2.5 text-[13px] font-semibold text-charcoal-2 hover:border-sage hover:text-sage transition-colors"
                >
                  Explore similar challenges →
                </Link>
              </div>
            </div>
          )}
         </div>
        </main>
      </div>
    </div>
  );
}
