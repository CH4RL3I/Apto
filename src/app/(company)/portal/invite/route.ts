import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const submissionId = searchParams.get("submission");
  const userId = searchParams.get("user");
  const companyId = searchParams.get("company");

  if (!submissionId || !userId || !companyId) {
    return NextResponse.redirect(`${origin}/portal`);
  }

  const supabase = await createClient();

  // Check if invitation already exists
  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("submission_id", submissionId)
    .eq("company_id", companyId)
    .single();

  if (!existing) {
    await supabase.from("invitations").insert({
      submission_id: submissionId,
      user_id: userId,
      company_id: companyId,
      status: "pending",
      message: "We were impressed by your case study submission and would like to invite you for an interview!",
    });

    // Update submission status to reviewed
    await supabase
      .from("submissions")
      .update({ status: "reviewed" })
      .eq("id", submissionId);
  }

  return NextResponse.redirect(`${origin}/portal`);
}
