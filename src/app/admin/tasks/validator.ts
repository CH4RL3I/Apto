import type {
  ChallengeTask,
  AnalysisTask,
  RecommendationTask,
  CurveballTask,
  CaseStudy,
} from "@/lib/questionnaire/case-studies";

export interface OverridePayload {
  tasks: ChallengeTask[];
  desk: CaseStudy["desk"] | null;
  companyBlock: CaseStudy["companyBlock"] | null;
}

class V {
  errors: string[] = [];
  push(p: string, msg: string) {
    this.errors.push(`${p}: ${msg}`);
  }
}

function isStr(x: unknown): x is string {
  return typeof x === "string";
}
function isNum(x: unknown): x is number {
  return typeof x === "number" && !Number.isNaN(x);
}
function isArr(x: unknown): x is unknown[] {
  return Array.isArray(x);
}
function isObj(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function validateAnalysis(t: Record<string, unknown>, p: string, v: V) {
  if (!isStr(t.title)) v.push(`${p}.title`, "must be string");
  if (!isNum(t.durationMin)) v.push(`${p}.durationMin`, "must be number");
  if (!isArr(t.scoredOn) || !t.scoredOn.every(isStr))
    v.push(`${p}.scoredOn`, "must be string[]");
  if (!isStr(t.prompt)) v.push(`${p}.prompt`, "must be string");

  if (!isObj(t.quickCheck)) {
    v.push(`${p}.quickCheck`, "must be object");
  } else {
    const qc = t.quickCheck;
    if (!isStr(qc.question)) v.push(`${p}.quickCheck.question`, "must be string");
    if (!isArr(qc.options)) v.push(`${p}.quickCheck.options`, "must be array");
    else
      qc.options.forEach((o, i) => {
        if (!isObj(o)) {
          v.push(`${p}.quickCheck.options[${i}]`, "must be object");
          return;
        }
        if (!isStr(o.text)) v.push(`${p}.quickCheck.options[${i}].text`, "string");
        if (typeof o.correct !== "boolean")
          v.push(`${p}.quickCheck.options[${i}].correct`, "boolean");
        if (!isStr(o.feedback))
          v.push(`${p}.quickCheck.options[${i}].feedback`, "string");
      });
  }

  if (t.dataTable !== undefined && t.dataTable !== null) {
    if (!isObj(t.dataTable)) v.push(`${p}.dataTable`, "must be object");
    else {
      const dt = t.dataTable;
      if (!isArr(dt.columns) || !dt.columns.every(isStr))
        v.push(`${p}.dataTable.columns`, "string[]");
      if (
        !isArr(dt.rows) ||
        !dt.rows.every((r) => isArr(r) && r.every(isStr))
      )
        v.push(`${p}.dataTable.rows`, "string[][]");
    }
  }

  if (!isObj(t.textarea)) v.push(`${p}.textarea`, "must be object");
  else {
    if (!isStr(t.textarea.placeholder))
      v.push(`${p}.textarea.placeholder`, "string");
    if (!isNum(t.textarea.wordLimit))
      v.push(`${p}.textarea.wordLimit`, "number");
  }
}

function validateRecommendation(
  t: Record<string, unknown>,
  p: string,
  v: V,
) {
  if (!isStr(t.title)) v.push(`${p}.title`, "string");
  if (!isNum(t.durationMin)) v.push(`${p}.durationMin`, "number");
  if (!isArr(t.scoredOn) || !t.scoredOn.every(isStr))
    v.push(`${p}.scoredOn`, "string[]");
  if (!isStr(t.brief)) v.push(`${p}.brief`, "string");

  if (!isObj(t.picker)) v.push(`${p}.picker`, "object");
  else {
    if (!isStr(t.picker.label)) v.push(`${p}.picker.label`, "string");
    if (!isArr(t.picker.options))
      v.push(`${p}.picker.options`, "array");
    else
      t.picker.options.forEach((o, i) => {
        if (!isObj(o)) {
          v.push(`${p}.picker.options[${i}]`, "object");
          return;
        }
        if (!isStr(o.id)) v.push(`${p}.picker.options[${i}].id`, "string");
        if (!isStr(o.emoji)) v.push(`${p}.picker.options[${i}].emoji`, "string");
        if (!isStr(o.name)) v.push(`${p}.picker.options[${i}].name`, "string");
        if (!isStr(o.sub)) v.push(`${p}.picker.options[${i}].sub`, "string");
      });
  }

  if (!isObj(t.matching)) v.push(`${p}.matching`, "object");
  else {
    if (!isStr(t.matching.instruction))
      v.push(`${p}.matching.instruction`, "string");
    if (!isArr(t.matching.rows)) v.push(`${p}.matching.rows`, "array");
    else
      t.matching.rows.forEach((r, i) => {
        if (!isObj(r)) {
          v.push(`${p}.matching.rows[${i}]`, "object");
          return;
        }
        if (!isStr(r.factor))
          v.push(`${p}.matching.rows[${i}].factor`, "string");
        if (!isStr(r.correctReasonId))
          v.push(`${p}.matching.rows[${i}].correctReasonId`, "string");
        if (!isArr(r.options))
          v.push(`${p}.matching.rows[${i}].options`, "array");
        else
          r.options.forEach((opt, j) => {
            if (!isObj(opt)) {
              v.push(`${p}.matching.rows[${i}].options[${j}]`, "object");
              return;
            }
            if (!isStr(opt.id))
              v.push(`${p}.matching.rows[${i}].options[${j}].id`, "string");
            if (!isStr(opt.text))
              v.push(`${p}.matching.rows[${i}].options[${j}].text`, "string");
          });
      });
  }

  if (!isObj(t.textarea)) v.push(`${p}.textarea`, "object");
  else {
    if (!isStr(t.textarea.label)) v.push(`${p}.textarea.label`, "string");
    if (!isStr(t.textarea.helperHtml))
      v.push(`${p}.textarea.helperHtml`, "string");
    if (!isStr(t.textarea.structureTip))
      v.push(`${p}.textarea.structureTip`, "string");
    if (!isStr(t.textarea.placeholder))
      v.push(`${p}.textarea.placeholder`, "string");
    if (!isNum(t.textarea.wordLimit))
      v.push(`${p}.textarea.wordLimit`, "number");
  }
}

function validateCurveball(t: Record<string, unknown>, p: string, v: V) {
  if (!isStr(t.title)) v.push(`${p}.title`, "string");
  if (!isNum(t.durationMin)) v.push(`${p}.durationMin`, "number");
  if (!isArr(t.scoredOn) || !t.scoredOn.every(isStr))
    v.push(`${p}.scoredOn`, "string[]");
  if (!isStr(t.curveballHtml)) v.push(`${p}.curveballHtml`, "string");
  if (!isStr(t.recapText)) v.push(`${p}.recapText`, "string");

  if (!isObj(t.insight)) v.push(`${p}.insight`, "object");
  else {
    if (!isStr(t.insight.label)) v.push(`${p}.insight.label`, "string");
    if (!isStr(t.insight.text)) v.push(`${p}.insight.text`, "string");
  }

  if (!isObj(t.stancePicker)) v.push(`${p}.stancePicker`, "object");
  else {
    if (!isArr(t.stancePicker.options))
      v.push(`${p}.stancePicker.options`, "array");
    else
      t.stancePicker.options.forEach((o, i) => {
        if (!isObj(o)) {
          v.push(`${p}.stancePicker.options[${i}]`, "object");
          return;
        }
        if (!isStr(o.id)) v.push(`${p}.stancePicker.options[${i}].id`, "string");
        if (!isStr(o.icon))
          v.push(`${p}.stancePicker.options[${i}].icon`, "string");
        if (!isStr(o.title))
          v.push(`${p}.stancePicker.options[${i}].title`, "string");
        if (!isStr(o.sub)) v.push(`${p}.stancePicker.options[${i}].sub`, "string");
        if (!isStr(o.coachingHint))
          v.push(`${p}.stancePicker.options[${i}].coachingHint`, "string");
      });
  }

  if (!isObj(t.textarea)) v.push(`${p}.textarea`, "object");
  else {
    if (!isStr(t.textarea.label)) v.push(`${p}.textarea.label`, "string");
    if (!isStr(t.textarea.helperHtml))
      v.push(`${p}.textarea.helperHtml`, "string");
    if (!isStr(t.textarea.placeholder))
      v.push(`${p}.textarea.placeholder`, "string");
    if (!isNum(t.textarea.wordLimit))
      v.push(`${p}.textarea.wordLimit`, "number");
  }
}

export function validateOverridePayload(payload: unknown): {
  ok: boolean;
  errors: string[];
  value?: OverridePayload;
} {
  const v = new V();
  if (!isObj(payload)) {
    return { ok: false, errors: ["payload: must be object"] };
  }
  if (!isArr(payload.tasks)) {
    return { ok: false, errors: ["tasks: must be array"] };
  }
  if (payload.tasks.length === 0) {
    return { ok: false, errors: ["tasks: must contain at least one task"] };
  }

  payload.tasks.forEach((t, i) => {
    const p = `tasks[${i}]`;
    if (!isObj(t)) {
      v.push(p, "must be object");
      return;
    }
    const type = t.type;
    if (type === "analysis") validateAnalysis(t, p, v);
    else if (type === "recommendation") validateRecommendation(t, p, v);
    else if (type === "curveball") validateCurveball(t, p, v);
    else
      v.push(
        `${p}.type`,
        `must be one of "analysis"|"recommendation"|"curveball" (got ${JSON.stringify(type)})`,
      );
  });

  let desk: CaseStudy["desk"] | null = null;
  if (payload.desk !== null && payload.desk !== undefined) {
    if (!isObj(payload.desk)) {
      v.push("desk", "must be object or null");
    } else {
      const d = payload.desk;
      if (!isStr(d.quote)) v.push("desk.quote", "string");
      if (!isStr(d.authorName)) v.push("desk.authorName", "string");
      if (!isStr(d.authorTitle)) v.push("desk.authorTitle", "string");
      if (!isStr(d.authorInitials)) v.push("desk.authorInitials", "string");
      desk = d as unknown as CaseStudy["desk"];
    }
  }

  let companyBlock: CaseStudy["companyBlock"] | null = null;
  if (payload.companyBlock !== null && payload.companyBlock !== undefined) {
    if (!isObj(payload.companyBlock)) {
      v.push("companyBlock", "must be object or null");
    } else {
      const cb = payload.companyBlock;
      if (!isStr(cb.tagline)) v.push("companyBlock.tagline", "string");
      if (!isStr(cb.primaryTag)) v.push("companyBlock.primaryTag", "string");
      if (!isArr(cb.secondaryTags) || !cb.secondaryTags.every(isStr))
        v.push("companyBlock.secondaryTags", "string[]");
      if (!isStr(cb.totalTimeLabel))
        v.push("companyBlock.totalTimeLabel", "string");
      companyBlock = cb as unknown as CaseStudy["companyBlock"];
    }
  }

  if (v.errors.length > 0) return { ok: false, errors: v.errors };

  return {
    ok: true,
    errors: [],
    value: {
      tasks: payload.tasks as ChallengeTask[],
      desk,
      companyBlock,
    },
  };
}

export type {
  ChallengeTask,
  AnalysisTask,
  RecommendationTask,
  CurveballTask,
};
