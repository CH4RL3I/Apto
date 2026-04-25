import { createBrowserClient } from "@supabase/ssr";

// NEXT_PUBLIC_* vars are inlined at build time. Placeholder fallbacks let
// prerender succeed when a Vercel scope (e.g. Preview) is missing them —
// real values still get inlined on any build where Vercel has them set.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "placeholder-anon-key";

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);
