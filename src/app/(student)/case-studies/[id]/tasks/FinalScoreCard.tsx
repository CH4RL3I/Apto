"use client";

interface DimScore {
  label: string;
  score: number;
  feedback: string;
}

interface Props {
  challengeTitle: string;
  roleLabel: string;
  overall: string;
  dims: DimScore[];
}

export function FinalScoreCard({ challengeTitle, roleLabel, overall, dims }: Props) {
  return (
    <div className="rounded-[14px] border border-sage bg-chalk p-6 md:p-8 mb-4 fade-in relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-sage" />
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="text-lg font-semibold text-charcoal">
            Challenge complete <span aria-hidden>🎉</span>
          </div>
          <div className="text-[13px] text-charcoal-2 mt-1">
            {challengeTitle} · {roleLabel} · All 3 tasks
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-sage stat-num leading-none score-reveal">
            {overall}
          </div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-charcoal-3 mt-1">
            overall
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {dims.map((d) => (
          <div key={d.label}>
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-32 text-[12px] font-medium text-charcoal-2">
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
            <p className="mt-1.5 ml-0 sm:ml-32 text-[12px] text-charcoal-2 leading-relaxed">
              {d.feedback}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
