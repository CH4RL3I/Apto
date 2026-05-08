"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type {
  AnalysisTask,
  CaseStudy,
  ChallengeTask,
  CurveballTask,
  RecommendationTask,
} from "@/lib/questionnaire/case-studies";
import { saveTasksOverride, deleteTasksOverride } from "../actions";

type Desk = NonNullable<CaseStudy["desk"]>;
type CompanyBlock = NonNullable<CaseStudy["companyBlock"]>;

interface EditorState {
  tasks: ChallengeTask[];
  desk: Desk | null;
  companyBlock: CompanyBlock | null;
}

interface TaskEditorProps {
  caseStudyId: string;
  hasOverride: boolean;
  initial: EditorState;
}

const EMPTY_ANALYSIS: AnalysisTask = {
  type: "analysis",
  title: "",
  durationMin: 10,
  scoredOn: [],
  prompt: "",
  quickCheck: { question: "", options: [] },
  textarea: { placeholder: "", wordLimit: 250 },
  resources: [],
};

const EMPTY_RECOMMENDATION: RecommendationTask = {
  type: "recommendation",
  title: "",
  durationMin: 10,
  scoredOn: [],
  brief: "",
  picker: { label: "", options: [] },
  matching: { instruction: "", rows: [] },
  textarea: {
    label: "",
    helperHtml: "",
    structureTip: "",
    placeholder: "",
    wordLimit: 250,
  },
  resources: [],
};

const EMPTY_CURVEBALL: CurveballTask = {
  type: "curveball",
  title: "",
  durationMin: 10,
  scoredOn: [],
  curveballHtml: "",
  recapText: "",
  insight: { label: "", text: "" },
  stancePicker: { options: [] },
  textarea: {
    label: "",
    helperHtml: "",
    placeholder: "",
    wordLimit: 250,
  },
};

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number";
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-2">
        {label}
      </span>
      <input
        type={type}
        value={value as string | number}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full rounded-lg border border-sage-mist-2 bg-chalk px-3 py-2 text-sm"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-2">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="focus-ring w-full rounded-lg border border-sage-mist-2 bg-chalk px-3 py-2 font-mono text-xs"
      />
    </label>
  );
}

function ChipsInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-2">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-sage-mist-2 bg-chalk px-2 py-1.5">
        {values.map((v, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-pale-sage px-2 py-0.5 text-xs text-sage-700"
          >
            {v}
            <button
              type="button"
              className="text-sage-700 hover:text-coral"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
              e.preventDefault();
              onChange([...values, draft.trim()]);
              setDraft("");
            }
          }}
          placeholder="add and press Enter"
          className="min-w-[140px] flex-1 bg-transparent text-xs outline-none"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-sage-mist-2 bg-chalk p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-charcoal">{title}</h3>
        {right}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-lg bg-pale-sage/40 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-sage-700">
        {title}
      </h4>
      {children}
    </div>
  );
}

