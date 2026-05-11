import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import type { ParsedCV } from "@/lib/questionnaire/matching";
import { ProfileEditForm } from "./ProfileEditForm";

export default async function ProfileEditPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userData?.role === "company") redirect("/portal");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const cv = (profile?.cv_parsed ?? null) as ParsedCV | null;
  const cvSkills = Array.isArray(profile?.cv_skills)
    ? (profile.cv_skills as string[])
    : cv?.skills ?? [];

  const initial = {
    name: cv?.name ?? userData?.name ?? "",
    education: cv?.education ?? "",
    experience: Array.isArray(cv?.experience) ? cv!.experience : [],
    skills: cvSkills,
    isPublic: Boolean(profile?.is_public),
    username: typeof profile?.username === "string" ? profile.username : "",
    headline: typeof profile?.headline === "string" ? profile.headline : "",
    cvUrl: typeof profile?.cv_url === "string" ? profile.cv_url : null,
    email: typeof user.email === "string" ? user.email : null,
  };

  return (
    <div className="min-h-screen bg-pale-sage brand-dotted">
      <div className="border-b border-sage-mist-2 bg-chalk">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center">
            <Logo height={28} priority />
          </Link>
          <Link
            href="/dashboard"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-charcoal-2 hover:text-charcoal"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-6">
          <div className="eyebrow mb-2">Account</div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal md:text-[28px]">
            Settings
          </h1>
          <p className="mt-2 text-sm text-charcoal-2">
            Edit your information, replace your CV, manage privacy, and delete your account.
          </p>
        </div>

        <ProfileEditForm initial={initial} />
      </div>
    </div>
  );
}
