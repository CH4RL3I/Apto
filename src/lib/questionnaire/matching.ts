import type { Answers } from "./questions.ts";
import { CASE_STUDIES, type CaseStudy } from "./case-studies.ts";

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
  keywords: string[];
  caseStudy: string;
}

export interface ScoredJob extends Job {
  score: number;
  reasons: string[];
  matchPercent: number;
}

export interface ParsedCV {
  name: string | null;
  education: string | null;
  experience: string[];
  skills: string[];
  languages: string[];
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

export function daySnapshot(cs: CaseStudy): string {
  const skills = cs.skillsTested.slice(0, 3);
  const skillsClause =
    skills.length === 0
      ? ""
      : skills.length === 1
      ? skills[0].toLowerCase()
      : `${skills.slice(0, -1).join(", ").toLowerCase()} and ${skills[skills.length - 1].toLowerCase()}`;
  const handoff = cs.matchesRoles[0];

  const mode = cs.matchesMode ? MODE_LABELS[cs.matchesMode] : null;
  const output = cs.matchesOutput ? OUTPUT_LABELS[cs.matchesOutput] : null;

  if (mode && output) {
    return `A typical day blends ${mode} with work where ${output}. Expect to spend real time on ${skillsClause}${
      handoff ? `, with hand-offs to a ${handoff}` : ""
    }.`;
  }
  if (mode) {
    return `A typical day centers on ${mode}, with focus on ${skillsClause}${
      handoff ? ` and frequent collaboration with a ${handoff}` : ""
    }.`;
  }
  return `A typical day on this case revolves around ${skillsClause}${
    handoff ? `, often alongside a ${handoff}` : ""
  }.`;
}

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
    keywords: [
      "python", "java", "go", "rust", "kotlin", "typescript", "node",
      "backend", "api", "rest", "graphql", "sql", "postgres", "mysql",
      "redis", "docker", "kubernetes", "aws", "gcp", "azure",
      "microservices", "system design", "computer science",
    ],
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
    keywords: [
      "product manager", "product management", "roadmap", "stakeholder",
      "agile", "scrum", "user research", "kpi", "okr", "jira", "figma",
      "a/b", "prioritization", "product strategy", "discovery",
      "specs", "requirements",
    ],
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
    keywords: [
      "figma", "sketch", "adobe xd", "user research", "wireframe",
      "prototype", "ui", "ux", "interaction design", "design system",
      "usability", "user testing", "accessibility", "visual design",
      "product design",
    ],
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
    keywords: [
      "python", "r", "sql", "pandas", "numpy", "scikit", "scikit-learn",
      "tensorflow", "pytorch", "machine learning", "deep learning",
      "statistics", "regression", "classification", "data analysis",
      "jupyter", "data science", "analytics", "ab testing",
      "feature engineering", "computer science", "mathematics",
    ],
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
    keywords: [
      "seo", "sem", "google ads", "facebook ads", "tiktok ads", "ppc",
      "cac", "ltv", "google analytics", "mixpanel", "amplitude",
      "a/b", "growth", "performance marketing", "hubspot",
      "paid acquisition", "funnel", "conversion", "email marketing",
      "lifecycle", "marketing",
    ],
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
    keywords: [
      "consulting", "powerpoint", "excel", "financial modeling",
      "case study", "mckinsey", "bcg", "bain", "oliver wyman",
      "strategy", "due diligence", "stakeholder", "client",
      "advisory", "business analyst", "operations", "transformation",
    ],
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
    keywords: [
      "customer success", "salesforce", "hubspot", "onboarding",
      "renewal", "churn", "account management", "saas", "support",
      "client", "qbr", "expansion", "upsell", "retention",
      "stakeholder",
    ],
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
    keywords: [
      "startup", "founder", "operations", "fundraising", "notion",
      "airtable", "ops", "chief of staff", "early stage", "seed",
      "series a", "hiring", "recruiting", "crm", "pitch deck",
      "entrepreneurship",
    ],
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
    keywords: [
      "venture capital", "vc", "private equity", "investment banking",
      "investment", "due diligence", "financial modeling",
      "valuation", "pitch deck", "term sheet", "excel", "deal",
      "startup", "lp", "gp", "portfolio", "thesis", "cfa",
    ],
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
    keywords: [
      "sports", "marketing", "brand", "sponsorship", "campaign",
      "social media", "fan engagement", "club", "league",
      "events", "athletic", "merchandising", "partnerships",
    ],
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
    keywords: [
      "sports", "data analysis", "python", "r", "sql", "tableau",
      "power bi", "performance analysis", "biomechanics",
      "sports science", "gps", "statistics", "physiology",
      "kinesiology", "match analysis",
    ],
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
    keywords: [
      "motorsport", "racing", "automotive", "mechanical engineering",
      "aerodynamics", "telemetry", "matlab", "cfd", "vehicle dynamics",
      "f1", "formula", "simulink", "ansys", "powertrain",
      "thermodynamics", "tire",
    ],
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
    keywords: [
      "podcast", "audio", "production", "audio editing", "media",
      "broadcast", "ableton", "pro tools", "logic pro", "interview",
      "storytelling", "narrative", "radio", "journalism",
    ],
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
    keywords: [
      "music", "a&r", "label", "artist", "talent", "spotify",
      "streaming", "music production", "music industry", "agency",
      "scouting", "music management", "ableton", "logic pro",
    ],
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
    keywords: [
      "game design", "unity", "unreal", "level design", "narrative",
      "gameplay", "mobile games", "monetization", "retention",
      "progression", "playtesting", "game development", "indie",
      "free to play", "live ops",
    ],
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
    keywords: [
      "journalism", "writing", "research", "reporting", "interview",
      "editor", "publication", "investigation", "news", "media",
      "freelance", "feature", "long form", "foia", "fact-checking",
      "political science",
    ],
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
    keywords: [
      "art history", "museum", "gallery", "exhibition", "art",
      "fine arts", "humanities", "cultural studies", "archives",
      "curator", "contemporary art", "art criticism", "philosophy",
    ],
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
    keywords: [
      "architecture", "autocad", "revit", "rhino", "sketchup",
      "urban planning", "urban design", "construction", "real estate",
      "civil engineering", "bim", "grasshopper", "landscape", "zoning",
    ],
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
    keywords: [
      "luxury", "fashion", "brand management", "retail",
      "merchandising", "lvmh", "kering", "richemont", "premium",
      "buying", "trend", "showroom", "vogue", "consumer goods",
      "marketing",
    ],
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
    keywords: [
      "hospitality", "hotel", "operations", "f&b", "guest",
      "front office", "general manager", "boutique hotel",
      "concierge", "revenue management", "rooms division",
      "ehl", "lausanne", "lobby",
    ],
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
    keywords: [
      "restaurant", "f&b", "hospitality", "menu", "kitchen",
      "operations", "concept", "food", "beverage", "culinary",
      "chef", "sommelier", "barista", "front of house", "p&l",
      "interior design",
    ],
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
    keywords: [
      "events", "festival", "logistics", "production", "venue",
      "sponsorship", "live music", "concert", "operations",
      "vendor management", "ticketing", "stage", "permitting",
      "event production", "event management",
    ],
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
    keywords: [
      "ngo", "non-profit", "nonprofit", "program management",
      "international development", "fieldwork", "humanitarian",
      "social impact", "global health", "monitoring and evaluation",
      "m&e", "grant writing", "unicef", "un", "development studies",
    ],
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
    keywords: [
      "climate", "sustainability", "energy", "cleantech",
      "business development", "sales", "esg", "carbon", "renewable",
      "b2b", "industrial", "decarbonization", "net zero",
      "environmental science", "engineering",
    ],
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
    keywords: [
      "clinical research", "pharma", "biotech", "clinical trial",
      "gcp", "ich", "regulatory", "fda", "ema", "biology",
      "life sciences", "biomedical", "medicine", "nursing", "crf",
      "edc", "monitoring",
    ],
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
    keywords: [
      "creative", "advertising agency", "advertising", "brand",
      "campaign", "art direction", "copywriting", "concept",
      "art director", "adobe", "photoshop", "illustrator",
      "indesign", "after effects", "graphic design", "cannes lions",
    ],
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
    keywords: [
      "sports", "agent", "negotiation", "contract", "athlete",
      "agency", "talent management", "representation", "endorsement",
      "scouting", "sports law", "law school", "jd", "client",
    ],
    caseStudy:
      "A 19-year-old rising star is about to sign their first pro contract — negotiate terms, evaluate 3 club options, and plan the next 4 years.",
  },
];

