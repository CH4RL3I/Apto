"use client";

import { useState } from "react";

interface Props {
  challengeTitle: string;
}

export function CertificateBanner({ challengeTitle }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="rounded-[14px] border border-sage-mist-2 bg-pale-sage p-5 mb-4 flex items-center gap-4 fade-in">
      <div
        aria-hidden
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-sage text-2xl"
      >
        🏅
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-charcoal">
          {challengeTitle} Certificate earned
        </div>
        <div className="text-[12px] text-charcoal-2 mt-0.5 leading-relaxed">
          Your score breakdown and responses are saved to your Apto portfolio.
          Companies can see exactly how you think, not just that you passed.
        </div>
      </div>
      <div className="relative">
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip((v) => !v)}
          className="rounded-lg border border-sage bg-chalk px-3 py-2 text-[12px] font-semibold text-sage hover:bg-pale-sage focus-ring"
        >
          View certificate ↗
        </button>
        {showTooltip && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-lg bg-charcoal text-chalk text-[11px] leading-relaxed px-3 py-2 shadow-2 z-10">
            Certificate available — coming soon: shareable link with your full
            response history.
          </div>
        )}
      </div>
    </div>
  );
}
