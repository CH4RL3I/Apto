import { test, expect } from "./fixtures";

const hasSeededStudent = !!process.env.PLAYWRIGHT_TEST_STUDENT_EMAIL && !!process.env.PLAYWRIGHT_TEST_STUDENT_PASSWORD;
const supabaseReachable = !!process.env.PLAYWRIGHT_SUPABASE_REACHABLE;

const ANALYSIS_ANSWER =
  "Sustainable demand is rising; premium willingness exists in target markets so EcoThread should enter quickly.".padEnd(
    100,
    " "
  );
const RECOMMENDATION_ANSWER =
  "Amsterdam balances brand fit, comp, and revenue potential; phased entry with capsule line lowers risk meaningfully.".padEnd(
    80,
    " "
  );
const CURVEBALL_ANSWER =
  "Adapt sourcing, retain mission narrative, lengthen runway, and renegotiate supplier terms to protect margin.".padEnd(
    60,
    " "
  );

test.describe("Multi-task challenge happy path (cs-99)", () => {
  test.skip(!hasSeededStudent, "Requires seeded student account");
  test.skip(!supabaseReachable, "Set PLAYWRIGHT_SUPABASE_REACHABLE=1 once Supabase + seed account are wired up");

  test("completes all three tasks and reaches certificate", async ({ loggedIn: page }) => {
    await page.goto("/case-studies/cs-99-ecothread-strategy");

    // Dual-mode entry card visible.
    await expect(page.getByText(/Choose your mode/i)).toBeVisible();
    const multiTaskCta = page.getByRole("link", { name: /Start multi-task challenge/i });
    const classicCta = page.getByRole("link", { name: /Or do the classic exam/i });
    await expect(multiTaskCta).toBeVisible();
    await expect(classicCta).toBeVisible();

    await multiTaskCta.click();
    await expect(page).toHaveURL(/\/case-studies\/cs-99-ecothread-strategy\/tasks$/);

    // Sidebar shows EcoThread + the three tasks with their durations.
    await expect(page.getByText(/EcoThread/i).first()).toBeVisible();
    await expect(page.getByText(/Analysis/i).first()).toBeVisible();
    await expect(page.getByText(/35\s*min/i).first()).toBeVisible();
    await expect(page.getByText(/Recommendation/i).first()).toBeVisible();
    await expect(page.getByText(/30\s*min/i).first()).toBeVisible();
    await expect(page.getByText(/Curveball/i).first()).toBeVisible();
    await expect(page.getByText(/20\s*min/i).first()).toBeVisible();

    // ----- Task 1: Analysis -----
    const correctQuickCheck = page.getByText(
      /Existing demand for sustainable products and willingness to pay a premium/i
    );
    await correctQuickCheck.click();
    await expect(page.getByText(/✓\s*Correct/i)).toBeVisible();

    const analysisTextarea = page.locator("textarea").first();
    await analysisTextarea.fill(ANALYSIS_ANSWER);
    await page.getByRole("button", { name: /Submit\s*&\s*continue/i }).click();

    // ----- Task 2: Recommendation -----
    await expect(page.getByText(/Amsterdam/i).first()).toBeVisible({ timeout: 30_000 });
    await page.getByText(/^Amsterdam$/i).first().click();

    // Three matching dropdowns (revenue, comp, brand).
    const selects = page.locator("select");
    const selectCount = await selects.count();
    expect(selectCount).toBeGreaterThanOrEqual(3);
    // Pick the option with "correct" in its data attribute when available; else first non-empty option.
    for (let i = 0; i < Math.min(selectCount, 3); i++) {
      const sel = selects.nth(i);
      const options = await sel.locator("option").allTextContents();
      const target =
        options.find((o) => /correct/i.test(o)) ?? options.find((o) => o.trim().length > 0 && !/select/i.test(o));
      if (target) await sel.selectOption({ label: target });
    }

    const recTextarea = page.locator("textarea").first();
    await recTextarea.fill(RECOMMENDATION_ANSWER);
    await page.getByRole("button", { name: /Submit\s*&\s*continue/i }).click();

    // Score result card with 3 dimensions.
    await expect(page.getByText(/Score|Result/i).first()).toBeVisible({ timeout: 60_000 });

    // Continue to Task 3 — there's typically a "Next task" / "Continue" button after scoring.
    const next = page.getByRole("button", { name: /Next task|Continue|Go to/i }).first();
    if (await next.isVisible().catch(() => false)) {
      await next.click();
    }

    // ----- Task 3: Curveball -----
    await expect(page.getByText(/Adapt the approach/i)).toBeVisible({ timeout: 30_000 });
    await page.getByText(/Adapt the approach/i).click();

    const curveTextarea = page.locator("textarea").first();
    await curveTextarea.fill(CURVEBALL_ANSWER);
    await page.getByRole("button", { name: /Submit\s*&\s*continue|Submit\s*final|Finish/i }).first().click();

    // Final score with 4 dimensions + certificate banner.
    await expect(page.getByText(/Final score|Overall|Certificate/i).first()).toBeVisible({ timeout: 90_000 });
    const certLink = page.getByRole("link", { name: /View certificate/i });
    await expect(certLink).toBeVisible();
    const href = await certLink.getAttribute("href");
    expect(href).toMatch(/^\/certificate\/[0-9a-f-]{8,}/i);
  });
});
