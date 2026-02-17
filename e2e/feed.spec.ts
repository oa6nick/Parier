import { test, expect } from "@playwright/test";

test.describe("Feed", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Pariall/i);
  });

  test("feed content is visible", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const content = page.locator("main, [role='main'], .feed, body");
    await expect(content.first()).toBeVisible({ timeout: 10000 });
  });
});
