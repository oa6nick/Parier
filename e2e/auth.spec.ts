import { test, expect } from "@playwright/test";

test.describe("Auth", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/en/login");
    await expect(page).toHaveTitle(/Pariall|Login/i);
  });

  test("redirects to login when accessing protected route", async ({ page }) => {
    await page.goto("/en/profile");
    await page.waitForURL(/\/(login|auth)/);
  });
});
