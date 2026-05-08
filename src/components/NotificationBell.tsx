"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type NotificationType =
  | "connection_request"
  | "connection_accepted"
  | "message_received"
  | "invitation_received"
  | "invitation_accepted"
  | "invitation_rejected"
  | "submission_scored";

type NotificationPayload = Record<string, unknown> | null;

type NotificationRow = {
  id: string;
  type: NotificationType;
  payload: NotificationPayload;
  read_at: string | null;
  created_at: string;
};

type Props = {
  userId: string;
  initialUnreadCount: number;
};

function describe(notification: NotificationRow): { label: string; href: string } {
  const payload = (notification.payload ?? {}) as Record<string, unknown>;
  switch (notification.type) {
    case "connection_request":
      return { label: "New connection request", href: "/connections" };
    case "connection_accepted":
      return { label: "Your connection request was accepted", href: "/connections" };
    case "message_received": {
      const connectionId = payload.connection_id as string | undefined;
      const preview = (payload.preview as string | undefined) ?? "New message";
      return {
        label: preview,
        href: connectionId ? `/messages/${connectionId}` : "/messages",
      };
    }
    case "invitation_received":
      return { label: "A company sent you an invitation", href: "/dashboard#invitations" };
    case "invitation_accepted":
      return { label: "An invitation was accepted", href: "/dashboard#invitations" };
    case "invitation_rejected":
      return { label: "An invitation was declined", href: "/dashboard#invitations" };
    case "submission_scored":
      return { label: "Your submission was scored", href: "/dashboard#submissions" };
    default:
      return { label: "Notification", href: "/notifications" };
  }
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(1, Math.floor((Date.now() - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export function NotificationBell({ userId, initialUnreadCount }: Props) {
  const [unread, setUnread] = useState(initialUnreadCount);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to realtime inserts on notifications for this user.
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          setUnread((n) => n + 1);
          setItems((prev) => (prev ? [row, ...prev].slice(0, 10) : prev));
          setPulse(true);
          window.setTimeout(() => setPulse(false), 1200);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Click-outside to close popover.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  async function loadRecent() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications/recent", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { items: NotificationRow[] };
        setItems(data.items);
      }
    } finally {
      setLoading(false);
    }
  }

  async function togglePanel() {
    const next = !open;
    setOpen(next);
    if (next && items === null) await loadRecent();
  }

  async function markAllRead() {
    setLoading(true);
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
      setUnread(0);
      setItems((prev) =>
        prev ? prev.map((row) => ({ ...row, read_at: row.read_at ?? new Date().toISOString() })) : prev,
      );
    } finally {
      setLoading(false);
    }
  }

  async function markOne(id: string) {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((prev) =>
      prev ? prev.map((row) => (row.id === id ? { ...row, read_at: new Date().toISOString() } : row)) : prev,
    );
    setUnread((n) => Math.max(0, n - 1));
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={togglePanel}
        aria-label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"}
        aria-expanded={open}
        className={`focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-sage-mist-2 bg-chalk text-charcoal-2 shadow-1 transition-all hover:bg-pale-sage ${
          pulse ? "ring-2 ring-coral animate-pulse" : ""
        }`}
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold leading-[18px] text-chalk shadow-1"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-[320px] overflow-hidden rounded-[14px] border border-sage-mist-2 bg-chalk shadow-2">
          <div className="flex items-center justify-between border-b border-sage-mist-2 px-3 py-2">
            <div className="text-sm font-bold text-charcoal">Notifications</div>
            <button
              type="button"
              onClick={markAllRead}
              disabled={loading || unread === 0}
              className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-sage hover:bg-pale-sage disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="h-3 w-3" strokeWidth={2} />
              Mark all read
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading && items === null ? (
              <div className="flex items-center justify-center gap-2 px-3 py-6 text-xs text-charcoal-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading…
              </div>
            ) : items && items.length > 0 ? (
              <ul className="divide-y divide-sage-mist-2">
                {items.map((row) => {
                  const meta = describe(row);
                  const unreadRow = !row.read_at;
                  return (
                    <li key={row.id}>
                      <Link
                        href={meta.href}
                        onClick={() => {
                          setOpen(false);
                          if (unreadRow) void markOne(row.id);
                        }}
                        className={`block px-3 py-2.5 text-sm transition-colors hover:bg-pale-sage ${
                          unreadRow ? "bg-pale-sage/40" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {unreadRow && (
                            <span
                              aria-hidden="true"
                              className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-coral"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-semibold text-charcoal">
                              {meta.label}
                            </div>
                            <div className="mt-0.5 text-[11px] text-charcoal-3">
                              {timeAgo(row.created_at)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-3 py-6 text-center text-xs text-charcoal-2">
                No notifications yet.
              </div>
            )}
          </div>

          <div className="border-t border-sage-mist-2 px-3 py-2 text-right">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="focus-ring inline-flex rounded-lg px-2 py-1 text-[11px] font-semibold text-sage hover:bg-pale-sage"
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
