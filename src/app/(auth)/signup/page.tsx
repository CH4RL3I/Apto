"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { signupStudent } from "./actions";

export default function StudentSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("password", password);
    const res = await signupStudent(fd);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Sign-up failed");
      return;
    }
    if (res.redirect) {
      router.push(res.redirect);
      router.refresh();
    } else {
      setConfirmation("Check your email to confirm your account, then sign in.");
    }
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
          <p className="mt-2 text-charcoal-2">Create your student account.</p>
        </div>

        <div className="bg-chalk rounded-[14px] shadow-2 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
              {error}
            </div>
          )}
          {confirmation && (
            <div className="bg-pale-sage border border-sage-mist-2 text-sage-700 text-sm rounded-lg px-4 py-2.5 mb-4">
              {confirmation}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Müller"
                required
                minLength={2}
                className="w-full px-4 py-2.5 bg-chalk border border-sage-mist-2 rounded-[10px] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                Email
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-charcoal-2 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-sage font-semibold hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-center text-xs text-charcoal-3 mt-2">
          Hiring?{" "}
          <Link href="/signup/company" className="text-sage font-semibold hover:underline">
            Sign up as a company
          </Link>
        </p>
      </div>
    </div>
  );
}
