"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { Building2, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

const COMPANY_COOKIE = "apto_pending_company_signup";

function setCompanyCookie(value: object) {
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${COMPANY_COOKIE}=${encoded}; path=/; max-age=1800; samesite=lax`;
}

export default function CompanySignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setCompanyCookie({ name: companyName.trim(), email: email.trim(), ts: Date.now() });

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?role=company`,
      },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pale-sage px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link
            href="/"
            aria-label="Apto home"
            className="inline-flex items-center justify-center"
          >
            <Logo height={56} priority />
          </Link>
          <p className="mt-2 text-charcoal-2">
            Host case studies. Find candidates who can do the work.
          </p>
        </div>

        <div className="bg-chalk rounded-[14px] shadow-2 p-8">
          {sent ? (
            <div className="text-center fade-in">
              <div className="w-14 h-14 bg-pale-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-sage" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-semibold text-charcoal mb-2">
                Check your email
              </h2>
              <p className="text-sm text-charcoal-2">
                We sent a sign-up link to <strong className="text-charcoal">{email}</strong>
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-sm text-sage hover:underline font-medium"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 bg-pale-sage rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-sage" strokeWidth={1.75} />
                </div>
                <h2 className="text-base font-semibold text-charcoal">Sign up as a company</h2>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-charcoal mb-1.5"
                  >
                    Company name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ShipFlow"
                    required
                    minLength={2}
                    className="w-full px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-charcoal mb-1.5"
                  >
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hiring@yourcompany.com"
                    required
                    className="w-full px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || companyName.trim().length < 2}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  {loading ? "Sending…" : "Send magic link"}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-charcoal-2 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-sage font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
