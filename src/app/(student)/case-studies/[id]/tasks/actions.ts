"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

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
    throw new Error(updErr.message);
  }
}

export async function completeMultiTaskSubmission(
  submissionId: string,
): Promise<{ scores: TaskScores }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: row, error: loadErr } = await supabase
    .from("submissions")
    .select("id, user_id")
    .eq("id", submissionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadErr || !row) {
    throw new Error(loadErr?.message ?? "Submission not found");
  }

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const cookie = hdrs.get("cookie") ?? "";
  const url = `${proto}://${host}/api/score-multi-task`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify({ submissionId }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(
      (detail as { error?: string }).error ?? `Scoring failed (${res.status})`,
    );
  }

  const json = (await res.json()) as { scores: TaskScores };
  const scores = json.scores;

  await supabase
    .from("submissions")
    .update({
      task_scores: scores,
      score: scores.overall,
      status: "scored",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  return { scores };
}
