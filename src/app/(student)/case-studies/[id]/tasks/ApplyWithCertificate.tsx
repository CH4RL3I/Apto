"use client";

import { useState } from "react";

interface Props {
  companyName: string;
  roleLabel: string;
}

export function ApplyWithCertificate({ companyName, roleLabel }: Props) {
  const [applied, setApplied] = useState(false);
  return (
    <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-5 mb-4 flex flex-col gap-4 fade-in sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="text-sm font-semibold text-charcoal">
          Apply to {companyName} — {roleLabel}
        </div>
        <div className="text-[12px] text-charcoal-2 mt-1 leading-relaxed">
          {applied
            ? `✓ Application submitted. ${companyName} will review your certificate and score when they open a position.`
            : `No open role right now — Apto holds your application. ${companyName} reviews when they hire.`}
        </div>
      </div>
      <button
        type="button"
        disabled={applied}
        onClick={() => setApplied(true)}
        className={`w-full flex-none rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors sm:w-auto ${
          applied
            ? "bg-pale-sage text-sage-700 cursor-default"
            : "bg-charcoal text-chalk hover:bg-sage"
        }`}
      >
        {applied ? "Applied ✓" : "Apply with certificate →"}
      </button>
    </div>
  );
}
