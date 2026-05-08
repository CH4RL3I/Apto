"use client";

import { useState } from "react";
import type { AnalysisTask } from "@/lib/questionnaire/case-studies";
import { QuickCheckQuiz } from "./QuickCheckQuiz";
import { DataTable } from "./DataTable";
import { OpenTextarea } from "./OpenTextarea";
import { TaskScoreResult } from "./TaskScoreResult";

export interface AnalysisAnswer {
  quizPick: number | null;
  text: string;
}

interface Props {
  task: AnalysisTask;
  taskNumber: number;
  answer: AnalysisAnswer;
  onAnswerChange: (a: AnalysisAnswer) => void;
  submitted: boolean;
  onSubmit: () => void;
  onContinue: () => void;
  showResources: boolean;
  setShowResources: (v: boolean) => void;
  onTextareaRef?: (el: HTMLTextAreaElement | null) => void;
}

export function computeAnalysisScores(task: AnalysisTask, a: AnalysisAnswer) {
  const correctIdx = task.quickCheck.options.findIndex((o) => o.correct);
  const quizCorrect = a.quizPick === correctIdx;
  const wordCount = a.text.trim().split(/\s+/).filter(Boolean).length;
  const lengthScore = Math.min(100, Math.round((wordCount / Math.max(40, task.textarea.wordLimit * 0.5)) * 80) + 10);
  const structure = quizCorrect ? Math.min(95, lengthScore + 5) : Math.min(75, lengthScore - 5);
  const judgment = wordCount > 80 ? (quizCorrect ? 82 : 65) : 55;
  const communication = wordCount > 60 ? 84 : 62;
  return { structure, judgment, communication };
}

export function TaskAnalysis({
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
    if (answer.text.trim().split(/\s+/).filter(Boolean).length < 20) {
      setError("Write at least 20 words of analysis before submitting.");
      return;
    }
    setError(null);
    onSubmit();
  }

  const scores = submitted ? computeAnalysisScores(task, answer) : null;

  return (
    <>
      <div className="rounded-[14px] border border-sage bg-chalk overflow-hidden mb-4">
        <div className="flex items-start gap-3 border-b border-sage-mist-2 bg-pale-sage px-5 py-4">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sage text-chalk font-bold text-sm">
            {taskNumber}
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage">
              Analysis · {task.durationMin} min
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
              <QuickCheckQuiz
                question={task.quickCheck.question}
                options={task.quickCheck.options}
                selected={answer.quizPick}
                onSelect={(i) =>
                  onAnswerChange({ ...answer, quizPick: i })
                }
              />

              <hr className="border-sage-mist-2 my-4" />

              <div className="text-sm leading-7 text-charcoal mb-3 whitespace-pre-line">
                {task.prompt}
              </div>

              {task.dataTable && (
                <DataTable
                  columns={task.dataTable.columns}
                  rows={task.dataTable.rows}
                />
              )}

              <OpenTextarea
                value={answer.text}
                onChange={(t) => onAnswerChange({ ...answer, text: t })}
                placeholder={task.textarea.placeholder}
                wordLimit={task.textarea.wordLimit}
                rows={6}
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
              Submit &amp; continue →
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
                "You picked relevant factors and compared them clearly. Strong structure shows you can navigate noisy data.",
            },
            {
              label: "Judgment",
              score: scores.judgment,
              feedback:
                scores.judgment > 70
                  ? "Good judgment — you focused on demand and willingness to pay over surface metrics."
                  : "Try going deeper on which factors actually move the decision for a premium DTC brand.",
            },
            {
              label: "Communication",
              score: scores.communication,
              feedback:
                "Concise and readable. No jargon. This works as an analyst note.",
            },
          ]}
          onContinue={onContinue}
          continueLabel="Continue to Task 2"
        />
      )}
    </>
  );
}
