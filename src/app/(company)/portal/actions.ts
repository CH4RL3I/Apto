"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface InviteResult {
  ok: boolean;
  error?: string;
}

export async function sendInterviewInvite(
  submissionId: string,
  message: string,
  contactEmail: string,
): Promise<InviteResult> {
  const trimmedMessage = message.trim();
  if (trimmedMessage.length < 20 || trimmedMessage.length > 500) {
    return { ok: false, error: "Message must be 20–500 characters." };
  }
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
    return { ok: false, error: "A valid reply-to email is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (userRow?.role !== "company") {
    return { ok: false, error: "Company account required." };
  }

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!company) return { ok: false, error: "Company profile missing." };

  const { data: submission } = await supabase
    .from("submissions")
    .select("id, user_id, case_study_id")
    .eq("id", submissionId)
    .single();
  if (!submission) return { ok: false, error: "Submission not found." };

  const { data: owns } = await supabase
    .from("case_studies")
    .select("id")
    .eq("id", submission.case_study_id)
    .eq("company_id", company.id)
    .single();
  if (!owns) {
    return { ok: false, error: "Submission is not owned by this company." };
  }

  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("submission_id", submission.id)
    .eq("company_id", company.id)
    .maybeSingle();

  if (existing) {
    return { ok: false, error: "Invitation already sent." };
  }

  const { error: insertError } = await supabase.from("invitations").insert({
    submission_id: submission.id,
    user_id: submission.user_id,
    company_id: company.id,
    status: "pending",
    message: trimmedMessage,
    contact_email: contactEmail.trim(),
  });
  if (insertError) return { ok: false, error: insertError.message };

  await supabase
    .from("submissions")
    .update({ status: "reviewed" })
    .eq("id", submission.id);

  revalidatePath("/portal");
  revalidatePath("/portal/submissions");
  revalidatePath(`/portal/submissions/${submission.id}`);
  revalidatePath(`/portal/candidates/${submission.id}`);

  return { ok: true };
}
