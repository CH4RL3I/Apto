"use client";

import { useState } from "react";

interface Props {
  onAccept: () => void;
  onCancel?: () => void;
}

/**
 * First-run honor-code modal. Shows once per session before the multi-task or
 * exam runner unlocks. Acceptance is persisted as
 * `integrity_signals.honor_code_accepted_at` on the submission.
 */
export function HonorCodeModal({ onAccept, onCancel }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-6">
      <div className="w-full max-w-md rounded-[14px] bg-chalk shadow-2 p-7">
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-pale-sage">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5 text-sage"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path d="M12 2.5l8 3v6.3c0 4.5-3.3 8.2-8 10-4.7-1.8-8-5.5-8-10V5.5l8-3z" />
              <path d="M9 12.25l2.4 2.4 4.5-5" />
            </svg>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-3 mb-1">
            Trust layer
          </div>
          <h2 className="text-xl font-bold text-charcoal tracking-tight">
            Before you start
          </h2>
        </div>

        <p className="text-sm text-charcoal-2 leading-relaxed mb-4">
          This is solo work. To keep things fair for you and the companies that
          review your submission, we record a few signals while you work:
        </p>
        <ul className="space-y-1.5 text-sm text-charcoal-2 mb-5">
          <li className="flex gap-2">
            <span className="text-sage font-bold mt-0.5">•</span>
            Tab switches and fullscreen exits.
          </li>
          <li className="flex gap-2">
            <span className="text-sage font-bold mt-0.5">•</span>
            Paste events (with character count, not the pasted text).
          </li>
          <li className="flex gap-2">
            <span className="text-sage font-bold mt-0.5">•</span>
            Time on task and idle periods.
          </li>
        </ul>
        <p className="text-[12px] text-charcoal-3 leading-relaxed mb-5">
          Companies see this on your submission — and so do you, on your
          certificate. Copy-paste from external sources may be flagged.
        </p>

        <label className="flex items-start gap-2 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-sage-mist-2 text-sage focus:ring-sage"
          />
          <span className="text-[13px] text-charcoal-2 leading-relaxed">
            I understand this is solo work, my activity is recorded for
            integrity, and copy-paste from external sources may be flagged.
          </span>
        </label>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={!checked}
            onClick={onAccept}
            className="focus-ring inline-flex w-full items-center justify-center rounded-full bg-sage px-4 py-3 text-sm font-semibold text-chalk shadow-1 transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-charcoal-2 py-2 text-sm hover:text-charcoal transition-colors"
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
