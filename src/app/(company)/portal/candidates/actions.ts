"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ReviewStatus =
  | "submitted"
  | "scored"
  | "reviewed"
  | "shortlisted"
  | "rejected";

const ALLOWED: ReviewStatus[] = [
  "submitted",
  "scored",
  "reviewed",
  "shortlisted",
  "rejected",
];

async function requireOwningCompany(submissionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (userRow?.role !== "company") throw new Error("Company account required");

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!company) throw new Error("Company profile missing");

  const { data: submission } = await supabase
    .from("submissions")
    .select("id, case_study_id")
    .eq("id", submissionId)
    .single();
  if (!submission) throw new Error("Submission not found");

  const { data: owns } = await supabase
    .from("case_studies")
    .select("id")
    .eq("id", submission.case_study_id)
    .eq("company_id", company.id)
    .single();
  if (!owns) throw new Error("Submission is not owned by this company");

  return supabase;
}

export async function saveNotes(submissionId: string, notes: string) {
  const supabase = await requireOwningCompany(submissionId);
  const { error } = await supabase
    .from("submissions")
    .update({ reviewer_notes: notes })
    .eq("id", submissionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/portal/candidates/${submissionId}`);
}

export async function setStatus(submissionId: string, status: ReviewStatus) {
  if (!ALLOWED.includes(status)) throw new Error("Invalid status");
  const supabase = await requireOwningCompany(submissionId);
  const { error } = await supabase
    .from("submissions")
    .update({ status })
    .eq("id", submissionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/portal/candidates/${submissionId}`);
  revalidatePath("/portal");
}