function AnalysisForm({
  task,
  onChange,
}: {
  task: AnalysisTask;
  onChange: (t: AnalysisTask) => void;
}) {
  const update = <K extends keyof AnalysisTask>(k: K, v: AnalysisTask[K]) =>
    onChange({ ...task, [k]: v });

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Title"
          value={task.title}
          onChange={(v) => update("title", v)}
        />
        <TextField
          label="Duration (min)"
          type="number"
          value={task.durationMin}
          onChange={(v) => update("durationMin", Number(v) || 0)}
        />
      </div>
      <ChipsInput
        label="Scored on"
        values={task.scoredOn}
        onChange={(v) => update("scoredOn", v)}
      />
      <TextArea
        label="Prompt"
        value={task.prompt}
        onChange={(v) => update("prompt", v)}
        rows={3}
      />

      <SubSection title="Quick check">
        <TextField
          label="Question"
          value={task.quickCheck.question}
          onChange={(v) =>
            update("quickCheck", { ...task.quickCheck, question: v })
          }
        />
        <div className="space-y-2">
          {task.quickCheck.options.map((o, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto_2fr_auto] gap-2 rounded-md bg-chalk p-2"
            >
              <input
                value={o.text}
                onChange={(e) => {
                  const opts = clone(task.quickCheck.options);
                  opts[i].text = e.target.value;
                  update("quickCheck", { ...task.quickCheck, options: opts });
                }}
                placeholder="Option text"
                className="rounded border border-sage-mist-2 px-2 py-1 text-xs"
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={o.correct}
                  onChange={(e) => {
                    const opts = clone(task.quickCheck.options);
                    opts[i].correct = e.target.checked;
                    update("quickCheck", { ...task.quickCheck, options: opts });
                  }}
                />
                correct
              </label>
              <input
                value={o.feedback}
                onChange={(e) => {
                  const opts = clone(task.quickCheck.options);
                  opts[i].feedback = e.target.value;
                  update("quickCheck", { ...task.quickCheck, options: opts });
                }}
                placeholder="Feedback"
                className="rounded border border-sage-mist-2 px-2 py-1 text-xs"
              />
              <button
                type="button"
                className="text-xs text-coral hover:underline"
                onClick={() => {
                  const opts = task.quickCheck.options.filter(
                    (_, j) => j !== i,
                  );
                  update("quickCheck", { ...task.quickCheck, options: opts });
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              update("quickCheck", {
                ...task.quickCheck,
                options: [
                  ...task.quickCheck.options,
                  { text: "", correct: false, feedback: "" },
                ],
              })
            }
          >
            + Add option
          </Button>
        </div>
      </SubSection>

      <SubSection title="Data table (optional)">
        <DataTableEditor
          dataTable={task.dataTable ?? null}
          onChange={(dt) =>
            onChange({ ...task, dataTable: dt ?? undefined })
          }
        />
      </SubSection>

      <SubSection title="Open textarea">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Placeholder"
            value={task.textarea.placeholder}
            onChange={(v) =>
              update("textarea", { ...task.textarea, placeholder: v })
            }
          />
          <TextField
            label="Word limit"
            type="number"
            value={task.textarea.wordLimit}
            onChange={(v) =>
              update("textarea", {
                ...task.textarea,
                wordLimit: Number(v) || 0,
              })
            }
          />
        </div>
      </SubSection>
    </>
  );
}

function DataTableEditor({
  dataTable,
  onChange,
}: {
  dataTable: { columns: string[]; rows: string[][] } | null;
  onChange: (dt: { columns: string[]; rows: string[][] } | null) => void;
}) {
  if (!dataTable) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onChange({ columns: ["Column 1"], rows: [[""]] })}
      >
        + Add data table
      </Button>
    );
  }
  const { columns, rows } = dataTable;
  return (
    <div className="space-y-2">
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              {columns.map((c, ci) => (
                <th key={ci} className="border border-sage-mist-2 p-1">
                  <input
                    value={c}
                    onChange={(e) => {
                      const cols = [...columns];
                      cols[ci] = e.target.value;
                      onChange({ columns: cols, rows });
                    }}
                    className="w-full bg-transparent font-semibold"
                  />
                </th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {columns.map((_, ci) => (
                  <td key={ci} className="border border-sage-mist-2 p-1">
                    <input
                      value={r[ci] ?? ""}
                      onChange={(e) => {
                        const newRows = clone(rows);
                        while (newRows[ri].length < columns.length)
                          newRows[ri].push("");
                        newRows[ri][ci] = e.target.value;
                        onChange({ columns, rows: newRows });
                      }}
                      className="w-full bg-transparent"
                    />
                  </td>
                ))}
                <td className="p-1">
                  <button
                    type="button"
                    className="text-xs text-coral hover:underline"
                    onClick={() =>
                      onChange({
                        columns,
                        rows: rows.filter((_, j) => j !== ri),
                      })
                    }
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            onChange({
              columns,
              rows: [...rows, columns.map(() => "")],
            })
          }
        >
          + Row
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            onChange({
              columns: [...columns, `Column ${columns.length + 1}`],
              rows: rows.map((r) => [...r, ""]),
            })
          }
        >
          + Column
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            onChange({
              columns: columns.slice(0, -1),
              rows: rows.map((r) => r.slice(0, -1)),
            })
          }
        >
          - Column
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onChange(null)}
        >
          Remove table
        </Button>
      </div>
    </div>
  );
}

