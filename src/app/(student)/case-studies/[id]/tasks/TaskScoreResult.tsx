"use client";

interface DimScore {
  label: string;
  score: number; // 0-100
  feedback: string;
}

interface Props {
  taskNumber: number;
  dims: DimScore[];
  onContinue: () => void;
  continueLabel: string;
}

export function TaskScoreResult({ taskNumber, dims, onContinue, continueLabel }: Props) {
  return (
    <div className="rounded-[14px] border border-sage bg-chalk p-6 mb-4 fade-in">
      <div className="text-base font-semibold text-charcoal">
        Task {taskNumber} complete <span aria-hidden>🎉</span>
      </div>
      <p className="text-[13px] text-charcoal-2 mt-1 mb-5">
        Here&apos;s how you did — scores update your running total
      </p>
      <div className="space-y-4">
        {dims.map((d) => (
          <div key={d.label}>
            <div className="flex items-center gap-3">
              <div className="w-32 text-[12px] font-medium text-charcoal-2">
                {d.label}
              </div>
              <div className="flex-1 h-2 rounded-full bg-sage-mist-2 overflow-hidden">
                <div
                  className="h-full bg-sage transition-[width] duration-700 ease-out"
                  style={{ width: `${d.score}%` }}
                />
              </div>
              <div className="w-10 text-right text-[13px] font-bold text-charcoal stat-num">
                {(d.score / 10).toFixed(1)}
              </div>
            </div>
            <p className="mt-1.5 ml-32 text-[12px] text-charcoal-2 leading-relaxed">
              {d.feedback}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-lg bg-charcoal px-5 py-2.5 text-[13px] font-semibold text-chalk hover:bg-sage transition-colors"
        >
          {continueLabel} →
        </button>
      </div>
    </div>
  );
}
