import type { Answers } from "./questions.ts";

export type ValueKey =
  | "content"
  | "growth"
  | "team"
  | "impact"
  | "flexibility"
  | "salary";

export interface Job {
  id: string;
  title: string;
  subtitle: string;
  fields: string[];
  industries: string[];
  phases: ("startup" | "scaleup" | "corporate")[];
  mode: "deep" | "coordinator" | "mixed" | "reactive";
  output: "creator" | "optimizer" | "enabler" | "advisor";
  values: Record<ValueKey, 1 | 2 | 3>;
  caseStudy: string;
}

export interface ScoredJob extends Job {
  score: number;
  reasons: string[];
  matchPercent: number;
}

const INDUSTRY_LABELS: Record<string, string> = {
  Tech: "Tech",
  Finance: "Finance",
  Healthcare: "Healthcare",
  Consumer: "Consumer",
  Industrial: "Industrial",
  Energy: "Energy",
  Media: "Media",
  Mobility: "Mobility",
  Public: "Public Sector",
  Services: "Services",
  Sport: "Sport",
  Hospitality: "Hospitality",
  Arts: "Arts & Culture",
  RealEstate: "Real Estate",
};

const MODE_LABELS: Record<Job["mode"], string> = {
  deep: "focused solo work",
  coordinator: "stakeholder coordination",
  mixed: "mix of concept and execution",
  reactive: "customer-centric responsiveness",
};

const OUTPUT_LABELS: Record<Job["output"], string> = {
  creator: "you create something tangible",
  optimizer: "you measurably improve systems",
  enabler: "you make others more successful",
  advisor: "you enable decisions",
};

const VALUE_WEIGHTS = [3, 2, 1] as const;

