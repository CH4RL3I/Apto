import { notFound } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { createClient } from "@/lib/supabase/server";
import { ConnectButton } from "./ConnectButton";

interface ProfileRow {
  user_id: string;
  is_public: boolean;
  username: string | null;
  headline: string | null;
  cv_parsed: { name?: string | null; summary?: string | null } | null;
  cv_skills: string[] | null;
}

interface UserRow {
  id: string;
  name: string | null;
  email: string;
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const slug = username.toLowerCase();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id, is_public, username, headline, cv_parsed, cv_skills")
    .ilike("username", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!profile) notFound();
  const p = profile as ProfileRow;

  const { data: userRow } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("id", p.user_id)
    .maybeSingle();
  const u = userRow as UserRow | null;

  const displayName =
    p.cv_parsed?.name?.trim() || u?.name?.trim() || "Apto member";
  const headline =
    p.headline?.trim() ||
    (typeof p.cv_parsed?.summary === "string" ? p.cv_parsed.summary : "");
  const skills = (p.cv_skills ?? []).slice(0, 24);

  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();

  let canConnect = false;
  if (viewer && viewer.id !== p.user_id) {
    const { data: existing } = await supabase
      .from("connections")
      .select("id, status")
      .or(
        `and(requester_id.eq.${viewer.id},recipient_id.eq.${p.user_id}),and(requester_id.eq.${p.user_id},recipient_id.eq.${viewer.id})`,
      )
      .maybeSingle();
    canConnect = !existing;
  }

  return (
    <div className="min-h-screen bg-pale-sage brand-dotted">
      <div className="border-b border-sage-mist-2 bg-chalk">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center">
            <Logo height={28} priority />
          </Link>
          {!viewer && (
            <Link
              href="/login"
              className="focus-ring text-sm font-semibold text-sage hover:underline"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-[18px] bg-chalk p-6 shadow-1 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="eyebrow mb-2">Public profile</div>
              <h1 className="text-3xl font-bold tracking-tight text-charcoal md:text-[34px]">
                {displayName}
              </h1>
              {headline && (
                <p className="mt-2 text-charcoal-2">{headline}</p>
              )}
            </div>
            {viewer && viewer.id !== p.user_id && canConnect && (
              <ConnectButton recipientUserId={p.user_id} />
            )}
            {viewer && viewer.id !== p.user_id && !canConnect && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-pale-sage px-3 py-1.5 text-[13px] font-semibold text-sage-700">
                Connection exists
              </span>
            )}
          </div>

          {skills.length > 0 && (
            <div className="mt-6">
              <div className="eyebrow mb-2">Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <Pill key={s} variant="sage" size="md">
                    {s}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-[12px] border border-dashed border-sage-mist-2 bg-pale-sage/40 p-5 text-sm text-charcoal-2">
            Submitted challenges and outcomes are private by default. Connect
            with {displayName.split(" ")[0]} to see more.
          </div>
        </div>
      </div>
    </div>
  );
}
