"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  cancelConnection,
  respondToConnection,
} from "./actions";

interface BaseProps {
  connectionId: string;
  name: string;
  headline: string | null;
}

export function IncomingRow({ connectionId, name, headline }: BaseProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(status: "accepted" | "rejected") {
    setError(null);
    startTransition(async () => {
      try {
        await respondToConnection(connectionId, status);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-[14px] bg-chalk p-5 shadow-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="font-semibold text-charcoal">{name}</div>
        {headline && (
          <div className="text-sm text-charcoal-2">{headline}</div>
        )}
        {error && (
          <div className="mt-1 text-xs text-coral-700">{error}</div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={isPending}
          onClick={() => handle("accepted")}
        >
          Accept
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => handle("rejected")}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

export function SentRow({ connectionId, name, headline }: BaseProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      try {
        await cancelConnection(connectionId);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-[14px] bg-chalk p-5 shadow-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="font-semibold text-charcoal">{name}</div>
        {headline && (
          <div className="text-sm text-charcoal-2">{headline}</div>
        )}
        {error && (
          <div className="mt-1 text-xs text-coral-700">{error}</div>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={handleCancel}
      >
        Cancel request
      </Button>
    </div>
  );
}

export function AcceptedCard({
  connectionId,
  name,
  headline,
}: BaseProps) {
  return (
    <div className="rounded-[14px] bg-chalk p-5 shadow-1">
      <div className="font-semibold text-charcoal">{name}</div>
      {headline && (
        <div className="mt-1 text-sm text-charcoal-2">{headline}</div>
      )}
      <div className="mt-3">
        <Link
          href={`/messages/${connectionId}`}
          className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-lg bg-sage px-3 py-1.5 text-[13px] font-semibold text-chalk shadow-1 transition-all hover:bg-sage-700 hover:shadow-2"
        >
          Message
        </Link>
      </div>
    </div>
  );
}
