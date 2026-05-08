"use client";

import { useState } from "react";
import type { RecommendationTask } from "@/lib/questionnaire/case-studies";
import { OptionPicker } from "./OptionPicker";
import { MatchingRows } from "./MatchingRows";
import { OpenTextarea } from "./OpenTextarea";
import { InsightBox } from "./InsightBox";
import { TaskScoreResult } from "./TaskScoreResult";

export interface RecommendationAnswer {
  cityId: string | null;
  matches: Record<number, string>;
  text: string;
}

interface Props {
  task: RecommendationTask;
  taskNumber: number;
  answer: RecommendationAnswer;
  onAnswerChange: (a: RecommendationAnswer) => void;
  submitted: boolean;
  onSubmit: () => void;
  onContinue: () => void;
  showResources: boolean;
  setShowResources: (v: boolean) => void;
  onTextareaRef?: (el: HTMLTextAreaElement | null) => void;
}

export function computeRecommendationScores(task: RecommendationTask, a: RecommendationAnswer) {
  const matchTotal = task.matching.rows.length;
  const matchCorrect = task.matching.rows.filter(
    (r, i) => a.matches[i] === r.correctReasonId,
  ).length;
  const wordCount = a.text.trim().split(/\s+/).filter(Boolean).length;
  // Amsterdam is the model answer for the seeded data
  const isAmsterdam = a.cityId === "amsterdam";
  const structure = isAmsterdam ? 82 : 65;
  const judgment = wordCount > 100 ? 78 : 55;
  const communication = wordCount > 50 ? 85 : 60;
  const matchBonus = Math.round((matchCorrect / Math.max(1, matchTotal)) * 5);
  return {
    structure: Math.min(100, structure + matchBonus),
    judgment: Math.min(100, judgment + matchBonus),
    communication,
  };
}

export function TaskRecommendation({
  task,
  taskNumber,
  answer,
  onAnswerChange,
  submitted,
  onSubmit,
  onContinue,
  showResources,
  setShowResources,
  onTextareaRef,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!answer.cityId) {
      setError("Pick a city first.");
      return;
    }
    if (answer.text.trim().split(/\s+/).filter(Boolean).length < 20) {
      setError("Write your recommendation before submitting.");
      return;
    }
    setError(null);
    onSubmit();
  }

  const scores = submitted ? computeRecommendationScores(task, answer) : null;

  return (
    <>
      <div className="rounded-[14px] border border-sage bg-chalk overflow-hidden mb-4">
        <div className="flex items-start gap-3 border-b border-sage-mist-2 bg-pale-sage px-5 py-4">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sage text-chalk font-bold text-sm">
            {taskNumber}
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage">
              Recommendation · {task.durationMin} min
            </div>
            <div className="text-base font-semibold text-charcoal mt-0.5">
              {task.title}
            </div>
            <div className="text-[12px] text-charcoal-2 mt-0.5">
              Scored on: {task.scoredOn.join(" · ")}
            </div>
          </div>
        </div>

        <div className="flex gap-1 border-b border-sage-mist-2 bg-pale-sage/50 px-5">
          <button
            type="button"
            onClick={() => setShowResources(false)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
              !showResources ? "border-sage text-charcoal" : "border-transparent text-charcoal-3 hover:text-charcoal-2"
            }`}
          >
            Task
          </button>
          <button
            type="button"
            onClick={() => setShowResources(true)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
              showResources ? "border-sage text-charcoal" : "border-transparent text-charcoal-3 hover:text-charcoal-2"
            }`}
          >
            Resources
          </button>
        </div>

        <div className="p-5">
          {!showResources ? (
            <>
              <p className="text-sm leading-7 text-charcoal-2 mb-5">
                {task.brief}
              </p>

              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal-2 mb-2.5">
                {task.picker.label}
              </div>
              <OptionPicker
                options={task.picker.options}
                selected={answer.cityId}
                onSelect={(id) => onAnswerChange({ ...answer, cityId: id })}
                columns={3}
                disabled={submitted}
              />

              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal-2 mb-2.5 mt-6">
                Step 2 — Match each factor to why it matters
              </div>
              <MatchingRows
                instruction={task.matching.instruction}
                rows={task.matching.rows}
                values={answer.matches}
                onChange={(rowIndex, value) =>
                  onAnswerChange({
                    ...answer,
                    matches: { ...answer.matches, [rowIndex]: value },
                  })
                }
              />

              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal-2 mb-2.5 mt-6">
                {task.textarea.label}
              </div>
              <p
                className="text-[13px] text-charcoal-2 leading-relaxed mb-2.5"
                dangerouslySetInnerHTML={{ __html: task.textarea.helperHtml }}
              />
              <div className="mb-3">
                <InsightBox
                  label="💡 Structure tip"
                  text={task.textarea.structureTip}
                />
              </div>
              <OpenTextarea
                value={answer.text}
                onChange={(t) => onAnswerChange({ ...answer, text: t })}
                placeholder={task.textarea.placeholder}
                wordLimit={task.textarea.wordLimit}
                rows={5}
                disabled={submitted}
                onTextareaRef={onTextareaRef}
              />
              {error && (
                <p className="mt-2 text-[12px] text-coral-700">{error}</p>
              )}
            </>
          ) : (
            <ul className="divide-y divide-sage-mist-2">
              {task.resources.map((r, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-pale-sage text-base">
                    {r.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-charcoal">
                      {r.title}
                    </div>
                    <div className="text-[11px] text-charcoal-3">
                      {r.subtitle}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!submitted && !showResources && (
          <div className="flex items-center justify-end gap-2 border-t border-sage-mist-2 bg-pale-sage/40 px-5 py-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-charcoal px-5 py-2.5 text-[13px] font-semibold text-chalk hover:bg-sage transition-colors"
            >
              Submit &amp; see score →
            </button>
          </div>
        )}
      </div>

      {submitted && scores && (
        <TaskScoreResult
          taskNumber={taskNumber}
          dims={[
            {
              label: "Structure",
              score: scores.structure,
              feedback:
                scores.structure > 75
                  ? "Clear structure — you led with the recommendation and backed it up."
                  : "Try leading with your answer, not your analysis. Executives read the first line.",
            },
            {
              label: "Judgment",
              score: scores.judgment,
              feedback:
                scores.judgment > 70
                  ? "Good judgment — you acknowledged risk which shows mature thinking."
                  : "Strong pick but the rationale is thin. What's the one reason this beats the alternatives?",
            },
            {
              label: "Communication",
              score: scores.communication,
              feedback:
                "Concise and readable. No jargon. This works as a real executive note.",
            },
          ]}
          onContinue={onContinue}
          continueLabel="Continue to Task 3"
        />
      )}
    </>
  );
}
