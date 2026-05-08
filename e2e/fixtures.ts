import { test as base, expect, type Page } from "@playwright/test";

export type SeededStudent = {
  email: string;
  password: string;
};

export type Fixtures = {
  seededStudent: SeededStudent;
  loggedIn: Page;
};

function readSeededStudent(): SeededStudent | null {
  const email = process.env.PLAYWRIGHT_TEST_STUDENT_EMAIL;
  const password = process.env.PLAYWRIGHT_TEST_STUDENT_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

export const requireSeededStudent = (): SeededStudent => {
  const seeded = readSeededStudent();
  if (!seeded) {
    throw new Error(
      "PLAYWRIGHT_TEST_STUDENT_EMAIL / PLAYWRIGHT_TEST_STUDENT_PASSWORD must be set. " +
        "Seed a Supabase student account (see playwright.config.ts header) and export those vars."
    );
  }
  return seeded;
};

/**
 * Sign in as the seeded student via the /login form. Returns once /dashboard is reached.
 */
export async function signInStudent(page: Page, creds: SeededStudent): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(creds.email);
  await page.getByLabel("Password").fill(creds.password);
  await Promise.all([
    page.waitForURL("**/dashboard", { timeout: 30_000 }),
    page.getByRole("button", { name: /^sign in$/i }).click(),
  ]);
  await expect(page).toHaveURL(/\/dashboard$/);
}

export const test = base.extend<Fixtures>({
  seededStudent: async ({}, use) => {
    const seeded = readSeededStudent();
    // If unset, downstream tests will skip; we still provide a typed value to avoid TS errors.
    await use(seeded ?? { email: "", password: "" });
  },
  loggedIn: async ({ page }, use) => {
    const creds = requireSeededStudent();
    await signInStudent(page, creds);
    await use(page);
  },
});

export { expect };
