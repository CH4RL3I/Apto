"use client";

import { useId, useState } from "react";

type InfoTooltipProps = {
  label: string;
  text: string;
  className?: string;
};

export function InfoTooltip({ label, text, className }: InfoTooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className={`relative inline-flex items-center ${className ?? ""}`}>
      <button
        type="button"
        aria-label={`About ${label}`}
        aria-describedby={id}
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onBlur={() => setOpen(false)}
        className="peer focus-ring inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-sage-mist-2 bg-chalk text-[9px] font-bold leading-none text-charcoal-2 transition-colors hover:bg-pale-sage hover:text-sage-700 focus:bg-pale-sage focus:text-sage-700"
      >
        <span aria-hidden="true">i</span>
      </button>
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 w-56 -translate-x-1/2 rounded-md border border-sage-mist-2 bg-charcoal p-2 text-[10px] font-medium normal-case tracking-normal text-chalk shadow-2 transition-opacity duration-150 peer-hover:opacity-100 peer-focus:opacity-100 ${open ? "opacity-100" : "opacity-0"}`}
      >
        {text}
      </span>
    </span>
  );
}

export const IMPACT_SCORE_TOOLTIP =
  "Impact Score reflects how strongly your skills, interests, and prior work align with the people who succeed in this role. Higher means a closer fit — it's not a ranking of importance.";
