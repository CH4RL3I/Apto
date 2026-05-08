import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { track } from "@/lib/posthog";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

const TIMEOUT_MS = 30000;
const RESPONSE_MAX_CHARS = 8000;

interface DimensionScore {
  name: string;
  score: number;
  feedback: string;
}

interface MultiTaskScore {
  overall: number;
  dimensions: DimensionScore[];
}

interface TaskResponseEntry {
  taskIndex: number;
  taskType: string;
  response: unknown;
  submittedAt: string;
}

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

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const submissionId = body?.submissionId;
    if (typeof submissionId !== "string" || !submissionId) {
      return NextResponse.json(
        { error: "submissionId required" },
        { status: 400 },
      );
    }

    const { data: submission } = await supabase
      .from("submissions")
      .select("id, user_id, case_study_id, task_responses, is_multi_task")
      .eq("id", submissionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    const caseStudyId = submission.case_study_id as string;
    const caseStudy = CASE_STUDIES.find((c) => c.id === caseStudyId);
    if (!caseStudy || !caseStudy.tasks || caseStudy.tasks.length === 0) {
      return NextResponse.json(
        { error: "Case study or tasks not found" },
        { status: 404 },
      );
    }

    const responses = Array.isArray(submission.task_responses)
      ? (submission.task_responses as TaskResponseEntry[])
      : [];

    if (responses.length === 0) {
      return NextResponse.json(
        { error: "No task responses to score" },
        { status: 400 },
      );
    }

    const dimensionSet = new Set<string>();
    caseStudy.tasks.forEach((t) =>
      t.scoredOn.forEach((d) => dimensionSet.add(d)),
    );
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: multiTaskScoreSchema as Schema,
        temperature: 0.4,
      },
    });

    const generatePromise = model.generateContent(prompt);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Gemini timeout (30s)")), TIMEOUT_MS);
    });

    const result = await Promise.race([generatePromise, timeoutPromise]);
    const parsed = JSON.parse(result.response.text()) as MultiTaskScore;

    const scores: MultiTaskScore = {
      overall: Math.max(0, Math.min(100, Math.round(parsed.overall))),
      dimensions: (parsed.dimensions ?? []).map((d) => ({
        name: String(d.name),
        score: Math.max(0, Math.min(100, Math.round(d.score))),
        feedback: String(d.feedback ?? ""),
      })),
    };

    await track(user.id, "multi_task_scored", {
      case_study_id: caseStudyId,
      score: scores.overall,
    });

    return NextResponse.json({ scores });
  } catch (error) {
    console.error("Score multi-task error:", error);
    const detail =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json({ error: detail }, { status: 502 });
  }
}
