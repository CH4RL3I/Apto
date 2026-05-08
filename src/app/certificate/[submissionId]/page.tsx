import { createClient } from "@/lib/supabase/server";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { Logo } from "@/components/Logo";
import { PrintButton } from "./PrintButton";

const COMPLETED_STATUSES = new Set([
  "submitted",
  "scored",
  "reviewed",
  "shortlisted",
]);

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("submissions")
    .select("id, user_id, case_study_id, status, submitted_at, score")
    .eq("id", submissionId)
    .maybeSingle();

  const isComplete =
    submission && COMPLETED_STATUSES.has(submission.status as string);

  if (!submission || !isComplete) {
    return (
      <div className="min-h-screen bg-pale-sage flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-chalk rounded-[14px] shadow-1 p-8 text-center">
          <div className="eyebrow mb-2">Certificate</div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight mb-3">
            Certificate not found
          </h1>
          <p className="text-sm text-charcoal-2 leading-relaxed">
            This certificate is unavailable. Certificates are issued only for
            completed challenges.
          </p>
        </div>
      </div>
    );
  }

  const caseStudy = CASE_STUDIES.find((c) => c.id === submission.case_study_id);
  const challengeTitle = caseStudy?.title ?? "Challenge";
  const companyName = caseStudy?.companyName ?? "Apto";

  let studentName: string | null = null;
  if (submission.user_id) {
    const { data: userRow } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", submission.user_id)
      .maybeSingle();
    studentName =
      (userRow?.name as string | null) ??
      (userRow?.email as string | null) ??
      null;
  }

  const completionDate = formatDate(submission.submitted_at as string | null);
  const displayName = studentName?.trim() || "Apto Student";

  return (
    <div className="min-h-screen bg-pale-sage print:bg-white py-10 px-4 print:p-0 print:min-h-0">
      <div className="max-w-3xl mx-auto mb-6 flex justify-end gap-2 print:hidden">
        <PrintButton />
      </div>

      <div
        className="max-w-3xl mx-auto bg-chalk shadow-2 print:shadow-none rounded-[18px] print:rounded-none border-2 border-sage print:border-2 print:border-sage p-10 md:p-14 print:p-12 relative overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-pale-sage opacity-60 print:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-pale-sage opacity-60 print:hidden"
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-4 mb-10">
            <Logo height={32} priority />
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal-3">
              Certificate
            </div>
          </div>

          <div className="text-center">
            <div className="eyebrow mb-3">Certificate of Completion</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-charcoal">
              This certifies that
            </h1>
            <p className="mt-6 text-2xl md:text-3xl font-bold text-sage tracking-tight">
              {displayName}
            </p>
            <p className="mt-6 text-base text-charcoal-2 leading-relaxed max-w-xl mx-auto">
              has successfully completed the Apto challenge
            </p>
            <p className="mt-3 text-xl md:text-2xl font-bold text-charcoal tracking-tight">
              {challengeTitle}
            </p>
            <p className="mt-3 text-sm text-charcoal-2">
              issued by{" "}
              <span className="font-semibold text-charcoal">{companyName}</span>
            </p>
            {typeof submission.score === "number" && (
              <p className="mt-6 text-sm text-charcoal-2">
                Score:{" "}
                <span className="font-bold text-charcoal stat-num">
                  {submission.score}
                </span>
                <span className="text-charcoal-3">/100</span>
              </p>
            )}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-sage-mist-2 pt-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">
                Completed on
              </div>
              <div className="mt-1 text-sm font-semibold text-charcoal">
                {completionDate ?? "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">
                Issued by
              </div>
              <div className="mt-1 text-sm font-semibold text-charcoal">
                Apto
              </div>
            </div>
          </div>

          <p className="mt-8 text-[11px] text-charcoal-3 text-center leading-relaxed">
            Verified by Apto · ID: {submission.id}
          </p>
        </div>
      </div>
    </div>
  );
}

