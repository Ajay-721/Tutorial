const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://perfumy-api.onrender.com/');
  await page.waitForLoadState('networkidle');
  const html = await page.content();
  console.log('has backdrop:', html.includes('welcome-modal-backdrop'));
  console.log('has welcome modal:', html.includes('welcome-modal'));
  const modal = page.locator('#welcome-modal');
  console.log('modal visible:', await modal.isVisible().catch(() => false));
  console.log('modal html:', await modal.innerHTML().catch(() => 'unable to read innerHTML'));
  const closeCandidates = await modal.locator('button, [role="button"], [aria-label], text="×", text="Close"').allTextContents();
  console.log('modal close candidates:', JSON.stringify(closeCandidates));
  const visibleCloseTexts = await page.locator('button, [role="button"], [aria-label], text="×", text="Close"').allTextContents();
  console.log('page close candidates:', JSON.stringify(visibleCloseTexts.slice(0,40)));
  await browser.close();
})();
