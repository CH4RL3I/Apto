import Link from "next/link";
import {
  Bookmark,
  Briefcase,
  Building2,
  Compass,
  Home as HomeIcon,
  MessageCircle,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";

export type StudentNavKey =
  | "home"
  | "discover"
  | "challenges"
  | "companies"
  | "connections"
  | "messages";

const items: ReadonlyArray<{
  key: StudentNavKey;
  label: string;
  href: string;
  icon: LucideIcon;
}> = [
  { key: "home", label: "Home", href: "/dashboard", icon: HomeIcon },
  { key: "discover", label: "Discover", href: "/results", icon: Compass },
  { key: "challenges", label: "Challenges", href: "/challenges", icon: Briefcase },
  { key: "companies", label: "Companies", href: "/companies", icon: Building2 },
  { key: "connections", label: "Connections", href: "/connections", icon: Users },
  { key: "messages", label: "Messages", href: "/messages", icon: MessageCircle },
];

async function getUnreadMessageCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .is("read_at", null)
      .neq("sender_id", user.id);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function StudentSidebar({ active }: { active: StudentNavKey }) {
  const unread = await getUnreadMessageCount();
  return (
    <aside className="hidden border-r border-sage-mist-2 bg-chalk/86 p-5 lg:flex lg:flex-col">
      <Link
        href="/"
        aria-label="Apto home"
        className="focus-ring mb-8 inline-flex w-fit items-center rounded-xl"
      >
        <Logo height={34} priority />
      </Link>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          const showUnread = item.key === "messages" && unread > 0;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`focus-ring flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-l-4 border-sage bg-pale-sage text-sage"
                  : "text-charcoal-2 hover:bg-pale-sage hover:text-charcoal"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              <span className="flex-1">{item.label}</span>
              {showUnread && (
                <span
                  aria-label={`${unread} unread message${unread === 1 ? "" : "s"}`}
                  className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-bold leading-[18px] text-chalk"
                >
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <Link
          href="/dashboard#submissions"
          className="focus-ring flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold text-charcoal-2 hover:bg-pale-sage hover:text-charcoal"
        >
          <Bookmark className="h-4 w-4" strokeWidth={1.75} />
          Bookmarks
        </Link>
        <Link
          href="/profile/edit"
          className="focus-ring flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold text-charcoal-2 hover:bg-pale-sage hover:text-charcoal"
        >
          <Settings className="h-4 w-4" strokeWidth={1.75} />
          Settings
        </Link>
      </div>
    </aside>
  );
}

export function StudentShell({
  active,
  children,
}: {
  active: StudentNavKey;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-pale-sage brand-dotted px-3 py-3 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[26px] border border-sage-mist-2 bg-chalk shadow-3 lg:grid lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[238px_1fr] apto-dashboard-shell">
        <StudentSidebar active={active} />
        <main className="min-w-0 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
