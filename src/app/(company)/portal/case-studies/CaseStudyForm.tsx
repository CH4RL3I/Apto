"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import {
  createCaseStudy,
  updateCaseStudy,
  type CaseStudyInput,
  type RubricRow,
} from "./actions";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
const FORMATS = ["text", "document", "spreadsheet", "slides"] as const;

interface Props {
  mode: "create" | "edit";
  id?: string;
  initial?: Partial<CaseStudyInput>;
}

export function CaseStudyForm({ mode, id, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [brief, setBrief] = useState(initial?.brief ?? "");
  const [timeMinutes, setTimeMinutes] = useState(initial?.time_minutes ?? 45);
  const [difficulty, setDifficulty] = useState<CaseStudyInput["difficulty"]>(
    initial?.difficulty ?? "intermediate",
  );
  const [skills, setSkills] = useState<string[]>(initial?.skills_tested ?? []);
  const [skillDraft, setSkillDraft] = useState("");
  const [deliverable, setDeliverable] = useState<CaseStudyInput["deliverable_format"]>(
    initial?.deliverable_format ?? "text",
  );
  const [rubric, setRubric] = useState<RubricRow[]>(
    initial?.rubric && initial.rubric.length > 0
      ? initial.rubric
      : [{ criterion: "", weight: 1, description: "" }],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weightSum = rubric.reduce((acc, r) => acc + (Number(r.weight) || 0), 0);
  const weightOk = Math.abs(weightSum - 1) < 0.001;

  function addSkill() {
    const v = skillDraft.trim();
    if (!v || skills.includes(v)) return;
    setSkills([...skills, v]);
    setSkillDraft("");
  }

  function removeSkill(s: string) {
    setSkills(skills.filter((x) => x !== s));
  }

  function updateRubric(idx: number, patch: Partial<RubricRow>) {
    setRubric(rubric.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  function addRubric() {
    setRubric([...rubric, { criterion: "", weight: 0, description: "" }]);
  }

  function removeRubric(idx: number) {
    if (rubric.length === 1) return;
    setRubric(rubric.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!weightOk) {
      setError(`Rubric weights must sum to 1.0 (currently ${weightSum.toFixed(2)}).`);
      return;
    }
    if (rubric.some((r) => !r.criterion.trim())) {
      setError("Each rubric row needs a criterion name.");
      return;
    }
    setSubmitting(true);
    const payload: CaseStudyInput = {
      title: title.trim(),
      brief: brief.trim(),
      time_minutes: Number(timeMinutes),
      difficulty,
      skills_tested: skills,
      deliverable_format: deliverable,
      rubric: rubric.map((r) => ({ ...r, weight: Number(r.weight) })),
    };
    try {
      if (mode === "create") {
        await createCaseStudy(payload);
      } else {
        await updateCaseStudy(id!, payload);
      }
      router.push("/portal/case-studies");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-1.5">
          Title
        </label>
        <input
          id="title"
          required
          minLength={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          placeholder="Redesign the Onboarding Flow"
        />
      </div>

      <div>
        <label htmlFor="brief" className="block text-sm font-medium text-charcoal mb-1.5">
          Brief <span className="text-charcoal-3 font-normal">(markdown allowed)</span>
        </label>
        <textarea
          id="brief"
          required
          minLength={20}
          rows={20}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          className="w-full px-4 py-3 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage font-mono leading-relaxed"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-charcoal mb-1.5">
            Time (minutes)
          </label>
          <input
            id="time"
            type="number"
            min={5}
            max={240}
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-charcoal mb-1.5">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as CaseStudyInput["difficulty"])}
            className="w-full px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-charcoal mb-1.5">
            Deliverable
          </label>
          <select
            id="format"
            value={deliverable}
            onChange={(e) =>
              setDeliverable(e.target.value as CaseStudyInput["deliverable_format"])
            }
            className="w-full px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Skills tested</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-pale-sage text-sage-700 font-semibold"
            >
              {s}
              <button
                type="button"
                onClick={() => removeSkill(s)}
                className="hover:text-coral-700"
                aria-label={`Remove ${s}`}
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill and press Enter"
            className="flex-1 px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />
          <Button type="button" variant="ghost" size="md" onClick={addSkill}>
            Add
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-charcoal">Rubric</label>
          <Pill variant={weightOk ? "sage" : "coral"} size="sm">
            Weights sum: {weightSum.toFixed(2)}
          </Pill>
        </div>
        <div className="space-y-3">
          {rubric.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr_90px_2fr_auto] gap-2 items-start bg-chalk border border-sage-mist-2 rounded-[10px] p-3"
            >
              <input
                type="text"
                value={row.criterion}
                onChange={(e) => updateRubric(idx, { criterion: e.target.value })}
                placeholder="Criterion"
                className="px-3 py-2 bg-chalk border border-sage-mist-2 rounded-lg text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              />
              <input
                type="number"
                step="0.05"
                min={0}
                max={1}
                value={row.weight}
                onChange={(e) => updateRubric(idx, { weight: Number(e.target.value) })}
                className="px-3 py-2 bg-chalk border border-sage-mist-2 rounded-lg text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage stat-num"
              />
              <input
                type="text"
                value={row.description}
                onChange={(e) => updateRubric(idx, { description: e.target.value })}
                placeholder="What does a good answer look like?"
                className="px-3 py-2 bg-chalk border border-sage-mist-2 rounded-lg text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              />
              <button
                type="button"
                onClick={() => removeRubric(idx)}
                disabled={rubric.length === 1}
                className="p-2 text-charcoal-2 hover:text-coral-700 disabled:opacity-30"
                aria-label="Remove rubric row"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addRubric}
          className="mt-3"
          icon={<Plus className="w-4 h-4" strokeWidth={1.75} />}
        >
          Add criterion
        </Button>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-sage-mist-2">
        <Button type="submit" variant="primary" size="md" disabled={submitting}>
          {submitting ? "Saving…" : mode === "create" ? "Create case study" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/portal/case-studies")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
