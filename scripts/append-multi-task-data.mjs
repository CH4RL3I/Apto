// Generate templated multi-task data for every existing case study.
//
// Reads the existing TypeScript seed file `src/lib/questionnaire/case-studies.ts`,
// parses the `CASE_STUDIES` array as JSON (it's `JSON.stringify`d by
// `build-case-studies.mjs`), and adds three deterministic ChallengeTask entries
// + a `desk` block + a `companyBlock` to each entry.
//
// The hand-authored `cs-99-ecothread-strategy` entry is intentionally LEFT
// UNTOUCHED — it's the reference shape that all other entries should look like.
//
// This is a deterministic, no-LLM template. The output is intentionally generic
// per role-family bucket: PM, Data/Analytics, Sales, Strategy/Consulting,
// Finance/IB, Design/UX, Engineering, and Other. Per-case content is derived
// from the markdown source files at the path below.
//
// Re-run safe: this script overwrites `tasks`, `desk`, and `companyBlock`
// every time. The `body`, `intro`, and existing fields are preserved.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const REPO = "/private/tmp/apto-cs-tasks";
const TS_PATH = join(REPO, "src/lib/questionnaire/case-studies.ts");
const MD_DIR = "/Users/emiliogappa/Downloads/Privat und Geteilt 2/Apto/Case Studies";

const SKIP_IDS = new Set(["cs-99-ecothread-strategy"]);

// ---------------------------------------------------------------------------
// 1. Parse the existing TypeScript seed file
// ---------------------------------------------------------------------------

const src = readFileSync(TS_PATH, "utf8");
const START_MARKER = "export const CASE_STUDIES: CaseStudy[] = ";
const arrayStart = src.indexOf(START_MARKER) + START_MARKER.length;
if (arrayStart < START_MARKER.length) {
  throw new Error("could not find CASE_STUDIES array");
}

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
if (arrayEnd === -1) throw new Error("unterminated CASE_STUDIES array");

const header = src.slice(0, arrayStart);
const trailer = src.slice(arrayEnd);
const arrayText = src.slice(arrayStart, arrayEnd);
const cases = JSON.parse(arrayText);

// ---------------------------------------------------------------------------
// 2. Read markdown source files for richer per-case context
// ---------------------------------------------------------------------------

const mdFiles = readdirSync(MD_DIR).filter((f) => /^cs-\d+.*\.md$/.test(f));
const mdById = new Map();
for (const fname of mdFiles) {
  const stem = fname.replace(/\s+\d+\.md$/, "").replace(/\.md$/, "");
  const raw = readFileSync(join(MD_DIR, fname), "utf8");
  // Don't overwrite if we already have this id (cs-57 has duplicate file
  // " 1.md" — keep the first one we see).
  if (!mdById.has(stem)) mdById.set(stem, raw);
}

