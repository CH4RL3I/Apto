import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/StudentSidebar";
import { Conversation } from "./Conversation";

interface MessageRow {
  id: string;
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

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ connectionId: string }>;
}) {
  const { connectionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: connection } = await supabase
    .from("connections")
    .select("id, requester_id, recipient_id, status")
    .eq("id", connectionId)
    .single();

  if (!connection) notFound();
  if (
    connection.requester_id !== user.id &&
    connection.recipient_id !== user.id
  ) {
    notFound();
  }
  if (connection.status !== "accepted") {
    notFound();
  }

  const otherId =
    connection.requester_id === user.id
      ? connection.recipient_id
      : connection.requester_id;

  const [{ data: rawMessages }, { data: otherUser }] = await Promise.all([
    supabase
      .from("messages")
      .select("id, sender_id, body, created_at, read_at")
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true }),
    supabase
      .from("users")
      .select("id, name, email")
      .eq("id", otherId)
      .single(),
  ]);

  const messages = (rawMessages ?? []) as MessageRow[];
  const other = otherUser as UserRow | null;
  const otherName = other?.name?.trim() || other?.email || "Connection";

  return (
    <StudentShell active="messages">
      <div className="mb-4">
        <Link
          href="/messages"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-charcoal-2 hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Back to inbox
        </Link>
      </div>
      <header className="mb-5">
        <div className="eyebrow mb-1">Conversation</div>
        <h1 className="text-2xl font-bold tracking-tight text-charcoal">
          {otherName}
        </h1>
      </header>

      <Conversation
        connectionId={connectionId}
        currentUserId={user.id}
        messages={messages}
      />
    </StudentShell>
  );
}
