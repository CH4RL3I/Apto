// Author hand-quality multi-task content for every templated case study via Gemini.
//
// Reads `src/lib/questionnaire/case-studies.ts`, parses the JSON-stringify'd
// `CASE_STUDIES` array, and for every entry that is NOT cs-99 calls Gemini
// with a few-shot template derived from cs-99 itself. The model returns a
// JSON object with `tasks`, `desk`, and `companyBlock` fields, which replace
// the existing templated values.
//
// Idempotent: an in-script `_authored: "llm"` sentinel marks already-upgraded
// entries so re-runs skip them. The sentinel is stripped before writing back
// so it never lands in git.
//
// Failures are logged to scripts/.llm-author-skipped.json (gitignored). Build
// safety: invalid responses leave the existing templated data in place.
//
// Usage:
//   node scripts/llm-author-tasks.mjs \
//     --source-dir "/Users/emiliogappa/Downloads/Privat und Geteilt 2/Apto/Case Studies/"
//
// Optional flags:
//   --concurrency 4   max parallel Gemini calls (default 3)
//   --limit 5         cap the number of case studies upgraded this run
//   --only cs-01-pm-feature-cut  restrict to one slug (debugging)

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SchemaType } from "@google/generative-ai";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(SCRIPT_DIR);
const TS_PATH = join(REPO, "src/lib/questionnaire/case-studies.ts");
const ENV_PATH = join(REPO, ".env.local");
const SKIP_LOG = join(SCRIPT_DIR, ".llm-author-skipped.json");

const REFERENCE_ID = "cs-99-ecothread-strategy";
const SKIP_IDS = new Set([REFERENCE_ID]);

// gemini-2.5-flash with thinkingBudget=0 (disabled) — fastest 2.5-class
// model that supports JSON-mode + responseSchema. We call the REST API
// directly so we can pass thinkingConfig (the 0.24 SDK doesn't expose it).
const MODEL_NAME = "gemini-2.5-flash";
const MAX_RETRIES = 2;

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { sourceDir: null, concurrency: 3, limit: Infinity, only: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--source-dir") out.sourceDir = argv[++i];
    else if (a === "--concurrency") out.concurrency = parseInt(argv[++i], 10);
    else if (a === "--limit") out.limit = parseInt(argv[++i], 10);
    else if (a === "--only") out.only = argv[++i];
  }
  if (!out.sourceDir) {
    out.sourceDir = "/Users/emiliogappa/Downloads/Privat und Geteilt 2/Apto/Case Studies/";
  }
  return out;
}

const args = parseArgs(process.argv);

// ---------------------------------------------------------------------------
// .env.local loader (no dotenv dependency)
// ---------------------------------------------------------------------------