function RecommendationForm({
  task,
  onChange,
}: {
  task: RecommendationTask;
  onChange: (t: RecommendationTask) => void;
}) {
  const update = <K extends keyof RecommendationTask>(
    k: K,
    v: RecommendationTask[K],
  ) => onChange({ ...task, [k]: v });

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Title"
          value={task.title}
          onChange={(v) => update("title", v)}
        />
        <TextField
          label="Duration (min)"
          type="number"
          value={task.durationMin}
          onChange={(v) => update("durationMin", Number(v) || 0)}
        />
      </div>
      <ChipsInput
        label="Scored on"
        values={task.scoredOn}
        onChange={(v) => update("scoredOn", v)}
      />
      <TextArea
        label="Brief"
        value={task.brief}
        onChange={(v) => update("brief", v)}
        rows={3}
      />

      <SubSection title="Picker">
        <TextField
          label="Label"
          value={task.picker.label}
          onChange={(v) => update("picker", { ...task.picker, label: v })}
        />
        <div className="space-y-2">
          {task.picker.options.map((o, i) => (
            <div
              key={i}
              className="grid grid-cols-[80px_60px_1fr_2fr_auto] gap-2 rounded-md bg-chalk p-2"
            >
              <input
                value={o.id}
                onChange={(e) => {
                  const opts = clone(task.picker.options);
                  opts[i].id = e.target.value;
                  update("picker", { ...task.picker, options: opts });
                }}
                placeholder="id"
                className="rounded border border-sage-mist-2 px-2 py-1 font-mono text-xs"
              />
              <input
                value={o.emoji}
                onChange={(e) => {
                  const opts = clone(task.picker.options);
                  opts[i].emoji = e.target.value;
                  update("picker", { ...task.picker, options: opts });
                }}
                placeholder="emoji"
                className="rounded border border-sage-mist-2 px-2 py-1 text-center text-xs"
              />
              <input
                value={o.name}
                onChange={(e) => {
                  const opts = clone(task.picker.options);
                  opts[i].name = e.target.value;
                  update("picker", { ...task.picker, options: opts });
                }}
                placeholder="name"
                className="rounded border border-sage-mist-2 px-2 py-1 text-xs"
              />
              <input
                value={o.sub}
                onChange={(e) => {
                  const opts = clone(task.picker.options);
                  opts[i].sub = e.target.value;
                  update("picker", { ...task.picker, options: opts });
                }}
                placeholder="sub"
                className="rounded border border-sage-mist-2 px-2 py-1 text-xs"
              />
              <button
                type="button"
                className="text-xs text-coral hover:underline"
                onClick={() => {
                  const opts = task.picker.options.filter((_, j) => j !== i);
                  update("picker", { ...task.picker, options: opts });
                }}
              >
                ×
              </button>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              update("picker", {
                ...task.picker,
                options: [
                  ...task.picker.options,
                  { id: "", emoji: "", name: "", sub: "" },
                ],
              })
            }
          >
            + Add option
          </Button>
        </div>
      </SubSection>

      <SubSection title="Matching">
        <TextField
          label="Instruction"
          value={task.matching.instruction}
          onChange={(v) =>
            update("matching", { ...task.matching, instruction: v })
          }
        />
        <div className="space-y-3">
          {task.matching.rows.map((row, ri) => (
            <div key={ri} className="space-y-2 rounded-md bg-chalk p-2">
              <div className="grid grid-cols-[1fr_140px_auto] gap-2">
                <input
                  value={row.factor}
                  onChange={(e) => {
                    const rows = clone(task.matching.rows);
                    rows[ri].factor = e.target.value;
                    update("matching", { ...task.matching, rows });
                  }}
                  placeholder="Factor"
                  className="rounded border border-sage-mist-2 px-2 py-1 text-xs"
                />
                <input
                  value={row.correctReasonId}
                  onChange={(e) => {
                    const rows = clone(task.matching.rows);
                    rows[ri].correctReasonId = e.target.value;
                    update("matching", { ...task.matching, rows });
                  }}
                  placeholder="correctReasonId"
                  className="rounded border border-sage-mist-2 px-2 py-1 font-mono text-xs"
                />
                <button
                  type="button"
                  className="text-xs text-coral hover:underline"
                  onClick={() => {
                    const rows = task.matching.rows.filter((_, j) => j !== ri);
                    update("matching", { ...task.matching, rows });
                  }}
                >
                  Remove row
                </button>
              </div>
              <div className="space-y-1 pl-4">
                {row.options.map((opt, oi) => (
                  <div
                    key={oi}
                    className="grid grid-cols-[100px_1fr_auto] gap-2"
                  >
                    <input
                      value={opt.id}
                      onChange={(e) => {
                        const rows = clone(task.matching.rows);
                        rows[ri].options[oi].id = e.target.value;
                        update("matching", { ...task.matching, rows });
                      }}
                      placeholder="id"
                      className="rounded border border-sage-mist-2 px-2 py-1 font-mono text-xs"
                    />
                    <input
                      value={opt.text}
                      onChange={(e) => {
                        const rows = clone(task.matching.rows);
                        rows[ri].options[oi].text = e.target.value;
                        update("matching", { ...task.matching, rows });
                      }}
                      placeholder="reason text"
                      className="rounded border border-sage-mist-2 px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      className="text-xs text-coral hover:underline"
                      onClick={() => {
                        const rows = clone(task.matching.rows);
                        rows[ri].options = rows[ri].options.filter(
                          (_, j) => j !== oi,
                        );
                        update("matching", { ...task.matching, rows });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const rows = clone(task.matching.rows);
                    rows[ri].options.push({ id: "", text: "" });
                    update("matching", { ...task.matching, rows });
                  }}
                >
                  + Add reason
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              update("matching", {
                ...task.matching,
                rows: [
                  ...task.matching.rows,
                  { factor: "", correctReasonId: "", options: [] },
                ],
              })
            }
          >
            + Add row
          </Button>
        </div>
      </SubSection>

      <SubSection title="Open textarea">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Label"
            value={task.textarea.label}
            onChange={(v) =>
              update("textarea", { ...task.textarea, label: v })
            }
          />
          <TextField
            label="Word limit"
            type="number"
            value={task.textarea.wordLimit}
            onChange={(v) =>
              update("textarea", {
                ...task.textarea,
                wordLimit: Number(v) || 0,
              })
            }
          />
        </div>
        <TextField
          label="Structure tip"
          value={task.textarea.structureTip}
          onChange={(v) =>
            update("textarea", { ...task.textarea, structureTip: v })
          }
        />
        <TextField
          label="Placeholder"
          value={task.textarea.placeholder}
          onChange={(v) =>
            update("textarea", { ...task.textarea, placeholder: v })
          }
        />
        <TextArea
          label="Helper HTML"
          value={task.textarea.helperHtml}
          onChange={(v) =>
            update("textarea", { ...task.textarea, helperHtml: v })
          }
          rows={2}
        />
      </SubSection>
    </>
  );
}

function CurveballForm({
  task,
  onChange,
}: {
  task: CurveballTask;
  onChange: (t: CurveballTask) => void;
}) {
  const update = <K extends keyof CurveballTask>(k: K, v: CurveballTask[K]) =>
    onChange({ ...task, [k]: v });

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Title"
          value={task.title}
          onChange={(v) => update("title", v)}
        />
        <TextField
          label="Duration (min)"
          type="number"
          value={task.durationMin}
          onChange={(v) => update("durationMin", Number(v) || 0)}
        />
      </div>
      <ChipsInput
        label="Scored on"
        values={task.scoredOn}
        onChange={(v) => update("scoredOn", v)}
      />
      <TextArea
        label="Curveball HTML"
        value={task.curveballHtml}
        onChange={(v) => update("curveballHtml", v)}
        rows={4}
      />
      <TextArea
        label="Recap text"
        value={task.recapText}
        onChange={(v) => update("recapText", v)}
        rows={2}
      />

      <SubSection title="Insight">
        <TextField
          label="Label"
          value={task.insight.label}
          onChange={(v) => update("insight", { ...task.insight, label: v })}
        />
        <TextArea
          label="Text"
          value={task.insight.text}
          onChange={(v) => update("insight", { ...task.insight, text: v })}
          rows={2}
        />
      </SubSection>

      <SubSection title="Stance picker">
        <div className="space-y-2">
          {task.stancePicker.options.map((o, i) => (
            <div
              key={i}
              className="grid grid-cols-[80px_60px_1fr_1fr_auto] gap-2 rounded-md bg-chalk p-2"
            >
              <input
                value={o.id}
                onChange={(e) => {
                  const opts = clone(task.stancePicker.options);
                  opts[i].id = e.target.value;
                  update("stancePicker", { options: opts });
                }}
                placeholder="id"
                className="rounded border border-sage-mist-2 px-2 py-1 font-mono text-xs"
              />
              <input
                value={o.icon}
                onChange={(e) => {
                  const opts = clone(task.stancePicker.options);
                  opts[i].icon = e.target.value;
                  update("stancePicker", { options: opts });
                }}
                placeholder="icon"
                className="rounded border border-sage-mist-2 px-2 py-1 text-center text-xs"
              />
              <input
                value={o.title}
                onChange={(e) => {
                  const opts = clone(task.stancePicker.options);
                  opts[i].title = e.target.value;
                  update("stancePicker", { options: opts });
                }}
                placeholder="title"
                className="rounded border border-sage-mist-2 px-2 py-1 text-xs"
              />
              <input
                value={o.sub}
                onChange={(e) => {
                  const opts = clone(task.stancePicker.options);
                  opts[i].sub = e.target.value;
                  update("stancePicker", { options: opts });
                }}
                placeholder="sub"
                className="rounded border border-sage-mist-2 px-2 py-1 text-xs"
              />
              <button
                type="button"
                className="text-xs text-coral hover:underline"
                onClick={() => {
                  const opts = task.stancePicker.options.filter(
                    (_, j) => j !== i,
                  );
                  update("stancePicker", { options: opts });
                }}
              >
                ×
              </button>
              <textarea
                value={o.coachingHint}
                onChange={(e) => {
                  const opts = clone(task.stancePicker.options);
                  opts[i].coachingHint = e.target.value;
                  update("stancePicker", { options: opts });
                }}
                placeholder="coaching hint"
                rows={2}
                className="col-span-5 rounded border border-sage-mist-2 px-2 py-1 text-xs"
              />
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              update("stancePicker", {
                options: [
                  ...task.stancePicker.options,
                  {
                    id: "",
                    icon: "",
                    title: "",
                    sub: "",
                    coachingHint: "",
                  },
                ],
              })
            }
          >
            + Add stance
          </Button>
        </div>
      </SubSection>

      <SubSection title="Open textarea">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Label"
            value={task.textarea.label}
            onChange={(v) =>
              update("textarea", { ...task.textarea, label: v })
            }
          />
          <TextField
            label="Word limit"
            type="number"
            value={task.textarea.wordLimit}
            onChange={(v) =>
              update("textarea", {
                ...task.textarea,
                wordLimit: Number(v) || 0,
              })
            }
          />
        </div>
        <TextField
          label="Placeholder"
          value={task.textarea.placeholder}
          onChange={(v) =>
            update("textarea", { ...task.textarea, placeholder: v })
          }
        />
        <TextArea
          label="Helper HTML"
          value={task.textarea.helperHtml}
          onChange={(v) =>
            update("textarea", { ...task.textarea, helperHtml: v })
          }
          rows={2}
        />
      </SubSection>
    </>
  );
}

function DeskEditor({
  desk,
  onChange,
}: {
  desk: Desk | null;
  onChange: (d: Desk | null) => void;
}) {
  if (!desk) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() =>
          onChange({
            quote: "",
            authorName: "",
            authorTitle: "",
            authorInitials: "",
          })
        }
      >
        + Add desk block
      </Button>
    );
  }
  return (
    <div className="space-y-3">
      <TextArea
        label="Quote"
        value={desk.quote}
        onChange={(v) => onChange({ ...desk, quote: v })}
        rows={3}
      />
      <div className="grid grid-cols-3 gap-3">
        <TextField
          label="Author name"
          value={desk.authorName}
          onChange={(v) => onChange({ ...desk, authorName: v })}
        />
        <TextField
          label="Author title"
          value={desk.authorTitle}
          onChange={(v) => onChange({ ...desk, authorTitle: v })}
        />
        <TextField
          label="Initials"
          value={desk.authorInitials}
          onChange={(v) => onChange({ ...desk, authorInitials: v })}
        />
      </div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onChange(null)}
      >
        Remove desk
      </Button>
    </div>
  );
}

function CompanyBlockEditor({
  block,
  onChange,
}: {
  block: CompanyBlock | null;
  onChange: (b: CompanyBlock | null) => void;
}) {
  if (!block) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() =>
          onChange({
            tagline: "",
            primaryTag: "",
            secondaryTags: [],
            totalTimeLabel: "",
          })
        }
      >
        + Add company block
      </Button>
    );
  }
  return (
    <div className="space-y-3">
      <TextField
        label="Tagline"
        value={block.tagline}
        onChange={(v) => onChange({ ...block, tagline: v })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Primary tag"
          value={block.primaryTag}
          onChange={(v) => onChange({ ...block, primaryTag: v })}
        />
        <TextField
          label="Total time label"
          value={block.totalTimeLabel}
          onChange={(v) => onChange({ ...block, totalTimeLabel: v })}
        />
      </div>
      <ChipsInput
        label="Secondary tags"
        values={block.secondaryTags}
        onChange={(v) => onChange({ ...block, secondaryTags: v })}
      />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onChange(null)}
      >
        Remove company block
      </Button>
    </div>
  );
}

