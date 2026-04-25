"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) {
      setError(authError.message);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
            Guiding curious minds toward real-world success.
          </p>
        </div>

        <div className="bg-chalk rounded-[14px] shadow-2 p-8">
          {sent ? (
            <div className="text-center fade-in">
              <div className="w-14 h-14 bg-pale-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <Check
                  className="w-7 h-7 text-sage"
                  strokeWidth={1.75}
                />
              </div>
              <h2 className="text-lg font-semibold text-charcoal mb-2">
                Check your email
              </h2>
              <p className="text-sm text-charcoal-2">
                We sent a login link to <strong className="text-charcoal">{email}</strong>
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
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-chalk border border-sage-mist-2 rounded-[10px] px-4 py-3 text-sm font-semibold text-charcoal hover:bg-pale-sage transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-sage-mist-2" />
                <span className="text-xs text-charcoal-3 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-sage-mist-2" />
              </div>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-charcoal mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    required
                    className="w-full px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
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

        <p className="text-center text-[11px] text-charcoal-3 tracking-[0.22em] uppercase font-semibold mt-6">
          Explore. Understand. <span className="text-coral">Achieve.</span>
        </p>
        <p className="text-center text-xs text-charcoal-3 mt-3">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
