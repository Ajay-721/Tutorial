const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://perfumy-api.onrender.com/');
  await page.waitForLoadState('networkidle');
  console.log('page title:', await page.title());
  console.log('login button count:', await page.locator('text=Login').count());
  const loginButtons = await page.locator('text=Login').allTextContents();
  console.log('login button texts:', JSON.stringify(loginButtons));
  if (await page.locator('text=Login').count()) {
    await page.locator('text=Login').first().click();
    await page.waitForTimeout(2000);
    const loginModal = await page.locator('#login-modal').count();
    console.log('login modal count:', loginModal);
    if (loginModal) {
      console.log('login modal html:', await page.locator('#login-modal').innerHTML());
    }
    const inputs = await page.locator('input').allTextContents();
    console.log('input texts:', JSON.stringify(inputs));
    const labels = await page.locator('label').allTextContents();
    console.log('labels:', JSON.stringify(labels));
  }
  await browser.close();
})();
