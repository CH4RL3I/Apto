"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowUpRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CASE_STUDIES, type CaseStudy } from "@/lib/questionnaire/case-studies";
import type { Submission } from "@/types";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/lib/markdown";

type ScoringStatus = "idle" | "scoring" | "done" | "failed";

interface ScoreBreakdownShape {
  criteria?: Record<string, number>;
  strengths?: string[];
  improvements?: string[];
  writtenFeedback?: string;
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const caseStudyId = params.id as string;

  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [honorAccepted, setHonorAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdownShape | null>(null);
  const [scoringStatus, setScoringStatus] = useState<ScoringStatus>("idle");
  const [examError, setExamError] = useState<string | null>(null);

  // Integrity signals
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);

  const answerRef = useRef(answer);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  const handleStartExam = useCallback(async () => {
    setExamError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get CV URL from profile to attach to submission
    const { data: profile } = await supabase
      .from("profiles")
      .select("cv_url")
      .eq("user_id", user.id)
      .single();

    const { data: sub, error } = await supabase
      .from("submissions")
      .insert({
        user_id: user.id,
        case_study_id: caseStudyId,
        status: "in_progress",
        started_at: new Date().toISOString(),
        integrity_signals: { tab_switches: 0, paste_count: 0, fullscreen_exits: 0, time_spent_seconds: 0 },
        cv_snapshot_url: profile?.cv_url || null,
      })
      .select()
      .single();

    if (error || !sub) {
      setExamError(error?.message ?? "Could not start this case study.");
      setHonorAccepted(false);
      return;
    }

    setSubmission(sub as Submission);

    // Best-effort CV snapshot: copy the current CV file into the
    // submission-cvs bucket so the company always sees the version that
    // was attached at submission time, even if the student updates their
    // profile CV later. Failures fall back to the live URL pointer.
    if (profile?.cv_url) {
      try {
        const res = await fetch(profile.cv_url);
        if (res.ok) {
          const blob = await res.blob();
          const ext = (profile.cv_url.split(".").pop() ?? "pdf").split("?")[0].slice(0, 8);
          const path = `${user.id}/${sub.id}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("submission-cvs")
            .upload(path, blob, {
              contentType: blob.type || "application/pdf",
              upsert: true,
            });
          if (!uploadErr) {
            const { data: urlData } = supabase.storage
              .from("submission-cvs")
              .getPublicUrl(path);
            if (urlData?.publicUrl) {
              await supabase
                .from("submissions")
                .update({ cv_snapshot_url: urlData.publicUrl })
                .eq("id", sub.id);
            }
          }
        }
      } catch {
        // Best-effort — leave cv_snapshot_url as the live cv_url fallback.
      }
    }

    // Try fullscreen
    try {
      await document.documentElement.requestFullscreen();
    } catch { /* ok if denied */ }
  }, [caseStudyId, supabase]);

  const handleSubmit = useCallback(async () => {
    if (!submission || submitting) return;
    setSubmitting(true);
    setExamError(null);

    const timeSpent = submission.started_at
      ? Math.round((Date.now() - new Date(submission.started_at).getTime()) / 1000)
      : 0;

    const signals = {
      tab_switches: tabSwitches,
      paste_count: pasteCount,
      fullscreen_exits: fullscreenExits,
      time_spent_seconds: timeSpent,
    };

    // Phase 1: persist the answer immediately. Even if Gemini fails,
    // the candidate's work is saved.
    const { error: saveError } = await supabase
      .from("submissions")
      .update({
        answer: answerRef.current,
        submitted_at: new Date().toISOString(),
        status: "submitted",
        integrity_signals: signals,
      })
      .eq("id", submission.id);

    if (saveError) {
      setExamError(saveError.message);
      setSubmitting(false);
      return;
    }

    // Exit fullscreen before showing the scoring overlay.
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch { /* ok */ }

    // Phase 2: ask the API to grade the submission.
    setScoringStatus("scoring");
    setSubmitted(true);

    try {
      const response = await fetch("/api/score-submission", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Scoring failed");
      }
      setScore(data.score);
      setScoreBreakdown(data.scoreBreakdown);
      setScoringStatus("done");
    } catch (err) {
      console.error("Scoring failed:", err);
      setScoringStatus("failed");
    }
  }, [submission, submitting, tabSwitches, pasteCount, fullscreenExits, supabase]);

  // Load case study and create/resume submission
  useEffect(() => {
    async function init() {
      const cs = CASE_STUDIES.find((c) => c.id === caseStudyId);
      if (!cs) { router.push("/results"); return; }
      setCaseStudy(cs);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Check for existing in-progress submission
      const { data: existing } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", user.id)
        .eq("case_study_id", caseStudyId)
        .eq("status", "in_progress")
        .maybeSingle();

      if (existing) {
        setSubmission(existing as Submission);
        setAnswer(existing.answer || "");
        setHonorAccepted(true); // Already started
      }
    }
    init();
  }, [caseStudyId, router, supabase]);

  // Timer countdown
  useEffect(() => {
    if (!submission?.started_at || !caseStudy) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - new Date(submission.started_at!).getTime()) / 1000;
      const remaining = caseStudy.estimatedMinutes * 60 - elapsed;
      setTimeLeft(Math.max(0, Math.round(remaining)));

      if (remaining <= 0) {
        clearInterval(interval);
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [submission?.started_at, caseStudy, handleSubmit]);

  // Anti-cheat: visibility change
  useEffect(() => {
    if (!honorAccepted) return;
    const handler = () => {
      if (document.hidden) setTabSwitches((c) => c + 1);
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [honorAccepted]);

  // Block tab close while Gemini is scoring (otherwise the user loses the result).
  useEffect(() => {
    if (scoringStatus !== "scoring") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [scoringStatus]);

  // Anti-cheat: fullscreen exit
  useEffect(() => {
    if (!honorAccepted) return;
    const handler = () => {
      if (!document.fullscreenElement) setFullscreenExits((c) => c + 1);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [honorAccepted]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!submission) return;
    autoSaveTimer.current = setInterval(async () => {
      if (answerRef.current !== undefined) {
        await supabase
          .from("submissions")
          .update({ answer: answerRef.current })
          .eq("id", submission.id);
        setLastSaved(new Date());
      }
    }, 10000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [submission, supabase]);

  function handlePaste() {
    setPasteCount((c) => c + 1);
  }

  function handleAnswerChange(value: string) {
    answerRef.current = value;
    setAnswer(value);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Scoring in progress — full-screen overlay with spinner.
  if (submitted && scoringStatus === "scoring") {
    return (
      <div className="min-h-screen bg-pale-sage flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center fade-in">
          <div className="w-20 h-20 rounded-full bg-chalk shadow-2 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-9 h-9 text-sage animate-pulse" strokeWidth={1.75} />
          </div>
          <div className="eyebrow mb-2">Evaluating</div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-3 tracking-tight">
            Your submission is being evaluated...
          </h1>
          <p className="text-charcoal-2 leading-relaxed">
            This usually takes 10–20 seconds. Please don&apos;t close the tab.
          </p>
        </div>
      </div>
    );
  }

  // Submission saved but auto-scoring failed.
  if (submitted && scoringStatus === "failed") {
    return (
      <div className="min-h-screen bg-pale-sage flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center fade-in">
          <div className="w-20 h-20 rounded-full bg-chalk shadow-1 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-charcoal-3 stat-num">—</span>
          </div>
          <div className="eyebrow mb-2">Submitted</div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-3 tracking-tight">
            Saved.
          </h1>
          <p className="text-charcoal-2 mb-8 leading-relaxed">
            Your answer to &ldquo;{caseStudy?.title}&rdquo; was saved, but we couldn&apos;t
            auto-score it just now. You can retry from your dashboard.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Go to dashboard
            </Button>
            <Button
              onClick={() => router.push("/results")}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Explore more careers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Submitted state — show score and LLM feedback (celebratory).
  if (submitted && score !== null) {
    const criteriaMap = scoreBreakdown?.criteria ?? null;
    const writtenFeedback = scoreBreakdown?.writtenFeedback;
    const strengths = scoreBreakdown?.strengths ?? [];
    const improvements = scoreBreakdown?.improvements ?? [];

    return (
      <div className="min-h-screen bg-pale-sage py-12 px-6">
        <div className="max-w-2xl mx-auto fade-in">
          <div className="text-center mb-8">
            <div className="score-reveal">
              <div className="w-28 h-28 rounded-full bg-coral flex items-center justify-center mx-auto mb-6 shadow-2">
                <span className="text-4xl font-bold text-chalk stat-num">{score}</span>
              </div>
            </div>
            <div className="eyebrow mb-2">Submitted</div>
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2 tracking-tight">
              Great work.
            </h1>
            <p className="text-charcoal-2 leading-relaxed">
              Your solution to &ldquo;{caseStudy?.title}&rdquo; has been evaluated.
            </p>
          </div>

          {writtenFeedback && (
            <div className="bg-chalk rounded-[14px] shadow-1 p-6 mb-4 text-left">
              <h3 className="eyebrow mb-3">Reviewer notes</h3>
              <p className="text-sm text-charcoal-2 leading-relaxed">{writtenFeedback}</p>
            </div>
          )}

          {(strengths.length > 0 || improvements.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {strengths.length > 0 && (
                <div className="bg-chalk rounded-[14px] shadow-1 p-6 text-left">
                  <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage" strokeWidth={2} />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
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
                <div className="bg-chalk rounded-[14px] shadow-1 p-6 text-left">
                  <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-coral" strokeWidth={2} />
                    Areas to improve
                  </h3>
                  <ul className="space-y-2">
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

          {criteriaMap && Object.keys(criteriaMap).length > 0 && (
            <div className="bg-chalk rounded-[14px] shadow-1 p-6 mb-8 text-left">
              <h3 className="eyebrow mb-3">Score breakdown</h3>
              {Object.entries(criteriaMap).map(([criterion, value]) => (
                <div
                  key={criterion}
                  className="flex items-center justify-between py-2 border-b border-sage-mist-2 last:border-0"
                >
                  <span className="text-sm text-charcoal-2">{criterion}</span>
                  <span className="text-sm font-semibold text-charcoal stat-num">{value}/100</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {examError && (
              <p className="text-sm text-coral-700 bg-coral-100 rounded-lg px-3 py-2">
                {examError}
              </p>
            )}
            <Button
              onClick={() => router.push("/dashboard")}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Go to dashboard
            </Button>
            <Button
              onClick={() => router.push("/results")}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Explore more careers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Honor code modal
  if (!honorAccepted) {
    return (
      <div className="min-h-screen bg-pale-sage flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-chalk rounded-[14px] shadow-2 p-8 fade-in">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-pale-sage rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-sage" strokeWidth={1.75} />
            </div>
            <div className="eyebrow mb-2">Trust layer</div>
            <h2 className="text-xl font-bold text-charcoal tracking-tight">Honor code</h2>
          </div>

          <div className="space-y-3 text-sm text-charcoal-2 mb-6 leading-relaxed">
            <p>Before starting, please confirm:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-sage font-bold">•</span>
                I will complete this case study using my own knowledge.
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">•</span>
                I understand my tab switches and paste activity are monitored.
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">•</span>
                I will not use AI tools to generate my response.
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">•</span>
                My submission may be reviewed by the case-study company.
              </li>
            </ul>
          </div>

          {examError && (
            <p className="text-sm text-coral-700 bg-coral-100 rounded-lg px-3 py-2 mb-4">
              {examError}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setHonorAccepted(true);
                handleStartExam();
              }}
              variant="primary"
              size="lg"
              className="w-full"
            >
              I agree — start exam
            </Button>
            <button
              onClick={() => router.back()}
              className="w-full text-charcoal-2 py-2 text-sm hover:text-charcoal transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam mode
  return (
    <div className="min-h-screen exam-mode flex flex-col">
      {/* Top bar */}
      <div className="surface-2 flex items-center justify-between px-6 py-3 border-b border-dim">
        <div className="flex items-center gap-4">
          <Logo variant="dark" height={20} priority />
          <span className="sr-only">Apto</span>
          <span className="text-sm text-dim">|</span>
          <span className="text-sm text-pale-sage">{caseStudy?.title}</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Integrity indicators */}
          <div className="flex items-center gap-4 text-xs text-dim">
            {tabSwitches > 0 && (
              <span className="text-warn font-medium">Tab switches: {tabSwitches}</span>
            )}
            {pasteCount > 0 && (
              <span className="text-warn font-medium">Pastes: {pasteCount}</span>
            )}
          </div>

          {/* Timer */}
          {timeLeft !== null && (
            <div className={`text-lg font-mono font-bold ${timeLeft < 300 ? "text-warn" : "text-pale-sage"}`}>
              {formatTime(timeLeft)}
            </div>
          )}

          {/* Auto-save indicator */}
          {lastSaved && (
            <span className="text-xs text-dim">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Brief summary (collapsible) */}
      <div className="surface-2 border-b border-dim px-6 py-4">
        <details>
          <summary className="text-sm text-dim cursor-pointer hover:text-pale-sage transition-colors">
            View brief
          </summary>
          <div className="mt-3 max-w-3xl rounded-[12px] bg-chalk p-5 text-sm leading-relaxed shadow-1">
            <Markdown source={(caseStudy?.body ?? "").replace(/^\s*<img\b[^>]*>\s*\n?/i, "")} />
          </div>
        </details>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col p-6">
        <textarea
          value={answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="Write your solution here…"
          className="flex-1 w-full max-w-4xl mx-auto surface-3 border border-dim rounded-[14px] p-6 text-pale-sage text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage placeholder:text-dim"
        />

        <div className="flex items-center justify-between max-w-4xl mx-auto w-full mt-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-dim">
              {answer.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            {examError && <span className="text-xs text-warn">{examError}</span>}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || answer.trim().length < 10}
            variant="primary"
            size="lg"
          >
            {submitting ? "Submitting…" : "Submit solution"}
          </Button>
        </div>
      </div>
    </div>
  );
}
