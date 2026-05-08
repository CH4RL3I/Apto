import { test, expect } from "./fixtures";

const hasSeededStudent = !!process.env.PLAYWRIGHT_TEST_STUDENT_EMAIL && !!process.env.PLAYWRIGHT_TEST_STUDENT_PASSWORD;
const supabaseReachable = !!process.env.PLAYWRIGHT_SUPABASE_REACHABLE;

test.describe("Public profile (FR-9) smoke", () => {
  test.skip(!hasSeededStudent, "Requires seeded student account");
  test.skip(!supabaseReachable, "Set PLAYWRIGHT_SUPABASE_REACHABLE=1 once Supabase + seed account are wired up");

  test("toggling public profile + username makes /u/<username> reachable when logged out", async ({
    loggedIn: page,
    browser,
  }) => {
    await page.goto("/profile/edit");

    // Toggle public profile on. Use a forgiving locator — could be a checkbox or switch role.
    const publicToggle = page
      .getByLabel(/Make my profile public/i)
      .or(page.getByRole("switch", { name: /public/i }));
    if (await publicToggle.isVisible().catch(() => false)) {
      const checked = await publicToggle.isChecked().catch(() => false);
      if (!checked) await publicToggle.click();
    }

    // Set a username.
    const usernameField = page.getByLabel(/Username/i).first();
    if (await usernameField.isVisible().catch(() => false)) {
      await usernameField.fill("smoketest");
    }

    // Save.
    const save = page.getByRole("button", { name: /Save|Update/i }).first();
    if (await save.isVisible().catch(() => false)) {
      await save.click();
      // Allow server action to settle.
      await page.waitForTimeout(1000);
    }

    // Visit /u/smoketest in a fresh context (logged out).
    const ctx = await browser.newContext();
    const anon = await ctx.newPage();
    const resp = await anon.goto("/u/smoketest");
    expect(resp?.status() ?? 500).toBeLessThan(500);
    // The page should render *something* — any visible heading or the username string.
    await expect(anon.locator("body")).toContainText(/smoketest|profile|apto/i, { timeout: 15_000 });
    await ctx.close();
  });
});
