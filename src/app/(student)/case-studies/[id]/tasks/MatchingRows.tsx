"use client";

import type { MatchingRow } from "@/lib/questionnaire/case-studies";
import { InsightBox } from "./InsightBox";

interface Props {
  instruction: string;
  rows: MatchingRow[];
  values: Record<number, string>;
  onChange: (rowIndex: number, value: string) => void;
}

export function MatchingRows({ instruction, rows, values, onChange }: Props) {
  const allCorrect =
    rows.length > 0 &&
    rows.every((row, i) => values[i] === row.correctReasonId);
  const anyAttempted = Object.values(values).some((v) => v && v.length > 0);
  const anyWrong = rows.some(
    (row, i) => values[i] && values[i] !== row.correctReasonId,
  );
  return (
    <div>
      <p className="text-[13px] text-charcoal-2 leading-relaxed mb-3">
        {instruction}
      </p>
      <div className="space-y-2.5">
        {rows.map((row, i) => {
          const v = values[i] ?? "";
          const isCorrect = v && v === row.correctReasonId;
          const isWrong = v && v !== row.correctReasonId;
          return (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_1.4fr] gap-2 md:gap-3 items-center"
            >
              <div
                className={`rounded-lg border px-3 py-2.5 text-[13px] font-medium ${
                  isCorrect
                    ? "border-sage bg-pale-sage text-charcoal"
                    : "border-sage-mist-2 bg-chalk text-charcoal"
                }`}
              >
                {row.factor}
              </div>
              <div className="hidden md:block text-charcoal-3 text-center">
                →
              </div>
              <select
                value={v}
                onChange={(e) => onChange(i, e.target.value)}
                className={`w-full rounded-lg border bg-chalk px-3 py-2.5 text-[13px] text-charcoal outline-none focus:border-sage transition-colors ${
                  isCorrect
                    ? "border-sage bg-pale-sage"
                    : isWrong
                    ? "border-coral bg-coral-100"
                    : "border-sage-mist-2"
                }`}
              >
                <option value="">Select reason...</option>
                {row.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.text}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {allCorrect && (
        <div className="mt-4">
          <InsightBox
            label="✓ All matched correctly"
            text="Good — you've identified the strategic logic behind each factor. Now use this in your written recommendation."
            tone="success"
          />
        </div>
      )}
      {!allCorrect && anyAttempted && anyWrong && (
        <div className="mt-4">
          <InsightBox
            label="✗ Not quite"
            text="Think about what each data point is actually telling you about the market — what decision does it support?"
            tone="error"
          />
        </div>
      )}
    </div>
  );
}
