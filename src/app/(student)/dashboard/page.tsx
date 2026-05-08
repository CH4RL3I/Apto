import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  CalendarDays,
  FileText,
  Flame,
  Sparkles,
  Target,
  UserCircle2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";
import { StudentSidebar } from "@/components/StudentSidebar";
import { DashboardSearch } from "@/components/DashboardSearch";
import { RetryScoringButton } from "@/components/RetryScoringButton";
import { CASE_STUDIES } from "@/lib/questionnaire/case-studies";
import {
  getMatches,
  findCaseStudiesForJob,
  type ParsedCV,
} from "@/lib/questionnaire/matching";
import type { Answers } from "@/lib/questionnaire/questions";
import { InvitationActions } from "./InvitationActions";

type StatusVariant = "mist" | "sage" | "sageSolid" | "coral" | "coralSolid";
const statusVariant: Record<string, StatusVariant> = {
  in_progress: "mist",
  submitted: "sage",
  scored: "sageSolid",
  reviewed: "coral",
  shortlisted: "sageSolid",
  rejected: "coralSolid",
};

const upcomingEvents = [
  { title: "Case Prep Workshop", host: "BCG", time: "May 24 - 6:00 PM" },
  { title: "Product Careers 101", host: "Amplitude", time: "May 27 - 7:00 PM" },
  { title: "Build Your Portfolio", host: "Apto", time: "May 30 - 6:30 PM" },
];

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default async function DashboardPage() {
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

  if (!profile?.completed_at) {
    redirect(profile?.cv_url ? "/questionnaire" : "/upload-cv");
  }

  // submissions.case_study_id has no FK to case_studies (slug ids), so PostgREST
  // can't embed those joins. Fetch flat, then attach case-study + company
  // metadata from the in-app CASE_STUDIES array.
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, company:companies(*), submission:submissions(*)")
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false });

  const firstName = userData?.name ? userData.name.split(" ")[0] : "there";
  const initials = (() => {
    const name = (userData?.name as string | undefined)?.trim();
    if (name) {
      const parts = name.split(/\s+/).filter(Boolean);
      const first = parts[0]?.[0] ?? "";
      const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
      const combined = `${first}${last}`.toUpperCase();
      if (combined) return combined.slice(0, 2);
    }
    const email = userData?.email ?? user.email ?? "";
    return email.slice(0, 2).toUpperCase() || "??";
  })();
  const submissionRows = submissions ?? [];
  const invitationRows = invitations ?? [];
  const cvSkills = Array.isArray(profile?.cv_skills) ? profile.cv_skills : [];
  const scoredSubmissions = submissionRows.filter(
    (sub: Record<string, unknown>) => typeof sub.score === "number",
  );
  const averageScore = scoredSubmissions.length
    ? Math.round(
        scoredSubmissions.reduce(
          (sum: number, sub: Record<string, unknown>) => sum + (sub.score as number),
          0,
        ) / scoredSubmissions.length,
      )
    : 0;
  const impactScore = averageScore ? Math.min(990, averageScore * 10) : 820;
  const completedChallenges = submissionRows.filter((sub: Record<string, unknown>) =>
    ["scored", "reviewed"].includes(sub.status as string),
  ).length;

  const localCaseStudies = new Map<
    string,
    { title: string; companyName: string | null; logoUrl: string }
  >();
  for (const cs of CASE_STUDIES) {
    localCaseStudies.set(cs.id, {
      title: cs.title,
      companyName: cs.companyName,
      logoUrl: cs.logoUrl,
    });
  }

  // Derive 3 recommended case studies from the student's matches.
  // Skip cases the student has already submitted.
  const submittedCaseIds = new Set(
    submissionRows.map((s: Record<string, unknown>) => s.case_study_id as string),
  );
  const answers = (profile?.questionnaire_answers ?? {}) as Answers;
  const cv = (profile?.cv_parsed ?? null) as ParsedCV | null;
  const topMatches = getMatches(answers, cv);
  const recommendedChallenges = (() => {
    const seen = new Set<string>();
    const picks: {
      id: string;
      title: string;
      company: string;
      logoUrl: string;
      duration: string;
      minutes: number;
      skill: string;
    }[] = [];
    for (const job of topMatches) {
      for (const cs of findCaseStudiesForJob(job, 3)) {
        if (seen.has(cs.id) || submittedCaseIds.has(cs.id)) continue;
        seen.add(cs.id);
        picks.push({
          id: cs.id,
          title: cs.title,
          company: cs.companyName ?? job.title,
          logoUrl: cs.logoUrl,
          duration:
            cs.duration === "short" ? "Taster" : cs.duration === "long" ? "Deep dive" : "Mid-form",
          minutes: cs.estimatedMinutes,
          skill: cs.skillsTested[0] ?? job.fields[0] ?? "Case study",
        });
        if (picks.length >= 3) break;
      }
      if (picks.length >= 3) break;
    }
    return picks;
  })();

  const progressCards = [
    {
      label: "Learning streak",
      value: submissionRows.length > 0 ? `${Math.max(7, submissionRows.length * 2)} days` : "7 days",
      caption: "Keep momentum",
      icon: Flame,
      accent: "text-coral",
    },
    {
      label: "Skills unlocked",
      value: String(Math.max(cvSkills.length, completedChallenges * 3, 12)),
      caption: cvSkills.length > 0 ? `${cvSkills.length} from your CV` : "+3 this week",
      icon: Sparkles,
      accent: "text-sage",
    },
    {
      label: "Impact score",
      value: String(impactScore),
      caption: averageScore ? `${averageScore}/100 average` : "Top 15% potential",
      icon: Target,
      accent: "text-sage-700",
    },
  ];

  return (
    <div className="min-h-screen bg-pale-sage brand-dotted px-3 py-3 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[26px] border border-sage-mist-2 bg-chalk shadow-3 lg:grid lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[238px_1fr] apto-dashboard-shell">
        <StudentSidebar active="home" />

        <main className="min-w-0 p-4 md:p-6 lg:p-7">
          <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <Logo height={30} priority />
              <Pill variant="sage" size="sm">Student dashboard</Pill>
            </div>

            <DashboardSearch />

            <div className="flex items-center gap-3 self-end md:self-auto">
              <button className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-sage-mist-2 bg-chalk text-charcoal-2 shadow-1 transition-colors hover:bg-pale-sage">
                <Bell className="h-4 w-4" strokeWidth={1.75} />
                <span className="sr-only">Notifications</span>
              </button>
              <details className="apto-user-menu group relative">
                <summary className="focus-ring flex cursor-pointer list-none items-center gap-2 rounded-full border border-sage-mist-2 bg-chalk py-1 pr-3 pl-1 shadow-1 transition-colors hover:bg-pale-sage [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-sm font-bold uppercase tracking-tight text-chalk"
                  >
                    {initials}
                  </span>
                  <span className="hidden text-sm font-semibold text-charcoal sm:inline">
                    {firstName}
                  </span>
                </summary>
                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-[12px] border border-sage-mist-2 bg-chalk p-1 shadow-2">
                  <div className="border-b border-sage-mist-2 px-3 py-2">
                    <div className="text-xs text-charcoal-3">Signed in as</div>
                    <div className="truncate text-sm font-semibold text-charcoal">
                      {userData?.email ?? user.email}
                    </div>
                  </div>
                  <Link
                    href="/profile/edit"
                    className="block rounded-[8px] px-3 py-2 text-sm font-medium text-charcoal-2 hover:bg-pale-sage hover:text-charcoal"
                  >
                    Edit profile
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button className="w-full rounded-[8px] px-3 py-2 text-left text-sm font-medium text-coral-700 hover:bg-coral-100">
                      Sign out
                    </button>
                  </form>
                </div>
              </details>
            </div>
          </header>

          <section className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow mb-2">Home</div>
              <h1 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
                Good morning, {firstName}.
              </h1>
              <p className="mt-2 text-charcoal-2">
                Explore challenges, build skills, and make real impact.
              </p>
            </div>
            <ButtonLink href="/results" variant="primary" size="md">
              Explore challenges
            </ButtonLink>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
            <div className="min-w-0 space-y-7">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-charcoal">Recommended for you</h2>
                  <Link href="/results" className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-sage hover:underline">
                    View all
                  </Link>
                </div>

                {recommendedChallenges.length === 0 ? (
                  <div className="rounded-[16px] border border-sage-mist-2 bg-chalk p-6 text-sm text-charcoal-2 shadow-1">
                    You&apos;ve worked through your top matches. Browse the full case-study library for more.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    {recommendedChallenges.map((challenge) => (
                      <Link
                        key={challenge.id}
                        href={`/case-studies/${challenge.id}`}
                        className="focus-ring group relative overflow-hidden rounded-[16px] bg-sage p-5 text-chalk shadow-1 transition-all hover:-translate-y-0.5 hover:shadow-2"
                      >
                        <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full border-[26px] border-chalk/10" />
                        <Pill variant="coralSolid" size="sm">For you</Pill>
                        <h3 className="relative mt-4 min-h-[72px] text-base font-bold leading-snug tracking-tight">
                          {challenge.title}
                        </h3>
                        <div className="relative mt-4 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-chalk shadow-1">
                            <Image
                              src={challenge.logoUrl}
                              alt={`${challenge.company} logo`}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </span>
                          <span className="text-sm text-pale-sage">{challenge.company}</span>
                        </div>
                        <div className="relative mt-5 flex flex-wrap items-center gap-2 text-[11px] text-chalk/75">
                          <span>{challenge.duration}</span>
                          <span aria-hidden="true">·</span>
                          <span>{challenge.minutes} min</span>
                          <span aria-hidden="true">·</span>
                          <span>{challenge.skill}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-3 text-sm font-bold text-charcoal">Your progress</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {progressCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.label} className="rounded-[16px] border border-sage-mist-2 bg-chalk p-5 shadow-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-charcoal-2">{card.label}</div>
                          <Icon className={`h-5 w-5 ${card.accent}`} strokeWidth={1.75} />
                        </div>
                        <div className="stat-num mt-3 text-3xl text-charcoal">{card.value}</div>
                        <div className="mt-1 text-xs text-charcoal-3">{card.caption}</div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section id="invitations" className="scroll-mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-charcoal">Connections</h2>
                  {invitationRows.length > 0 && <Pill variant="coralSolid" size="sm">New invitation</Pill>}
                </div>

                {invitationRows.length > 0 ? (
                  <div className="space-y-4">
                    {invitationRows.map((inv: Record<string, unknown>) => {
                      const company = inv.company as Record<string, unknown> | null;
                      const submission = inv.submission as Record<string, unknown> | null;
                      const submissionCaseStudyId = submission?.case_study_id as string | undefined;
                      const localCs = submissionCaseStudyId ? localCaseStudies.get(submissionCaseStudyId) : undefined;
                      const caseStudyTitle = localCs?.title ?? "Case study";
                      const logoUrl =
                        (company?.logo_url as string | undefined) ??
                        localCs?.logoUrl ??
                        (submissionCaseStudyId ? `/company-logos/${submissionCaseStudyId}.png` : null);
                      const status = inv.status as string;
                      const invitationId = inv.id as string;
                      return (
                        <article key={invitationId} className="rounded-[16px] border border-sage bg-pale-sage p-5 shadow-1">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-3">
                              {logoUrl && (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-chalk shadow-1">
                                  <Image
                                    src={logoUrl}
                                    alt={`${(company?.name as string) ?? "Company"} logo`}
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="eyebrow mb-2">Match made</div>
                                <h3 className="text-lg font-bold tracking-tight text-charcoal">
                                  {(company?.name as string) ?? "A company"} wants to interview you.
                                </h3>
                                {typeof inv.message === "string" && inv.message && (
                                  <p className="mt-2 text-sm leading-relaxed text-charcoal-2">{inv.message}</p>
                                )}
                                <p className="mt-3 text-xs text-charcoal-2">
                                  Based on your submission to {caseStudyTitle}.
                                </p>
                              </div>
                            </div>
                            {status === "pending" ? (
                              <InvitationActions invitationId={invitationId} />
                            ) : (
                              <Pill
                                variant={status === "accepted" ? "sageSolid" : "mist"}
                                size="md"
                              >
                                <span className="capitalize">{status}</span>
                              </Pill>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[16px] border border-sage-mist-2 bg-chalk p-6 shadow-1">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="eyebrow mb-2">Match made</div>
                        <h3 className="text-lg font-bold tracking-tight text-charcoal">No invitations yet.</h3>
                        <p className="mt-2 text-sm text-charcoal-2">
                          Complete a case study to turn your profile into proof companies can review.
                        </p>
                      </div>
                      <ButtonLink href="/results" variant="ghost" size="md">
                        Find a challenge
                      </ButtonLink>
                    </div>
                  </div>
                )}
              </section>

              <section id="submissions" className="scroll-mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-charcoal">Recent submissions</h2>
                  <Link href="/results" className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-sage hover:underline">
                    Try another case study
                  </Link>
                </div>

                {submissionRows.length === 0 ? (
                  <div className="rounded-[16px] border border-sage-mist-2 bg-chalk p-10 text-center shadow-1">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pale-sage">
                      <FileText className="h-7 w-7 text-sage-300" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-bold text-charcoal">No submissions yet</h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-2">
                      Complete a case study to see your progress, score, and interview opportunities here.
                    </p>
                    <ButtonLink href="/results" variant="primary" size="md" className="mt-6">
                      Explore careers
                    </ButtonLink>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {submissionRows.map((sub: Record<string, unknown>) => {
                      const status = sub.status as string;
                      const caseStudyId = sub.case_study_id as string | undefined;
                      const localCs = caseStudyId ? localCaseStudies.get(caseStudyId) : undefined;
                      const caseStudyTitle = localCs?.title ?? "Case study";
                      const companyName = localCs?.companyName ?? "Case study";
                      const logoUrl =
                        localCs?.logoUrl ??
                        (caseStudyId ? `/company-logos/${caseStudyId}.png` : null);
                      return (
                        <article key={sub.id as string} className="rounded-[16px] border border-sage-mist-2 bg-chalk p-5 shadow-1 transition-shadow hover:shadow-2">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-3">
                              {logoUrl && (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-pale-sage shadow-1">
                                  <Image
                                    src={logoUrl}
                                    alt={`${companyName} logo`}
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="eyebrow mb-1">{companyName}</div>
                                <h3 className="font-bold tracking-tight text-charcoal">{caseStudyTitle}</h3>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                  <Pill variant={statusVariant[status] ?? "mist"} size="sm">
                                    <span className="capitalize">{formatStatus(status)}</span>
                                  </Pill>
                                  {typeof sub.score === "number" && (
                                    <span className="text-sm font-bold text-sage stat-num">{sub.score as number}/100</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {sub.status === "in_progress" ? (
                              <ButtonLink href={`/case-studies/${sub.case_study_id as string}/exam`} variant="ghost" size="sm">
                                Resume
                              </ButtonLink>
                            ) : sub.status === "submitted" && sub.score == null ? (
                              <RetryScoringButton submissionId={sub.id as string} />
                            ) : (
                              <Pill variant="mist" size="sm">Portfolio proof</Pill>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-[18px] border border-sage-mist-2 bg-chalk p-5 shadow-1">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-charcoal">Upcoming events</h2>
                  <Link href="/results" className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-sage hover:underline">
                    See all
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.title} className="grid grid-cols-[34px_1fr] gap-3 rounded-[14px] bg-pale-sage p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chalk text-sage shadow-1">
                        <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold leading-tight text-charcoal">{event.title}</h3>
                        <p className="mt-0.5 text-[11px] text-charcoal-2">by {event.host}</p>
                        <p className="mt-1 text-[11px] text-charcoal-3">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[18px] border border-sage-mist-2 bg-chalk p-5 shadow-1">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-charcoal">Your profile</h2>
                  <Link href="/profile/edit" className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-sage hover:underline">
                    Edit
                  </Link>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-chalk shadow-1">
                    <UserCircle2 className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold tracking-tight text-charcoal">
                      {userData?.name ?? "Apto student"}
                    </h3>
                    <p className="text-[11px] font-semibold text-sage">Apto student</p>
                    {typeof userData?.email === "string" && userData.email && (
                      <p className="mt-0.5 truncate text-[10px] text-charcoal-2">{userData.email}</p>
                    )}
                  </div>
                </div>

                {cvSkills.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {cvSkills.slice(0, 6).map((skill: string) => (
                      <span key={skill} className="rounded-full bg-pale-sage px-2 py-0.5 text-[10px] font-semibold text-sage-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-[11px] text-charcoal-2">
                    Upload a CV to surface your skills and sharpen your matches.
                  </p>
                )}

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-sage-mist-2 pt-4 text-center">
                  <div>
                    <div className="stat-num text-base text-charcoal">{completedChallenges}</div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">Done</div>
                  </div>
                  <div>
                    <div className="stat-num text-base text-charcoal">{impactScore}</div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">Impact</div>
                  </div>
                  <div>
                    <div className="stat-num text-base text-coral">
                      {averageScore ? `${averageScore}` : "-"}
                    </div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">Avg</div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
