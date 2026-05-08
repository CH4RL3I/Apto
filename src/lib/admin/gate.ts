import { createClient } from "@/lib/supabase/server";

export interface AdminGateResult {
  allowed: boolean;
  reason: "no-session" | "not-allowlisted" | "ok";
  email: string | null;
}

function parseAllowlist(): string[] {
  const raw = process.env.APTO_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function checkAdminGate(): Promise<AdminGateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { allowed: false, reason: "no-session", email: null };

  const email = (user.email ?? "").toLowerCase();
  const allowlist = parseAllowlist();
  if (allowlist.length === 0 || !email || !allowlist.includes(email)) {
    return { allowed: false, reason: "not-allowlisted", email: user.email ?? null };
  }

  return { allowed: true, reason: "ok", email: user.email ?? null };
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = parseAllowlist();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.toLowerCase());
}
