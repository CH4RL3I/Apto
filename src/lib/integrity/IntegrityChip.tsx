"use client";

/**
 * Visible cue to candidates that integrity signals are being recorded.
 * Honest UX, not gotcha — pairs with the honor-code modal at session start.
 */
export function IntegrityChip({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isDark = tone === "dark";
  return (
    <span
      title="We record tab switches, paste events, and time on task. Companies who review your submission see this."
      className={
        isDark
          ? "inline-flex items-center gap-1.5 rounded-full border border-chalk/15 bg-chalk/5 px-2.5 py-1 text-[11px] font-medium text-chalk/80"
          : "inline-flex items-center gap-1.5 rounded-full border border-sage-mist-2 bg-pale-sage/60 px-2.5 py-1 text-[11px] font-medium text-charcoal-2"
      }
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path d="M8 1.5l5 2v4.2c0 3-2.1 5.4-5 6.8-2.9-1.4-5-3.8-5-6.8V3.5l5-2z" />
        <path d="M5.75 8.25l1.6 1.6 3-3.4" />
      </svg>
      Integrity tracked
    </span>
  );
}
