"use client";

import { InsightBox } from "./InsightBox";
import type { QuickCheckOption } from "@/lib/questionnaire/case-studies";

interface Props {
  question: string;
  options: QuickCheckOption[];
  selected: number | null;
  onSelect: (index: number) => void;
}

export function QuickCheckQuiz({ question, options, selected, onSelect }: Props) {
  const selectedOpt = selected !== null ? options[selected] : null;
  return (
    <div className="mb-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.07em] text-charcoal-2 mb-2.5">
        Quick check — before you start
      </div>
      <p className="text-sm leading-7 text-charcoal-2 mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={`flex w-full items-start gap-2.5 rounded-lg border px-4 py-3 text-left transition-colors ${
                isSelected
                  ? "border-sage bg-pale-sage"
                  : "border-sage-mist-2 bg-chalk hover:border-sage hover:bg-pale-sage/50"
              }`}
            >
              <span
                className={`mt-0.5 flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected ? "border-sage bg-sage" : "border-sage-mist-2"
                }`}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-chalk" />
                )}
              </span>
              <span className="text-[13px] leading-relaxed text-charcoal">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
      {selectedOpt && (
        <div className="mt-3">
          <InsightBox
            label={selectedOpt.correct ? "✓ Correct" : "✗ Not quite"}
            text={selectedOpt.feedback}
            tone={selectedOpt.correct ? "success" : "error"}
          />
        </div>
      )}
    </div>
  );
}
