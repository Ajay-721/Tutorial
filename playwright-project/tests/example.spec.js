const { test, expect } = require('@playwright/test');

const credentials = {
  email: 'ramu@yopmail.com',
  password: 'Ramu@098',
};

// ===== CLOSE MODAL =====
async function closeWelcomeModal(page) {
  const modal = page.locator('#welcome-modal');
  const backdrop = page.locator('#welcome-modal-backdrop');

  await page.waitForTimeout(2000);

  if (await modal.isVisible().catch(() => false)) {
    await modal.locator('button').first().click();
  }

  await expect(backdrop).toBeHidden();
  await expect(modal).toBeHidden();
}

// ===== LOGIN =====
async function login(page, email, password) {
  const loginBtn = page.getByRole('button', { name: /login/i }).first();

  if (!(await loginBtn.isVisible().catch(() => false))) {
    console.log('Already logged in or login button not visible');
    return;
  }

  await loginBtn.click();

  const loginDialog = page.getByRole('dialog', { name: /login/i });

  const emailInput = loginDialog.getByPlaceholder('Enter email or phone number');
  await expect(emailInput).toBeVisible();
  await emailInput.fill(email);

  const passwordInput = loginDialog.getByPlaceholder('Enter your password');
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(password);

  const submitBtn = loginDialog.getByRole('button', { name: /^login$/i });
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();

  await expect(page.locator('text=Guest')).toBeHidden();
}

// ===== TEST 1 =====
test('loads app', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await expect(page.locator('text=Featured Perfumes')).toBeVisible();
});

// ===== TEST 2 =====
test('login works', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page, credentials.email, credentials.password);
});

// ===== TEST 3 =====
test('full flow: cart → checkout → payment', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);

  await login(page, credentials.email, credentials.password);

  const addToCart = page.locator('text=Add to Cart').first();
  await expect(addToCart).toBeVisible();
  await addToCart.click();

  // go to cart
  await page.locator('a:has-text("Cart")').click();
  await expect(page).toHaveURL(/cart/);

  // verify cart is not empty before checkout
  await expect(page.locator('text=Your cart is empty')).toBeHidden({ timeout: 15000 });
  const checkoutBtn = page.locator('text=Proceed to Checkout');
  await expect(checkoutBtn).toBeEnabled({ timeout: 15000 });

  await checkoutBtn.click();
  await expect(page).toHaveURL(/checkout/);

  await page.getByPlaceholder('Enter your full name').fill('Ramu Sharma');
  await page.getByPlaceholder('Enter your phone number').fill('9876543210');
  await page.getByPlaceholder('Enter your email').fill('ramu@yopmail.com');
  await page.getByPlaceholder('Enter your city').fill('Mumbai');
  await page.getByPlaceholder('House number, street, landmark').fill('123 Main Street');
  await page.getByPlaceholder('Enter your state').fill('Maharashtra');
  await page.getByPlaceholder('Enter your pincode').fill('400001');

  const paymentBtn = page.locator('text=Proceed to Payment');
  await expect(paymentBtn).toBeEnabled();
  await paymentBtn.click();

  await expect(page).toHaveURL(/payment/);
});