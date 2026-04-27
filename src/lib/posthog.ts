// Server-side PostHog client. Used in Route Handlers and Server Actions
// to record events that happen outside the browser (e.g. /api/score-submission).
import { PostHog } from "posthog-node";

const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";

let client: PostHog | null = null;

function getClient(): PostHog | null {
  if (!apiKey) return null;
  if (!client) {
    client = new PostHog(apiKey, {
      host,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

export async function track(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const c = getClient();
  if (!c) return;
  c.capture({ distinctId, event, properties });
  // Best-effort flush — don't block the request on it.
  c.flush().catch(() => {});
}
