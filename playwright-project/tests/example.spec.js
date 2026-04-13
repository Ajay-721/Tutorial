const { test, expect } = require('@playwright/test');



test('loads Perfumy app and shows featured perfumes', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/', { waitUntil: 'networkidle' });

  const heroText = page.locator('text=Find a scent that matches your mood and style.');
  await expect(heroText).toBeVisible({ timeout: 30000 });

  await expect(page.locator('text=Featured Perfumes')).toBeVisible({ timeout: 30000 });
});
