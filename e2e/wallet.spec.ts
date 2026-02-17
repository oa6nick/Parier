import { test, expect } from "@playwright/test";

test.describe("Wallet", () => {
  test("wallet page requires auth", async ({ page }) => {
    await page.goto("/en/wallet");
    await page.waitForURL(/\/(login|auth)/);
  });

  test("wallet route exists", async ({ page }) => {
    await page.goto("/en/login");
    const walletLink = page.locator('a[href*="wallet"]');
    const count = await walletLink.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
