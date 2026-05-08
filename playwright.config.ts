/**
 * Playwright config for Apto's first smoke test suite.
 *
 * Required env vars (set locally in `.env.local` or your shell, and on Vercel preview if running tests there):
 *   - PLAYWRIGHT_BASE_URL                  Optional. Defaults to http://localhost:3000.
 *   - PLAYWRIGHT_TEST_STUDENT_EMAIL        Email of a seeded Supabase student account used by the auth fixture.
 *   - PLAYWRIGHT_TEST_STUDENT_PASSWORD     Password for that account.
 *   - PLAYWRIGHT_TEST_STUDENT2_EMAIL       Optional. Enables 06-messages.spec; otherwise that spec is skipped.
 *   - PLAYWRIGHT_TEST_STUDENT2_PASSWORD    Optional, paired with the above.
 *
 * Seeding the test student: create the account once via Supabase Studio (Auth > Users > Add user, then insert a
 * matching row in the public.users table with role='student'). Verify the email if email confirmations are on.
 * Re-using the demo seed account from scripts/ is fine for local runs.
 *
 * Local quick-start:
 *   npx playwright install chromium
 *   PLAYWRIGHT_TEST_STUDENT_EMAIL=... PLAYWRIGHT_TEST_STUDENT_PASSWORD=... npm run test:e2e
 */
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["html", { outputFolder: "e2e-report", open: "never" }], ["list"]],
  outputDir: "test-results",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
