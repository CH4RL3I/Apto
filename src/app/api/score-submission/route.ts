import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { track } from "@/lib/posthog";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const scoreSchema = {
  type: SchemaType.OBJECT,
  required: ["overall", "criteria", "strengths", "improvements", "writtenFeedback"],
  properties: {
    overall: { type: SchemaType.INTEGER },
    criteria: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        required: ["name", "score", "rationale"],
        properties: {
          name: { type: SchemaType.STRING },
          score: { type: SchemaType.INTEGER },
          rationale: { type: SchemaType.STRING },
        },
      },
    },
    strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    improvements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    writtenFeedback: { type: SchemaType.STRING },
  },
};

const ANSWER_MAX_CHARS = 12000;
const TIMEOUT_MS = 25000;

interface CriterionDetail {
  name: string;
  score: number;
  rationale: string;
}

interface GeminiScoreResponse {
  overall: number;
  criteria: CriterionDetail[];
  strengths: string[];
  improvements: string[];
  writtenFeedback: string;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const submissionId = body?.submissionId;
    if (typeof submissionId !== "string" || !submissionId) {
      return NextResponse.json(
        { ok: false, error: "submissionId required" },
        { status: 400 },
      );
    }

    const { data: submission } = await supabase
      .from("submissions")
      .select("id, user_id, case_study_id, answer, status")
      .eq("id", submissionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!submission) {
      return NextResponse.json({ ok: false, error: "Submission not found" }, { status: 404 });
    }

    const answer = ((submission.answer as string) ?? "").trim();
    if (answer.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Answer is too short to score" },
        { status: 400 },
      );
    }

    const caseStudyId = submission.case_study_id as string;
    const caseStudy = CASE_STUDIES.find((c) => c.id === caseStudyId);
    if (!caseStudy) {
      return NextResponse.json(
        { ok: false, error: "Case study not found" },
        { status: 404 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "GEMINI_API_KEY not configured" },
        { status: 500 },
      );
    }

    const criteria =
      caseStudy.skillsTested.length > 0
        ? caseStudy.skillsTested.slice(0, 5)
        : ["Analysis", "Structure", "Communication", "Decisiveness"];

    const reviewerName = caseStudy.companyName ?? "the company";
    const truncatedAnswer =
      answer.length > ANSWER_MAX_CHARS
        ? answer.slice(0, ANSWER_MAX_CHARS) + "\n\n[... answer truncated ...]"
        : answer;

    const prompt = `You are a senior reviewer at ${reviewerName}. Grade this case-study answer.

CASE STUDY: ${caseStudy.title}

BRIEF (verbatim):
${caseStudy.body}

CRITERIA TO SCORE (0-100 each, integer):
${criteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

CANDIDATE'S ANSWER:
${truncatedAnswer}

OUTPUT RULES
- Score each criterion 0-100. Vary scores; do not put everything in the 80s. A weak answer should score in the 30s-50s.
- "rationale" for each criterion: one short sentence pointing to a specific part of the answer.
- "overall" is a 0-100 integer reflecting the holistic quality (not a strict mean of the criteria).
- "strengths": 2-4 short bullets, each ≤15 words, citing specific things the candidate did well.
- "improvements": 2-4 short bullets, each ≤15 words, naming concrete gaps or unmet asks from the brief.
- "writtenFeedback": 80-160 words, addressed to the candidate ("Your framing..."). Cite specifics. No platitudes.

Be honest. The candidate benefits from a real assessment.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: scoreSchema as Schema,
        temperature: 0.4,
      },
    });

    const generatePromise = model.generateContent(prompt);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Gemini timeout (25s)")), TIMEOUT_MS);
    });

    const result = await Promise.race([generatePromise, timeoutPromise]);
    const parsed = JSON.parse(result.response.text()) as GeminiScoreResponse;

    const criteriaFlat: Record<string, number> = {};
    for (const c of parsed.criteria ?? []) {
      criteriaFlat[c.name] = c.score;
    }

    const scoreBreakdown = {
      criteria: criteriaFlat,
      criteria_detail: parsed.criteria ?? [],
      strengths: parsed.strengths ?? [],
      improvements: parsed.improvements ?? [],
      writtenFeedback: parsed.writtenFeedback ?? "",
      model: "gemini-2.5-flash",
      generated_at: new Date().toISOString(),
    };

    const overall = Math.max(0, Math.min(100, Math.round(parsed.overall)));

    await supabase
      .from("submissions")
      .update({
        score: overall,
        score_breakdown: scoreBreakdown,
        status: "scored",
      })
      .eq("id", submissionId);

    await track(user.id, "case_study_scored", {
      case_study_id: caseStudyId,
      score: overall,
    });

    return NextResponse.json({
      ok: true,
      score: overall,
      scoreBreakdown,
    });
  } catch (error) {
    console.error("Score submission error:", error);
    const detail =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json({ ok: false, error: detail }, { status: 502 });
  }
}
