import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendInviteEmail } from "@/lib/email";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import { track } from "@/lib/posthog";

async function getSubmissionId(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as {
      submissionId?: unknown;
    } | null;
    return {
      submissionId:
        typeof body?.submissionId === "string" ? body.submissionId : null,
      wantsJson: true,
    };
  }

  const formData = await request.formData();
  const submissionId = formData.get("submissionId");
  return {
    submissionId: typeof submissionId === "string" ? submissionId : null,
    wantsJson: false,
  };
}

function respond(
  request: Request,
  wantsJson: boolean,
  status: number,
  message: string,
) {
  if (wantsJson) {
    return NextResponse.json({ error: message }, { status });
  }

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/portal`);
}

export async function POST(request: Request) {
  const { submissionId, wantsJson } = await getSubmissionId(request);

  if (!submissionId) {
    return respond(request, wantsJson, 400, "Missing submission id");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return respond(request, wantsJson, 401, "Unauthorized");
  }

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userRow?.role !== "company") {
    return respond(request, wantsJson, 403, "Company account required");
  }

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  if (!company) {
    return respond(request, wantsJson, 403, "Company account required");
  }

  const { data: submission } = await supabase
    .from("submissions")
    .select("id, user_id, case_study_id")
    .eq("id", submissionId)
    .single();

  if (!submission) {
    return respond(request, wantsJson, 404, "Submission not found");
  }

  const { data: ownedCaseStudy } = await supabase
    .from("case_studies")
    .select("id")
    .eq("id", submission.case_study_id)
    .eq("company_id", company.id)
    .single();

  if (!ownedCaseStudy) {
    return respond(request, wantsJson, 403, "Submission is not owned by this company");
  }

  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("submission_id", submission.id)
    .eq("company_id", company.id)
    .maybeSingle();

  if (!existing) {
    const inviteMessage =
      "We were impressed by your case study submission and would like to invite you for an interview!";

    const { error: inviteError } = await supabase.from("invitations").insert({
      submission_id: submission.id,
      user_id: submission.user_id,
      company_id: company.id,
      status: "pending",
      message: inviteMessage,
    });

    if (inviteError) {
      return respond(request, wantsJson, 500, inviteError.message);
    }

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status: "reviewed" })
      .eq("id", submission.id);

    if (updateError) {
      return respond(request, wantsJson, 500, updateError.message);
    }

    // Best-effort email + analytics — failures here don't roll back the invite.
    const { data: studentRow } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", submission.user_id)
      .single();

    const caseStudyTitle =
      CASE_STUDIES.find((c) => c.id === submission.case_study_id)?.title ?? "your case study";

    if (studentRow?.email) {
      await sendInviteEmail({
        to: studentRow.email as string,
        studentName: (studentRow.name as string | null) ?? null,
        companyName: (company.name as string) ?? "A company",
        caseStudyTitle,
        message: inviteMessage,
      });
    }

    await track(user.id, "invitation_sent", {
      case_study_id: submission.case_study_id,
      submission_id: submission.id,
    });
  }

  if (wantsJson) {
    return NextResponse.json({ ok: true });
  }

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/portal`);
}
