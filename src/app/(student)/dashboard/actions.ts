"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type InvitationResponse = "accepted" | "declined";

export async function respondToInvitation(
  invitationId: string,
  response: InvitationResponse,
): Promise<{ ok: boolean; error?: string }> {
  if (!invitationId) return { ok: false, error: "Missing invitation id." };
  if (response !== "accepted" && response !== "declined") {
    return { ok: false, error: "Invalid response." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("invitations")
    .update({ status: response })
    .eq("id", invitationId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  return { ok: true };
}
