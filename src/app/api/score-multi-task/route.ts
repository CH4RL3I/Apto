import { NextResponse } from "next/server";
import {
  scoreMultiTaskSubmission,
  ScoringError,
} from "@/lib/scoring/multi-task";

// Thin HTTP wrapper around the shared scoring lib. Kept for backwards-compat
// with any external callers + manual debugging via curl. The server action
// `completeMultiTaskSubmission` calls `scoreMultiTaskSubmission` directly
// (no self-fetch), so this route is no longer on the critical path.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const submissionId = body?.submissionId;
    if (typeof submissionId !== "string" || !submissionId) {
      return NextResponse.json(
        { error: "submissionId required" },
        { status: 400 },
      );
    }

    const scores = await scoreMultiTaskSubmission(submissionId);
    return NextResponse.json({ scores });
  } catch (error) {
    if (error instanceof ScoringError) {
      console.error("score-multi-task route ScoringError", {
        code: error.code,
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    console.error("score-multi-task route unexpected error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    const detail =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json({ error: detail }, { status: 502 });
  }
}
