// Shared multi-task scoring logic. Called from both the server action
// (`completeMultiTaskSubmission`) and the API route (`/api/score-multi-task`),
// so we don't need a self-referential HTTP hop with cookie forwarding —
// which was the root cause of the production "Server Components render"
// error surfacing on the final-score screen.

import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { track } from "@/lib/posthog";
import { createClient } from "@/lib/supabase/server";

const TIMEOUT_MS = 30000;
const RESPONSE_MAX_CHARS = 8000;

export interface DimensionScore {
  name: string;
  score: number;
  feedback: string;
}

export interface MultiTaskScore {
  overall: number;
  dimensions: DimensionScore[];
}

interface TaskResponseEntry {
  taskIndex: number;
  taskType: string;
  response: unknown;
  submittedAt: string;
}

export class ScoringError extends Error {
  code:
    | "NOT_AUTHENTICATED"
    | "MISSING_API_KEY"
    | "SUBMISSION_NOT_FOUND"
    | "CASE_STUDY_NOT_FOUND"
    | "NO_RESPONSES"
    | "GEMINI_TIMEOUT"
    | "GEMINI_BAD_SHAPE"
    | "GEMINI_FAILED"
    | "UNKNOWN";
  status: number;

  constructor(
    code: ScoringError["code"],
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "ScoringError";
    this.code = code;
    this.status = status;
  }
}

const multiTaskScoreSchema = {
  type: SchemaType.OBJECT,
  required: ["overall", "dimensions"],
  properties: {
    overall: { type: SchemaType.INTEGER },
    dimensions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        required: ["name", "score", "feedback"],
        properties: {
          name: { type: SchemaType.STRING },
          score: { type: SchemaType.INTEGER },
          feedback: { type: SchemaType.STRING },
        },
      },
    },
  },
};

function summariseResponse(response: unknown): string {
  try {
    const json = JSON.stringify(response, null, 2);
    if (json.length > RESPONSE_MAX_CHARS) {
      return json.slice(0, RESPONSE_MAX_CHARS) + "\n\n[... truncated ...]";
    }
    return json;
  } catch {
    return String(response);
  }
}

function clampScoreShape(parsed: unknown): MultiTaskScore {
  if (!parsed || typeof parsed !== "object") {
    throw new ScoringError(
      "GEMINI_BAD_SHAPE",
      "Gemini response was not an object",
      502,
    );
  }
  const p = parsed as { overall?: unknown; dimensions?: unknown };
  if (typeof p.overall !== "number" || !Array.isArray(p.dimensions)) {
    throw new ScoringError(
      "GEMINI_BAD_SHAPE",
      "Gemini response missing overall/dimensions",
      502,
    );
  }
  return {
    overall: Math.max(0, Math.min(100, Math.round(p.overall))),
    dimensions: (p.dimensions as unknown[]).map((d) => {
      const o = (d ?? {}) as { name?: unknown; score?: unknown; feedback?: unknown };
      return {
        name: String(o.name ?? ""),
        score:
          typeof o.score === "number"
            ? Math.max(0, Math.min(100, Math.round(o.score)))
            : 0,
        feedback: String(o.feedback ?? ""),
      };
    }),
  };
}

/**
 * Score a multi-task submission. Reads the submission for the current user
 * (RLS-bound via the server-side supabase client), calls Gemini, and returns
 * the parsed scores. Does NOT persist them — callers decide where to write.
 */
