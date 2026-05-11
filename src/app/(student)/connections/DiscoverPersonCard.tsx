"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { requestConnection } from "./actions";

interface Props {
  recipientUserId: string;
  username: string;
  name: string;
  headline: string | null;
  skills: string[];
}

export function DiscoverPersonCard({
  recipientUserId,
  username,
  name,
  headline,
  skills,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleConnect() {
    setError(null);
    startTransition(async () => {
      try {
        await requestConnection(recipientUserId);
        setSent(true);
        // Hide the card after a short beat so the user sees the confirmation.
        setTimeout(() => setHidden(true), 1200);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to send request");
      }
    });
  }

  if (hidden) return null;

  return (
    <div className="flex flex-col rounded-[14px] bg-chalk p-5 shadow-1">
      <div className="min-w-0">
        <div className="font-semibold text-charcoal">{name}</div>
        {headline && (
          <div className="mt-1 line-clamp-1 text-sm text-charcoal-2">
            {headline}
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((s) => (
            <Pill key={s} variant="sage" size="sm">
              {s}
            </Pill>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        {sent ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-pale-sage px-3 py-1.5 text-[13px] font-semibold text-sage-700">
            Request sent ✓
          </span>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isPending}
            onClick={handleConnect}
          >
            {isPending ? "Sending…" : "Connect"}
          </Button>
        )}
        <Link
          href={`/u/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring text-[13px] font-semibold text-sage hover:underline"
        >
          View profile
        </Link>
      </div>

      {error && (
        <div className="mt-2 text-xs text-coral-700">{error}</div>
      )}
    </div>
  );
}
