"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function buildIcs(params: {
  title: string;
  startsAt: string;
  durationMinutes: number;
}) {
  const start = new Date(params.startsAt);
  const end = new Date(start.getTime() + params.durationMinutes * 60 * 1000);

  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Apto//Events//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${params.title}`,
    `UID:${crypto.randomUUID()}@apto.app`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

function downloadIcs(title: string, startsAt: string, durationMinutes: number) {
  const ics = buildIcs({ title, startsAt, durationMinutes });
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface RegisterButtonProps {
  eventId: string;
  eventTitle: string;
  startsAt: string;
  durationMinutes: number;
  initialRegistered: boolean;
  initialSpotsLeft: number;
}

export function RegisterButton({
  eventId,
  eventTitle,
  startsAt,
  durationMinutes,
  initialRegistered,
  initialSpotsLeft,
}: RegisterButtonProps) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [spotsLeft, setSpotsLeft] = useState(initialSpotsLeft);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time subscription to keep spots count live
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`event-spots-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "events",
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          const updated = payload.new as { total_spots: number; registered_count: number };
          setSpotsLeft(updated.total_spots - updated.registered_count);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  async function handleRegister() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("register_for_event", {
        p_event_id: eventId,
      });
      if (rpcError) throw rpcError;
      setRegistered(true);
      setSpotsLeft((s) => Math.max(0, s - 1));
      downloadIcs(eventTitle, startsAt, durationMinutes);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (registered) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-[12px] border border-sage/30 bg-sage/5 px-4 py-3">
          <Check className="h-4 w-4 text-sage shrink-0" strokeWidth={2} />
          <p className="text-sm font-semibold text-sage">You&apos;re registered for this event</p>
        </div>
        <button
          onClick={() => downloadIcs(eventTitle, startsAt, durationMinutes)}
          className="focus-ring flex items-center gap-2 rounded-[12px] border border-sage-mist-2 bg-chalk px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-pale-sage transition-colors"
        >
          <CalendarDays className="h-4 w-4 text-sage" strokeWidth={1.75} />
          Download calendar invite (.ics)
        </button>
      </div>
    );
  }

  const isFull = spotsLeft <= 0;

  return (
    <div className="space-y-2">
      <button
        onClick={handleRegister}
        disabled={loading || isFull}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-[12px] bg-sage px-5 py-3 text-sm font-semibold text-chalk transition-colors hover:bg-sage/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Registering…
          </>
        ) : isFull ? (
          "Fully booked"
        ) : (
          <>
            <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
            Register — {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left
          </>
        )}
      </button>
      {error && <p className="text-xs text-coral">{error}</p>}
    </div>
  );
}
