import type { CookieOptions } from "@supabase/ssr";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Supabase's @supabase/ssr defaults to session-lifetime cookies, which means
// the refresh token cookie evaporates when the browser closes. We extend it
// to one year so "stay logged in" actually persists across browser restarts.
export function withPersistentMaxAge(options?: CookieOptions): CookieOptions {
  return {
    ...options,
    maxAge: options?.maxAge ?? ONE_YEAR_SECONDS,
    sameSite: options?.sameSite ?? "lax",
    secure: options?.secure ?? process.env.NODE_ENV === "production",
    httpOnly: options?.httpOnly ?? true,
    path: options?.path ?? "/",
  };
}