export async function scoreMultiTaskSubmission(
  submissionId: string,
): Promise<MultiTaskScore> {
  if (!process.env.GEMINI_API_KEY) {
    throw new ScoringError(
      "MISSING_API_KEY",
      "GEMINI_API_KEY not configured",
      503,
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new ScoringError("NOT_AUTHENTICATED", "Not authenticated", 401);
  }

  const { data: submission, error: subErr } = await supabase
    .from("submissions")
    .select("id, user_id, case_study_id, task_responses, is_multi_task")
    .eq("id", submissionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (subErr) {
    console.error("score-multi-task submission lookup failed", {
      submissionId,
      userId: user.id,
      error: subErr.message,
    });
    throw new ScoringError("SUBMISSION_NOT_FOUND", "Submission not found", 404);
  }
  if (!submission) {
    throw new ScoringError("SUBMISSION_NOT_FOUND", "Submission not found", 404);
  }

  const caseStudyId = submission.case_study_id as string;
  const caseStudy = CASE_STUDIES.find((c) => c.id === caseStudyId);
  if (!caseStudy || !caseStudy.tasks || caseStudy.tasks.length === 0) {
    throw new ScoringError(
      "CASE_STUDY_NOT_FOUND",
      "Case study or tasks not found",
      404,
    );
  }

  const responses = Array.isArray(submission.task_responses)
    ? (submission.task_responses as TaskResponseEntry[])
    : [];
  if (responses.length === 0) {
    throw new ScoringError("NO_RESPONSES", "No task responses to score", 400);
  }

  const dimensionSet = new Set<string>();
  caseStudy.tasks.forEach((t) => t.scoredOn.forEach((d) => dimensionSet.add(d)));
  const dimensions = Array.from(dimensionSet);

  const reviewerName = caseStudy.companyName ?? "the company";
  const taskBlocks = caseStudy.tasks
    .map((t, i) => {
      const r = responses.find((x) => x.taskIndex === i);
      const responseText = r ? summariseResponse(r.response) : "(no response)";
      return `### Task ${i + 1}: ${t.title} (${t.type})
Scored on: ${t.scoredOn.join(", ")}

Candidate response:
${responseText}`;
    })
    .join("\n\n");

  const prompt = `You are a senior reviewer at ${reviewerName}. Score this multi-task case-study submission across the rubric dimensions below.

CASE STUDY: ${caseStudy.title}
${caseStudy.companyBlock?.tagline ? `Company tagline: ${caseStudy.companyBlock.tagline}` : ""}

RUBRIC DIMENSIONS (one score per dimension, 0-100):
${dimensions.map((d, i) => `${i + 1}. ${d}`).join("\n")}

CANDIDATE TASK RESPONSES (in order):
${taskBlocks}

OUTPUT RULES
- One entry per dimension in "dimensions" — exactly the dimensions listed above, same names.
- Each "score" is an integer 0-100. Vary scores honestly; weak work scores 30-50, strong work 80-95.
- Each "feedback" is 1-2 sentences, addressed to the candidate, citing something specific from their responses.
- "overall" is a 0-100 integer reflecting holistic quality across all tasks (not a strict mean).
- Be honest. The candidate benefits from real assessment.`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: multiTaskScoreSchema as Schema,
      temperature: 0.4,
    },
  });

  let rawText: string;
  try {
    const generatePromise = model.generateContent(prompt);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Gemini timeout (30s)")), TIMEOUT_MS);
    });
    const result = await Promise.race([generatePromise, timeoutPromise]);
    rawText = result.response.text();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("score-multi-task gemini call failed", {
      submissionId,
      userId: user.id,
      error: msg,
      stack: e instanceof Error ? e.stack : undefined,
    });
    const code = /timeout/i.test(msg) ? "GEMINI_TIMEOUT" : "GEMINI_FAILED";
    throw new ScoringError(code, msg, 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    console.error("score-multi-task gemini json parse failed", {
      submissionId,
      userId: user.id,
      rawText: rawText.slice(0, 500),
      error: e instanceof Error ? e.message : String(e),
    });
    throw new ScoringError(
      "GEMINI_BAD_SHAPE",
      "Gemini response was not valid JSON",
      502,
    );
  }

  const scores = clampScoreShape(parsed);

  // Best-effort analytics — never fail scoring on telemetry.
  try {
    await track(user.id, "multi_task_scored", {
      case_study_id: caseStudyId,
      score: scores.overall,
    });
  } catch (e) {
    console.error("score-multi-task track failed", {
      submissionId,
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return scores;
}
