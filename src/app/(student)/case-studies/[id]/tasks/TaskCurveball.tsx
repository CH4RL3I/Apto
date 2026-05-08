"use client";

import { useState } from "react";
import type { CurveballTask } from "@/lib/questionnaire/case-studies";
import { OptionPicker } from "./OptionPicker";
import { OpenTextarea } from "./OpenTextarea";
import { InsightBox } from "./InsightBox";

export interface CurveballAnswer {
  stanceId: string | null;
  text: string;
}

interface Props {
  task: CurveballTask;
  taskNumber: number;
  answer: CurveballAnswer;
  onAnswerChange: (a: CurveballAnswer) => void;
  submitted: boolean;
  onSubmit: () => void;
  onTextareaRef?: (el: HTMLTextAreaElement | null) => void;
}

export function computeCurveballScores(task: CurveballTask, a: CurveballAnswer) {
  const map: Record<string, { s: number; j: number; c: number; comp: number }> = {
    adapt: { s: 85, j: 88, c: 82, comp: 90 },
    hold: { s: 80, j: 78, c: 85, comp: 82 },
    switch: { s: 72, j: 65, c: 78, comp: 60 },
    delay: { s: 55, j: 40, c: 70, comp: 35 },
  };
  const base = (a.stanceId && map[a.stanceId]) || { s: 70, j: 70, c: 70, comp: 70 };
  const wordCount = a.text.trim().split(/\s+/).filter(Boolean).length;
  const lengthBonus = wordCount > 60 ? 0 : -10;
  return {
    structure: Math.max(20, base.s + lengthBonus),
    judgment: Math.max(20, base.j + lengthBonus),
    communication: Math.max(20, base.c + lengthBonus),
    composure: Math.max(20, base.comp + lengthBonus),
  };
}

export function TaskCurveball({
  task,
  taskNumber,
  answer,
  onAnswerChange,
  submitted,
  onSubmit,
  onTextareaRef,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const selectedStance = task.stancePicker.options.find(
    (o) => o.id === answer.stanceId,
  );

  function handleSubmit() {
    if (!answer.stanceId) {
      setError("Pick your stance first.");
      return;
    }
    if (answer.text.trim().split(/\s+/).filter(Boolean).length < 15) {
      setError("Write your response before submitting.");
      return;
    }
    setError(null);
    onSubmit();
  }

  return (
    <div className="space-y-4 mb-4">
      <div className="relative overflow-hidden rounded-[14px] bg-charcoal text-chalk p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-coral" />
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-coral animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-coral">
            New development — just in
          </span>
        </div>
        <div className="text-base font-semibold mb-3">
          A competitor just entered your recommended market.
        </div>
        <div
          className="text-[13px] leading-7 text-chalk/85"
          dangerouslySetInnerHTML={{ __html: task.curveballHtml }}
        />
      </div>

      <div className="rounded-lg border border-sage-mist-2 bg-pale-sage px-4 py-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage mb-1">
          Your recommendation from Task 2
        </div>
        <div className="text-[13px] italic text-charcoal-2">
          &ldquo;{task.recapText}&rdquo;
        </div>
      </div>

      <div className="rounded-[14px] border border-sage bg-chalk overflow-hidden">
        <div className="flex items-start gap-3 border-b border-sage-mist-2 bg-pale-sage px-5 py-4">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sage text-chalk font-bold text-sm">
            {taskNumber}
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage">
              Curveball · {task.durationMin} min
            </div>
            <div className="text-base font-semibold text-charcoal mt-0.5">
              {task.title}
            </div>
            <div className="text-[12px] text-charcoal-2 mt-0.5">
              Scored on: {task.scoredOn.join(" · ")}
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm leading-7 text-charcoal-2 mb-4">
            The CEO needs a fast, clear response. There&apos;s no perfect answer
            here — she wants to see how you think under pressure, not a new full
            analysis.
          </p>

          <div className="mb-5">
            <InsightBox
              label={`💡 ${task.insight.label}`}
              text={task.insight.text}
            />
          </div>

          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal-2 mb-2.5">
            Step 1 — What&apos;s your stance?
          </div>
          <OptionPicker
            options={task.stancePicker.options.map((o) => ({
              id: o.id,
              icon: o.icon,
              title: o.title,
              sub: o.sub,
            }))}
            selected={answer.stanceId}
            onSelect={(id) => onAnswerChange({ ...answer, stanceId: id })}
            columns={4}
            disabled={submitted}
          />
          {selectedStance && (
            <div className="mt-3">
              <InsightBox
                label="Coaching note"
                text={selectedStance.coachingHint}
              />
            </div>
          )}

          <hr className="border-sage-mist-2 my-5" />

          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal-2 mb-2.5">
            {task.textarea.label}
          </div>
          <p
            className="text-[13px] text-charcoal-2 leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: task.textarea.helperHtml }}
          />
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
        </div>

        {!submitted && (
          <div className="flex flex-col gap-2 border-t border-sage-mist-2 bg-pale-sage/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-lg bg-charcoal px-5 py-2.5 text-[13px] font-semibold text-chalk hover:bg-sage transition-colors sm:w-auto"
            >
              Submit &amp; finish challenge →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
