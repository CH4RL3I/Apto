"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CASE_STUDIES, type CaseStudy } from "@/lib/questionnaire/case-studies";
import type { Submission } from "@/types";
import { Logo } from "@/components/Logo";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const caseStudyId = params.id as string;

  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [honorAccepted, setHonorAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<Record<string, number> | null>(null);

  // Integrity signals
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);

  const answerRef = useRef(answer);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  answerRef.current = answer;

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
        .single();

      if (existing) {
        setSubmission(existing as Submission);
        setAnswer(existing.answer || "");
        setHonorAccepted(true); // Already started
      }
    }
    init();
  }, [caseStudyId]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [submission?.started_at, caseStudy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Anti-cheat: visibility change
  useEffect(() => {
    if (!honorAccepted) return;
    const handler = () => {
      if (document.hidden) setTabSwitches((c) => c + 1);
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [honorAccepted]);

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
  }, [submission]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartExam = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get CV URL from profile to attach to submission
    const { data: profile } = await supabase
      .from("profiles")
      .select("cv_url")
      .eq("user_id", user.id)
      .single();

    const { data: sub } = await supabase
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

    if (sub) {
      setSubmission(sub as Submission);
    }

    // Try fullscreen
    try {
      await document.documentElement.requestFullscreen();
    } catch { /* ok if denied */ }
  }, [caseStudyId, supabase]);

  const handleSubmit = useCallback(async () => {
    if (!submission || submitting) return;
    setSubmitting(true);

    const timeSpent = submission.started_at
      ? Math.round((Date.now() - new Date(submission.started_at).getTime()) / 1000)
      : 0;

    const signals = {
      tab_switches: tabSwitches,
      paste_count: pasteCount,
      fullscreen_exits: fullscreenExits,
      time_spent_seconds: timeSpent,
    };

    // Mock scoring
    const wordCount = answerRef.current.trim().split(/\s+/).length;
    let baseScore: number;
    if (wordCount < 20) baseScore = 45 + Math.random() * 15;
    else if (wordCount < 50) baseScore = 60 + Math.random() * 15;
    else if (wordCount < 150) baseScore = 72 + Math.random() * 15;
    else baseScore = 80 + Math.random() * 12;

    // Generic 4-criterion breakdown derived from skills_tested where present.
    const criteria =
      caseStudy && caseStudy.skillsTested.length > 0
        ? caseStudy.skillsTested.slice(0, 4)
        : ["Analysis", "Structure", "Communication", "Decisiveness"];
    const breakdown: Record<string, number> = {};
    for (const criterion of criteria) {
      breakdown[criterion] = Math.max(
        30,
        Math.min(98, Math.round(baseScore + (Math.random() - 0.5) * 16)),
      );
    }

    await supabase
      .from("submissions")
      .update({
        answer: answerRef.current,
        submitted_at: new Date().toISOString(),
        status: "scored",
        score: Math.round(baseScore),
        score_breakdown: breakdown,
        integrity_signals: signals,
      })
      .eq("id", submission.id);

    // Exit fullscreen
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch { /* ok */ }

    setScore(Math.round(baseScore));
    setScoreBreakdown(breakdown);
    setSubmitted(true);
  }, [submission, submitting, tabSwitches, pasteCount, fullscreenExits, caseStudy, supabase]);

  function handlePaste() {
    setPasteCount((c) => c + 1);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Submitted state - show score
  if (submitted && score !== null) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center fade-in">
          <div className="score-reveal">
            <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
              <span className="text-4xl font-bold text-white">{score}</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Submission Scored!</h1>
          <p className="text-muted mb-8">
            Your solution to &quot;{caseStudy?.title}&quot; has been evaluated.
          </p>

          {scoreBreakdown && (
            <div className="bg-white rounded-xl border border-border p-6 mb-8 text-left">
              <h3 className="font-semibold text-slate-900 mb-4">Score Breakdown</h3>
              {Object.entries(scoreBreakdown).map(([criterion, value]) => (
                <div key={criterion} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-slate-600">{criterion}</span>
                  <span className="text-sm font-semibold text-slate-900">{value}/100</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/results")}
              className="w-full border border-border text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Explore More Careers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Honor code modal
  if (!honorAccepted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-border p-8 fade-in">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Honor Code</h2>
          </div>

          <div className="space-y-3 text-sm text-slate-600 mb-6">
            <p>Before starting, please confirm:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-primary">&#x2022;</span>
                I will complete this case study using my own knowledge
              </li>
              <li className="flex gap-2">
                <span className="text-primary">&#x2022;</span>
                I understand my tab switches and paste activity are monitored
              </li>
              <li className="flex gap-2">
                <span className="text-primary">&#x2022;</span>
                I will not use AI tools to generate my response
              </li>
              <li className="flex gap-2">
                <span className="text-primary">&#x2022;</span>
                My submission may be reviewed by the case-study company
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setHonorAccepted(true);
                handleStartExam();
              }}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              I Agree &mdash; Start Exam
            </button>
            <button
              onClick={() => router.back()}
              className="w-full text-muted py-2 text-sm hover:text-slate-900 transition-colors"
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
      <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <Logo variant="dark" height={20} priority />
          <span className="sr-only">Apto</span>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-sm text-slate-300">{caseStudy?.title}</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Integrity indicators */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            {tabSwitches > 0 && (
              <span className="text-amber-400">Tab switches: {tabSwitches}</span>
            )}
            {pasteCount > 0 && (
              <span className="text-amber-400">Pastes: {pasteCount}</span>
            )}
          </div>

          {/* Timer */}
          {timeLeft !== null && (
            <div className={`text-lg font-mono font-bold ${timeLeft < 300 ? "text-red-400" : "text-white"}`}>
              {formatTime(timeLeft)}
            </div>
          )}

          {/* Auto-save indicator */}
          {lastSaved && (
            <span className="text-xs text-slate-500">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Brief summary (collapsible) */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
        <details>
          <summary className="text-sm text-slate-300 cursor-pointer hover:text-white transition-colors">
            View brief
          </summary>
          <pre className="mt-3 text-sm text-slate-400 leading-relaxed whitespace-pre-wrap font-sans max-w-3xl">
            {caseStudy?.body}
          </pre>
        </details>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col p-6">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onPaste={handlePaste}
          placeholder="Write your solution here..."
          className="flex-1 w-full max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-xl p-6 text-slate-200 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-500"
        />

        <div className="flex items-center justify-between max-w-4xl mx-auto w-full mt-4">
          <span className="text-xs text-slate-500">
            {answer.trim().split(/\s+/).filter(Boolean).length} words
          </span>

          <button
            onClick={handleSubmit}
            disabled={submitting || answer.trim().length < 10}
            className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Solution"}
          </button>
        </div>
      </div>
    </div>
  );
}
