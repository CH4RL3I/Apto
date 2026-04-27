import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { PostHogProvider } from "@/components/PostHogProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apto — Explore. Understand. Achieve.",
  description:
    "Solve real case studies from real companies. Discover careers that actually fit you.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Identify the visitor for PostHog when they're signed in. No-op if PostHog
  // isn't configured.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${poppins.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <PostHogProvider userId={user?.id ?? null}>{children}</PostHogProvider>
      </body>
    </html>
  );
}
