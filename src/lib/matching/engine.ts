import { cosineSimilarity } from "./cosine";
import { DIMENSIONS } from "@/lib/constants";
import type { Career, MatchedCareer, Dimension } from "@/types";

const DIMENSION_LABELS: Record<Dimension, string> = {
  analytical: "analytical thinking",
  people: "working with people",
  creative: "creative problem-solving",
  strategic: "strategic planning",
  autonomous: "independent work",
  risk_tolerant: "embracing uncertainty",
  collaborative: "team collaboration",
  structured: "structured processes",
};

function generateExplanation(
  userVector: number[],
  career: Career
): string {
  // Find the top 2 dimensions where user and career vectors align
  const alignments = DIMENSIONS.map((dim, i) => ({
    dimension: dim,
    alignment: 1 - Math.abs(userVector[i] - career.target_vector[i]),
    userScore: userVector[i],
    careerScore: career.target_vector[i],
  }))
    .filter((a) => a.careerScore > 0.5) // Only consider dimensions the career values
    .sort((a, b) => b.alignment - a.alignment);

  const top = alignments.slice(0, 2);

  if (top.length < 2) {
    return `Your profile shows a strong overall alignment with the ${career.title} role. This career could be a great fit for your combination of skills and interests.`;
  }

  return `Your preference for ${DIMENSION_LABELS[top[0].dimension]} and ${DIMENSION_LABELS[top[1].dimension]} aligns strongly with the ${career.title} role. This career emphasizes both of these qualities in day-to-day work.`;
}

export function matchCareers(
  userVector: number[],
  careers: Career[]
): MatchedCareer[] {
  return careers
    .map((career) => ({
      ...career,
      matchScore: cosineSimilarity(userVector, career.target_vector),
      explanation: generateExplanation(userVector, career),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