function buildCvBlob(cv: ParsedCV): string {
  const parts: string[] = [];
  if (cv.education) parts.push(cv.education);
  for (const e of cv.experience ?? []) parts.push(e);
  for (const s of cv.skills ?? []) parts.push(s);
  for (const l of cv.languages ?? []) parts.push(l);
  return parts.join(" \n ").toLowerCase();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function blobMatchesKeyword(blob: string, keyword: string): boolean {
  const k = keyword.toLowerCase().trim();
  if (!k) return false;
  // Match keyword surrounded by start/end of string or non-alphanumeric chars
  // so "vc" doesn't match "device" and "ml" doesn't match "html".
  const re = new RegExp(`(^|[^a-z0-9])${escapeRegex(k)}($|[^a-z0-9])`, "i");
  return re.test(blob);
}

function scoreCvFit(
  job: Job,
  cvBlob: string,
): { score: number; matched: string[] } {
  const matched: string[] = [];
  for (const kw of job.keywords) {
    if (blobMatchesKeyword(cvBlob, kw)) matched.push(kw);
  }
  // 4 points per matched keyword, capped at 30. ~7-8 hits = max.
  const score = Math.min(30, matched.length * 4);
  return { score, matched };
}

function formatCvReason(matched: string[]): string {
  // Title-case keywords and pick the most distinctive (longest) up to 3.
  const ranked = [...matched]
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)
    .map((k) =>
      k
        .split(" ")
        .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" "),
    );
  if (ranked.length === 1) return `Your ${ranked[0]} background fits`;
  if (ranked.length === 2) return `Your ${ranked[0]} and ${ranked[1]} background fits`;
  return `Your background in ${ranked[0]}, ${ranked[1]}, and ${ranked[2]} aligns`;
}

