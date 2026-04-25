"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface RubricRow {
  criterion: string;
  weight: number;
  description: string;
}

export interface CaseStudyInput {
  title: string;
  brief: string;
  time_minutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  skills_tested: string[];
  deliverable_format: "text" | "document" | "spreadsheet" | "slides";
  rubric: RubricRow[];
}

async function requireCompany() {
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

  return { supabase, companyId: company.id as string };
}

export async function createCaseStudy(input: CaseStudyInput) {
  const { supabase, companyId } = await requireCompany();
  const { data, error } = await supabase
    .from("case_studies")
    .insert({
      company_id: companyId,
      title: input.title,
      brief: input.brief,
      time_minutes: input.time_minutes,
      difficulty: input.difficulty,
      skills_tested: input.skills_tested,
      deliverable_format: input.deliverable_format,
      rubric: input.rubric,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/portal/case-studies");
  return data!.id as string;
}

export async function updateCaseStudy(id: string, input: CaseStudyInput) {
  const { supabase, companyId } = await requireCompany();
  const { error } = await supabase
    .from("case_studies")
    .update({
      title: input.title,
      brief: input.brief,
      time_minutes: input.time_minutes,
      difficulty: input.difficulty,
      skills_tested: input.skills_tested,
      deliverable_format: input.deliverable_format,
      rubric: input.rubric,
    })
    .eq("id", id)
    .eq("company_id", companyId);
  if (error) throw new Error(error.message);
  revalidatePath("/portal/case-studies");
  revalidatePath(`/portal/case-studies/${id}/edit`);
}

export async function deleteCaseStudy(id: string) {
  const { supabase, companyId } = await requireCompany();
  const { error } = await supabase
    .from("case_studies")
    .delete()
    .eq("id", id)
    .eq("company_id", companyId);
  if (error) throw new Error(error.message);
  revalidatePath("/portal/case-studies");
}