function loadEnv() {
  if (!existsSync(ENV_PATH)) return;
  const raw = readFileSync(ENV_PATH, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnv();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY missing — checked process.env and .env.local at", ENV_PATH);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Parse case-studies.ts
// ---------------------------------------------------------------------------

const src = readFileSync(TS_PATH, "utf8");
const START_MARKER = "export const CASE_STUDIES: CaseStudy[] = ";
const arrayStart = src.indexOf(START_MARKER) + START_MARKER.length;
if (arrayStart < START_MARKER.length) throw new Error("CASE_STUDIES marker not found");

let depth = 0;
let arrayEnd = -1;
for (let i = arrayStart; i < src.length; i++) {
  const c = src[i];
  if (c === "[") depth++;
  else if (c === "]") {
    depth--;
    if (depth === 0) {
      arrayEnd = i + 1;
      break;
    }
  }
}
if (arrayEnd === -1) throw new Error("CASE_STUDIES array unterminated");

const header = src.slice(0, arrayStart);
const trailer = src.slice(arrayEnd);
const cases = JSON.parse(src.slice(arrayStart, arrayEnd));

const reference = cases.find((c) => c.id === REFERENCE_ID);
if (!reference || !reference.tasks || !reference.desk || !reference.companyBlock) {
  throw new Error(`Reference entry ${REFERENCE_ID} is missing tasks/desk/companyBlock`);
}

// ---------------------------------------------------------------------------
// Markdown source
// ---------------------------------------------------------------------------

function loadMarkdown(dir) {
  const out = new Map();
  if (!existsSync(dir)) {
    console.warn(`source dir not found: ${dir}`);
    return out;
  }
  const files = readdirSync(dir).filter((f) => /^cs-\d+.*\.md$/.test(f));
  for (const fname of files) {
    const stem = fname.replace(/\s+\d+\.md$/, "").replace(/\.md$/, "");
    if (out.has(stem)) continue;
    out.set(stem, readFileSync(join(dir, fname), "utf8"));
  }
  return out;
}

const mdById = loadMarkdown(args.sourceDir);

// ---------------------------------------------------------------------------
// Gemini schema (mirrors ChallengeTask + desk + companyBlock)
// ---------------------------------------------------------------------------

const ChallengeResource = {
  type: SchemaType.OBJECT,
  required: ["title", "subtitle", "icon"],
  properties: {
    title: { type: SchemaType.STRING },
    subtitle: { type: SchemaType.STRING },
    icon: { type: SchemaType.STRING },
  },
};

const Textarea = (extra = {}) => ({
  type: SchemaType.OBJECT,
  required: Array.from(new Set(["placeholder", "wordLimit", ...(extra.required || [])])),
  properties: {
    label: { type: SchemaType.STRING },
    helperHtml: { type: SchemaType.STRING },
    structureTip: { type: SchemaType.STRING },
    placeholder: { type: SchemaType.STRING },
    wordLimit: { type: SchemaType.INTEGER },
  },
});

const responseSchema = {
  type: SchemaType.OBJECT,
  required: ["tasks", "desk", "companyBlock"],
  properties: {
    tasks: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        // Discriminated union flattened: every field optional except the
        // ones common to all three task types. The validator below enforces
        // type-specific structure.
        required: ["type", "title", "durationMin", "scoredOn"],
        properties: {
          type: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          durationMin: { type: SchemaType.INTEGER },
          scoredOn: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          // analysis
          quickCheck: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING },
              options: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  required: ["text", "correct", "feedback"],
                  properties: {
                    text: { type: SchemaType.STRING },
                    correct: { type: SchemaType.BOOLEAN },
                    feedback: { type: SchemaType.STRING },
                  },
                },
              },
            },
          },
          prompt: { type: SchemaType.STRING },
          dataTable: {
            type: SchemaType.OBJECT,
            properties: {
              columns: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              rows: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              },
            },
          },
          textarea: Textarea(),
          resources: { type: SchemaType.ARRAY, items: ChallengeResource },
          // recommendation
          brief: { type: SchemaType.STRING },
          picker: {
            type: SchemaType.OBJECT,
            properties: {
              label: { type: SchemaType.STRING },
              options: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  required: ["id", "emoji", "name", "sub"],
                  properties: {
                    id: { type: SchemaType.STRING },
                    emoji: { type: SchemaType.STRING },
                    name: { type: SchemaType.STRING },
                    sub: { type: SchemaType.STRING },
                  },
                },
              },
            },
          },
          matching: {
            type: SchemaType.OBJECT,
            properties: {
              instruction: { type: SchemaType.STRING },
              rows: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  required: ["factor", "correctReasonId", "options"],
                  properties: {
                    factor: { type: SchemaType.STRING },
                    correctReasonId: { type: SchemaType.STRING },
                    options: {
                      type: SchemaType.ARRAY,
                      items: {
                        type: SchemaType.OBJECT,
                        required: ["id", "text"],
                        properties: {
                          id: { type: SchemaType.STRING },
                          text: { type: SchemaType.STRING },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          // curveball
          curveballHtml: { type: SchemaType.STRING },
          recapText: { type: SchemaType.STRING },
          insight: {
            type: SchemaType.OBJECT,
            properties: {
              label: { type: SchemaType.STRING },
              text: { type: SchemaType.STRING },
            },
          },
          stancePicker: {
            type: SchemaType.OBJECT,
            properties: {
              options: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  required: ["id", "icon", "title", "sub", "coachingHint"],
                  properties: {
                    id: { type: SchemaType.STRING },
                    icon: { type: SchemaType.STRING },
                    title: { type: SchemaType.STRING },
                    sub: { type: SchemaType.STRING },
                    coachingHint: { type: SchemaType.STRING },
                  },
                },
              },
            },
          },
        },
      },
    },
    desk: {
      type: SchemaType.OBJECT,
      required: ["quote", "authorName", "authorTitle", "authorInitials"],
      properties: {
        quote: { type: SchemaType.STRING },
        authorName: { type: SchemaType.STRING },
        authorTitle: { type: SchemaType.STRING },
        authorInitials: { type: SchemaType.STRING },
      },
    },
    companyBlock: {
      type: SchemaType.OBJECT,
      required: ["tagline", "primaryTag", "secondaryTags", "totalTimeLabel"],
      properties: {
        tagline: { type: SchemaType.STRING },
        primaryTag: { type: SchemaType.STRING },
        secondaryTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        totalTimeLabel: { type: SchemaType.STRING },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Prompt construction
// ---------------------------------------------------------------------------

const SYSTEM_INSTRUCTIONS = `You author multi-task challenges for the Apto career-discovery platform. Each challenge lets a candidate experience what a specific role does on a real day through three connected tasks: analysis, recommendation, curveball.

OUTPUT: a single JSON object with three top-level fields — \`tasks\`, \`desk\`, \`companyBlock\`. No prose, no commentary, no markdown wrapper.

VOICE: realistic, role-specific, coaching. Like a senior practitioner walking a smart junior through a real problem. No business-school clichés. No "leverage / synergy / holistic / robust". Concrete verbs. Specific over generic every time.

LENGTH LIMITS — keep prose tight. Aim for these word counts (NOT character counts) to stay well under output limits:
- desk.quote: 40–70 words (2–3 sentences).
- task titles: 3–6 words each.
- analysis.prompt: 35–70 words.
- analysis.quickCheck.question: ~20 words.
- analysis.quickCheck.options[].text: ~15 words. options[].feedback: ~25 words.
- analysis.textarea.placeholder: 20–35 words.
- recommendation.brief: 25–45 words.
- recommendation.picker.options[].sub: ~10 words.
- recommendation.matching.rows[].factor: ~10 words. options[].text: ~10–15 words.
- recommendation.textarea.helperHtml: 25–40 words. structureTip: 25–45 words.
- curveball.curveballHtml: 50–90 words.
- curveball.recapText: 30–55 words.
- curveball.insight.text: 35–65 words.
- curveball.stancePicker.options[].sub: ~10 words. coachingHint: 25–40 words.

HARD STRUCTURAL RULES:
1. \`tasks\` is an array of EXACTLY 3 items in this order: type "analysis", type "recommendation", type "curveball".
2. analysis.quickCheck.options has EXACTLY 4 items, EXACTLY 1 with correct: true. Distractors plausible.
3. analysis.dataTable: 4–6 rows; columns sensible for the role.
4. analysis.resources: EXACTLY 3 items.
5. recommendation.picker.options: 2–4 items grounded in this specific case.
6. recommendation.matching.rows: EXACTLY 3 rows. Each row has 4 options. Each row's correctReasonId must match one of that row's option ids.
7. recommendation.resources: EXACTLY 3 items.
8. curveball.stancePicker.options: EXACTLY 4 items.
9. durationMin: analysis 30–40, recommendation 25–35, curveball 15–25 (total ~70–90).
10. scoredOn: each task has 2–4 strings from the set {Structure, Judgment, Communication, Composure}.
11. HTML is allowed only inside curveballHtml and helperHtml — only <strong>, <em>, <br> tags.
12. companyBlock.tagline format: "<cluster> · <stage/detail> · <city/scale>". secondaryTags: array of exactly 2 short tags. totalTimeLabel: "~XX min total" (XX = sum of durationMin).

Reference the actual company, role, and situation from the brief throughout — picker options, matching factors, curveball event. Make every artefact feel hand-written for THIS case, never templated.

Match the few-shot example's voice and structure precisely. Treat it as the gold standard.`;

function buildUserPrompt(cs, md) {
  const role = cs.matchesRoles?.[0] || "analyst";
  const company = cs.companyName || "the company";

  // Trim few-shot — keep voice-bearing parts, drop verbose resources arrays
  // (the model is told to produce 3 standard resources per task in the system
  // prompt). Keeps the prompt under ~6k tokens of context.
  const trimResources = (t) => {
    const { resources: _drop, ...rest } = t;
    return rest;
  };
  const fewShot = {
    tasks: reference.tasks.map(trimResources),
    desk: reference.desk,
    companyBlock: {
      tagline: reference.companyBlock.tagline,
      primaryTag: reference.companyBlock.primaryTag,
      secondaryTags: reference.companyBlock.secondaryTags,
      totalTimeLabel: reference.companyBlock.totalTimeLabel,
    },
  };

  const caseFields = {
    id: cs.id,
    title: cs.title,
    cluster: cs.cluster,
    matchesRoles: cs.matchesRoles,
    matchesIndustries: cs.matchesIndustries,
    skillsTested: cs.skillsTested,
    companyName: cs.companyName,
    body: (cs.body || "").slice(0, 1200),
  };

  return [
    "## FEW-SHOT EXAMPLE — match this voice and structure",
    `Reference case: ${reference.title} (cluster: ${reference.cluster}, company: ${reference.companyName}).`,
    "Reference output (note: resources arrays omitted here — produce 3 standard resources per task in your output):",
    JSON.stringify(fewShot),
    "",
    "## YOUR TASK",
    `Author tasks/desk/companyBlock for case "${cs.id}" — role "${role}" at "${company}".`,
    "",
    "Source markdown (German is fine — write your output in English):",
    md ? md.slice(0, 5000) : "(no markdown source — use the case fields)",
    "",
    "Case fields (do not change — author only tasks/desk/companyBlock):",
    JSON.stringify(caseFields),
    "",
    "Output the JSON object now. Specific to THIS case. No commentary outside the JSON. Keep prose tight — every option/feedback/coachingHint/quote should be at or under the word limits in the system prompt.",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validate(out, cs) {
  if (!out || typeof out !== "object") return "not an object";
  if (!Array.isArray(out.tasks) || out.tasks.length !== 3) return "tasks must be array of 3";
  const wantTypes = ["analysis", "recommendation", "curveball"];
  for (let i = 0; i < 3; i++) {
    const t = out.tasks[i];
    if (!t || t.type !== wantTypes[i]) return `task[${i}].type must be ${wantTypes[i]}`;
    if (typeof t.title !== "string" || typeof t.durationMin !== "number") {
      return `task[${i}] missing title/durationMin`;
    }
    if (!Array.isArray(t.scoredOn) || t.scoredOn.length === 0) return `task[${i}] missing scoredOn`;
    if (t.type === "analysis") {
      if (!t.quickCheck?.options || t.quickCheck.options.length !== 4) return "analysis quickCheck needs 4 options";
      const correct = t.quickCheck.options.filter((o) => o.correct).length;
      if (correct !== 1) return `analysis quickCheck must have exactly 1 correct (got ${correct})`;
      if (typeof t.prompt !== "string") return "analysis missing prompt";
      if (!t.textarea?.placeholder) return "analysis missing textarea";
      if (!Array.isArray(t.resources) || t.resources.length < 1) return "analysis missing resources";
    }
    if (t.type === "recommendation") {
      if (!t.picker?.options || t.picker.options.length < 2) return "recommendation picker needs 2+ options";
      if (!t.matching?.rows || t.matching.rows.length !== 3) return "recommendation matching needs 3 rows";
      for (const row of t.matching.rows) {
        if (!Array.isArray(row.options) || row.options.length < 3) return "matching row needs 3+ options";
        if (!row.options.some((o) => o.id === row.correctReasonId)) {
          return `matching correctReasonId "${row.correctReasonId}" not in options`;
        }
      }
      if (!t.textarea?.placeholder) return "recommendation missing textarea";
    }
    if (t.type === "curveball") {
      if (typeof t.curveballHtml !== "string") return "curveball missing curveballHtml";
      if (!t.stancePicker?.options || t.stancePicker.options.length !== 4) return "curveball stancePicker needs 4 options";
      if (!t.insight?.text) return "curveball missing insight";
      if (!t.textarea?.placeholder) return "curveball missing textarea";
    }
  }
  if (!out.desk?.quote || !out.desk?.authorName) return "desk missing quote/authorName";
  if (!out.companyBlock?.tagline || !Array.isArray(out.companyBlock?.secondaryTags)) {
    return "companyBlock missing tagline/secondaryTags";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Gemini call
// ---------------------------------------------------------------------------

// Direct REST call to Gemini — the 0.24 SDK doesn't expose thinkingConfig,
// and thinking-mode adds minutes of latency per call on gemini-2.5-flash.
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

let totalInputTokens = 0;
let totalOutputTokens = 0;

async function callGemini(prompt) {
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      // No responseSchema — providing it caused gemini-2.5-flash to emit
      // degenerate repeated text. The system prompt + explicit schema in
      // the user prompt is enough.
      temperature: 0.6,
      maxOutputTokens: 16384,
      thinkingConfig: { thinkingBudget: 2048 },
    },
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`);
  }
  const j = await res.json();
  const usage = j.usageMetadata || {};
  totalInputTokens += usage.promptTokenCount || 0;
  totalOutputTokens += usage.candidatesTokenCount || 0;
  const cand = j.candidates?.[0];
  const text = cand?.content?.parts?.map((p) => p.text || "").join("") || "";
  const finishReason = cand?.finishReason;
  if (process.env.LLM_DEBUG) {
    console.log("--- chars:", text.length, "tokens:", usage.candidatesTokenCount, "finish:", finishReason);
  }
  if (finishReason === "MAX_TOKENS") {
    throw new Error(`MAX_TOKENS hit (${usage.candidatesTokenCount} tokens) — output truncated`);
  }
  return JSON.parse(text);
}

async function authorOne(cs) {
  const md = mdById.get(cs.id);
  const prompt = buildUserPrompt(cs, md);
  let lastErr = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const out = await callGemini(prompt);
      const err = validate(out, cs);
      if (err) {
        lastErr = `validation: ${err}`;
        continue;
      }
      return { ok: true, data: out };
    } catch (e) {
      lastErr = e?.message || String(e);
      // Linear back-off; quotas need real time.
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  return { ok: false, error: lastErr };
}

// ---------------------------------------------------------------------------
// Main loop with bounded concurrency
// ---------------------------------------------------------------------------

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function take() {
    while (true) {
      const idx = next++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, take));
  return results;
}

// Idempotency: detect templated entries by the deterministic
// `<Company> hiring lead` authorName pattern produced by the upstream
// template script. Hand-authored entries (cs-99 and any LLM-upgraded ones)
// have realistic author names like "Mia Krause".
function isTemplated(cs) {
  return /\bhiring lead$/.test(cs?.desk?.authorName || "");
}

const targets = cases.filter((cs) => {
  if (SKIP_IDS.has(cs.id)) return false;
  if (args.only && cs.id !== args.only) return false;
  if (!isTemplated(cs)) return false; // already hand-quality, skip
  return true;
});

const workQueue = targets.slice(0, args.limit);

console.log(
  `Authoring ${workQueue.length} case studies (skipping cs-99 and ${targets.length - workQueue.length} over --limit). Concurrency: ${args.concurrency}.`,
);

let upgraded = 0;
const skipped = [];
let done = 0;

const startedAt = Date.now();

// Resource icons used as fallbacks if the model omits one or returns junk.
const ICON_FALLBACK = ["📐", "📖", "💬", "📄", "⚡", "🧠"];

// The model occasionally adds extra fields to ChallengeResource (e.g.
// "type", "url", "description") or emits a bare string. Coerce both into
// the expected { title, subtitle, icon } shape.
function sanitizeResource(r, i) {
  if (typeof r === "string") {
    return { title: r, subtitle: "Reference · 2 min read", icon: ICON_FALLBACK[i % ICON_FALLBACK.length] };
  }
  if (!r || typeof r !== "object") {
    return { title: `Resource ${i + 1}`, subtitle: "Reference · 2 min read", icon: ICON_FALLBACK[i % ICON_FALLBACK.length] };
  }
  const out = {};
  out.title = typeof r.title === "string" ? r.title : `Resource ${i + 1}`;
  if (typeof r.subtitle === "string" && r.subtitle.trim()) out.subtitle = r.subtitle;
  else if (typeof r.description === "string") out.subtitle = r.description;
  else if (typeof r.type === "string") out.subtitle = `${r.type[0].toUpperCase() + r.type.slice(1)} · 2 min read`;
  else out.subtitle = "Reference · 2 min read";
  out.icon = typeof r.icon === "string" && r.icon.length <= 4 ? r.icon : ICON_FALLBACK[i % ICON_FALLBACK.length];
  return out;
}

function sanitizeTasks(tasks) {
  for (const t of tasks) {
    if (Array.isArray(t.resources)) t.resources = t.resources.map(sanitizeResource);
  }
  return tasks;
}

await runPool(workQueue, args.concurrency, async (cs) => {
  const t0 = Date.now();
  const r = await authorOne(cs);
  done++;
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  if (r.ok) {
    cs.tasks = sanitizeTasks(r.data.tasks);
    cs.desk = r.data.desk;
    cs.companyBlock = {
      ...(cs.companyBlock || {}),
      ...r.data.companyBlock,
      // preserve existing logoUrl / brand if the model didn't return them
    };
    cs._authored = "llm";
    upgraded++;
    console.log(`  [${done}/${workQueue.length}] ${cs.id} ok (${elapsed}s)`);
  } else {
    skipped.push({ id: cs.id, error: r.error });
    console.warn(`  [${done}/${workQueue.length}] ${cs.id} SKIPPED: ${r.error} (${elapsed}s)`);
  }
});

const totalSec = ((Date.now() - startedAt) / 1000).toFixed(1);

// ---------------------------------------------------------------------------
// Strip in-memory sentinels and write back
// ---------------------------------------------------------------------------

for (const cs of cases) delete cs._authored;

const newArrayText = JSON.stringify(cases, null, 2);
writeFileSync(TS_PATH, header + newArrayText + trailer);

if (skipped.length) {
  writeFileSync(SKIP_LOG, JSON.stringify(skipped, null, 2));
} else if (existsSync(SKIP_LOG)) {
  writeFileSync(SKIP_LOG, "[]");
}

// Rough cost estimate — gemini-2.5-flash list price (May 2025):
//   input  $0.30 / 1M tokens (≤128k context)
//   output $2.50 / 1M tokens
const inputCost = (totalInputTokens / 1_000_000) * 0.3;
const outputCost = (totalOutputTokens / 1_000_000) * 2.5;
const totalCost = inputCost + outputCost;

console.log("");
console.log("---");
console.log(`Done in ${totalSec}s. Upgraded: ${upgraded}. Skipped: ${skipped.length}.`);
console.log(
  `Tokens — input: ${totalInputTokens}, output: ${totalOutputTokens}. Estimated cost: $${totalCost.toFixed(4)} (input $${inputCost.toFixed(4)} + output $${outputCost.toFixed(4)}).`,
);
if (skipped.length) console.log(`Skipped log: ${SKIP_LOG}`);
