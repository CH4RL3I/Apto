import { BookOpen, ChevronDown } from "lucide-react";

interface ChallengeIntroProps {
  intro: {
    summary: string;
    glossary: { term: string; definition: string }[];
  };
}

export function ChallengeIntro({ intro }: ChallengeIntroProps) {
  return (
    <details className="group bg-chalk rounded-[14px] shadow-1 mb-6 overflow-hidden">
      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-6 py-4 hover:bg-pale-sage/40 transition-colors">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-pale-sage flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-sage" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <div className="eyebrow leading-tight">Before you start</div>
            <h2 className="text-[15px] font-semibold text-charcoal leading-snug">
              Background &amp; terminology
            </h2>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 text-charcoal-3 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
          strokeWidth={1.75}
        />
      </summary>

      <div className="px-6 pb-6 pt-1 border-t border-sage-mist-2/60">
        <p className="text-sm text-charcoal-2 leading-relaxed mt-4 mb-5">
          {intro.summary}
        </p>

        <div className="eyebrow mb-2.5">Key terms</div>
        <dl className="divide-y divide-sage-mist-2/60">
          {intro.glossary.map(({ term, definition }) => (
            <div key={term} className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-4 py-2.5">
              <dt className="text-[13px] font-semibold text-charcoal">{term}</dt>
              <dd className="text-[13px] text-charcoal-2 leading-relaxed">{definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
