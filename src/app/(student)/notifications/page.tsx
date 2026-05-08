import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/StudentSidebar";
import { Pill } from "@/components/ui/Pill";
import { MarkAllReadButton } from "./MarkAllReadButton";
import { NotificationItem } from "./NotificationItem";

type Tab = "all" | "unread" | "connections" | "messages" | "invitations";

type NotificationType =
  | "connection_request"
  | "connection_accepted"
  | "message_received"
  | "invitation_received"
  | "invitation_accepted"
  | "invitation_rejected"
  | "submission_scored";

type NotificationRow = {
  id: string;
  type: NotificationType;
  payload: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "connections", label: "Connections" },
  { key: "messages", label: "Messages" },
  { key: "invitations", label: "Invitations" },
];

const CONNECTION_TYPES: NotificationType[] = ["connection_request", "connection_accepted"];
const MESSAGE_TYPES: NotificationType[] = ["message_received"];
const INVITATION_TYPES: NotificationType[] = [
  "invitation_received",
  "invitation_accepted",
  "invitation_rejected",
];

function describe(row: NotificationRow): { label: string; detail: string | null; href: string } {
  const payload = (row.payload ?? {}) as Record<string, unknown>;
  switch (row.type) {
    case "connection_request":
      return {
        label: "New connection request",
        detail: "Someone wants to connect with you.",
        href: "/connections",
      };
    case "connection_accepted":
      return {
        label: "Connection accepted",
        detail: "You can now exchange messages.",
        href: "/connections",
      };
    case "message_received": {
      const connectionId = payload.connection_id as string | undefined;
      const preview = (payload.preview as string | undefined) ?? "New message";
      return {
        label: "New message",
        detail: preview,
        href: connectionId ? `/messages/${connectionId}` : "/messages",
      };
    }
    case "invitation_received": {
      const message = payload.message as string | undefined;
      return {
        label: "Interview invitation",
        detail: message ?? "A company wants to interview you.",
        href: "/dashboard#invitations",
      };
    }
    case "invitation_accepted":
      return {
        label: "Invitation accepted",
        detail: "An invitation status was updated.",
        href: "/dashboard#invitations",
      };
    case "invitation_rejected":
      return {
        label: "Invitation declined",
        detail: "An invitation status was updated.",
        href: "/dashboard#invitations",
      };
    case "submission_scored":
      return {
        label: "Submission scored",
        detail: "Your case study submission has a score.",
        href: "/dashboard#submissions",
      };
    default:
      return { label: "Notification", detail: null, href: "/notifications" };
  }
}

function dayKey(iso: string): string {
  const d = new Date(iso);
  return d.toDateString();
}

function formatDay(key: string): string {
  const d = new Date(key);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86_400_000).toDateString();
  if (key === today) return "Today";
  if (key === yesterday) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function filterRows(rows: NotificationRow[], tab: Tab): NotificationRow[] {
  switch (tab) {
    case "unread":
      return rows.filter((r) => r.read_at === null);
    case "connections":
      return rows.filter((r) => CONNECTION_TYPES.includes(r.type));
    case "messages":
      return rows.filter((r) => MESSAGE_TYPES.includes(r.type));
    case "invitations":
      return rows.filter((r) => INVITATION_TYPES.includes(r.type));
    case "all":
    default:
      return rows;
  }
}

function groupByDay(rows: NotificationRow[]): Array<{ day: string; rows: NotificationRow[] }> {
  const map = new Map<string, NotificationRow[]>();
  for (const row of rows) {
    const key = dayKey(row.created_at);
    const list = map.get(key);
    if (list) list.push(row);
    else map.set(key, [row]);
  }
  return Array.from(map.entries()).map(([day, rows]) => ({ day, rows }));
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = (await searchParams) ?? {};
  const requestedTab = (params.tab as Tab | undefined) ?? "all";
  const activeTab: Tab = TABS.some((t) => t.key === requestedTab) ? requestedTab : "all";

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, payload, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (notifications ?? []) as NotificationRow[];
  const unreadCount = rows.filter((r) => !r.read_at).length;
  const filtered = filterRows(rows, activeTab);
  const groups = groupByDay(filtered);

  return (
    <StudentShell active="home">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="eyebrow mb-2">Inbox</div>
          <h1 className="text-3xl font-bold tracking-tight text-charcoal">Notifications</h1>
          <p className="mt-2 text-sm text-charcoal-2">
            Updates on connections, messages, and interview invitations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Pill variant="coralSolid" size="sm">
              {unreadCount} unread
            </Pill>
          )}
          <MarkAllReadButton disabled={unreadCount === 0} />
        </div>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2 border-b border-sage-mist-2 pb-2">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          const href = tab.key === "all" ? "/notifications" : `/notifications?tab=${tab.key}`;
          return (
            <Link
              key={tab.key}
              href={href}
              className={`focus-ring rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-sage text-chalk"
                  : "bg-chalk text-charcoal-2 border border-sage-mist-2 hover:bg-pale-sage"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {groups.length === 0 ? (
        <div className="rounded-[16px] border border-sage-mist-2 bg-chalk p-10 text-center shadow-1">
          <h2 className="font-bold text-charcoal">You&apos;re all caught up</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-2">
            No notifications in this view. New activity will land here as it happens.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.day}>
              <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal-3">
                {formatDay(group.day)}
              </h2>
              <div className="space-y-2">
                {group.rows.map((row) => {
                  const meta = describe(row);
                  return (
                    <NotificationItem
                      key={row.id}
                      id={row.id}
                      href={meta.href}
                      label={meta.label}
                      detail={meta.detail}
                      unread={!row.read_at}
                      createdAt={row.created_at}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </StudentShell>
  );
}