export const JOBS: Job[] = [
  {
    id: "swe-backend",
    title: "Software Engineer (Backend)",
    subtitle: "Tech · Scale-up or enterprise",
    fields: ["Engineering"],
    industries: ["Tech", "Finance", "Healthcare"],
    phases: ["scaleup", "corporate", "startup"],
    mode: "deep",
    output: "creator",
    values: { content: 3, growth: 3, team: 1, impact: 2, flexibility: 3, salary: 3 },
    caseStudy:
      "An API stops scaling under load — find the bottleneck and design a new architecture.",
  },
  {
    id: "pm",
    title: "Product Manager",
    subtitle: "Tech · Scale-up or enterprise",
    fields: ["Product"],
    industries: ["Tech", "Finance", "Healthcare", "Consumer"],
    phases: ["scaleup", "corporate"],
    mode: "coordinator",
    output: "enabler",
    values: { content: 2, growth: 3, team: 3, impact: 3, flexibility: 2, salary: 2 },
    caseStudy:
      "Engineering, Design, and Sales all want different features — prioritize the Q2 roadmap and defend it.",
  },
  {
    id: "ux-designer",
    title: "UX / Product Designer",
    subtitle: "Tech · Media · Consumer",
    fields: ["Design", "Product"],
    industries: ["Tech", "Media", "Consumer"],
    phases: ["startup", "scaleup", "corporate"],
    mode: "mixed",
    output: "creator",
    values: { content: 3, growth: 2, team: 2, impact: 3, flexibility: 2, salary: 2 },
    caseStudy:
      "Redesign the onboarding of a banking app so that users 60+ can get through it without help from support.",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    subtitle: "Tech · Finance · Healthcare",
    fields: ["Data", "Research"],
    industries: ["Tech", "Finance", "Healthcare"],
    phases: ["scaleup", "corporate"],
    mode: "deep",
    output: "advisor",
    values: { content: 3, growth: 3, team: 1, impact: 2, flexibility: 2, salary: 3 },
    caseStudy:
      "Build a model that predicts customer churn 30 days in advance — and explain it to the Head of Product.",
  },
  {
    id: "growth-marketing",
    title: "Growth Marketing Manager",
    subtitle: "Tech · Consumer · Startup / Scale-up",
    fields: ["Marketing", "Data"],
    industries: ["Tech", "Consumer"],
    phases: ["startup", "scaleup"],
    mode: "mixed",
    output: "optimizer",
    values: { content: 2, growth: 3, team: 2, impact: 3, flexibility: 2, salary: 2 },
    caseStudy:
      "CAC payback has climbed to 14 months — test 3 new acquisition channels in 6 weeks.",
  },
  {
    id: "consultant",
    title: "Management Consultant",
    subtitle: "Professional Services · Enterprise",
    fields: ["Finance", "Product"],
    industries: ["Services"],
    phases: ["corporate"],
    mode: "coordinator",
    output: "advisor",
    values: { content: 3, growth: 3, team: 2, impact: 2, flexibility: 1, salary: 3 },
    caseStudy:
      "An enterprise needs to cut 200M in costs over 18 months — build the structure for Phase 1.",
  },
  {
    id: "csm",
    title: "Customer Success Manager",
    subtitle: "SaaS · B2B services",
    fields: ["Customer", "Product"],
    industries: ["Tech", "Services"],
    phases: ["scaleup", "corporate"],
    mode: "reactive",
    output: "enabler",
    values: { content: 2, growth: 2, team: 3, impact: 3, flexibility: 2, salary: 2 },
    caseStudy:
      "An enterprise customer is threatening to churn — figure out why and build a rescue plan with Product.",
  },
  {
    id: "founders-associate",
    title: "Founder's Associate / Chief of Staff",
    subtitle: "Early-stage startup",
    fields: ["Operations", "Product"],
    industries: ["Tech", "Consumer"],
    phases: ["startup"],
    mode: "mixed",
    output: "optimizer",
    values: { content: 3, growth: 3, team: 2, impact: 3, flexibility: 2, salary: 1 },
    caseStudy:
      "In 2 weeks the founder needs a CRM set up, Q3 hires lined up, and a Series A pitch — prioritize.",
  },
  {
    id: "vc-analyst",
    title: "VC Analyst",
    subtitle: "Finance · Venture Capital",
    fields: ["Finance", "Research"],
    industries: ["Finance", "Tech"],
    phases: ["scaleup", "corporate"],
    mode: "deep",
    output: "advisor",
    values: { content: 3, growth: 3, team: 1, impact: 2, flexibility: 2, salary: 3 },
    caseStudy:
      "Evaluate a Series A pitch from a climate-tech startup — recommendation goes to the partner meeting.",
  },
  {
    id: "sports-marketing",
    title: "Sports Marketing Manager",
    subtitle: "Sport · Club or league",
    fields: ["Marketing"],
    industries: ["Sport", "Consumer"],
    phases: ["scaleup", "corporate"],
    mode: "mixed",
    output: "creator",
    values: { content: 3, growth: 2, team: 3, impact: 2, flexibility: 2, salary: 2 },
    caseStudy:
      "Stadium attendance has dropped to 65% — develop a concept that brings the under-30 audience back into the stadium.",
  },
  {
    id: "sports-data",
    title: "Performance Data Analyst (Sport)",
    subtitle: "Sport · Pro club or sports science",
    fields: ["Data", "Research"],
    industries: ["Sport", "Healthcare"],
    phases: ["scaleup", "corporate"],
    mode: "deep",
    output: "advisor",
    values: { content: 3, growth: 3, team: 2, impact: 2, flexibility: 1, salary: 2 },
    caseStudy:
      "A striker loses 12% sprint speed in the second half — analyze GPS and heart-rate data and deliver 2 training recommendations to the coaching staff.",
  },
  {
    id: "motorsport-engineer",
    title: "Motorsport Engineer",
    subtitle: "Sport · Racing team",
    fields: ["Engineering"],
    industries: ["Sport", "Mobility"],
    phases: ["corporate"],
    mode: "deep",
    output: "creator",
    values: { content: 3, growth: 3, team: 2, impact: 1, flexibility: 1, salary: 2 },
    caseStudy:
      "In sector 2 the car is 0.3s per lap slower than the rival — analyze the telemetry and design 3 setup options for qualifying.",
  },
  {
    id: "podcast-producer",
    title: "Podcast Producer / Audio Strategist",
    subtitle: "Media · Indie or label",
    fields: ["Design", "Marketing"],
    industries: ["Media"],
    phases: ["startup", "scaleup"],
    mode: "mixed",
    output: "creator",
    values: { content: 3, growth: 2, team: 2, impact: 2, flexibility: 3, salary: 1 },
    caseStudy:
      "A true-crime show has stalled at 25k weekly listeners — rework the format, guest strategy, and distribution to grow to 100k.",
  },
  {
    id: "music-ar",
    title: "Music A&R / Talent Manager",
    subtitle: "Media · Label or agency",
    fields: ["Marketing", "Research"],
    industries: ["Media", "Arts"],
    phases: ["scaleup", "corporate"],
    mode: "coordinator",
    output: "enabler",
    values: { content: 3, growth: 2, team: 3, impact: 2, flexibility: 2, salary: 2 },
    caseStudy:
      "From 15 unsigned-artist demos, pick 2 to sign — justify with streaming data, social traction, and musical fit with the label.",
  },
  {
    id: "game-designer",
    title: "Game Designer",
    subtitle: "Media · Tech · Studio",
    fields: ["Design", "Product"],
    industries: ["Media", "Tech"],
    phases: ["startup", "scaleup", "corporate"],
    mode: "mixed",
    output: "creator",
    values: { content: 3, growth: 2, team: 3, impact: 2, flexibility: 2, salary: 2 },
    caseStudy:
      "A mobile game has 45% D1 retention but only 8% D30 — find the drop-off and design a new progression loop.",
  },
  {
    id: "investigative-journalist",
    title: "Investigative Journalist",
    subtitle: "Media · Public Interest",
    fields: ["Research", "Design"],
    industries: ["Media", "Public"],
    phases: ["scaleup", "corporate", "startup"],
    mode: "deep",
    output: "advisor",
    values: { content: 3, growth: 2, team: 1, impact: 3, flexibility: 2, salary: 1 },
    caseStudy:
      "Anonymous sources point to corruption in a city administration — spend 6 weeks investigating and substantiate the allegations with 3 independent sources.",
  },
  {
    id: "curator",
    title: "Curator (Museum / Gallery)",
    subtitle: "Arts · Cultural institution",
    fields: ["Research", "Design"],
    industries: ["Arts"],
    phases: ["corporate"],
    mode: "deep",
    output: "creator",
    values: { content: 3, growth: 1, team: 2, impact: 3, flexibility: 3, salary: 1 },
    caseStudy:
      "Curate an exhibition on women in 70s conceptual art — artist selection, spatial staging, and a companion program for 20 works.",
  },
  {
    id: "architect",
    title: "Architect / Urban Designer",
    subtitle: "Real Estate · Urban planning",
    fields: ["Design", "Operations"],
    industries: ["RealEstate"],
    phases: ["scaleup", "corporate"],
    mode: "mixed",
    output: "creator",
    values: { content: 3, growth: 2, team: 2, impact: 3, flexibility: 2, salary: 2 },
    caseStudy:
      "An old-town plot with heritage-protection constraints is going to be developed — design 12 residential units that convince both the authorities and the neighbors.",
  },
  {
    id: "luxury-brand",
    title: "Luxury / Fashion Brand Manager",
    subtitle: "Consumer · Arts · Maison",
    fields: ["Marketing", "Design"],
    industries: ["Consumer", "Arts"],
    phases: ["scaleup", "corporate"],
    mode: "mixed",
    output: "creator",
    values: { content: 2, growth: 2, team: 2, impact: 1, flexibility: 2, salary: 3 },
    caseStudy:
      "The house wants to launch a Gen Z line without diluting its exclusivity — positioning, price point, channel strategy.",
  },
  {
    id: "hotel-gm",
    title: "Hotel General Manager (Boutique)",
    subtitle: "Hospitality · Boutique hotels",
    fields: ["Operations", "Customer"],
    industries: ["Hospitality"],
    phases: ["scaleup", "corporate"],
    mode: "reactive",
    output: "enabler",
    values: { content: 2, growth: 2, team: 3, impact: 2, flexibility: 1, salary: 2 },
    caseStudy:
      "Your boutique hotel sits at 4.1/5 on Booking — breakfast and check-in are the recurring complaints. You have 60 days to reach 4.6.",
  },
  {
    id: "restaurant-concept",
    title: "Restaurant Concept Developer",
    subtitle: "Hospitality · F&B · Restaurants",
    fields: ["Product", "Design"],
    industries: ["Hospitality", "Consumer"],
    phases: ["startup", "scaleup"],
    mode: "mixed",
    output: "creator",
    values: { content: 3, growth: 3, team: 3, impact: 2, flexibility: 2, salary: 2 },
    caseStudy:
      "Develop a restaurant concept for a vacant space in Prenzlauer Berg — menu, interior, and a business case with break-even in 18 months.",
  },
  {
    id: "event-manager",
    title: "Festival / Live Event Manager",
    subtitle: "Media · Sport · Live industry",
    fields: ["Operations", "Marketing"],
    industries: ["Media", "Sport", "Hospitality"],
    phases: ["scaleup", "corporate"],
    mode: "coordinator",
    output: "enabler",
    values: { content: 3, growth: 2, team: 3, impact: 2, flexibility: 1, salary: 2 },
    caseStudy:
      "Run a 3-day music festival for 15,000 attendees — lineup curation, logistics, sponsorship, safety, budget €2.5M.",
  },
  {
    id: "ngo-pm",
    title: "NGO Program Manager",
    subtitle: "Public · Non-profit",
    fields: ["Operations", "People"],
    industries: ["Public"],
    phases: ["scaleup", "corporate"],
    mode: "coordinator",
    output: "enabler",
    values: { content: 2, growth: 2, team: 3, impact: 3, flexibility: 2, salary: 1 },
    caseStudy:
      "An education program is reaching only 40% of the planned 2,000 children in Tanzania — diagnose on the ground and build a turnaround plan.",
  },
  {
    id: "climate-bd",
    title: "Climate Tech Business Developer",
    subtitle: "Energy · Tech · Startup / Scale-up",
    fields: ["Sales", "Product"],
    industries: ["Energy", "Tech"],
    phases: ["startup", "scaleup"],
    mode: "coordinator",
    output: "enabler",
    values: { content: 2, growth: 3, team: 2, impact: 3, flexibility: 2, salary: 2 },
    caseStudy:
      "Sell a novel CO2 measurement technology to the steel industry — identify 3 pilot customers and close at least one deal in Q1.",
  },
  {
    id: "cra",
    title: "Clinical Research Associate",
    subtitle: "Healthcare · Pharma · CRO",
    fields: ["Research"],
    industries: ["Healthcare"],
    phases: ["scaleup", "corporate"],
    mode: "deep",
    output: "advisor",
    values: { content: 3, growth: 2, team: 2, impact: 3, flexibility: 1, salary: 2 },
    caseStudy:
      "Coordinate a Phase II study for a diabetes drug — 12 clinics, 200 patients, recruitment in 6 months.",
  },
  {
    id: "creative-director",
    title: "Creative Director (Ad Agency)",
    subtitle: "Media · Services · Creative agency",
    fields: ["Design", "Marketing"],
    industries: ["Media", "Services"],
    phases: ["scaleup", "corporate"],
    mode: "coordinator",
    output: "creator",
    values: { content: 3, growth: 2, team: 2, impact: 2, flexibility: 2, salary: 3 },
    caseStudy:
      "An automotive client is launching its first EV — develop the creative lead concept across campaign, live event, and digital activation.",
  },
  {
    id: "sports-agent",
    title: "Sports Talent Agent",
    subtitle: "Sport · Agency",
    fields: ["Sales", "People"],
    industries: ["Sport", "Media"],
    phases: ["scaleup", "corporate"],
    mode: "reactive",
    output: "enabler",
    values: { content: 2, growth: 2, team: 3, impact: 2, flexibility: 1, salary: 3 },
    caseStudy:
      "A 19-year-old rising star is about to sign their first pro contract — negotiate terms, evaluate 3 club options, and plan the next 4 years.",
  },
];

