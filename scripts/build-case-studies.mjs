// One-off: parse cs-*.md frontmatter + body into a TS data file.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "/Users/emiliogappa/Desktop/apto case studies";
const OUT = "/Users/emiliogappa/Desktop/Apto/src/lib/questionnaire/case-studies.ts";

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("no frontmatter");
  const head = m[1];
  const body = m[2].trim();

  const meta = {};
  const lines = head.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) { i++; continue; }
    const key = kv[1];
    const rest = kv[2];

    if (rest === "") {
      // multiline list follows
      const items = [];
      i++;
      while (i < lines.length && lines[i].startsWith("  - ")) {
        items.push(lines[i].slice(4).trim());
        i++;
      }
      meta[key] = items;
    } else {
      // single value: strip surrounding quotes if any
      let v = rest.trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      meta[key] = v;
      i++;
    }
  }
  return { meta, body };
}

const files = readdirSync(SRC)
  .filter((f) => /^cs-\d+.*\.md$/.test(f))
  .sort();

const cases = files.map((f) => {
  const raw = readFileSync(join(SRC, f), "utf8");
  const { meta, body } = parseFrontmatter(raw);
  return {
    id: meta.id,
    title: meta.title,
    cluster: meta.cluster,
    duration: meta.duration,
    estimatedMinutes: Number(meta.estimated_minutes),
    matchesRoles: meta.matches_roles || [],
    matchesFields: meta.matches_fields || [],
    matchesIndustries: meta.matches_industries || [],
    matchesMode: meta.matches_mode,
    matchesOutput: meta.matches_output,
    skillsTested: meta.skills_tested || [],
    body,
  };
});

console.log(`Parsed ${cases.length} case studies.`);

// Sanity: check fields are populated
for (const c of cases) {
  if (!c.id || !c.title || !c.matchesMode || !c.matchesOutput) {
    console.error("Missing fields in", c.id, c);
  }
}

const header = `// AUTO-GENERATED from ../../../apto case studies/cs-*.md.
// Do not edit by hand — re-run scripts/build-case-studies.mjs.
import type { Job } from "./matching";

export type CaseStudyDuration = "short" | "medium" | "long";

export interface CaseStudy {
  id: string;
  title: string;
  cluster: string;
  duration: CaseStudyDuration;
  estimatedMinutes: number;
  matchesRoles: string[];
  matchesFields: string[];
  matchesIndustries: string[];
  matchesMode: Job["mode"];
  matchesOutput: Job["output"];
  skillsTested: string[];
  body: string;
}

export const CASE_STUDIES: CaseStudy[] = ${JSON.stringify(cases, null, 2)};
`;

writeFileSync(OUT, header);
console.log(`Wrote ${OUT}`);