function extractRole(md) {
  const m = md.match(/##\s*(Deine Rolle|Your Role)[\s\S]*?\n\n([\s\S]*?)(?=\n##|\n---|$)/);
  if (!m) return null;
  // Pull out the bolded role title or first sentence.
  const blob = m[2];
  const bold = blob.match(/\*\*([^*\n]+)\*\*/);
  return bold ? bold[1].trim() : blob.split(/[.\n]/)[0].trim();
}

// ---------------------------------------------------------------------------
// 3. Role-family bucketing
// ---------------------------------------------------------------------------

// Eight buckets. Bucketing is determined by slug keywords first, then
// matchesFields/matchesRoles fallbacks. Per-bucket content templates live
// in the BUCKET_CONTENT map below.

const BUCKETS = ["pm", "data", "sales", "strategy", "finance", "design", "engineering", "other"];

function bucketFor(cs) {
  const slug = cs.id.toLowerCase();
  const roles = (cs.matchesRoles || []).join(" ").toLowerCase();
  const fields = (cs.matchesFields || []).join(" ").toLowerCase();
  const cluster = (cs.cluster || "").toLowerCase();
  const blob = `${slug} ${roles} ${fields} ${cluster}`;

  // Order matters — earlier rules win.
  if (/\bpm\b|product[ -]?manager|product_management|product-marketing/.test(blob)) return "pm";
  if (/sales|sdr|enterprise-sales|account[ -]?executive|revops/.test(blob)) return "sales";
  if (/data|analytic|ml|machine[ -]?learning|quant|pipeline|forecast|equity[ -]?research|fpa|treasury|aml|fraud/.test(blob)) return "data";
  if (/strategy|consulting|chief[ -]?of[ -]?staff|founder|vc|investment[ -]?memo|ngo|ib-/.test(blob)) return "strategy";
  if (/finance|valuation|audit|wealth|insurtech|claims|portfolio|reimbursement|fundrais|tender|ppa-deal|real[ -]?estate|hotel|m-?and-?a/.test(blob)) return "finance";
  if (/ux|design|copywriter|creative|writing|marketing|seo|lifecycle|growth|brand|community|devrel/.test(blob)) return "design";
  if (/swe|software|engineer|sre|incident|cyber|cloud|iot|mobile|backend|frontend|cybersecurity|tech-cloud/.test(blob)) return "engineering";
  return "other";
}

// ---------------------------------------------------------------------------
// 4. Templated per-bucket task content
// ---------------------------------------------------------------------------

const BUCKET_CONTENT = {
  pm: {
    quickQ: "When you need to cut scope under a hard deadline, which lens carries the most weight for a product manager?",
    quickOpts: [
      ["Maximise the number of features shipped — quantity signals momentum to stakeholders", false, "Shipping more features dilutes focus. The PM job is to protect the few outcomes that move the metric."],
      ["Prioritise by user impact and business risk first, then sequence by engineering effort", true, "Right call. Impact and risk decide what stays; effort only sequences what's already in. Without that order you optimise for the wrong thing."],
      ["Defer to whichever stakeholder shouts loudest — they own the relationship", false, "Loudness is not signal. A PM has to weigh evidence, not volume."],
      ["Keep everything in scope but extend the deadline by two weeks", false, "Extending a roadmap deadline mid-quarter is rarely free — it cascades into hiring, sales commits, and finance plans. Cuts before slips."],
    ],
    promptTemplate: (cs, role) =>
      `You're the ${role} on this challenge. Using the brief above, identify the 2–3 factors that should drive your call. Compare the available options against those factors and explain why your shortlist is the right one to defend in front of the team.`,
    dataTable: {
      columns: ["Factor", "Option A", "Option B", "Option C"],
      rows: [
        ["User impact (estimated)", "High", "Medium", "Low"],
        ["Engineering cost", "8 weeks", "3 weeks", "1 week"],
        ["Strategic fit", "Core roadmap", "Adjacent", "Opportunistic"],
        ["Reversibility", "Hard to undo", "Medium", "Easy"],
      ],
    },
    pickerLabel: "Step 1 — Pick the call you'd take to the team",
    pickerOpts: [
      { id: "ship-core", emoji: "🎯", name: "Ship the core scope", sub: "Cut everything that isn't load-bearing" },
      { id: "stage-it", emoji: "🪜", name: "Stage the launch", sub: "Phase 1 narrow, phase 2 in 6 weeks" },
      { id: "rebalance", emoji: "⚖️", name: "Rebalance with engineering", sub: "Trade scope for tech debt paydown" },
    ],
    matchingRows: [
      {
        factor: "Strong user evidence",
        correctReasonId: "impact",
        options: [
          { id: "impact", text: "Direct signal that the work moves the user metric" },
          { id: "ops", text: "Lower delivery risk for the engineering team" },
          { id: "comms", text: "Cleaner story for the next stakeholder review" },
          { id: "scope", text: "Reduced surface area for QA and rollout" },
        ],
      },
      {
        factor: "Engineering capacity is tight",
        correctReasonId: "scope",
        options: [
          { id: "impact", text: "Direct signal that the work moves the user metric" },
          { id: "ops", text: "Stakeholder relationships need protecting" },
          { id: "comms", text: "Cleaner story for the next stakeholder review" },
          { id: "scope", text: "Smaller scope is the only realistic path to ship" },
        ],
      },
      {
        factor: "Stakeholder pressure from a senior leader",
        correctReasonId: "comms",
        options: [
          { id: "impact", text: "Direct signal that the work moves the user metric" },
          { id: "ops", text: "Lower delivery risk for the engineering team" },
          { id: "comms", text: "Communication needs to land before commitments shift" },
          { id: "scope", text: "Reduced surface area for QA and rollout" },
        ],
      },
    ],
    recommendationStructure: "Lead with your call. Two reasons. One risk and how you'd mitigate it. PMs read recommendations top-down — if your first sentence isn't the answer, the rest gets skimmed.",
    curveballHtml: "It's the morning of your roadmap review. <strong>The CEO just forwarded a feature request from a top-3 customer that wasn't on your list</strong> and is asking you to fit it in. The customer threatened to churn if it isn't on the Q3 roadmap. You have 30 minutes before the review.",
    recapTemplate: (role) =>
      `As the ${role}, my call was to focus on the highest-impact scope and stage the rest. Top risk: stakeholder pushback from teams whose work got deferred. Mitigation: clear comms with named owners and re-evaluation in 6 weeks.`,
    insight: {
      label: "What strong PMs do here",
      text: "Don't reflexively re-open the roadmap because one customer is loud. Don't dismiss the request either — it might be real signal. Triage: is this churn risk real, is the feature actually small, and what does it displace? Answer those three, then take a position.",
    },
    stanceOpts: [
      { id: "absorb", icon: "🧩", title: "Absorb it into scope", sub: "Find a creative way to fit the request without cutting your priorities", coachingHint: "Tempting, but it usually means quiet scope creep. Only credible if the work is genuinely small or shares infrastructure with what's already in." },
      { id: "swap", icon: "🔄", title: "Swap it for something else", sub: "Cut a lower-priority item to make room", coachingHint: "Defensible — but the swap has to be transparent. Name what you're cutting and why this customer signal beats the original signal." },
      { id: "defer", icon: "🗓️", title: "Defer to next quarter", sub: "Acknowledge the request, commit to it later, hold the line now", coachingHint: "Often the right call when churn risk isn't actually that high. Pair it with a concrete commitment date and a workaround." },
      { id: "escalate", icon: "🚨", title: "Escalate to the CEO", sub: "Surface the trade-off explicitly and ask for the call", coachingHint: "Use sparingly — strong PMs make trade-off calls themselves. Reserve this for cases where the strategic stakes outweigh your authority." },
    ],
  },
  data: {
    quickQ: "When a metric moves unexpectedly and leadership wants an answer fast, what's the first move?",
    quickOpts: [
      ["Run a deep regression on every variable to find statistically significant drivers", false, "Too slow. Leadership needs a clear story before they need statistical rigour."],
      ["Decompose the metric into its drivers, isolate the segment that's actually moving, and form a hypothesis", true, "Right move. Decomposition narrows the search space and gives you something you can defend in 20 minutes."],
      ["Wait for more data so the trend is unambiguous", false, "Waiting is rarely the answer when leadership is already asking."],
      ["Email the engineering team to check for instrumentation bugs first", false, "Worth checking, but starting there signals you don't trust your own data without prompting."],
    ],
    promptTemplate: (cs, role) =>
      `You're the ${role}. Decompose the metric in the brief into its main drivers, identify which 2–3 components are actually moving, and form your initial hypothesis. Show your reasoning — the path to the answer matters as much as the answer.`,
    dataTable: {
      columns: ["Segment", "Last quarter", "This quarter", "Delta"],
      rows: [
        ["Segment A", "100", "104", "+4%"],
        ["Segment B", "100", "112", "+12%"],
        ["Segment C", "100", "85", "-15%"],
        ["Segment D", "100", "98", "-2%"],
      ],
    },
    pickerLabel: "Step 1 — Pick the driver you'd lead with",
    pickerOpts: [
      { id: "segment", emoji: "🎯", name: "A specific segment is moving", sub: "Concentrated in one cohort, not the whole base" },
      { id: "season", emoji: "🌀", name: "Seasonality / mix shift", sub: "The underlying mix changed, not the unit metric" },
      { id: "data", emoji: "🔍", name: "An instrumentation issue", sub: "The number isn't real — it's a measurement artefact" },
    ],
    matchingRows: [
      {
        factor: "One segment is moving sharply, the rest are flat",
        correctReasonId: "concentrated",
        options: [
          { id: "concentrated", text: "The driver is concentrated, not systemic — investigate that segment" },
          { id: "broad", text: "Likely a broad market shift" },
          { id: "tooling", text: "Probably a tracking change" },
          { id: "noise", text: "Likely statistical noise — wait it out" },
        ],
      },
      {
        factor: "The total moved but every segment looks similar",
        correctReasonId: "broad",
        options: [
          { id: "concentrated", text: "Look for one outlier segment" },
          { id: "broad", text: "Mix shift or systemic change — investigate the weights" },
          { id: "tooling", text: "Probably a tracking change" },
          { id: "noise", text: "Likely statistical noise — wait it out" },
        ],
      },
      {
        factor: "The number is implausibly large versus history",
        correctReasonId: "tooling",
        options: [
          { id: "concentrated", text: "The driver is concentrated, not systemic" },
          { id: "broad", text: "Likely a broad market shift" },
          { id: "tooling", text: "Suspect instrumentation or definition change first" },
          { id: "noise", text: "Likely statistical noise — wait it out" },
        ],
      },
    ],
    recommendationStructure: "Lead with the driver you believe is doing the work. Two pieces of evidence. One alternative explanation you considered and ruled out. Leadership wants a single answer they can act on, not a list.",
    curveballHtml: "You're 30 minutes from presenting your analysis. <strong>A teammate just told you the underlying source table was repaired this morning and the historical numbers shifted by ~3%.</strong> Some of your conclusions might rest on the old numbers. Leadership still expects you in the room.",
    recapTemplate: (role) =>
      `As the ${role}, my call was that the move is concentrated in a specific segment, not systemic. Top risk: the data refresh changes the picture. Mitigation: rerun the key cuts and call out any conclusions that flip.`,
    insight: {
      label: "What strong analysts do here",
      text: "Don't pretend the data refresh didn't happen. Don't blow up the meeting either. Identify which of your specific conclusions actually depend on the affected numbers, rerun those, and bring both views into the room. Show your work.",
    },
    stanceOpts: [
      { id: "rerun", icon: "🔁", title: "Rerun the key cuts now", sub: "Buy yourself 20 minutes to confirm the headline numbers", coachingHint: "Usually right — a 20-minute rerun beats walking into the room with stale numbers. Make sure you only rerun the cuts that matter." },
      { id: "flag", icon: "🚩", title: "Flag the change in the meeting", sub: "Present the analysis as-is and call out which conclusions might shift", coachingHint: "Honest, but only credible if you actually know which conclusions are at risk. Vague flags damage credibility." },
      { id: "delay", icon: "⏸️", title: "Push the meeting", sub: "Tell leadership you need an extra hour for clean numbers", coachingHint: "Use rarely — pushing a leadership meeting at the last minute is expensive. Only justified if the headline number is materially wrong." },
      { id: "ignore", icon: "🙈", title: "Ignore it", sub: "The shift is small enough not to matter", coachingHint: "Hard to defend. Even if the shift is small, you need to have actually checked." },
    ],
  },
  sales: {
    quickQ: "A high-value deal has gone quiet for three weeks. What's the most useful first move?",
    quickOpts: [
      ["Send a polite check-in email asking if anything has changed", false, "Polite, but rarely moves the deal. You learn nothing about why it stalled."],
      ["Map the buying committee, identify who has actually gone silent, and target a specific re-engagement", true, "Strongest play. Stalled deals usually mean one stakeholder dropped out — find that person."],
      ["Offer a discount to re-create urgency", false, "Discounts late in the cycle train buyers to wait you out. Use only when there's a real timing reason."],
      ["Escalate to your manager and ask them to intervene", false, "Premature. You haven't yet established whether the deal is recoverable on your own."],
    ],
    promptTemplate: (cs, role) =>
      `You're the ${role}. Map the buying committee, identify which roles you have real engagement with and which have gone quiet, and pick the 2–3 levers most likely to move this deal. Show why you ranked the levers in that order.`,
    dataTable: {
      columns: ["Stakeholder", "Last contact", "Sentiment", "Power"],
      rows: [
        ["Economic buyer (CFO)", "3 weeks ago", "Neutral", "High"],
        ["Champion (Head of Ops)", "1 week ago", "Positive", "Medium"],
        ["End user lead", "5 days ago", "Positive", "Low"],
        ["Procurement", "Not yet engaged", "Unknown", "Medium"],
      ],
    },
    pickerLabel: "Step 1 — Pick how you'd unblock the deal",
    pickerOpts: [
      { id: "champion", emoji: "🤝", name: "Lean on the champion", sub: "Get them to surface the real blocker" },
      { id: "exec", emoji: "👔", name: "Multi-thread to the economic buyer", sub: "Bypass silence with a peer-level outreach" },
      { id: "value", emoji: "📊", name: "Reset the value case", sub: "Send a tightened ROI summary anchored to their priorities" },
    ],
    matchingRows: [
      {
        factor: "Champion still warm, economic buyer cold",
        correctReasonId: "thread",
        options: [
          { id: "thread", text: "Multi-thread upward — silence usually means the champion can't sell internally" },
          { id: "discount", text: "Drop price to recreate urgency" },
          { id: "wait", text: "Wait — they'll come back if it's real" },
          { id: "exit", text: "Disqualify the deal and move on" },
        ],
      },
      {
        factor: "No champion identified yet",
        correctReasonId: "champion",
        options: [
          { id: "champion", text: "Find a champion before pushing further" },
          { id: "discount", text: "Drop price to recreate urgency" },
          { id: "wait", text: "Wait — they'll come back if it's real" },
          { id: "exit", text: "Disqualify the deal and move on" },
        ],
      },
      {
        factor: "Procurement not engaged but legal already involved",
        correctReasonId: "exit",
        options: [
          { id: "thread", text: "Multi-thread upward" },
          { id: "discount", text: "Drop price to recreate urgency" },
          { id: "exit", text: "Process risk — pull procurement in early to avoid surprises" },
          { id: "wait", text: "Wait — they'll come back if it's real" },
        ],
      },
    ],
    recommendationStructure: "Lead with the lever you'd pull first. Two reasons. One risk. Reps who hedge get coached. Reps who pick a play and defend it get the deal.",
    curveballHtml: "You finally got your champion on the phone. <strong>Halfway through the call she lets slip that a competitor has been shortlisted alongside you</strong> and the procurement team is doing a side-by-side comparison. You weren't told. The decision is in 10 days.",
    recapTemplate: (role) =>
      `As the ${role}, my call was to lean on the champion and reset the value case. Top risk: silent stakeholder kills the deal at the finish line. Mitigation: a peer-level outreach to the economic buyer this week.`,
    insight: {
      label: "What strong reps do here",
      text: "Don't act betrayed. Don't panic-discount. Treat the competitive shortlist as a signal that you're real and reset around the criteria the buyer is actually using. Strong reps win on framing the comparison, not on price.",
    },
    stanceOpts: [
      { id: "frame", icon: "🎯", title: "Reframe the comparison", sub: "Get back in front of the buyer with the criteria that favour you", coachingHint: "Usually the strongest move. The rep who shapes the buying criteria wins more than the rep who lowers their price." },
      { id: "discount", icon: "💸", title: "Pre-empt with a discount", sub: "Cut price to undercut the competitor", coachingHint: "Easy to do, hard to undo. Train the buyer once that you discount under pressure and you'll do it forever." },
      { id: "exec", icon: "👔", title: "Bring an executive in", sub: "Run an exec-to-exec play to reset the relationship", coachingHint: "Powerful when the deal warrants it. Make sure your exec actually adds something the buyer wants — don't just send them in for status." },
      { id: "qualify", icon: "❓", title: "Re-qualify the deal", sub: "Maybe this isn't winnable — invest where the win rate is higher", coachingHint: "Sometimes the right call. But disqualify on evidence, not on emotion." },
    ],
  },
  strategy: {
    quickQ: "When making a strategic recommendation under time pressure, what gives the recommendation the most credibility?",
    quickOpts: [
      ["Comprehensive market research with every data point covered", false, "Comprehensiveness is rarely what wins the room. A clear argument with the right two or three data points beats a 40-slide deck."],
      ["A clear position with two or three load-bearing reasons and the biggest risk acknowledged", true, "Right. Strong recommendations are short, defensible, and acknowledge the strongest counter-argument up front."],
      ["A long list of options with the pros and cons of each", false, "That's a memo, not a recommendation. The job is to pick."],
      ["Quoting senior leaders or famous frameworks for credibility", false, "Frameworks are scaffolding, not credibility. The argument has to stand on its own logic."],
    ],
    promptTemplate: (cs, role) =>
      `You're the ${role}. Pick the 2–3 dimensions you think matter most for this decision and compare the options against them. Don't try to evaluate every angle — show that you can pick the right lens.`,
    dataTable: {
      columns: ["Dimension", "Option A", "Option B", "Option C"],
      rows: [
        ["Strategic fit", "Strong", "Medium", "Adjacent"],
        ["Time to impact", "12 months", "6 months", "3 months"],
        ["Reversibility", "Hard", "Medium", "Easy"],
        ["Resource intensity", "High", "Medium", "Low"],
      ],
    },
    pickerLabel: "Step 1 — Pick the path you'd recommend",
    pickerOpts: [
      { id: "lean-in", emoji: "🚀", name: "Lean into option A", sub: "Highest strategic fit, slowest payoff" },
      { id: "balanced", emoji: "⚖️", name: "Take option B", sub: "Reasonable fit, balanced timeline" },
      { id: "hedge", emoji: "🧭", name: "Hedge with option C", sub: "Adjacent and fast — but lower ceiling" },
    ],
    matchingRows: [
      {
        factor: "Long-term strategic fit",
        correctReasonId: "fit",
        options: [
          { id: "fit", text: "Compounding value over time" },
          { id: "speed", text: "Faster path to revenue" },
          { id: "risk", text: "Lower execution risk" },
          { id: "optionality", text: "Preserves future optionality" },
        ],
      },
      {
        factor: "Quick wins to fund the next phase",
        correctReasonId: "speed",
        options: [
          { id: "fit", text: "Compounding value over time" },
          { id: "speed", text: "Time-to-impact funds the rest" },
          { id: "risk", text: "Lower execution risk" },
          { id: "optionality", text: "Preserves future optionality" },
        ],
      },
      {
        factor: "Uncertainty about market direction",
        correctReasonId: "optionality",
        options: [
          { id: "fit", text: "Compounding value over time" },
          { id: "speed", text: "Faster path to revenue" },
          { id: "risk", text: "Lower execution risk" },
          { id: "optionality", text: "Keeps future moves open if the market shifts" },
        ],
      },
    ],
    recommendationStructure: "Lead with the recommendation. Two reasons. The biggest risk and one mitigation. Executives skim — your first sentence has to be the answer.",
    curveballHtml: "You sent your recommendation an hour ago. <strong>Your CEO just replied: a competitor announced a similar move yesterday with a much larger budget</strong> and is asking whether your recommendation still holds. Board meeting is in 90 minutes.",
    recapTemplate: (role) =>
      `As the ${role}, my recommendation was the option with strongest strategic fit. Top risk: a competitor moves first and burns the market. Mitigation: phase the rollout so we learn before scaling.`,
    insight: {
      label: "What strong strategists do here",
      text: "Don't flip your recommendation at the first sign of competition — that signals weak conviction. Don't ignore the news either. Pressure-test whether your core logic still holds, take a clear position, and show your reasoning.",
    },
    stanceOpts: [
      { id: "hold", icon: "🎯", title: "Hold the recommendation", sub: "The competitor doesn't change the underlying logic", coachingHint: "Often the strongest move when your original argument was sound. Be explicit about why the new information doesn't change it." },
      { id: "switch", icon: "🔄", title: "Switch to a different option", sub: "The competitive picture changed enough to warrant it", coachingHint: "Defensible only if you can name the specific assumption that broke. 'They're scary' isn't an assumption." },
      { id: "adapt", icon: "⚡", title: "Adapt the approach", sub: "Same recommendation, different execution to differentiate", coachingHint: "Frequently the smartest answer — it shows you can hold a position and update your tactics simultaneously." },
      { id: "delay", icon: "⏸️", title: "Delay the decision", sub: "Get more data before committing", coachingHint: "Hard to justify when the board is meeting in 90 minutes. 'Wait' isn't an answer they can take into the room." },
    ],
  },
  finance: {
    quickQ: "When pricing a deal under uncertainty, what discipline matters most for a junior analyst?",
    quickOpts: [
      ["Always pick the assumption that produces the highest valuation — defend the deal", false, "That's marketing, not analysis. You'll get caught the first time someone stress-tests the model."],
      ["Build a clear base / downside / upside view and explain which assumption each case turns on", true, "Right. The junior who walks senior people through the load-bearing assumption beats the one with five decimal places of false precision."],
      ["Use the average of available comparable transactions as the answer", false, "Comparables anchor the bid, but the load-bearing assumption usually isn't an average."],
      ["Build the most detailed model possible — more rows means more rigour", false, "Rigour is about which assumptions matter, not how many cells you fill in."],
    ],
    promptTemplate: (cs, role) =>
      `You're the ${role}. Lay out a base / downside / upside view of the financial picture in the brief. Identify the 2–3 assumptions the answer actually turns on, and show your reasoning rather than the spreadsheet.`,
    dataTable: {
      columns: ["Driver", "Base", "Downside", "Upside"],
      rows: [
        ["Revenue growth", "8%", "2%", "14%"],
        ["Margin", "22%", "18%", "26%"],
        ["Implied multiple", "12x", "9x", "15x"],
        ["Hold period", "5 yr", "5 yr", "5 yr"],
      ],
    },
    pickerLabel: "Step 1 — Pick the call you'd take to committee",
    pickerOpts: [
      { id: "yes", emoji: "✅", name: "Recommend approval", sub: "Returns are credible across the base case" },
      { id: "negotiate", emoji: "🤝", name: "Approve at a lower price", sub: "Worth doing, but only at materially better terms" },
      { id: "pass", emoji: "🚫", name: "Pass", sub: "Risk-adjusted return doesn't clear the hurdle" },
    ],
    matchingRows: [
      {
        factor: "Returns clear the hurdle in the base case",
        correctReasonId: "yes",
        options: [
          { id: "yes", text: "Returns are real — recommend approval with caveats on monitoring" },
          { id: "neg", text: "Negotiate — only at a lower price" },
          { id: "pass", text: "Risk-adjusted, returns don't clear the hurdle" },
          { id: "wait", text: "Wait for more information" },
        ],
      },
      {
        factor: "Downside case breaks below cost of capital",
        correctReasonId: "neg",
        options: [
          { id: "yes", text: "Recommend approval" },
          { id: "neg", text: "Negotiate price down — the downside is too thin" },
          { id: "pass", text: "Pass" },
          { id: "wait", text: "Wait for more information" },
        ],
      },
      {
        factor: "Key assumption can't be diligenced in the available time",
        correctReasonId: "wait",
        options: [
          { id: "yes", text: "Recommend approval" },
          { id: "neg", text: "Negotiate price down" },
          { id: "pass", text: "Pass" },
          { id: "wait", text: "Defer the decision until the assumption is testable" },
        ],
      },
    ],
    recommendationStructure: "Lead with your call. The 2–3 assumptions it turns on. The one risk you'd flag. Investment committees read first sentences and the risk slide. Lead with the answer.",
    curveballHtml: "Your model is done. <strong>An hour before committee, the seller's broker sends new comparable data showing the asset is priced 12% below recent comps.</strong> The senior partner running the deal is excited; you're not sure the comps are like-for-like.",
    recapTemplate: (role) =>
      `As the ${role}, my call was based on the base-case returns clearing the hurdle. Top risk: the load-bearing assumption is fragile. Mitigation: structure the deal with a price adjustment if the assumption fails to hold.`,
    insight: {
      label: "What strong analysts do here",
      text: "Don't roll over because a senior is excited. Don't reject the new comps reflexively either. Stress-test whether they're actually comparable, restate your view honestly, and let the committee decide with full information.",
    },
    stanceOpts: [
      { id: "rerun", icon: "🔁", title: "Rerun the model with the new comps", sub: "Take the data seriously and update the view", coachingHint: "Right move when the comps look genuinely comparable. Be explicit about which inputs changed." },
      { id: "flag", icon: "🚩", title: "Flag the comps as not like-for-like", sub: "Hold your view and explain the apples-to-oranges issue", coachingHint: "Strong if you can articulate the specific reason — different lease structure, different geography, different vintage. Vague rejection looks like you're protecting your number." },
      { id: "blend", icon: "⚖️", title: "Blend old and new comps", sub: "Show both views and let committee weigh them", coachingHint: "Often the right answer in committee — show both, recommend one, explain why." },
      { id: "fold", icon: "🤝", title: "Fold to the senior partner", sub: "They want the deal — adopt their view", coachingHint: "Don't. Folding to seniority on price is how careers and funds break." },
    ],
  },
  design: {
    quickQ: "When a creative direction has to land for an executive review, what matters most?",
    quickOpts: [
      ["Showing every option you considered so the executive can pick", false, "Designers who present every option signal indecision. Pick one, explain why, show one alternative for context."],
      ["A single recommended direction with a clear rationale and one defensible alternative", true, "Right. Executives want a recommendation, not a menu."],
      ["The most polished mockups possible — visual quality wins the room", false, "Polish helps, but a beautiful direction without a defensible reason still gets cut."],
      ["Asking the executive what they want first, then designing to it", false, "That's outsourcing your judgment. Bring a point of view; iterate from there."],
    ],
    promptTemplate: (cs, role) =>
      `You're the ${role}. Identify the 2–3 audience and brand factors that should drive the direction here. Compare the options against those factors and explain why your shortlist is the right one to defend.`,
    dataTable: {
      columns: ["Factor", "Direction A", "Direction B", "Direction C"],
      rows: [
        ["Audience fit", "Strong", "Medium", "Weak"],
        ["Brand alignment", "Aligned", "Stretch", "Off-brand"],
        ["Execution complexity", "Medium", "Low", "High"],
        ["Differentiation vs peers", "High", "Medium", "Low"],
      ],
    },
    pickerLabel: "Step 1 — Pick the direction you'd take to the executive",
    pickerOpts: [
      { id: "lead", emoji: "🎨", name: "Lead with the brand-aligned direction", sub: "Audience fit is strong, executional risk is contained" },
      { id: "stretch", emoji: "🌱", name: "Take the brand-stretch direction", sub: "Higher upside, more polish needed" },
      { id: "test", emoji: "🧪", name: "Test two directions in parallel", sub: "Lower commitment, more learning" },
    ],
    matchingRows: [
      {
        factor: "Audience signals strongly against an option",
        correctReasonId: "audience",
        options: [
          { id: "audience", text: "Audience fit beats internal preference" },
          { id: "brand", text: "Brand consistency over a one-off win" },
          { id: "speed", text: "Faster execution path" },
          { id: "diff", text: "Differentiation versus competitors" },
        ],
      },
      {
        factor: "Brand consistency is fragile right now",
        correctReasonId: "brand",
        options: [
          { id: "audience", text: "Audience fit beats internal preference" },
          { id: "brand", text: "Protect long-term brand equity over short-term reach" },
          { id: "speed", text: "Faster execution path" },
          { id: "diff", text: "Differentiation versus competitors" },
        ],
      },
      {
        factor: "The category is crowded and look-alike",
        correctReasonId: "diff",
        options: [
          { id: "audience", text: "Audience fit beats internal preference" },
          { id: "brand", text: "Brand consistency over a one-off win" },
          { id: "speed", text: "Faster execution path" },
          { id: "diff", text: "Differentiation is what gets remembered" },
        ],
      },
    ],
    recommendationStructure: "Lead with the direction. Two reasons. One alternative you considered and why you didn't take it. Bring a point of view — that's what gets you trusted with the next brief.",
    curveballHtml: "You shared the recommended direction yesterday. <strong>Overnight, the CEO forwarded a competitor's new campaign that uses a strikingly similar visual language.</strong> She wants to know if you'd still recommend the same direction — and she's presenting to investors tomorrow morning.",
    recapTemplate: (role) =>
      `As the ${role}, my call was the brand-aligned direction with strong audience fit. Top risk: looks too similar to a competitor. Mitigation: differentiate the execution rather than abandon the direction.`,
    insight: {
      label: "What strong creatives do here",
      text: "Don't scrap the direction because someone else got there first. Don't pretend the similarity isn't real either. Identify what's actually shared, find the wedge that makes your version distinct, and bring that to the room.",
    },
    stanceOpts: [
      { id: "differentiate", icon: "✨", title: "Differentiate the execution", sub: "Same direction, distinct expression", coachingHint: "Usually the strongest move. The direction is rarely the issue — the execution is." },
      { id: "pivot", icon: "🔄", title: "Pivot to a fresh direction", sub: "Restart with a new angle", coachingHint: "Risky on a tight timeline. Only credible if the similarity is fundamental, not surface-level." },
      { id: "lean", icon: "💪", title: "Lean into the similarity", sub: "Beat the competitor at their own game", coachingHint: "Rarely the right call. You almost never out-execute a competitor on their territory." },
      { id: "delay", icon: "⏸️", title: "Push the launch", sub: "Buy time to rework the direction", coachingHint: "Hard to justify on the eve of an investor presentation." },
    ],
  },
  engineering: {
    quickQ: "Under incident or hard-deadline pressure, what discipline matters most for an engineer?",
    quickOpts: [
      ["Ship the fastest possible fix and tidy up later", false, "Sometimes right, but as a default it accumulates production debt that bites the next on-call."],
      ["Form a clear hypothesis, verify it, and choose the smallest reversible change that addresses the root cause", true, "Right. Strong engineers reduce blast radius and ship the smallest change that works."],
      ["Roll back to the last known good state immediately", false, "Useful tactic, but reflexive rollback without a hypothesis is just delaying the diagnosis."],
      ["Loop in as many people as possible so nobody can blame you later", false, "Coordination overhead can make incidents worse. Engage people you actually need."],
    ],
    promptTemplate: (cs, role) =>
      `You're the ${role}. Identify the 2–3 technical or operational factors that should drive your call here, compare the options against them, and explain why your shortlist is the right one to defend at the next stand-up.`,
    dataTable: {
      columns: ["Factor", "Option A", "Option B", "Option C"],
      rows: [
        ["Blast radius", "Wide", "Medium", "Narrow"],
        ["Reversibility", "Hard", "Medium", "Easy"],
        ["Time to ship", "1 day", "1 week", "2 weeks"],
        ["Operational debt incurred", "High", "Low", "Medium"],
      ],
    },
    pickerLabel: "Step 1 — Pick the technical call",
    pickerOpts: [
      { id: "minimal", emoji: "🪶", name: "Smallest reversible fix", sub: "Reduce blast radius, accept some debt" },
      { id: "rebuild", emoji: "🛠️", name: "Address the root cause now", sub: "Slower, but pays off the underlying issue" },
      { id: "isolate", emoji: "🚧", name: "Isolate the affected surface", sub: "Contain it behind a flag, fix properly later" },
    ],
    matchingRows: [
      {
        factor: "Active customer impact",
        correctReasonId: "stop",
        options: [
          { id: "stop", text: "Stop the bleeding first — fix root cause after" },
          { id: "root", text: "Address the root cause now" },
          { id: "scope", text: "Reduce surface area for the rollout" },
          { id: "comms", text: "Communicate status to customers" },
        ],
      },
      {
        factor: "Recurring incident with same root cause",
        correctReasonId: "root",
        options: [
          { id: "stop", text: "Stop the bleeding first" },
          { id: "root", text: "Pay the debt now — recurring incidents compound" },
          { id: "scope", text: "Reduce surface area for the rollout" },
          { id: "comms", text: "Communicate status to customers" },
        ],
      },
      {
        factor: "Wide blast radius across services",
        correctReasonId: "scope",
        options: [
          { id: "stop", text: "Stop the bleeding first" },
          { id: "root", text: "Address the root cause now" },
          { id: "scope", text: "Contain the change behind a flag and roll out narrowly" },
          { id: "comms", text: "Communicate status to customers" },
        ],
      },
    ],
    recommendationStructure: "Lead with the call. Two reasons. One risk and the rollback plan. Engineering recommendations get respected when the rollback is cheaper than the deploy.",
    curveballHtml: "You shipped the fix two hours ago. <strong>Monitoring shows the affected metric is improving, but a related service has started throwing intermittent 500s</strong> that look correlated with your change. Your manager is asking whether to roll back. You have 15 minutes to decide.",
    recapTemplate: (role) =>
      `As the ${role}, my call was the smallest reversible change that addressed customer impact. Top risk: a related service degrades. Mitigation: a clear rollback path and metric to trigger it.`,
    insight: {
      label: "What strong engineers do here",
      text: "Don't roll back reflexively if the headline metric is improving — you'll lose the win. Don't ignore the new errors either. Decide which signal is more reliable, set a numeric trigger for rollback, and tell your manager which one you're watching.",
    },
    stanceOpts: [
      { id: "watch", icon: "👀", title: "Hold and watch the metric", sub: "Set a numeric trigger for rollback", coachingHint: "Often the right move when the headline metric is moving the right way. Make the trigger explicit and time-boxed." },
      { id: "rollback", icon: "↩️", title: "Roll back now", sub: "Better safe than sorry", coachingHint: "Defensible if customer impact from the new errors looks broad. Reflexive rollback wastes the win." },
      { id: "patch", icon: "🩹", title: "Forward-fix the new errors", sub: "Smaller patch on top of the existing change", coachingHint: "Sometimes the right answer if the cause is obvious. Risky if you're guessing — you can compound the incident." },
      { id: "escalate", icon: "🚨", title: "Escalate to the wider team", sub: "Pull in more eyes before deciding", coachingHint: "Right when the call is genuinely unclear. Don't use it to avoid making the call yourself." },
    ],
  },
  other: {
    quickQ: "When you're handed an ambiguous brief and a tight deadline, what's the strongest first move?",
    quickOpts: [
      ["Try to do everything the brief mentions to demonstrate effort", false, "Effort isn't the asset. Judgment is. Pick the 2–3 things that matter most."],
      ["Identify the 2–3 factors that matter most, take a position, and prepare to defend it", true, "Right. Strong work narrows the problem before solving it."],
      ["Ask for more information until the brief is unambiguous", false, "Briefs are always ambiguous. Asking for clarity is fine; waiting for it is not."],
      ["Do whatever the most senior person in the room hinted they want", false, "That's not analysis. That's prediction. Bring your own view first."],
    ],
    promptTemplate: (cs, role) =>
      `You're the ${role}. Pick the 2–3 factors you think matter most for this decision and compare the available paths against those factors. Show why you ranked them in that order.`,
    dataTable: {
      columns: ["Factor", "Path A", "Path B", "Path C"],
      rows: [
        ["Stakeholder fit", "Strong", "Medium", "Weak"],
        ["Time to impact", "Long", "Medium", "Short"],
        ["Reversibility", "Hard", "Medium", "Easy"],
        ["Cost", "High", "Medium", "Low"],
      ],
    },
    pickerLabel: "Step 1 — Pick the path you'd recommend",
    pickerOpts: [
      { id: "a", emoji: "🅰️", name: "Take Path A", sub: "Strongest fit, longest payoff" },
      { id: "b", emoji: "🅱️", name: "Take Path B", sub: "Balanced fit and timeline" },
      { id: "c", emoji: "🆎", name: "Take Path C", sub: "Lower cost, lower upside" },
    ],
    matchingRows: [
      {
        factor: "Strong stakeholder fit",
        correctReasonId: "fit",
        options: [
          { id: "fit", text: "Fit drives long-term outcomes" },
          { id: "speed", text: "Faster path to results" },
          { id: "cost", text: "Lower cost in the near term" },
          { id: "risk", text: "Lower execution risk" },
        ],
      },
      {
        factor: "Tight deadline",
        correctReasonId: "speed",
        options: [
          { id: "fit", text: "Fit drives long-term outcomes" },
          { id: "speed", text: "Speed beats perfection on a hard deadline" },
          { id: "cost", text: "Lower cost in the near term" },
          { id: "risk", text: "Lower execution risk" },
        ],
      },
      {
        factor: "Limited budget",
        correctReasonId: "cost",
        options: [
          { id: "fit", text: "Fit drives long-term outcomes" },
          { id: "speed", text: "Faster path to results" },
          { id: "cost", text: "Cost discipline keeps options open later" },
          { id: "risk", text: "Lower execution risk" },
        ],
      },
    ],
    recommendationStructure: "Lead with the recommendation. Two reasons. One risk you'd flag. Strong recommendations are short, defensible, and acknowledge the strongest counter-argument up front.",
    curveballHtml: "You sent your recommendation an hour ago. <strong>Your sponsor just replied with new context that contradicts one of your assumptions</strong> and is asking whether your recommendation still holds. They need an answer before their next meeting in 90 minutes.",
    recapTemplate: (role) =>
      `As the ${role}, my recommendation was the path with the strongest fit for the situation in the brief. Top risk: a key assumption breaks. Mitigation: a checkpoint at week 4 with clear criteria for course-correcting.`,
    insight: {
      label: "What strong people do here",
      text: "Don't flip your recommendation at the first sign of new information — that signals weak conviction. Don't ignore it either. Pressure-test whether your core logic still holds, take a clear position, and explain your reasoning briefly.",
    },
    stanceOpts: [
      { id: "hold", icon: "🎯", title: "Hold the recommendation", sub: "The new information doesn't change the underlying logic", coachingHint: "Often the right move when your original argument was sound. Be explicit about why the new info doesn't change it." },
      { id: "switch", icon: "🔄", title: "Switch to a different path", sub: "The new context changed enough to warrant it", coachingHint: "Defensible only if you can name the specific assumption that broke." },
      { id: "adapt", icon: "⚡", title: "Adapt the approach", sub: "Same recommendation, different execution", coachingHint: "Frequently the smartest answer — it shows you can hold a position and update tactics simultaneously." },
      { id: "delay", icon: "⏸️", title: "Delay the decision", sub: "Get more data before committing", coachingHint: "Hard to justify when the sponsor needs an answer in 90 minutes." },
    ],
  },
};

// ---------------------------------------------------------------------------
// 5. Build tasks / desk / companyBlock for one case study
// ---------------------------------------------------------------------------

function buildTasks(cs, bucket, role) {
  const c = BUCKET_CONTENT[bucket];
  const company = cs.companyName || "the company";
  const placeholderAnalysis = `Write your analysis here. Pick 2–3 factors and compare the options against them. Show your reasoning, not just your conclusion.`;
  const recoBrief = `Based on your analysis, ${company} needs a single clear call. You'll do this in two steps — pick the path, then explain your reasoning and address the biggest risk.`;

  const analysis = {
    type: "analysis",
    title: "Analyse the situation",
    durationMin: 35,
    scoredOn: ["Structure", "Judgment", "Communication"],
    quickCheck: {
      question: c.quickQ,
      options: c.quickOpts.map(([text, correct, feedback]) => ({ text, correct, feedback })),
    },
    prompt: c.promptTemplate(cs, role),
    dataTable: c.dataTable,
    textarea: {
      placeholder: placeholderAnalysis,
      wordLimit: 200,
    },
    resources: [
      { title: "How to evaluate options in 3 steps", subtitle: "Framework card · 2 min read", icon: "📐" },
      { title: "What good reasoning looks like", subtitle: "Glossary · 1 min read", icon: "📖" },
      { title: "Example: how a past analyst structured their answer", subtitle: "Anonymised · passing score", icon: "💬" },
    ],
  };

  const recommendation = {
    type: "recommendation",
    title: "Make your recommendation",
    durationMin: 30,
    scoredOn: ["Structure", "Judgment", "Communication"],
    brief: recoBrief,
    picker: {
      label: c.pickerLabel,
      options: c.pickerOpts,
    },
    matching: {
      instruction: "Connect each factor to the strategic reason it should influence the call. This is how analysts structure a stakeholder-ready recommendation.",
      rows: c.matchingRows,
    },
    textarea: {
      label: "Step 3 — Write your recommendation",
      helperHtml: `Write a short recommendation that ${company}'s leadership can read in 60 seconds. <strong>Lead with your call.</strong> Then two reasons and one risk with mitigation.`,
      structureTip: c.recommendationStructure,
      placeholder: `I recommend [your call] because…`,
      wordLimit: 150,
    },
    resources: [
      { title: "How to write a stakeholder-ready recommendation", subtitle: "Framework · 2 min read", icon: "📄" },
      { title: "Example: anonymised passing recommendation", subtitle: "Opens in side drawer", icon: "💬" },
      { title: "What makes a recommendation weak", subtitle: "Common mistakes · 1 min read", icon: "⚡" },
    ],
  };

  const curveball = {
    type: "curveball",
    title: "Handle the curveball",
    durationMin: 20,
    scoredOn: ["Structure", "Judgment", "Communication", "Composure"],
    curveballHtml: c.curveballHtml,
    recapText: c.recapTemplate(role),
    insight: c.insight,
    stancePicker: { options: c.stanceOpts },
    textarea: {
      label: "Step 2 — Write your response",
      helperHtml: `You have 90 minutes before the next conversation. Write the message you'd send. <strong>100 words max.</strong> Lead with your position, give two reasons, and end with what you'd do next.`,
      placeholder: `My view is…`,
      wordLimit: 100,
    },
  };

  return [analysis, recommendation, curveball];
}

// Pick a sensible role title for desk/quote — prefer the first matchesRoles
// entry, fall back to the role bucket name.
function deskFor(cs, bucket, role) {
  const company = cs.companyName || "the team";
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const quoteByBucket = {
    pm: `What I look for is whether you can hold a position under pressure. Most candidates over-research and under-decide. The strongest ${role}s I've worked with pick a call early and back it with logic — they update when evidence changes, but they don't hedge.`,
    data: `When you bring me an analysis, I want a clear story before I want a perfect model. Show me which two or three numbers actually drive the answer. The ${role}s who go far here are the ones who tell me what to do, not the ones who hand me a dashboard.`,
    sales: `Stalled deals look the same on paper — and behind every one is a different missing person. The reps who win on my team are the ones who diagnose before they pitch. As a ${role}, your job is to find the truth, not to push the contract.`,
    strategy: `I joined ${company} because I wanted to see what happens when smart people pick a direction and stick to it. The ${role}s who impress me take a position early, defend it with two or three load-bearing reasons, and stay open when new evidence shows up.`,
    finance: `Investment committees read the first sentence and the risk slide. As a ${role}, your model is only as strong as the assumptions you can defend out loud. The juniors who go far here can walk me through the load-bearing input in plain English.`,
    design: `Bring a point of view. The ${role}s I trust most pick a direction, show me one alternative they considered and rejected, and tell me why. Designers who present every option signal they don't know which one is right.`,
    engineering: `On-call teaches you fast. As a ${role}, the discipline I look for is reducing blast radius — the smallest reversible change that addresses the actual cause. Speed without that discipline turns into permanent technical debt.`,
    other: `What I look for is judgment under pressure. As a ${role}, your job is to identify the two or three things that matter most, take a position, and defend it cleanly. The candidates who hedge everything rarely make it past the first round.`,
  };

  return {
    quote: quoteByBucket[bucket] || quoteByBucket.other,
    authorName: `${company} hiring lead`,
    authorTitle: `${role} hiring lead · ${company}`,
    authorInitials: initials || "AP",
  };
}

function companyBlockFor(cs, role) {
  const company = cs.companyName || "the team";
  const cluster = (cs.cluster || "")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const totalMin = 35 + 30 + 20; // sum of durationMin across the three tasks
  const tagline = cluster
    ? `${cluster} · ${role} · ${company}`
    : `${role} · ${company}`;
  return {
    tagline,
    primaryTag: cluster || role,
    secondaryTags: [role, `~${totalMin} min`],
    totalTimeLabel: `~${totalMin} min total`,
  };
}

// ---------------------------------------------------------------------------
// 6. Walk every case study and patch
// ---------------------------------------------------------------------------

let updated = 0;
for (const cs of cases) {
  if (SKIP_IDS.has(cs.id)) continue;
  const md = mdById.get(cs.id);
  const role = (md && extractRole(md)) || (cs.matchesRoles && cs.matchesRoles[0]) || "analyst";
  const bucket = bucketFor(cs);
  cs.tasks = buildTasks(cs, bucket, role);
  cs.desk = deskFor(cs, bucket, role);
  cs.companyBlock = companyBlockFor(cs, role);
  updated++;
}

// ---------------------------------------------------------------------------
// 7. Stringify and write back
// ---------------------------------------------------------------------------

const newArrayText = JSON.stringify(cases, null, 2);
const out = header + newArrayText + trailer;
writeFileSync(TS_PATH, out);

console.log(`Updated ${updated} case studies (skipped ${SKIP_IDS.size}).`);
const bucketCounts = {};
for (const cs of cases) {
  if (SKIP_IDS.has(cs.id)) continue;
  const b = bucketFor(cs);
  bucketCounts[b] = (bucketCounts[b] || 0) + 1;
}
console.log("Bucket distribution:", bucketCounts);
