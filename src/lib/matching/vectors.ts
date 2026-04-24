import { DIMENSIONS, QUESTIONS } from "@/lib/constants";
import type { Dimension } from "@/types";

type Answers = Record<number, string | string[] | number>;

export function answersToVector(answers: Answers): number[] {
  const scores: Record<Dimension, number[]> = {
    analytical: [],
    people: [],
    creative: [],
    strategic: [],
    autonomous: [],
    risk_tolerant: [],
    collaborative: [],
    structured: [],
  };

  for (const question of QUESTIONS) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null) continue;

    if (question.type === "slider" && question.sliderConfig) {
      const value = typeof answer === "number" ? answer : parseFloat(answer as string);
      const normalized = value / question.sliderConfig.max;

      for (const [dim, weight] of Object.entries(question.sliderConfig.dimensions.low)) {
        scores[dim as Dimension].push((1 - normalized) * weight);
      }
      for (const [dim, weight] of Object.entries(question.sliderConfig.dimensions.high)) {
        scores[dim as Dimension].push(normalized * weight);
      }
    } else if (question.type === "single-select" && question.options) {
      const selected = question.options.find((o) => o.value === answer);
      if (selected) {
        for (const [dim, weight] of Object.entries(selected.dimensions)) {
          scores[dim as Dimension].push(weight);
        }
      }
    } else if (question.type === "multi-select" && question.options) {
      const selectedValues = Array.isArray(answer) ? answer : [answer];
      for (const val of selectedValues) {
        const selected = question.options.find((o) => o.value === val);
        if (selected) {
          for (const [dim, weight] of Object.entries(selected.dimensions)) {
            scores[dim as Dimension].push(weight);
          }
        }
      }
    }
  }

  // Average the scores for each dimension, default to 0.5 if no data
  return DIMENSIONS.map((dim) => {
    const vals = scores[dim];
    if (vals.length === 0) return 0.5;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  });
}
