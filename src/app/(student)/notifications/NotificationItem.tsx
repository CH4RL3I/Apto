"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markNotificationRead } from "./actions";

type Props = {
  id: string;
  href: string;
  label: string;
  detail: string | null;
  unread: boolean;
  createdAt: string;
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NotificationItem({ id, href, label, detail, unread, createdAt }: Props) {
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={() => {
        if (unread) {
          startTransition(async () => {
            await markNotificationRead(id);
            router.refresh();
          });
        }
      }}
      className={`focus-ring flex items-start gap-3 rounded-[14px] border border-sage-mist-2 bg-chalk px-4 py-3 shadow-1 transition-shadow hover:shadow-2 ${
        unread ? "bg-pale-sage/40" : ""
      }`}
    >
      {unread && (
        <span
          aria-hidden="true"
          className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-coral"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-charcoal">{label}</div>
        {detail && <div className="mt-0.5 text-xs text-charcoal-2">{detail}</div>}
      </div>
      <div className="shrink-0 text-[11px] text-charcoal-3">{formatTime(createdAt)}</div>
    </Link>
  );
}
