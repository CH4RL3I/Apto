"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";

let initialized = false;

export function PostHogProvider({
  userId,
  children,
}: {
  userId?: string | null;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!apiKey || initialized) return;
    posthog.init(apiKey, {
      api_host: host,
      capture_pageview: true,
      person_profiles: "identified_only",
    });
    initialized = true;
  }, []);

  useEffect(() => {
    if (!apiKey || !initialized) return;
    if (userId) {
      posthog.identify(userId);
    } else {
      posthog.reset();
    }
  }, [userId]);

  return <>{children}</>;
}
