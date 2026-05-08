import { test, expect } from "./fixtures";

const hasSeededStudent = !!process.env.PLAYWRIGHT_TEST_STUDENT_EMAIL && !!process.env.PLAYWRIGHT_TEST_STUDENT_PASSWORD;
const supabaseReachable = !!process.env.PLAYWRIGHT_SUPABASE_REACHABLE;

test.describe("Legacy exam path", () => {
  test.skip(!hasSeededStudent, "Requires seeded student account");
  test.skip(!supabaseReachable, "Set PLAYWRIGHT_SUPABASE_REACHABLE=1 once Supabase + seed account are wired up");

  test("classic exam button on cs-99 navigates to /exam with timer + textarea", async ({ loggedIn: page }) => {
    await page.goto("/case-studies/cs-99-ecothread-strategy");
    const classic = page.getByRole("link", { name: /Or do the classic exam/i });
    await expect(classic).toBeVisible();
    await classic.click();
    await expect(page).toHaveURL(/\/case-studies\/cs-99-ecothread-strategy\/exam$/);

    // Exam page: timer + textarea must be present.
    await expect(page.locator("textarea").first()).toBeVisible();
    // Timer is typically rendered as MM:SS — match e.g. "60:00" or "59:" etc.
    await expect(page.getByText(/\b\d{1,3}:\d{2}\b/).first()).toBeVisible();
  });
});