export function TaskEditor({
  caseStudyId,
  hasOverride,
  initial,
}: TaskEditorProps) {
  const [state, setState] = useState<EditorState>(() => clone(initial));
  const [showPreview, setShowPreview] = useState(true);
  const [message, setMessage] = useState<{
    kind: "ok" | "err";
    text: string;
    errors?: string[];
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const previewJson = useMemo(
    () =>
      JSON.stringify(
        {
          tasks: state.tasks,
          desk: state.desk,
          companyBlock: state.companyBlock,
        },
        null,
        2,
      ),
    [state],
  );

  function setTask(i: number, t: ChallengeTask) {
    setState((s) => {
      const tasks = [...s.tasks];
      tasks[i] = t;
      return { ...s, tasks };
    });
  }
  function removeTask(i: number) {
    setState((s) => ({ ...s, tasks: s.tasks.filter((_, j) => j !== i) }));
  }
  function moveTask(i: number, dir: -1 | 1) {
    setState((s) => {
      const tasks = [...s.tasks];
      const j = i + dir;
      if (j < 0 || j >= tasks.length) return s;
      [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
      return { ...s, tasks };
    });
  }
  function addTask(type: "analysis" | "recommendation" | "curveball") {
    const t =
      type === "analysis"
        ? clone(EMPTY_ANALYSIS)
        : type === "recommendation"
        ? clone(EMPTY_RECOMMENDATION)
        : clone(EMPTY_CURVEBALL);
    setState((s) => ({ ...s, tasks: [...s.tasks, t] }));
  }

  function onSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveTasksOverride(caseStudyId, {
        tasks: state.tasks,
        desk: state.desk,
        companyBlock: state.companyBlock,
      });
      if (result.ok) {
        setMessage({ kind: "ok", text: "Saved." });
        router.refresh();
      } else {
        setMessage({
          kind: "err",
          text: result.error ?? "Save failed",
          errors: result.errors,
        });
      }
    });
  }

  function onReset() {
    if (
      !confirm(
        "Delete the DB override and revert to file-based defaults? This cannot be undone.",
      )
    ) {
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const result = await deleteTasksOverride(caseStudyId);
      if (result.ok) {
        setMessage({ kind: "ok", text: "Override removed." });
        router.refresh();
        router.push("/admin/tasks");
      } else {
        setMessage({ kind: "err", text: result.error ?? "Delete failed" });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <Section title="Desk (top-of-page quote)">
          <DeskEditor
            desk={state.desk}
            onChange={(d) => setState((s) => ({ ...s, desk: d }))}
          />
        </Section>

        <Section title="Company block">
          <CompanyBlockEditor
            block={state.companyBlock}
            onChange={(b) => setState((s) => ({ ...s, companyBlock: b }))}
          />
        </Section>

        {state.tasks.map((t, i) => (
          <Section
            key={i}
            title={`Task ${i + 1} · ${t.type}`}
            right={
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="text-xs text-sage hover:underline"
                  onClick={() => moveTask(i, -1)}
                  disabled={i === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="text-xs text-sage hover:underline"
                  onClick={() => moveTask(i, 1)}
                  disabled={i === state.tasks.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="text-xs text-coral hover:underline"
                  onClick={() => removeTask(i)}
                >
                  Remove
                </button>
              </div>
            }
          >
            {t.type === "analysis" ? (
              <AnalysisForm
                task={t}
                onChange={(nt) => setTask(i, nt)}
              />
            ) : t.type === "recommendation" ? (
              <RecommendationForm
                task={t}
                onChange={(nt) => setTask(i, nt)}
              />
            ) : (
              <CurveballForm
                task={t}
                onChange={(nt) => setTask(i, nt)}
              />
            )}
          </Section>
        ))}

        <div className="flex flex-wrap gap-2 rounded-xl border border-dashed border-sage-mist-2 bg-pale-sage/30 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-sage-700">
            Add task:
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => addTask("analysis")}
          >
            + Analysis
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => addTask("recommendation")}
          >
            + Recommendation
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => addTask("curveball")}
          >
            + Curveball
          </Button>
        </div>

        {message ? (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              message.kind === "ok"
                ? "border-sage bg-pale-sage text-sage-700"
                : "border-coral bg-coral-100 text-coral-700"
            }`}
          >
            <div>{message.text}</div>
            {message.errors && message.errors.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-xs">
                {message.errors.slice(0, 12).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
                {message.errors.length > 12 ? (
                  <li>… +{message.errors.length - 12} more</li>
                ) : null}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-xl border border-sage-mist-2 bg-chalk p-4 shadow-2">
          <Button
            type="button"
            variant="primary"
            onClick={onSave}
            disabled={pending}
          >
            {pending ? "Saving…" : "Save"}
          </Button>
          {hasOverride ? (
            <Button
              type="button"
              variant="coral"
              onClick={onReset}
              disabled={pending}
            >
              Reset to defaults
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/tasks")}
          >
            Back to list
          </Button>
        </div>
      </div>

      <aside className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-charcoal">JSON preview</h3>
          <button
            type="button"
            className="text-xs text-sage hover:underline"
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "Collapse" : "Expand"}
          </button>
        </div>
        {showPreview ? (
          <pre className="max-h-[80vh] overflow-auto rounded-xl border border-sage-mist-2 bg-charcoal/95 p-4 font-mono text-[11px] leading-relaxed text-chalk">
            {previewJson}
          </pre>
        ) : null}
      </aside>
    </div>
  );
}
