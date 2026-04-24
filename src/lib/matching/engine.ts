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

// Map CV skills to career relevance (secondary signal)
const CAREER_SKILL_KEYWORDS: Record<string, string[]> = {
  "product-manager": ["product", "project management", "strategy", "communication", "stakeholder", "data analysis", "agile", "roadmap", "presentation"],
  "ux-designer": ["design", "figma", "ux", "ui", "user research", "prototype", "wireframe", "creative", "visual", "css"],
  "data-analyst": ["data", "sql", "python", "statistics", "excel", "analytics", "tableau", "visualization", "machine learning", "r"],
};

function cvSkillBoost(cvSkills: string[], career: Career): number {
  if (!cvSkills || cvSkills.length === 0) return 0;
  const keywords = CAREER_SKILL_KEYWORDS[career.slug] || [];
  if (keywords.length === 0) return 0;

  const lowerSkills = cvSkills.map((s) => s.toLowerCase());
  const matches = keywords.filter((kw) =>
    lowerSkills.some((skill) => skill.includes(kw))
  );

  // Return a small boost (0 to 0.05) based on skill overlap
  return Math.min(0.05, (matches.length / keywords.length) * 0.05);
}

export function matchCareers(
  userVector: number[],
  careers: Career[],
  cvSkills?: string[]
): MatchedCareer[] {
  return careers
    .map((career) => {
      const baseScore = cosineSimilarity(userVector, career.target_vector);
      const skillBoost = cvSkills ? cvSkillBoost(cvSkills, career) : 0;
      return {
        ...career,
        matchScore: Math.min(1, baseScore + skillBoost),
        explanation: generateExplanation(userVector, career),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
