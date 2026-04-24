import type { CaseStudy } from "@/types";

export function mockScore(
  answer: string,
  caseStudy: CaseStudy
): { score: number; breakdown: Record<string, number> } {
  // Generate plausible scores based on answer length/content
  const wordCount = answer.trim().split(/\s+/).length;

  // Base score: longer, more thoughtful answers score higher
  let baseScore: number;
  if (wordCount < 20) baseScore = 45 + Math.random() * 15; // 45-60
  else if (wordCount < 50) baseScore = 60 + Math.random() * 15; // 60-75
  else if (wordCount < 150) baseScore = 72 + Math.random() * 15; // 72-87
  else baseScore = 80 + Math.random() * 12; // 80-92

  // Generate per-rubric breakdown
  const breakdown: Record<string, number> = {};
  if (caseStudy.rubric) {
    for (const item of caseStudy.rubric) {
      // Each criterion score varies +/- 8 from base
      const variance = (Math.random() - 0.5) * 16;
      breakdown[item.criterion] = Math.max(
        30,
        Math.min(98, Math.round(baseScore + variance))
      );
    }
  }

  return {
    score: Math.round(baseScore),
    breakdown,
  };
}
