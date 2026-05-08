"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { sendInterviewInvite } from "../actions";

interface Props {
  submissionId: string;
  candidateName: string;
  caseStudyTitle: string;
  recruiterName: string;
  companyName: string;
  defaultContactEmail: string;
}

function buildTemplate(
  candidateName: string,
  caseStudyTitle: string,
  recruiterName: string,
  companyName: string,
) {
  const name = candidateName || "there";
  return `Hi ${name}, your solution to our ${caseStudyTitle} caught our attention. We'd love to chat — reply to this email and we'll set up a 30-min intro call. — ${recruiterName}, ${companyName}`;
}

export function InviteModal({
  submissionId,
  candidateName,
  caseStudyTitle,
  recruiterName,
  companyName,
  defaultContactEmail,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(() =>
    buildTemplate(candidateName, caseStudyTitle, recruiterName, companyName),
  );
  const [contactEmail, setContactEmail] = useState(defaultContactEmail);
  const [error, setError] = useState<string | null>(null);

  const len = message.trim().length;
  const lenOk = len >= 20 && len <= 500;

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await sendInterviewInvite(
        submissionId,
        message,
        contactEmail,
      );
      if (!result.ok) {
        setError(result.error ?? "Failed to send invite.");
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <Button variant="primary" size="md" onClick={() => setOpen(true)}>
        Invite to interview
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-4">
          <div className="w-full max-w-lg rounded-[14px] bg-chalk shadow-2 p-6">
            <div className="mb-4">
              <div className="eyebrow mb-1">Invite to interview</div>
              <h2 className="text-xl font-bold text-charcoal tracking-tight">
                Reach out to {candidateName || "this candidate"}
              </h2>
              <p className="text-sm text-charcoal-2 mt-1">
                We&apos;ll surface this in the candidate&apos;s dashboard so they can reply.
              </p>
            </div>

            <label className="block text-sm font-semibold text-charcoal mb-1">
              Personal message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full rounded-[10px] border border-sage-mist-2 bg-chalk p-3 text-sm text-charcoal focus:outline-none focus:border-sage"
              placeholder="20–500 characters"
            />
            <div
              className={`mt-1 text-xs ${
                lenOk ? "text-charcoal-3" : "text-coral-700"
              }`}
            >
              {len}/500 characters {lenOk ? "" : "(20–500 required)"}
            </div>

            <label className="block text-sm font-semibold text-charcoal mb-1 mt-4">
              Reply-to email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-sage"
              placeholder="hiring@company.com"
            />

            {error && (
              <div className="mt-3 rounded-[10px] border border-coral bg-coral-100 px-3 py-2 text-sm text-coral-800">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={submit}
                disabled={pending || !lenOk}
              >
                {pending ? "Sending…" : "Send invite"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
