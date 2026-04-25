import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bookmark,
  BookmarkPlus,
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  Compass,
  Globe2,
  GraduationCap,
  Home as HomeIcon,
  Leaf,
  MapPin,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UserCircle2,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const essence = [
  {
    icon: Compass,
    eyebrow: "Guided exploration",
    title: "Discover paths that fit you.",
    copy: "Helping students discover paths that fit their strengths and interests.",
  },
  {
    icon: Users,
    eyebrow: "Practical clarity",
    title: "See the real work.",
    copy: "Helping students understand what real work looks like and how to move toward it.",
  },
  {
    icon: Leaf,
    eyebrow: "Real connections",
    title: "Meet real companies.",
    copy: "Connecting top talent with real companies through authentic, case-study challenges.",
  },
  {
    icon: Target,
    eyebrow: "Real impact",
    title: "Build real proof.",
    copy: "Real-world learning. Real impact. Real opportunities.",
  },
];

const mockChallenges = [
  {
    label: "New",
    title: "Market Entry Analysis for Sustainable Fashion",
    company: "EcoThread",
    icon: Leaf,
    meta: "4 weeks",
  },
  {
    label: "New",
    title: "Product Strategy for Gen Z Education",
    company: "EduSpark",
    icon: GraduationCap,
    meta: "4 weeks",
  },
  {
    label: "New",
    title: "User Research for Finance App",
    company: "FinEdge",
    icon: ShieldCheck,
    meta: "4 weeks",
  },
];

const sidebarItems = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Discover", icon: Compass },
  { label: "Challenges", icon: Briefcase },
  { label: "Companies", icon: Building2 },
  { label: "Connections", icon: Users },
  { label: "Messages", icon: MessageCircle },
];

