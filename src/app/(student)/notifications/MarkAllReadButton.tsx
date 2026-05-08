"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";
import { markAllNotificationsRead } from "./actions";

export function MarkAllReadButton({ disabled }: { disabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={() =>
        startTransition(async () => {
          await markAllNotificationsRead();
          router.refresh();
        })
      }
      className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-sage-mist-2 bg-chalk px-3 py-1.5 text-xs font-semibold text-sage shadow-1 transition-colors hover:bg-pale-sage disabled:cursor-not-allowed disabled:opacity-50"
    >
      <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
      {pending ? "Marking…" : "Mark all read"}
    </button>
  );
}
