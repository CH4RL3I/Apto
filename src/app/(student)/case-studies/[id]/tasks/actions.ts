"use server";

import { createClient } from "@/lib/supabase/server";
import {
  scoreMultiTaskSubmission,
  ScoringError,
  type MultiTaskScore,
} from "@/lib/scoring/multi-task";

export interface TaskResponseEntry {
  taskIndex: number;
  taskType: string;
  response: unknown;
  submittedAt: string;
}

export interface TaskScores {
  overall: number;
  dimensions: { name: string; score: number; feedback: string }[];
}

export async function startMultiTaskSubmission(
  caseStudyId: string,
): Promise<{ submissionId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: existing } = await supabase
    .from("submissions")
    .select("id")
    .eq("user_id", user.id)
    .eq("case_study_id", caseStudyId)
    .eq("is_multi_task", true)
    .eq("status", "in_progress")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    return { submissionId: existing.id as string };
  }

  const { data: inserted, error } = await supabase
    .from("submissions")
    .insert({
      user_id: user.id,
      case_study_id: caseStudyId,
      is_multi_task: true,
      status: "in_progress",
      task_responses: [],
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("startMultiTaskSubmission insert failed", {
      caseStudyId,
      userId: user.id,
      error: error?.message,
    });
    throw new Error(error?.message ?? "Failed to start submission");
  }

  return { submissionId: inserted.id as string };
}

export async function saveTaskResponse(
  submissionId: string,
  taskIndex: number,
  taskType: string,
  response: unknown,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: row, error: loadErr } = await supabase
    .from("submissions")
    .select("id, user_id, task_responses")
    .eq("id", submissionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadErr || !row) {
    console.error("saveTaskResponse load failed", {
      submissionId,
      taskIndex,
      userId: user.id,
      error: loadErr?.message,
    });
    throw new Error(loadErr?.message ?? "Submission not found");
  }

  const existing = Array.isArray(row.task_responses)
    ? (row.task_responses as TaskResponseEntry[])
    : [];

  const next: TaskResponseEntry[] = existing.filter(
    (e) => e.taskIndex !== taskIndex,
  );
  next.push({
    taskIndex,
    taskType,
    response,
    submittedAt: new Date().toISOString(),
  });
  next.sort((a, b) => a.taskIndex - b.taskIndex);

  const { error: updErr } = await supabase
    .from("submissions")
    .update({ task_responses: next })
    .eq("id", submissionId);

  if (updErr) {
    console.error("saveTaskResponse update failed", {
      submissionId,
      taskIndex,
      userId: user.id,
      error: updErr.message,
    });
    throw new Error(updErr.message);
  }
}

export async function acceptHonorCode(submissionId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: row } = await supabase
    .from("submissions")
    .select("id, user_id, integrity_signals")
    .eq("id", submissionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!row) return;

  const existing =
    (row.integrity_signals as Record<string, unknown> | null) ?? {};
  if (existing.honor_code_accepted_at) return;

  await supabase
    .from("submissions")
    .update({
      integrity_signals: {
        ...existing,
        honor_code_accepted_at: new Date().toISOString(),
      },
    })
    .eq("id", submissionId);
}

export interface CompleteResult {
  ok: boolean;
  scores?: TaskScores;
  /**
   * Stable failure code suitable for showing a localised message in the UI.
   * Never contains framework internals.
   */
  errorCode?: ScoringError["code"] | "PERSIST_FAILED" | "UNKNOWN";
  /**
   * Short user-facing message. Server-side details go to console.error only.
   */
  errorMessage?: string;
}

export async function completeMultiTaskSubmission(
  submissionId: string,
  integritySignals?: Record<string, unknown> | null,
): Promise<CompleteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      errorCode: "NOT_AUTHENTICATED",
      errorMessage: "You need to be signed in to score this submission.",
    };
  }

  const { data: row, error: loadErr } = await supabase
    .from("submissions")
    .select("id, user_id, integrity_signals")
    .eq("id", submissionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadErr || !row) {
    console.error("completeMultiTaskSubmission load failed", {
      submissionId,
      userId: user.id,
      error: loadErr?.message,
    });
    return {
      ok: false,
      errorCode: "SUBMISSION_NOT_FOUND",
      errorMessage:
        "We could not find this submission. Try again from your dashboard.",
    };
  }

  // Merge incoming signals on top of any persisted fields (e.g.
  // honor_code_accepted_at recorded earlier in the session).
  if (integritySignals) {
    const existing =
      (row.integrity_signals as Record<string, unknown> | null) ?? {};
    const { error: integrityErr } = await supabase
      .from("submissions")
      .update({
        integrity_signals: { ...existing, ...integritySignals },
      })
      .eq("id", submissionId);
    if (integrityErr) {
      // Non-fatal — log and continue with scoring.
      console.error("completeMultiTaskSubmission integrity update failed", {
        submissionId,
        userId: user.id,
        error: integrityErr.message,
      });
    }
  }

  let scores: MultiTaskScore;
  try {
    scores = await scoreMultiTaskSubmission(submissionId);
  } catch (e) {
    if (e instanceof ScoringError) {
      console.error("completeMultiTaskSubmission scoring failed", {
        submissionId,
        userId: user.id,
        code: e.code,
        message: e.message,
      });
      const userMessage =
        e.code === "MISSING_API_KEY"
          ? "Scoring is temporarily unavailable. Your responses are saved — we'll score in the background."
          : e.code === "GEMINI_TIMEOUT"
          ? "Scoring is taking longer than usual. Your responses are saved — refresh in a minute."
          : e.code === "GEMINI_BAD_SHAPE" || e.code === "GEMINI_FAILED"
          ? "Scoring service returned an unexpected response. Your responses are saved — retry from your dashboard."
          : e.code === "SUBMISSION_NOT_FOUND" || e.code === "CASE_STUDY_NOT_FOUND"
          ? "We could not find this submission to score."
          : e.code === "NO_RESPONSES"
          ? "No task responses were saved for this submission."
          : "Scoring failed. Your responses are saved — retry from your dashboard.";
      return { ok: false, errorCode: e.code, errorMessage: userMessage };
    }
    console.error("completeMultiTaskSubmission unexpected error", {
      submissionId,
      userId: user.id,
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
    });
    return {
      ok: false,
      errorCode: "UNKNOWN",
      errorMessage:
        "Scoring failed unexpectedly. Your responses are saved — retry from your dashboard.",
    };
  }

  const { error: persistErr } = await supabase
    .from("submissions")
    .update({
      task_scores: scores,
      score: scores.overall,
      status: "scored",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (persistErr) {
    console.error("completeMultiTaskSubmission persist failed", {
      submissionId,
      userId: user.id,
      error: persistErr.message,
    });
    // Scores were generated but not saved. Return them so the UI can still
    // show real Gemini scores; flag the persistence issue separately.
    return {
      ok: false,
      scores,
      errorCode: "PERSIST_FAILED",
      errorMessage:
        "Your scores are computed but we could not save them. Try again from your dashboard.",
    };
  }

  return { ok: true, scores };
}
