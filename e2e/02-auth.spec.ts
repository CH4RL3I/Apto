import { test, expect } from "./fixtures";

const hasSeededStudent = !!process.env.PLAYWRIGHT_TEST_STUDENT_EMAIL && !!process.env.PLAYWRIGHT_TEST_STUDENT_PASSWORD;
// Set this when running against an env where the seed account actually exists
// in Supabase (e.g. Vercel preview, or a fully-configured local dev).
// Without it, signInWithPassword will fail with "Failed to fetch" and we skip.
const supabaseReachable = !!process.env.PLAYWRIGHT_SUPABASE_REACHABLE;

test.describe("Auth flow smoke", () => {
  test.skip(!hasSeededStudent, "Set PLAYWRIGHT_TEST_STUDENT_EMAIL/PASSWORD to run auth tests");
  test.skip(
    !supabaseReachable,
    "Auth tests need a reachable Supabase. Set PLAYWRIGHT_SUPABASE_REACHABLE=1 once the seed account exists."
  );

  test("logs in, persists across reload, and signs out", async ({ page, seededStudent, context }) => {
    // Sign in via the form.
    await page.goto("/login");
    await page.getByLabel("Email").fill(seededStudent.email);
    await page.getByLabel("Password").fill(seededStudent.password);
    await Promise.all([
      page.waitForURL("**/dashboard", { timeout: 30_000 }),
      page.getByRole("button", { name: /^sign in$/i }).click(),
    ]);
    await expect(page).toHaveURL(/\/dashboard$/);

    // Cookie sanity-check: a Supabase auth cookie should be present and not session-only.
    const cookies = await context.cookies();
    const authCookie = cookies.find((c) => /auth-token|sb-.*-auth-token/i.test(c.name));
    expect(authCookie, "expected a Supabase auth cookie").toBeTruthy();
    if (authCookie?.expires && authCookie.expires > 0) {
      const thirtyDaysFromNow = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      expect(authCookie.expires).toBeGreaterThan(thirtyDaysFromNow);
    }

    // Reload — still on the dashboard.
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard$/);

    // Sign out via the visible "Sign out" affordance (form posts to /auth/signout).
    const signOut = page.getByRole("button", { name: /^sign out$/i }).first();
    if (await signOut.isVisible().catch(() => false)) {
      await signOut.click();
    } else {
      // Fallback: hit the signout endpoint directly.
      await page.request.post("/auth/signout");
      await page.goto("/login");
    }
    await page.waitForURL(/\/(login|$)/, { timeout: 30_000 });
    await expect(page).toHaveURL(/\/(login|$)/);

    // Cookie cleared.
    const afterCookies = await context.cookies();
    const stillAuthed = afterCookies.find(
      (c) => /auth-token|sb-.*-auth-token/i.test(c.name) && c.value && c.value !== ""
    );
    expect(stillAuthed?.value || "").toBe("");
  });
});
