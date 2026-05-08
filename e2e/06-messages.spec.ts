import { test, expect } from "./fixtures";

const hasStudent2 =
  !!process.env.PLAYWRIGHT_TEST_STUDENT2_EMAIL && !!process.env.PLAYWRIGHT_TEST_STUDENT2_PASSWORD;

test.describe("Messages (FR-9) smoke", () => {
  test.skip(!hasStudent2, "requires second seeded account");

  test("two students can exchange a message", async ({ loggedIn: page }) => {
    // Stub: send a message from student 1 to student 2.
    // Real implementation requires:
    //   1. Seed two student accounts and a connection between them.
    //   2. Sign in as student 1 in `loggedIn` page, navigate to /messages/<connectionId>.
    //   3. Type a message, send, assert it appears.
    //   4. Open a second context as student 2, assert the message is received.
    await page.goto("/messages");
    await expect(page).toHaveURL(/\/messages/);
  });
});
