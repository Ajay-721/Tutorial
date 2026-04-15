const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://perfumy-api.onrender.com/');
  await page.waitForLoadState('networkidle');
  const modal = page.locator('#welcome-modal');
  const backdrop = page.locator('#welcome-modal-backdrop');
  const close = page.locator('button:has-text("Close welcome popup")');
  console.log('modal count', await modal.count());
  console.log('modal visible', await modal.isVisible().catch(() => false));
  console.log('backdrop visible', await backdrop.isVisible().catch(() => false));
  console.log('close count', await close.count());
  console.log('close visible', await close.isVisible().catch(() => false));
  console.log('close text', await close.evaluateAll(nodes => nodes.map(n => n.textContent)));
  console.log('html snippet', await page.locator('#welcome-modal').innerHTML().catch(() => '')); 
  await browser.close();
})();
