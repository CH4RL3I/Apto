"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface ProfileEditInput {
  name: string;
  education: string;
  experience: string[];
  skills: string[];
  isPublic: boolean;
  username: string;
  headline: string;
}

const USERNAME_RE = /^[a-z0-9-]{3,30}$/;

export async function updateStudentProfile(input: ProfileEditInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cleanName = input.name.trim();
  const cleanEducation = input.education.trim();
  const cleanExperience = input.experience
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
  const cleanSkills = input.skills
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const cleanHeadline = input.headline.trim().slice(0, 200);
  const cleanUsername = input.username.trim().toLowerCase();

  if (input.isPublic) {
    if (!cleanUsername) {
      throw new Error("A username is required to make your profile public.");
    }
    if (!USERNAME_RE.test(cleanUsername)) {
      throw new Error(
        "Username must be 3–30 characters, lowercase letters, numbers, or hyphens.",
      );
    }
    const { data: taken } = await supabase
      .from("profiles")
      .select("user_id")
      .ilike("username", cleanUsername)
      .neq("user_id", user.id)
      .maybeSingle();
    if (taken) {
      throw new Error("That username is already taken.");
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_parsed")
    .eq("user_id", user.id)
    .single();

  const existing = (profile?.cv_parsed ?? {}) as Record<string, unknown>;
  const nextCvParsed = {
    ...existing,
    name: cleanName || null,
    education: cleanEducation || null,
    experience: cleanExperience,
    skills: cleanSkills,
  };

  const profileUpdate: Record<string, unknown> = {
    cv_parsed: nextCvParsed,
    cv_skills: cleanSkills,
    is_public: input.isPublic,
    headline: cleanHeadline || null,
  };
  if (input.isPublic) {
    profileUpdate.username = cleanUsername;
  } else if (cleanUsername) {
    profileUpdate.username = cleanUsername;
  } else {
    profileUpdate.username = null;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("user_id", user.id);
  if (updateError) throw new Error(updateError.message);

  if (cleanName) {
    await supabase
      .from("users")
      .update({ name: cleanName })
      .eq("id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile/edit");
  if (cleanUsername) revalidatePath(`/u/${cleanUsername}`);
}

// ---------------------------------------------------------------------------
// Account deletion
// ---------------------------------------------------------------------------

const CV_BUCKET = "cvs";

/**
 * Parse a stored cv_url into a storage object path inside the `cvs` bucket.
 * Upload code stores either a public URL (`getPublicUrl().publicUrl`) or the
 * raw path `${user.id}/${ts}-${name}` as a fallback. Both shapes are handled.
 */
function cvUrlToStoragePath(cvUrl: string): string | null {
  if (!cvUrl) return null;
  // Public URL: .../storage/v1/object/public/<bucket>/<path>
  const marker = `/storage/v1/object/public/${CV_BUCKET}/`;
  const idx = cvUrl.indexOf(marker);
  if (idx >= 0) {
    const tail = cvUrl.slice(idx + marker.length);
    return decodeURIComponent(tail.split("?")[0]);
  }
  // Signed URL: .../storage/v1/object/sign/<bucket>/<path>?token=...
  const signedMarker = `/storage/v1/object/sign/${CV_BUCKET}/`;
  const sIdx = cvUrl.indexOf(signedMarker);
  if (sIdx >= 0) {
    const tail = cvUrl.slice(sIdx + signedMarker.length);
    return decodeURIComponent(tail.split("?")[0]);
  }
  // Plain path fallback (no scheme).
  if (!/^https?:\/\//i.test(cvUrl)) {
    return cvUrl.replace(/^\/+/, "");
  }
  return null;
}

export async function deleteMyAccount(
  confirmation: string,
): Promise<{ ok: boolean; error?: string }> {
  if (confirmation !== "DELETE") {
    return { ok: false, error: "Type DELETE to confirm" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You are not signed in." };
  }
  const userId = user.id;

  // Look up CV path before nuking the row (admin client so RLS can't surprise us).
  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error("deleteMyAccount: admin client unavailable", err);
    return {
      ok: false,
      error:
        "Account deletion is temporarily unavailable. Please contact support.",
    };
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("cv_url")
    .eq("user_id", userId)
    .maybeSingle();

  // Best-effort CV file removal. Failure here must NOT block account deletion.
  const cvPath = profile?.cv_url
    ? cvUrlToStoragePath(profile.cv_url as string)
    : null;
  if (cvPath) {
    const { error: storageErr } = await admin.storage
      .from(CV_BUCKET)
      .remove([cvPath]);
    if (storageErr) {
      console.error(
        "deleteMyAccount: failed to remove CV file (continuing)",
        storageErr,
      );
    }
  }

  // Tables that DO NOT cascade from auth.users(id) — explicit cleanup first.
  // - public.invitations.user_id → public.users(id) (no ON DELETE CASCADE)
  //   Without this, deleting the auth user would fail when public.users cascade
  //   tries to drop the row referenced by invitations.
  const { error: invitationsErr } = await admin
    .from("invitations")
    .delete()
    .eq("user_id", userId);
  if (invitationsErr) {
    console.error("deleteMyAccount: failed to delete invitations", invitationsErr);
    return {
      ok: false,
      error: "Could not delete your invitations. Please try again.",
    };
  }

  // Delete the auth user. ON DELETE CASCADE on public.users(id) → auth.users(id)
  // takes care of: users, profiles, submissions, connections (requester+recipient),
  // messages (sender), notifications. case_study_tasks.updated_by is SET NULL.
  const { error: authErr } = await admin.auth.admin.deleteUser(userId, false);
  if (authErr) {
    console.error("deleteMyAccount: auth.admin.deleteUser failed", authErr);
    return {
      ok: false,
      error:
        "We couldn't delete your account. Please try again or contact support.",
    };
  }

  // Sign the user out of this browser session (clears cookies). Best effort.
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("deleteMyAccount: signOut after delete failed", err);
  }

  return { ok: true };
}
