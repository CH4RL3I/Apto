import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/StudentSidebar";

interface ConnectionRow {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: string;
}

interface MessageRow {
  id: string;
  connection_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

interface UserRow {
  id: string;
  name: string | null;
  email: string;
}

function pickName(u?: UserRow) {
  if (!u) return "Unknown";
  return u.name?.trim() || u.email;
}

function preview(body: string) {
  const trimmed = body.trim().replace(/\s+/g, " ");
  return trimmed.length > 90 ? `${trimmed.slice(0, 87)}…` : trimmed;
}

export default async function MessagesInboxPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawConnections } = await supabase
    .from("connections")
    .select("id, requester_id, recipient_id, status")
    .eq("status", "accepted");

  const connections = (rawConnections ?? []) as ConnectionRow[];

  const connectionIds = connections.map((c) => c.id);
  const otherIds = Array.from(
    new Set(
      connections.map((c) =>
        c.requester_id === user.id ? c.recipient_id : c.requester_id,
      ),
    ),
  );

  const [{ data: rawMessages }, { data: usersData }] = await Promise.all([
    connectionIds.length
      ? supabase
          .from("messages")
          .select("id, connection_id, sender_id, body, created_at, read_at")
          .in("connection_id", connectionIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as MessageRow[] }),
    otherIds.length
      ? supabase.from("users").select("id, name, email").in("id", otherIds)
      : Promise.resolve({ data: [] as UserRow[] }),
  ]);

  const messages = (rawMessages ?? []) as MessageRow[];
  const userMap = new Map<string, UserRow>(
    ((usersData ?? []) as UserRow[]).map((u) => [u.id, u]),
  );

  const lastByConnection = new Map<string, MessageRow>();
  const unreadByConnection = new Map<string, number>();
  for (const m of messages) {
    if (!lastByConnection.has(m.connection_id)) {
      lastByConnection.set(m.connection_id, m);
    }
    if (m.sender_id !== user.id && m.read_at === null) {
      unreadByConnection.set(
        m.connection_id,
        (unreadByConnection.get(m.connection_id) ?? 0) + 1,
      );
    }
  }

  const sorted = [...connections].sort((a, b) => {
    const at = lastByConnection.get(a.id)?.created_at ?? "";
    const bt = lastByConnection.get(b.id)?.created_at ?? "";
    return bt.localeCompare(at);
  });

  return (
    <StudentShell active="messages">
      <header className="mb-8">
        <div className="eyebrow mb-2">Inbox</div>
        <h1 className="text-3xl font-bold tracking-tight text-charcoal">
          Messages
        </h1>
        <p className="mt-1 text-charcoal-2">
          Conversations with your connections.
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-sage-mist-2 bg-pale-sage/40 p-8 text-center">
          <div className="text-sm font-semibold text-charcoal">
            Your inbox is quiet
          </div>
          <div className="mt-1 text-sm text-charcoal-2">
            Accept a connection to start chatting.
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-sage-mist-2 overflow-hidden rounded-[14px] bg-chalk shadow-1">
          {sorted.map((c) => {
            const otherId =
              c.requester_id === user.id ? c.recipient_id : c.requester_id;
            const last = lastByConnection.get(c.id);
            const unread = unreadByConnection.get(c.id) ?? 0;
            return (
              <li key={c.id}>
                <Link
                  href={`/messages/${c.id}`}
                  className="focus-ring flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-pale-sage/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-charcoal">
                        {pickName(userMap.get(otherId))}
                      </span>
                      {unread > 0 && (
                        <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-bold leading-[18px] text-chalk">
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-sm text-charcoal-2">
                      {last ? preview(last.body) : "No messages yet"}
                    </div>
                  </div>
                  {last && (
                    <time
                      dateTime={last.created_at}
                      className="shrink-0 text-xs text-charcoal-3"
                    >
                      {new Date(last.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </StudentShell>
  );
}
