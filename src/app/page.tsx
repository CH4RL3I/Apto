import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <Link href="/" aria-label="Apto home" className="inline-flex items-center">
          <Logo height={36} priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted hover:text-slate-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Career exploration, reimagined
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
          Stop guessing.
          <br />
          <span className="text-primary">Start proving.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
          Take a 5-minute quiz, get matched to careers that fit you, then solve
          real case studies from real companies. Top performers get invited to
          interview &mdash; no applications needed.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="bg-primary text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
          >
            Discover Your Career &rarr;
          </Link>
          <a
            href="#how-it-works"
            className="border border-border text-slate-700 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-50 transition-colors"
          >
            See How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
          <div>
            <div className="text-3xl font-bold text-slate-900">5 min</div>
            <div className="text-sm text-muted mt-1">Quiz to match</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900">3+</div>
            <div className="text-sm text-muted mt-1">Career paths</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900">Real</div>
            <div className="text-sm text-muted mt-1">Company cases</div>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 px-6 bg-white border-t border-border"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take the Quiz",
                description:
                  "Answer 10 quick questions about your interests, work style, and values. No trick questions, no personality labels.",
                color: "text-pm",
              },
              {
                step: "02",
                title: "Get Matched",
                description:
                  "Our matching engine compares your profile against real career paths and shows you the best fits with clear explanations.",
                color: "text-ux",
              },
              {
                step: "03",
                title: "Prove Yourself",
                description:
                  "Solve a real case study from a real company. Top submissions get forwarded directly to the company for interview.",
                color: "text-data",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-surface rounded-2xl p-8 border border-border"
              >
                <div
                  className={`text-4xl font-bold ${item.color} opacity-50 mb-4`}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to discover what fits?
          </h2>
          <p className="text-primary-light text-lg mb-8">
            Join thousands of students who are proving their skills to real
            companies.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-primary px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-50 transition-colors"
          >
            Get Started Free &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-muted">
          <span className="font-semibold text-slate-900">apto</span>
          <span>&copy; 2026 Apto. Built at START Unicorn Lisbon.</span>
        </div>
      </footer>
    </div>
  );
}
