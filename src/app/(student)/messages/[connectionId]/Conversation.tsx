"use client";

import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { markMessagesRead, sendMessage } from "../actions";

interface Message {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

interface ConversationProps {
  connectionId: string;
  currentUserId: string;
  messages: Message[];
}

function dayKey(iso: string) {
  return new Date(iso).toDateString();
}

function formatDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function Conversation({
  connectionId,
  currentUserId,
  messages,
}: ConversationProps) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, startTransition] = useTransition();
  const [optimistic, addOptimistic] = useOptimistic<Message[], Message>(
    messages,
    (state, msg) => [...state, msg],
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markMessagesRead(connectionId).then(() => router.refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [optimistic.length]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setError(null);
    setDraft("");
    startTransition(async () => {
      addOptimistic({
        id: `optimistic-${Date.now()}`,
        sender_id: currentUserId,
        body,
        created_at: new Date().toISOString(),
        read_at: null,
      });
      try {
        await sendMessage(connectionId, body);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send");
        setDraft(body);
      }
    });
  }

  const grouped: Array<{ key: string; messages: Message[] }> = [];
  for (const m of optimistic) {
    const key = dayKey(m.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.key === key) {
      last.messages.push(m);
    } else {
      grouped.push({ key, messages: [m] });
    }
  }

  return (
    <div className="flex h-[calc(100svh-180px)] min-h-[420px] flex-col rounded-[14px] bg-chalk shadow-1 sm:h-[calc(100vh-200px)] sm:min-h-[480px]">
      <div className="flex-1 overflow-y-auto p-5">
        {grouped.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-charcoal-3">
            No messages yet. Say hi.
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.key} className="space-y-2">
                <div className="text-center text-[11px] font-semibold uppercase tracking-wide text-charcoal-3">
                  {formatDay(group.messages[0].created_at)}
                </div>
                {group.messages.map((m) => {
                  const mine = m.sender_id === currentUserId;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-[14px] px-3.5 py-2 text-sm shadow-1 ${
                          mine
                            ? "bg-sage text-chalk"
                            : "bg-pale-sage text-charcoal"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {m.body}
                        </div>
                        <div
                          className={`mt-1 text-[10px] ${mine ? "text-chalk/80" : "text-charcoal-3"}`}
                        >
                          {formatTime(m.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-sage-mist-2 p-3"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows={1}
          maxLength={4000}
          placeholder="Write a message…"
          className="focus-ring max-h-32 flex-1 resize-y rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSending || draft.trim().length === 0}
          icon={<Send className="h-4 w-4" strokeWidth={2} />}
        >
          Send
        </Button>
      </form>
      {error && (
        <div className="px-4 pb-3 text-xs text-coral-700">{error}</div>
      )}
    </div>
  );
}
