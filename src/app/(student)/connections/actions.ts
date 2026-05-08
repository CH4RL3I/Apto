"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ConnectionStatus = "pending" | "accepted" | "rejected" | "blocked";

export async function requestConnection(recipientUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (recipientUserId === user.id) {
    throw new Error("Cannot connect with yourself.");
  }

  const { data: existing } = await supabase
    .from("connections")
    .select("id, status, requester_id, recipient_id")
    .or(
      `and(requester_id.eq.${user.id},recipient_id.eq.${recipientUserId}),and(requester_id.eq.${recipientUserId},recipient_id.eq.${user.id})`,
    )
    .maybeSingle();

  if (existing) {
    if (existing.status === "accepted") {
      throw new Error("Already connected.");
    }
    if (existing.status === "pending") {
      throw new Error("A request is already pending.");
    }
  }

  const { error } = await supabase.from("connections").insert({
    requester_id: user.id,
    recipient_id: recipientUserId,
    status: "pending" satisfies ConnectionStatus,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/connections");
  revalidatePath(`/u/[username]`, "page");
}

export async function respondToConnection(
  connectionId: string,
  status: "accepted" | "rejected",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("connections")
    .update({ status, responded_at: new Date().toISOString() })
    .eq("id", connectionId)
    .eq("recipient_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/connections");
  revalidatePath("/messages");
}

export async function cancelConnection(connectionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("id", connectionId)
    .eq("requester_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/connections");
}
