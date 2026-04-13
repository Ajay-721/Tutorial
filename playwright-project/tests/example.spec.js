const { test, expect } = require('@playwright/test');



test('loads Perfumy app and shows featured perfumes', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');

  await expect(page).toHaveURL('https://perfumy-api.onrender.com/');
  await expect(page.locator('text=Find a scent that matches your mood and style.')).toBeVisible();
  await expect(page.locator('text=Featured Perfumes')).toBeVisible();
});
