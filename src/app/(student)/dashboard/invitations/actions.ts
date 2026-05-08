"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type InvitationStatus = "accepted" | "rejected";

export async function respondToInvitation(
  invitationId: string,
  status: InvitationStatus,
): Promise<{ ok: boolean; error?: string }> {
  if (!invitationId) return { ok: false, error: "Missing invitation id." };
  if (status !== "accepted" && status !== "rejected") {
    return { ok: false, error: "Invalid status." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("invitations")
    .update({ status, responded_at: new Date().toISOString() })
    .eq("id", invitationId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  return { ok: true };
}
