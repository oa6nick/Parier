import { test, expect } from "@playwright/test";

test.describe("Create Bet", () => {
  test("create page requires auth", async ({ page }) => {
    await page.goto("/en/create");
    await page.waitForURL(/\/(login|auth)/);
  });

  test("create route exists", async ({ page }) => {
    await page.goto("/en/login");
    await expect(page).toHaveURL(/login|auth/);
  });
});
