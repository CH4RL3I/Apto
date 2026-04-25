import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-chalk">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <Link href="/" aria-label="Apto home" className="inline-flex items-center">
          <Logo height={36} priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-charcoal-2 hover:text-charcoal transition-colors"
          >
            Log in
          </Link>
          <ButtonLink href="/login" variant="primary" size="sm">
            Get started
          </ButtonLink>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <div className="mb-6">
          <Pill
            variant="sage"
            size="md"
            icon={<span className="w-2 h-2 bg-sage rounded-full animate-pulse" />}
          >
            Career exploration, reimagined
          </Pill>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-charcoal leading-tight" style={{ textWrap: "balance" }}>
          Stop guessing.
          <br />
          <span className="text-sage">Start proving.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-charcoal-2 max-w-2xl leading-relaxed">
          Take a 5-minute quiz, get matched to careers that fit you, then solve
          real case studies from real companies. Top performers get invited to
          interview &mdash; no applications needed.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <ButtonLink href="/login" variant="primary" size="lg">
            Discover your career →
          </ButtonLink>
          <ButtonLink href="#how-it-works" variant="ghost" size="lg">
            See how it works
          </ButtonLink>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
          <div>
            <div className="stat-num text-4xl text-charcoal">5 min</div>
            <div className="text-sm text-charcoal-2 mt-1">Quiz to match</div>
          </div>
          <div>
            <div className="stat-num text-4xl text-charcoal">3+</div>
            <div className="text-sm text-charcoal-2 mt-1">Career paths</div>
          </div>
          <div>
            <div className="stat-num text-4xl text-charcoal">Real</div>
            <div className="text-sm text-charcoal-2 mt-1">Company cases</div>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 px-6 bg-pale-sage border-t border-sage-mist-2 mt-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="eyebrow text-center mb-3">How it works</div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-charcoal mb-16" style={{ letterSpacing: "-0.015em" }}>
            Three steps. One real path.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Take the quiz",
                description:
                  "Answer 7 quick questions about your interests, work style, and values. No trick questions, no personality labels.",
                accent: "text-sage",
              },
              {
                step: "02",
                title: "Get matched",
                description:
                  "Our matching engine compares your profile against real career paths and shows you the best fits with clear explanations.",
                accent: "text-sage-700",
              },
              {
                step: "03",
                title: "Prove yourself",
                description:
                  "Solve a real case study from a real company. Top submissions get forwarded directly for an interview.",
                accent: "text-coral",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-chalk rounded-[14px] p-8 shadow-1 hover:shadow-2 transition-shadow"
              >
                <div className={`text-5xl font-bold ${item.accent} mb-4 stat-num`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="text-charcoal-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-sage text-chalk text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: "-0.015em" }}>
            Ready to discover what fits?
          </h2>
          <p className="text-pale-sage text-lg mb-8">
            Real challenges. Real companies. Real you.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 bg-chalk text-sage px-[22px] py-3.5 rounded-xl text-[15px] font-semibold hover:bg-pale-sage transition-colors shadow-1 hover:shadow-2"
          >
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-sage-mist-2 bg-chalk">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-charcoal-2">
          <Logo height={20} variant="lockup" />
          <span>&copy; 2026 Apto. Built at START Unicorn Lisbon.</span>
        </div>
      </footer>
    </div>
  );
}
