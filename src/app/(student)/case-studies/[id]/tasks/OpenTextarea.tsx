"use client";

import { useCallback } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  wordLimit: number;
  rows?: number;
  disabled?: boolean;
  /** Optional callback that receives the textarea node for paste tracking. */
  onTextareaRef?: (el: HTMLTextAreaElement | null) => void;
}

export function OpenTextarea({
  value,
  onChange,
  placeholder,
  wordLimit,
  rows = 5,
  disabled = false,
  onTextareaRef,
}: Props) {
  const words = value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const over = words > wordLimit;
  const refCallback = useCallback(
    (el: HTMLTextAreaElement | null) => {
      onTextareaRef?.(el);
    },
    [onTextareaRef],
  );
  return (
    <div>
      <textarea
        ref={refCallback}
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
