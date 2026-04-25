import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  CalendarDays,
  Compass,
  GraduationCap,
  Home as HomeIcon,
  Leaf,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";

const essence = [
  {
    icon: Compass,
    title: "Guided exploration",
    copy: "Students discover paths that fit their strengths, values, and interests.",
  },
  {
    icon: Users,
    title: "Real connections",
    copy: "Top performers get closer to companies through practical case-study work.",
  },
  {
    icon: Target,
    title: "Practical clarity",
    copy: "Every recommendation explains what the role looks like and how to move toward it.",
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

export default function Home() {
  return (
    <div className="min-h-screen brand-page text-charcoal">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" aria-label="Apto home" className="inline-flex items-center focus-ring rounded-xl">
          <Logo height={38} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="focus-ring rounded-lg px-2 py-1 text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
          >
            Log in
          </Link>
          <ButtonLink href="/login" variant="primary" size="sm">
            Get started
          </ButtonLink>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-20 pt-8 md:pt-14">
        <section className="grid lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-14 items-center">
          <div className="fade-in">
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

            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-charcoal-2">
              Apto turns career discovery into real-world practice: students get matched to paths, solve company-style challenges, and build evidence of what they can do.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <ButtonLink href="/login" variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" strokeWidth={1.75} />}>
                Discover your path
              </ButtonLink>
              <ButtonLink href="#how-it-works" variant="ghost" size="lg">
                See how it works
              </ButtonLink>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-sage">
              <span>Explore.</span>
              <span>Understand.</span>
              <span className="text-coral">Achieve.</span>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-3">
              {essence.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[14px] border border-sage-mist-2/70 bg-chalk/78 p-4 shadow-1 backdrop-blur">
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-sage/30 text-sage">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-sm font-bold text-charcoal">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-charcoal-2">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <AppPreview />
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

        <section className="mt-8 grid lg:grid-cols-[1fr_1.65fr] gap-6">
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

      <section className="bg-sage px-6 py-20 text-center text-chalk">
        <div className="max-w-2xl mx-auto">
          <div className="eyebrow mb-3 text-chalk/70">Start here</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Turn student potential into real work.
          </h2>
          <p className="mt-4 text-lg text-pale-sage">
            Explore paths, understand roles, and prove your skills through practical challenges.
          </p>
          <ButtonLink href="/login" variant="coral" size="lg" className="mt-8">
            Get started free
          </ButtonLink>
        </div>
      </section>

      <footer className="border-t border-sage-mist-2 bg-chalk px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-4 text-sm text-charcoal-2">
          <Logo height={22} variant="lockup" />
          <span>&copy; 2026 Apto. Built at START Unicorn Lisbon.</span>
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

              <div className="grid xl:grid-cols-[1fr_190px] gap-5">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-charcoal">Recommended for you</h3>
                    <span className="text-[11px] font-semibold text-sage">View all</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {mockChallenges.map((challenge) => {
                      const Icon = challenge.icon;
                      return (
                        <div key={challenge.title} className="rounded-[14px] bg-sage p-4 text-chalk shadow-1">
                          <Pill variant="coralSolid" size="sm">{challenge.label}</Pill>
                          <h4 className="mt-3 min-h-[70px] text-sm font-bold leading-snug">{challenge.title}</h4>
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-pale-sage">
                            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                            {challenge.company}
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-[10px] text-chalk/72">
                            <CalendarDays className="h-3 w-3" strokeWidth={1.75} />
                            {challenge.meta}
                            <span>Beginner</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8">
                    <h3 className="mb-3 text-xs font-bold text-charcoal">Your progress</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        ["Learning streak", "7 days", "Keep going"],
                        ["Skills unlocked", "12", "+3 this week"],
                        ["Impact score", "820", "Top 15%"],
                      ].map(([label, value, caption]) => (
                        <div key={label} className="rounded-[12px] border border-sage-mist-2 bg-chalk p-4 shadow-1">
                          <div className="text-[11px] font-semibold text-charcoal-2">{label}</div>
                          <div className="stat-num mt-1 text-2xl text-charcoal">{value}</div>
                          <div className="mt-1 text-[10px] text-charcoal-3">{caption}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="rounded-[16px] border border-sage-mist-2 bg-chalk p-4 shadow-1">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-charcoal">Upcoming events</h3>
                    <span className="text-[10px] font-semibold text-sage">See all</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      ["Case Prep Workshop", "by BCG", "May 24 - 6:00 PM"],
                      ["Product Careers 101", "by Amplitude", "May 27 - 7:00 PM"],
                      ["Build Your Portfolio", "by Apto", "May 30 - 6:30 PM"],
                    ].map(([title, host, time]) => (
                      <div key={title} className="grid grid-cols-[28px_1fr] gap-3 rounded-[12px] bg-pale-sage p-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-chalk text-sage">
                          <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold leading-tight text-charcoal">{title}</div>
                          <div className="text-[10px] text-charcoal-2">{host}</div>
                          <div className="mt-1 text-[10px] text-charcoal-3">{time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
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
