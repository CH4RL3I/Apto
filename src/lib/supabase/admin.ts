import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS — must ONLY be used server-side
// (server actions / route handlers). Never import from a client component.
//
// We intentionally allow build-time absence of SUPABASE_SERVICE_ROLE_KEY so
// `next build` does not fail on Vercel previews that haven't been configured
// yet. Runtime callers MUST go through createAdminClient(), which throws
// when the key is missing.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createAdminClient() {
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