const steps = [
  {
    step: "01",
    title: "Explore with context",
    description:
      "Answer a short questionnaire and see role matches explained in plain language, not vague personality labels.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Understand the work",
    description:
      "Open case studies inspired by real business problems so the day-to-day feels tangible before you commit.",
    icon: Briefcase,
  },
  {
    step: "03",
    title: "Achieve with proof",
    description:
      "Build a portfolio of scored submissions that can turn curiosity into interviews and concrete next steps.",
    icon: Target,
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: "student" | "company" | null = null;
  if (user) {
    const { data: userRow } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    role = (userRow?.role as "student" | "company" | undefined) ?? null;
  }

  const homeHref = role === "company" ? "/portal" : "/dashboard";

  return (
    <div className="min-h-screen brand-page text-charcoal">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" aria-label="Apto home" className="inline-flex items-center focus-ring rounded-xl">
          <Logo height={38} priority />
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-charcoal-2">
                {user.email}
              </span>
              <ButtonLink href={homeHref} variant="primary" size="sm">
                {role === "company" ? "Open portal" : "Dashboard"}
              </ButtonLink>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="focus-ring rounded-lg px-2 py-1 text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="focus-ring rounded-lg px-2 py-1 text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
              >
                Log in
              </Link>
              <ButtonLink href="/login" variant="primary" size="sm">
                Get started
              </ButtonLink>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-20 pt-8 md:pt-14">
        <section className="grid lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-14 items-center">
          <div className="fade-in relative">
            <span className="apto-spark absolute -left-6 top-2 hidden text-3xl md:block" aria-hidden />

            <Pill
              variant="sage"
              size="md"
              icon={<Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />}
            >
              Career exploration, made practical
            </Pill>

            <h1
              className="mt-7 max-w-3xl text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.04] text-charcoal"
              style={{ textWrap: "balance" }}
            >
              Explore what fits. Understand the work. Achieve with proof.
            </h1>

            <p className="mt-6 max-w-xl text-lg md:text-xl italic font-medium text-sage-700">
              Guiding curious minds toward real-world success.
            </p>

            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-charcoal-2">
              Apto turns career discovery into real-world practice: students get matched to paths, solve company-style challenges, and build evidence of what they can do.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <ButtonLink href="/signup" variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" strokeWidth={1.75} />}>
                Discover your path
              </ButtonLink>
              <ButtonLink href="#how-it-works" variant="ghost" size="lg">
                See how it works
              </ButtonLink>
            </div>

            <div className="mt-10 inline-flex flex-wrap items-center gap-3 rounded-full border border-sage-mist-2 bg-chalk/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-sage shadow-1 backdrop-blur md:text-sm">
              <span>Explore.</span>
              <span aria-hidden className="apto-spark text-base text-coral">★</span>
              <span>Understand.</span>
              <span aria-hidden className="apto-spark text-base text-coral">★</span>
              <span className="text-coral">Achieve.</span>
            </div>
          </div>

          <AppPreview />
        </section>

        <section id="brand-essence" className="mt-24 md:mt-28">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow mb-3">Brand essence</div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-charcoal">
                Four ideas guide everything we build.
              </h2>
            </div>
            <p className="max-w-md text-sm md:text-base leading-relaxed text-charcoal-2">
              From the first questionnaire to the final interview invitation — these promises hold throughout.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {essence.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.eyebrow}
                  className="group relative flex h-full flex-col rounded-[20px] border border-sage-mist-2 bg-chalk p-6 shadow-1 transition-all hover:-translate-y-0.5 hover:shadow-2"
                >
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-sage/30 text-sage transition-colors group-hover:border-sage group-hover:bg-pale-sage">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage">{item.eyebrow}</div>
                  <h3 className="mt-2 text-lg font-bold tracking-tight text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-2">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="mt-24 rounded-[28px] bg-chalk p-6 md:p-10 shadow-2">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="eyebrow mb-3">Experience</div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-charcoal">
                Less generic discovery. More real momentum.
              </h2>
            </div>
            <p className="max-w-xl text-sm md:text-base leading-relaxed text-charcoal-2">
              The visual system now mirrors the brand board: soft chalk surfaces, sage guidance, coral achievement moments, line icons, and a clear product rhythm.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.step} className="group relative overflow-hidden rounded-[18px] bg-pale-sage p-6 shadow-1 transition-shadow hover:shadow-2">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-[22px] border-sage/10" />
                  <div className="relative">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="stat-num text-4xl text-sage">{item.step}</span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-chalk text-sage shadow-1">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-charcoal">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-2">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-20 md:mt-24">
          <div className="mb-8 md:mb-10 max-w-3xl">
            <div className="eyebrow mb-3">Inside Apto</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-charcoal">
              A working product. Not a deck.
            </h2>
            <p className="mt-3 max-w-xl text-charcoal-2">
              Real challenges from real companies, profiles built from real work, and matches you can act on.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <ChallengeCard />
            <StudentProfileCard />
            <MatchMadeCard />
            <CompanyPreviewCard />
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <div className="rounded-[24px] bg-chalk p-8 md:p-10 shadow-2">
            <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div>
                <div className="eyebrow mb-3">Built around real work</div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-charcoal">
                  No vanity metrics. Just real briefs, real industries, real proof.
                </h2>
                <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-charcoal-2">
                  Apto is an MVP. We&rsquo;re not going to pretend we have thousands of users yet. Here&rsquo;s what we actually have on day one.
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {[
                    "Product",
                    "Data",
                    "Design",
                    "Consulting",
                    "Finance",
                    "Marketing",
                    "Sales",
                    "People & HR",
                    "Sports",
                    "Pharma",
                    "Engineering",
                    "Sustainability",
                    "Public policy",
                    "+ 13 more",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-sage-mist-2 bg-pale-sage px-2.5 py-1 text-[11px] font-semibold text-sage-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[16px] bg-pale-sage p-5 shadow-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sage">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Case studies
                  </div>
                  <div className="stat-num mt-3 text-3xl text-charcoal">36</div>
                  <div className="mt-1 text-xs text-charcoal-2">Live in the library</div>
                </div>
                <div className="rounded-[16px] bg-pale-sage p-5 shadow-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sage">
                    <Compass className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Roles &amp; fields
                  </div>
                  <div className="stat-num mt-3 text-3xl text-charcoal">26</div>
                  <div className="mt-1 text-xs text-charcoal-2">From product to journalism</div>
                </div>
                <div className="col-span-2 rounded-[16px] border border-sage-mist-2 bg-chalk p-5 shadow-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sage">
                    <Star className="h-3.5 w-3.5" strokeWidth={1.75} />
                    What makes a brief
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-2">
                    Open-ended company-style problems. No multiple choice, no trivia. You write a real answer; we score it like a hiring panel would.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-20 grid lg:grid-cols-[1fr_1.65fr] gap-6">
          <div className="relative overflow-hidden rounded-[24px] bg-sage p-8 text-chalk shadow-2">
            <div className="poster-path" />
            <div className="relative z-10">
              <div className="mb-14 inline-flex items-center gap-2 text-sm font-semibold">
                <Logo variant="mark" height={28} className="rounded-full" />
                apto
              </div>
              <h2 className="max-w-xs text-3xl font-bold leading-tight tracking-tight">
                Real challenges. Real companies. Real you.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-chalk/78">
                A product story with a clear visual hook: students follow a guided path from curiosity to opportunity.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-[24px] bg-chalk p-8 shadow-2">
              <svg className="absolute inset-x-0 bottom-8 h-32 w-full" viewBox="0 0 420 160" aria-hidden="true">
                <path className="apto-path-line" strokeWidth="2.5" d="M12 104 C 96 18, 164 178, 236 92 S 334 20, 408 90" />
              </svg>
              <span className="apto-spark absolute right-10 top-12 text-4xl" aria-hidden="true" />
              <div className="relative z-10 max-w-xs">
                <Logo variant="mark" height={46} />
                <h2 className="mt-8 text-3xl font-bold leading-tight tracking-tight text-charcoal">
                  Your path. Real world. Endless possibilities.
                </h2>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[24px] bg-sage-700 p-8 text-chalk shadow-2">
              <div className="poster-path opacity-70" />
              <span className="apto-spark absolute right-10 top-16 text-5xl" aria-hidden="true" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold leading-tight tracking-tight">
                  Learn by doing. Grow by solving. Lead tomorrow.
                </h2>
                <div className="tagline-caps mt-12 text-[10px] leading-6 text-chalk/74">
                  Explore.<br />Understand.<br /><span className="text-coral">Achieve.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="relative overflow-hidden bg-sage px-6 py-20 text-chalk md:py-28">
        <div className="poster-path opacity-90" />
        <svg className="absolute inset-x-0 bottom-0 hidden h-40 w-full md:block" viewBox="0 0 1200 200" aria-hidden="true">
          <path className="apto-path-line" stroke="rgba(250, 250, 247, 0.4)" strokeWidth="2.5" d="M0 140 C 200 40, 400 200, 600 110 S 1000 30, 1200 110" />
        </svg>
        <span className="apto-spark absolute right-12 top-12 hidden text-5xl md:block" aria-hidden />

        <div className="relative z-10 mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <div className="eyebrow mb-4 text-chalk/70">Start here</div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Turn student potential into real work.
            </h2>
            <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-pale-sage">
              Explore paths, understand roles, and prove your skills through practical challenges from real companies.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/signup" variant="coral" size="lg" icon={<ArrowRight className="h-4 w-4" strokeWidth={1.75} />}>
                Get started free
              </ButtonLink>
              <Link href="/login/company" className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-chalk/80 hover:text-chalk transition-colors">
                Hiring? Post a challenge -&gt;
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[24px] bg-chalk/10 p-6 backdrop-blur-sm md:p-8">
              <div className="tagline-caps text-[11px] leading-7 text-chalk/85">
                Explore.<br />Understand.<br /><span className="text-coral">Achieve.</span>
              </div>
              <p className="mt-6 text-base leading-relaxed text-pale-sage">
                Three steps. One real path. From curious student to interview-ready candidate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-sage-mist-2 bg-chalk px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo height={26} variant="lockup" />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal-2">
            <Link href="/login" className="focus-ring rounded px-1 py-0.5 hover:text-charcoal">Student log in</Link>
            <Link href="/login/company" className="focus-ring rounded px-1 py-0.5 hover:text-charcoal">Company log in</Link>
            <Link href="#brand-essence" className="focus-ring rounded px-1 py-0.5 hover:text-charcoal">Brand essence</Link>
            <Link href="#how-it-works" className="focus-ring rounded px-1 py-0.5 hover:text-charcoal">How it works</Link>
          </div>
          <span className="text-xs text-charcoal-3">&copy; 2026 Apto. Built at START Unicorn Lisbon.</span>
        </div>
      </footer>
    </div>
  );
}

function AppPreview() {
  return (
    <div className="relative fade-in">
      <div className="brand-shell rounded-[30px] border border-sage-mist-2/80 bg-chalk/70 p-3 shadow-3 backdrop-blur">
        <div className="overflow-hidden rounded-[24px] border border-sage-mist-2 bg-chalk shadow-1">
          <div className="grid md:grid-cols-[190px_1fr] min-h-[560px]">
            <aside className="hidden md:flex flex-col border-r border-sage-mist-2 bg-chalk-2/70 p-4">
              <div className="mb-8 flex items-center gap-2 px-2 py-1">
                <Logo variant="mark" height={30} />
                <span className="text-xl font-bold text-charcoal">apto</span>
              </div>
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 rounded-[10px] px-3 py-2 text-xs font-semibold ${
                        item.active ? "bg-pale-sage text-sage" : "text-charcoal-2"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                      {item.label}
                    </div>
                  );
                })}
              </nav>
              <div className="mt-auto space-y-1">
                <div className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-xs font-semibold text-charcoal-2">
                  <Bookmark className="h-4 w-4" strokeWidth={1.75} />
                  Bookmarks
                </div>
                <div className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-xs font-semibold text-charcoal-2">
                  <Settings className="h-4 w-4" strokeWidth={1.75} />
                  Settings
                </div>
              </div>
            </aside>

            <div className="p-4 md:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex flex-1 items-center gap-2 rounded-[12px] border border-sage-mist-2 bg-chalk px-3 py-2.5 text-xs text-charcoal-3">
                  <Search className="h-4 w-4" strokeWidth={1.75} />
                  Search challenges, companies, skills...
                </div>
                <Bell className="h-5 w-5 text-charcoal-2" strokeWidth={1.75} />
                <div className="h-9 w-9 rounded-full bg-sage-300" />
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-charcoal">Good morning, Maya</h2>
                <p className="mt-1 text-xs text-charcoal-2">Explore challenges. Build skills. Make an impact.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-charcoal">Recommended for you</h3>
                    <span className="whitespace-nowrap text-[11px] font-semibold text-sage">View all</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {mockChallenges.map((challenge) => {
                      const Icon = challenge.icon;
                      return (
                        <div key={challenge.title} className="flex min-w-0 flex-col rounded-[12px] bg-sage p-3 text-chalk shadow-1">
                          <Pill variant="coralSolid" size="sm">{challenge.label}</Pill>
                          <h4 className="mt-2 line-clamp-3 text-[11px] font-bold leading-snug">{challenge.title}</h4>
                          <div className="mt-2 flex items-center gap-1 text-[10px] text-pale-sage">
                            <Icon className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                            <span className="truncate">{challenge.company}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-[9px] text-chalk/75">
                            <CalendarDays className="h-2.5 w-2.5 shrink-0" strokeWidth={1.75} />
                            <span className="truncate">{challenge.meta}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-xs font-bold text-charcoal">Your progress</h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      ["Learning streak", "7 days", "Keep going"],
                      ["Skills unlocked", "12", "+3 this week"],
                      ["Impact score", "820", "Top 15%"],
                    ].map(([label, value, caption]) => (
                      <div key={label} className="min-w-0 rounded-[12px] border border-sage-mist-2 bg-chalk p-3 shadow-1">
                        <div className="truncate text-[10px] font-semibold text-charcoal-2">{label}</div>
                        <div className="stat-num mt-1 text-xl text-charcoal">{value}</div>
                        <div className="mt-0.5 truncate text-[9px] text-charcoal-3">{caption}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-4 shadow-1">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-charcoal">Upcoming events</h3>
                    <span className="whitespace-nowrap text-[10px] font-semibold text-sage">See all</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      ["Case Prep Workshop", "BCG", "May 24"],
                      ["Product Careers 101", "Amplitude", "May 27"],
                      ["Build Your Portfolio", "Apto", "May 30"],
                    ].map(([title, host, time]) => (
                      <div key={title} className="flex min-w-0 items-start gap-2 rounded-[10px] bg-pale-sage p-2.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chalk text-sage">
                          <CalendarDays className="h-3 w-3" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-bold leading-tight text-charcoal">{title}</div>
                          <div className="truncate text-[9px] text-charcoal-2">by {host}</div>
                          <div className="mt-0.5 text-[9px] text-charcoal-3">{time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -top-5 hidden h-12 w-12 rotate-12 items-center justify-center rounded-[16px] bg-coral text-chalk shadow-2 lg:flex">
        <BarChart3 className="h-6 w-6" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function ChallengeCard() {
  return (
    <article className="relative flex flex-col rounded-[20px] border border-sage-mist-2 bg-chalk p-5 shadow-1 transition-shadow hover:shadow-2">
      <div className="mb-3 flex items-start justify-between gap-3">
        <Pill variant="coralSolid" size="sm">Hot</Pill>
        <BookmarkPlus className="h-4 w-4 text-charcoal-3" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-bold leading-snug tracking-tight text-charcoal">
        Market Entry Strategy for Sustainable Fashion
      </h3>
      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-sage">
        <Leaf className="h-3.5 w-3.5" strokeWidth={1.75} />
        EcoThread
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-pale-sage px-2 py-0.5 text-[11px] font-semibold text-sage-700">
          <Clock className="h-3 w-3" strokeWidth={1.75} />
          4 weeks
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-pale-sage px-2 py-0.5 text-[11px] font-semibold text-sage-700">
          <Users className="h-3 w-3" strokeWidth={1.75} />
          Team
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-pale-sage px-2 py-0.5 text-[11px] font-semibold text-sage-700">
          <Sparkles className="h-3 w-3" strokeWidth={1.75} />
          Beginner
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-charcoal-2">
        Help EcoThread identify new markets and a go-to-market strategy for their next phase of growth.
      </p>
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-sage-mist-2 pt-4">
        <div>
          <div className="stat-num text-xl text-charcoal">$1,000</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">Prize pool</div>
        </div>
        <div>
          <div className="stat-num text-xl text-charcoal">420</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">Joined</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-chalk shadow-1">
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
    </article>
  );
}

function StudentProfileCard() {
  return (
    <article className="flex flex-col rounded-[20px] border border-sage-mist-2 bg-chalk p-5 shadow-1 transition-shadow hover:shadow-2">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-chalk shadow-1">
          <UserCircle2 className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold tracking-tight text-charcoal">Maya Sharma</h3>
          <p className="text-xs font-semibold text-sage">Data &amp; Product Enthusiast</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-charcoal-2">
            <MapPin className="h-3 w-3" strokeWidth={1.75} />
            University of Toronto
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Data analysis", "Strategy", "Excel", "SQL"].map((skill) => (
          <span key={skill} className="rounded-full bg-pale-sage px-2 py-0.5 text-[11px] font-semibold text-sage-700">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-sage-mist-2 pt-4 text-center">
        <div>
          <div className="stat-num text-lg text-charcoal">8</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">Challenges</div>
        </div>
        <div>
          <div className="stat-num text-lg text-charcoal">820</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">Impact score</div>
        </div>
        <div>
          <div className="stat-num text-lg text-coral">15%</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-3">Top student</div>
        </div>
      </div>
    </article>
  );
}

function MatchMadeCard() {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[20px] border border-sage bg-pale-sage p-5 shadow-1">
      <span className="apto-spark absolute right-5 top-5 text-2xl" aria-hidden />
      <div className="eyebrow mb-2">Match made</div>
      <h3 className="text-lg font-bold tracking-tight text-charcoal">Great match!</h3>
      <p className="mt-1 text-xs text-charcoal-2">
        You and Amplitude are a great fit based on your last submission.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-chalk px-3 py-1.5 text-sm font-bold text-charcoal shadow-1 self-start">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-100 text-coral-700">
          <BarChart3 className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        Amplitude
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Product strategy", "Data", "User research"].map((skill) => (
          <span key={skill} className="rounded-full border border-sage/40 bg-chalk/60 px-2 py-0.5 text-[11px] font-semibold text-sage-700">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-sage/30 pt-4">
        <ButtonLink href="/login" variant="coral" size="sm" className="flex-1 justify-center">
          View opportunity
        </ButtonLink>
        <button className="text-xs font-semibold text-charcoal-2 hover:text-charcoal" type="button">
          Not now
        </button>
      </div>
    </article>
  );
}

function CompanyPreviewCard() {
  return (
    <article className="flex flex-col rounded-[20px] border border-sage-mist-2 bg-chalk p-5 shadow-1 transition-shadow hover:shadow-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-pale-sage text-sage shadow-1">
            <Building2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-charcoal">Boston Consulting Group</h3>
            <p className="text-xs text-charcoal-2">Global management consulting</p>
          </div>
        </div>
        <Bookmark className="h-4 w-4 text-charcoal-3" strokeWidth={1.75} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-[12px] bg-pale-sage p-2.5">
          <Briefcase className="mx-auto mb-1 h-4 w-4 text-sage" strokeWidth={1.75} />
          <div className="text-[10px] font-bold text-charcoal">Consulting</div>
        </div>
        <div className="rounded-[12px] bg-pale-sage p-2.5">
          <Users className="mx-auto mb-1 h-4 w-4 text-sage" strokeWidth={1.75} />
          <div className="text-[10px] font-bold text-charcoal">10k+ Staff</div>
        </div>
        <div className="rounded-[12px] bg-pale-sage p-2.5">
          <Globe2 className="mx-auto mb-1 h-4 w-4 text-sage" strokeWidth={1.75} />
          <div className="text-[10px] font-bold text-charcoal">90+ Offices</div>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-charcoal-2">
        Work on high-impact problems alongside global teams of senior strategists.
      </p>
      <div className="mt-5 border-t border-sage-mist-2 pt-4">
        <ButtonLink href="/login" variant="primary" size="sm" className="w-full justify-center">
          View open challenges
        </ButtonLink>
      </div>
    </article>
  );
}
