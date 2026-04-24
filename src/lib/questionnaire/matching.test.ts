import type { Answers } from "./questions.ts";
import { getMatches, scoreJob, JOBS } from "./matching.ts";

let failed = 0;
let passed = 0;

function check(label: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function summarize(label: string, answers: Answers) {
  const matches = getMatches(answers);
  console.log(`\n─── ${label} ───`);
  console.log(
    matches
      .map(
        (m, i) =>
          `  ${i + 1}. ${m.title.padEnd(44)} score=${String(m.score).padStart(3)} match=${m.matchPercent}%`,
      )
      .join("\n"),
  );
  return matches;
}

// ─── Test 1: Sport-targeted user ─────────────────────────────
const sportAnswers: Answers = {
  openness: "directional",
  fields: ["Marketing", "Data"],
  industries: ["Sport", "Media"],
  phase: "scaleup",
  mode: "mixed",
  output: "creator",
  values: ["content", "team", "growth"],
};
const sportMatches = summarize("Sport-targeted user", sportAnswers);
const sportIds = sportMatches.map((m) => m.id);
check(
  "returns 4 matches for openness=directional",
  sportMatches.length === 4,
  `got ${sportMatches.length}`,
);
check(
  "sports-marketing appears in top 3",
  sportIds.slice(0, 3).includes("sports-marketing"),
  `top ids: ${sportIds.slice(0, 3).join(", ")}`,
);
check(
  "top match includes fields/industry reasons",
  sportMatches[0].reasons.some((r) => r.startsWith("Matches your interest")) &&
    sportMatches[0].reasons.some((r) => r.startsWith("Industry:")),
);
check(
  "top match percent is capped at 98",
  sportMatches[0].matchPercent <= 98,
);

// ─── Test 2: Engineering / deep-work / tech ──────────────────
const engAnswers: Answers = {
  openness: "precise",
  fields: ["Engineering"],
  industries: ["Tech", "Finance"],
  phase: "scaleup",
  mode: "deep",
  output: "creator",
  values: ["growth", "content", "salary"],
};
const engMatches = summarize("Engineer-type user", engAnswers);
const engIds = engMatches.map((m) => m.id);
check(
  "returns 3 matches for openness=precise",
  engMatches.length === 3,
  `got ${engMatches.length}`,
);
check(
  "swe-backend is #1 match",
  engIds[0] === "swe-backend",
  `got ${engIds[0]}`,
);

// ─── Test 3: Explorer with 'any' industry ────────────────────
const exploreAnswers: Answers = {
  openness: "explore",
  fields: ["Product", "Design"],
  industries: ["any"],
  phase: "any",
  mode: "mixed",
  output: "creator",
  values: ["impact", "growth", "flexibility"],
};
const exploreMatches = summarize("Explorer with any industry", exploreAnswers);
check(
  "returns 5 matches for openness=explore",
  exploreMatches.length === 5,
  `got ${exploreMatches.length}`,
);
check(
  "all matches get the 'any' industry +8 boost",
  // any phase + any industry means every job scores ≥ 8 (any) + 15 (phase) = 23 before other matches
  exploreMatches.every((m) => m.score >= 23),
);

// ─── Unit: scoreJob values normalization ─────────────────────
const maxValuesJob = JOBS.find((j) => j.id === "restaurant-concept")!; // all team=3, growth=3, content=3
const maxValuesAnswers: Answers = {
  fields: [],
  industries: [],
  values: ["content", "growth", "team"],
};
const valueOnly = scoreJob(maxValuesJob, maxValuesAnswers);
// (3*3 + 2*3 + 1*3) / 18 * 10 = 10
check(
  "values at max yield 10 pts",
  valueOnly.score === 10,
  `got ${valueOnly.score}`,
);

// ─── Unit: fields overlap reasoning ──────────────────────────
const twoFieldAnswers: Answers = {
  fields: ["Design", "Product"],
  industries: [],
  values: [],
};
const uxScore = scoreJob(
  JOBS.find((j) => j.id === "ux-designer")!,
  twoFieldAnswers,
);
check(
  "2-field overlap caps at 30 pts",
  uxScore.score === 30,
  `got ${uxScore.score}`,
);
check(
  "reason lists both matched fields joined with 'and'",
  uxScore.reasons.some((r) => r === "Matches your interest in Design and Product"),
  `reasons: ${JSON.stringify(uxScore.reasons)}`,
);

// ─── Summary ─────────────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
