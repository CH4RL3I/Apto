"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function sendMessage(connectionId: string, body: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const trimmed = body.trim();
  if (trimmed.length === 0) throw new Error("Message cannot be empty.");
  if (trimmed.length > 4000) throw new Error("Message is too long.");

  const { error } = await supabase.from("messages").insert({
    connection_id: connectionId,
    sender_id: user.id,
    body: trimmed,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/messages/${connectionId}`);
  revalidatePath("/messages");
}

export async function markMessagesRead(connectionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("connection_id", connectionId)
    .neq("sender_id", user.id)
    .is("read_at", null);

  revalidatePath(`/messages/${connectionId}`);
  revalidatePath("/messages");
}
