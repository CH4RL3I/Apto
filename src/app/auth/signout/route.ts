import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // 303 See Other tells the browser to follow with GET. Without this,
  // NextResponse.redirect defaults to 307 and the browser re-POSTs the
  // form body to /login, which never navigates cleanly.
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}