export function scoreJob(
  job: Job,
  answers: Answers,
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // Fields (max 30)
  const userFields = answers.fields ?? [];
  const fieldMatches = userFields.filter((f) => job.fields.includes(f));
  if (fieldMatches.length > 0) {
    score += Math.min(30, fieldMatches.length * 22);
    reasons.push("Matches your interest in " + fieldMatches.join(" and "));
  }

  // Industries (max 23: 8 for "any" + 15 for overlap)
  const userIndustries = answers.industries ?? [];
  if (userIndustries.includes("any")) {
    score += 8;
  }
  const specificIndustries = userIndustries.filter((i) => i !== "any");
  const industryMatches = specificIndustries.filter((i) =>
    job.industries.includes(i),
  );
  if (industryMatches.length > 0) {
    score += Math.min(15, industryMatches.length * 8);
    const labels = industryMatches.map((i) => INDUSTRY_LABELS[i] ?? i);
    reasons.push("Industry: " + labels.join(", "));
  }

  // Phase (15)
  if (answers.phase === "any" || (answers.phase && job.phases.includes(answers.phase as Job["phases"][number]))) {
    score += 15;
  }

  // Mode (15)
  if (answers.mode && answers.mode === job.mode) {
    score += 15;
    reasons.push("Work style: " + MODE_LABELS[job.mode]);
  }

  // Output (15)
  if (answers.output && answers.output === job.output) {
    score += 15;
    reasons.push("Output type: " + OUTPUT_LABELS[job.output]);
  }

  // Values (max 10, normalized from /18)
  const userValues = answers.values ?? [];
  let valueSum = 0;
  for (let i = 0; i < Math.min(VALUE_WEIGHTS.length, userValues.length); i++) {
    const v = userValues[i] as ValueKey;
    const jobPriority = job.values[v];
    if (typeof jobPriority === "number") {
      valueSum += VALUE_WEIGHTS[i] * jobPriority;
    }
  }
  score += (valueSum / 18) * 10;

  return { score: Math.round(score), reasons };
}

export function getMatches(answers: Answers): ScoredJob[] {
  const countByOpenness: Record<string, number> = {
    precise: 3,
    directional: 4,
    explore: 5,
  };
  const count = countByOpenness[answers.openness ?? ""] ?? 4;

  const scored = JOBS.map((job) => {
    const { score, reasons } = scoreJob(job, answers);
    return { job, score, reasons };
  }).sort((a, b) => b.score - a.score);

  const top = scored.slice(0, count);
  const topScore = top[0]?.score ?? 0;
  const denom = Math.max(topScore, 80);

  return top.map(({ job, score, reasons }) => ({
    ...job,
    score,
    reasons,
    matchPercent: Math.min(98, Math.round((score / denom) * 100)),
  }));
}
