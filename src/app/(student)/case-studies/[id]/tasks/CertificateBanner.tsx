"use client";

interface Props {
  challengeTitle: string;
  submissionId: string | null;
}

export function CertificateBanner({ challengeTitle, submissionId }: Props) {
  return (
    <div className="rounded-[14px] border border-sage-mist-2 bg-pale-sage p-5 mb-4 flex flex-col gap-4 fade-in sm:flex-row sm:items-center">
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
      {submissionId ? (
        <a
          href={`/certificate/${submissionId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-lg border border-sage bg-chalk px-3 py-2 text-center text-[12px] font-semibold text-sage hover:bg-pale-sage focus-ring sm:w-auto"
        >
          View certificate ↗
        </a>
      ) : (
        <span className="w-full rounded-lg border border-sage-mist-2 bg-chalk px-3 py-2 text-center text-[12px] font-semibold text-charcoal-3 sm:w-auto">
          Saving…
        </span>
      )}
    </div>
  );
}
