"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkAdminGate } from "@/lib/admin/gate";
import { validateOverridePayload } from "./validator";

export interface ActionResult {
  ok: boolean;
  error?: string;
  errors?: string[];
}

export async function saveTasksOverride(
  caseStudyId: string,
  payload: unknown,
): Promise<ActionResult> {
  const gate = await checkAdminGate();
  if (!gate.allowed) return { ok: false, error: "Forbidden" };

  if (!caseStudyId || typeof caseStudyId !== "string") {
    return { ok: false, error: "Invalid case study id" };
  }

  const result = validateOverridePayload(payload);
  if (!result.ok || !result.value) {
    return {
      ok: false,
      error: "Invalid payload",
      errors: result.errors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("case_study_tasks").upsert(
    {
      case_study_id: caseStudyId,
      tasks: result.value.tasks,
      desk: result.value.desk,
      company_block: result.value.companyBlock,
      updated_at: new Date().toISOString(),
      updated_by: user?.id ?? null,
    },
    { onConflict: "case_study_id" },
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${caseStudyId}`);
  revalidatePath("/case-studies/[id]/tasks", "page");
  return { ok: true };
}

export async function deleteTasksOverride(
  caseStudyId: string,
): Promise<ActionResult> {
  const gate = await checkAdminGate();
  if (!gate.allowed) return { ok: false, error: "Forbidden" };

  if (!caseStudyId || typeof caseStudyId !== "string") {
    return { ok: false, error: "Invalid case study id" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("case_study_tasks")
    .delete()
    .eq("case_study_id", caseStudyId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${caseStudyId}`);
  revalidatePath("/case-studies/[id]/tasks", "page");
  return { ok: true };
}
