"use client";

interface Option {
  id: string;
  emoji?: string;
  icon?: string;
  name?: string;
  title?: string;
  sub: string;
}

interface Props {
  options: Option[];
  selected: string | null;
  onSelect: (id: string) => void;
  columns?: 2 | 3 | 4;
  disabled?: boolean;
}

export function OptionPicker({
  options,
  selected,
  onSelect,
  columns = 3,
  disabled = false,
}: Props) {
  const colClass =
    columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";
  return (
    <div className={`grid gap-2.5 ${colClass}`}>
      {options.map((opt) => {
        const isSel = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt.id)}
            className={`relative rounded-xl border bg-chalk p-4 text-left transition-all disabled:cursor-not-allowed ${
              isSel
                ? "border-sage bg-pale-sage shadow-1"
                : "border-sage-mist-2 hover:border-sage hover:bg-pale-sage/40"
            }`}
          >
            <div className="text-2xl mb-1.5">{opt.emoji ?? opt.icon}</div>
            <div className="text-sm font-semibold text-charcoal">
              {opt.name ?? opt.title}
            </div>
            <div className="text-[11px] text-charcoal-2 mt-0.5 leading-snug">
              {opt.sub}
            </div>
            {isSel && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-sage text-[10px] font-bold text-chalk">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
