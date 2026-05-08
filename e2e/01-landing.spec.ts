import { test, expect } from "./fixtures";

test.describe("Landing page smoke", () => {
  test("renders public homepage with nav, CTA, and no console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/");
    await expect(page).toHaveTitle(/Apto/i);

    await expect(page.getByRole("link", { name: /^Student log in$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Company log in$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Brand essence$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^How it works$/i })).toBeVisible();

    // "Get started" CTA is shown when logged out (button-like link).
    await expect(page.getByRole("link", { name: /^Get started$/i })).toBeVisible();

    // Filter out benign noise (Sentry / Next dev hot-update warnings, etc.).
    const meaningful = consoleErrors.filter(
      (msg) =>
        !/sentry/i.test(msg) &&
        !/Failed to load resource/i.test(msg) &&
        !/favicon/i.test(msg)
    );
    expect(meaningful, `Unexpected console errors:\n${meaningful.join("\n")}`).toEqual([]);
  });

  test("Student log in nav goes to /login with student heading", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /^Student log in$/i }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText(/Sign in as a student/i)).toBeVisible();
  });

  test("Company log in nav goes to /login/company with company heading", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /^Company log in$/i }).click();
    await expect(page).toHaveURL(/\/login\/company$/);
    await expect(page.getByText(/Sign in as a company/i)).toBeVisible();
  });
});
