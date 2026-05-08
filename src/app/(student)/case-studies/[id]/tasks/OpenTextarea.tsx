"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  wordLimit: number;
  rows?: number;
  disabled?: boolean;
}

export function OpenTextarea({
  value,
  onChange,
  placeholder,
  wordLimit,
  rows = 5,
  disabled = false,
}: Props) {
  const words = value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const over = words > wordLimit;
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full resize-y rounded-lg border border-sage-mist-2 bg-chalk px-4 py-3 text-[13px] leading-relaxed text-charcoal outline-none focus:border-sage transition-colors placeholder:text-charcoal-3 disabled:bg-pale-sage/40"
      />
      <div
        className={`text-[11px] mt-1.5 text-right ${
          over ? "text-coral" : "text-charcoal-3"
        }`}
      >
        {words} / {wordLimit} words
      </div>
    </div>
  );
}