export function scoreJob(
  job: Job,
  answers: Answers,
  cv?: ParsedCV | null,
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

  // CV fit (max 30) — only when a CV is provided
  if (cv) {
    const blob = buildCvBlob(cv);
    if (blob.length > 0) {
      const { score: cvScore, matched } = scoreCvFit(job, blob);
      score += cvScore;
      if (matched.length > 0) {
        reasons.push(formatCvReason(matched));
      }
    }
  }

  return { score: Math.round(score), reasons };
}

export function getMatches(
  answers: Answers,
  cv?: ParsedCV | null,
): ScoredJob[] {
  const countByOpenness: Record<string, number> = {
    precise: 3,
    directional: 4,
    explore: 5,
  };
  const count = countByOpenness[answers.openness ?? ""] ?? 4;

  const scored = JOBS.map((job) => {
    const { score, reasons } = scoreJob(job, answers, cv);
    return { job, score, reasons };
  }).sort((a, b) => b.score - a.score);

  const top = scored.slice(0, count);
  const topScore = top[0]?.score ?? 0;
  // Denominator floor scales with whether CV is present (max possible
  // questionnaire = 108, with CV = 138). Keeps percentages comparable.
  const denom = Math.max(topScore, cv ? 100 : 80);

  return top.map(({ job, score, reasons }) => ({
    ...job,
    score,
    reasons,
    matchPercent: Math.min(98, Math.round((score / denom) * 100)),
  }));
}

// ─── Case study pairing ─────────────────────────────────────
// Given a job, find the case studies whose frontmatter metadata
// best fits it. Uses fields/industries overlap + mode + output match.
function scoreCaseStudyForJob(cs: CaseStudy, job: Job): number {
  let score = 0;
  // Fields overlap (max 9)
  const fieldOverlap = cs.matchesFields.filter((f) =>
    job.fields.includes(f),
  ).length;
  score += Math.min(9, fieldOverlap * 5);
  // Industries overlap (max 8)
  const industryOverlap = cs.matchesIndustries.filter((i) =>
    job.industries.includes(i),
  ).length;
  score += Math.min(8, industryOverlap * 3);
  // Mode match (5)
  if (cs.matchesMode === job.mode) score += 5;
  // Output match (5)
  if (cs.matchesOutput === job.output) score += 5;
  return score;
}

export function findCaseStudiesForJob(
  job: Job,
  limit = 2,
): (CaseStudy & { fitScore: number })[] {
  return CASE_STUDIES.map((cs) => ({
    ...cs,
    fitScore: scoreCaseStudyForJob(cs, job),
  }))
    .filter((cs) => cs.fitScore > 0)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, limit);
}
