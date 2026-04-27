"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

export default function CompanyLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    window.location.assign("/portal");
  }

  return (
    <div className="min-h-screen flex items-center justify-center brand-page px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link
            href="/"
            aria-label="Apto home"
            className="inline-flex items-center justify-center"
          >
            <Logo height={56} priority />
          </Link>
          <p className="mt-2 text-charcoal-2">Sign in to your hiring portal.</p>
        </div>

        <div className="bg-chalk rounded-[14px] shadow-2 p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-pale-sage rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sage" strokeWidth={1.75} />
            </div>
            <h2 className="text-base font-semibold text-charcoal">Company sign-in</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
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
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-charcoal-2 mt-6">
          Don&apos;t have a company account yet?{" "}
          <Link href="/signup/company" className="text-sage font-semibold hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-center text-xs text-charcoal-3 mt-2">
          Looking to apply?{" "}
          <Link href="/login" className="text-sage font-semibold hover:underline">
            Student sign-in
          </Link>
        </p>
      </div>
    </div>
  );
}
