const { test, expect } = require('@playwright/test');

const credentials = { email: 'ramu@yopmail.com', password: 'Ramu@098' };

const deliveryDetails = {
  name: 'Ramu Sharma',
  phone: '9876543210',
  email: 'ramu@yopmail.com',
  city: 'Mumbai',
  address: '123 Main Street',
  state: 'Maharashtra',
  pincode: '400001',
};

async function closeWelcomeModal(page) {
  const modal = page.locator('#welcome-modal');
  const backdrop = page.locator('#welcome-modal-backdrop');
  await page.waitForTimeout(2000);
  if (await modal.isVisible().catch(() => false)) {
    await modal.locator('button').first().click();
  }
  await backdrop.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  await expect(modal).toBeHidden();
}

async function login(page) {
  const loginBtn = page.getByRole('button', { name: /login/i }).first();
  if (!(await loginBtn.isVisible().catch(() => false))) return;
  await loginBtn.click();
  const dialog = page.getByRole('dialog', { name: /login/i });
  await dialog.getByPlaceholder('Enter email or phone number').fill(credentials.email);
  await dialog.getByPlaceholder('Enter your password').fill(credentials.password);
  await dialog.getByRole('button', { name: /^login$/i }).click();
  await expect(page.locator('text=Guest')).toBeHidden();
}

// Helper: extract text of the value cell next to a label in the summary
async function getSummaryValue(page, label) {
  return page.evaluate((lbl) => {
    const allDivs = [...document.querySelectorAll('*')];
    for (const el of allDivs) {
      if (el.children.length === 2 &&
          el.children[0].textContent.trim() === lbl) {
        return el.children[1].textContent.trim();
      }
    }
    return null;
  }, label);
}

// ─── SETUP: capture cart values, then reach payment page ────────────────────

test('TC-RATE-01 · cart summary values are correct before checkout', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page);

  await page.locator('text=Add to Cart').first().click();
  await page.locator('a:has-text("Cart")').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('text=Your cart is empty')).toBeHidden({ timeout: 15000 });

  // Verify cart summary values are real numbers (not zero)
  const subtotal  = page.locator('text=Subtotal').locator('xpath=following-sibling::*[1]');
  const shipping  = page.locator('text=Shipping').locator('xpath=following-sibling::*[1]');
  const packaging = page.locator('text=Packaging').locator('xpath=following-sibling::*[1]');
  const grandTotal = page.locator('text=Grand Total').locator('xpath=following-sibling::*[1]');
  const itemCount  = page.locator('text=Total Items').locator('xpath=following-sibling::*[1]');

  const subtotalTxt   = await subtotal.textContent();
  const shippingTxt   = await shipping.textContent();
  const packagingTxt  = await packaging.textContent();
  const grandTotalTxt = await grandTotal.textContent();
  const itemsTxt      = await itemCount.textContent();

  console.log('Cart — Items:',    itemsTxt?.trim());
  console.log('Cart — Subtotal:', subtotalTxt?.trim());
  console.log('Cart — Shipping:', shippingTxt?.trim());
  console.log('Cart — Packaging:', packagingTxt?.trim());
  console.log('Cart — Grand Total:', grandTotalTxt?.trim());

  // Items must be at least 1
  expect(Number(itemsTxt?.trim())).toBeGreaterThan(0);

  // All monetary values must contain "Rs." and NOT be "Rs. 0"
  for (const [label, val] of [
    ['Subtotal', subtotalTxt],
    ['Shipping', shippingTxt],
    ['Packaging', packagingTxt],
    ['Grand Total', grandTotalTxt],
  ]) {
    expect(val, `${label} should contain Rs.`).toContain('Rs.');
    expect(val?.trim(), `${label} should not be Rs. 0`).not.toBe('Rs. 0');
  }
});

// ─── TC-RATE-02 ─────────────────────────────────────────────────────────────

test('TC-RATE-02 · payment summary Items count matches cart', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page);

  // Capture cart item count
  await page.locator('text=Add to Cart').first().click();
  await page.locator('a:has-text("Cart")').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('text=Your cart is empty')).toBeHidden({ timeout: 15000 });
  const cartItemCount = await page.locator('text=Total Items').locator('xpath=following-sibling::*[1]').textContent();
  console.log('Cart item count:', cartItemCount?.trim());

  // Proceed to payment
  await page.locator('text=Proceed to Checkout').click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByPlaceholder('Enter your full name').fill(deliveryDetails.name);
  await page.getByPlaceholder('Enter your phone number').fill(deliveryDetails.phone);
  await page.getByPlaceholder('Enter your email').fill(deliveryDetails.email);
  await page.getByPlaceholder('Enter your city').fill(deliveryDetails.city);
  await page.getByPlaceholder('House number, street, landmark').fill(deliveryDetails.address);
  await page.getByPlaceholder('Enter your state').fill(deliveryDetails.state);
  await page.getByPlaceholder('Enter your pincode').fill(deliveryDetails.pincode);
  await page.locator('text=Proceed to Payment').click();
  await expect(page).toHaveURL(/payment/);
  await page.waitForTimeout(1000);

  // Payment summary Items value
  const paymentItems = await getSummaryValue(page, 'Items');
  console.log('Payment summary — Items:', paymentItems);

  expect(
    paymentItems?.trim(),
    `Payment Items (${paymentItems?.trim()}) should match cart (${cartItemCount?.trim()})`
  ).toBe(cartItemCount?.trim());
});

// ─── TC-RATE-03 ─────────────────────────────────────────────────────────────

test('TC-RATE-03 · payment summary Subtotal matches cart Subtotal', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page);

  await page.locator('text=Add to Cart').first().click();
  await page.locator('a:has-text("Cart")').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('text=Your cart is empty')).toBeHidden({ timeout: 15000 });
  const cartSubtotal = await page.locator('text=Subtotal').locator('xpath=following-sibling::*[1]').textContent();
  console.log('Cart Subtotal:', cartSubtotal?.trim());

  await page.locator('text=Proceed to Checkout').click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByPlaceholder('Enter your full name').fill(deliveryDetails.name);
  await page.getByPlaceholder('Enter your phone number').fill(deliveryDetails.phone);
  await page.getByPlaceholder('Enter your email').fill(deliveryDetails.email);
  await page.getByPlaceholder('Enter your city').fill(deliveryDetails.city);
  await page.getByPlaceholder('House number, street, landmark').fill(deliveryDetails.address);
  await page.getByPlaceholder('Enter your state').fill(deliveryDetails.state);
  await page.getByPlaceholder('Enter your pincode').fill(deliveryDetails.pincode);
  await page.locator('text=Proceed to Payment').click();
  await expect(page).toHaveURL(/payment/);
  await page.waitForTimeout(1000);

  const paymentSubtotal = await getSummaryValue(page, 'Subtotal');
  console.log('Payment Subtotal:', paymentSubtotal);

  expect(
    paymentSubtotal?.trim(),
    `Payment Subtotal (${paymentSubtotal?.trim()}) should match cart (${cartSubtotal?.trim()})`
  ).toBe(cartSubtotal?.trim());
});

// ─── TC-RATE-04 ─────────────────────────────────────────────────────────────

test('TC-RATE-04 · payment summary Shipping matches cart Shipping', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page);

  await page.locator('text=Add to Cart').first().click();
  await page.locator('a:has-text("Cart")').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('text=Your cart is empty')).toBeHidden({ timeout: 15000 });
  const cartShipping = await page.locator('text=Shipping').locator('xpath=following-sibling::*[1]').textContent();
  console.log('Cart Shipping:', cartShipping?.trim());

  await page.locator('text=Proceed to Checkout').click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByPlaceholder('Enter your full name').fill(deliveryDetails.name);
  await page.getByPlaceholder('Enter your phone number').fill(deliveryDetails.phone);
  await page.getByPlaceholder('Enter your email').fill(deliveryDetails.email);
  await page.getByPlaceholder('Enter your city').fill(deliveryDetails.city);
  await page.getByPlaceholder('House number, street, landmark').fill(deliveryDetails.address);
  await page.getByPlaceholder('Enter your state').fill(deliveryDetails.state);
  await page.getByPlaceholder('Enter your pincode').fill(deliveryDetails.pincode);
  await page.locator('text=Proceed to Payment').click();
  await expect(page).toHaveURL(/payment/);
  await page.waitForTimeout(1000);

  const paymentShipping = await getSummaryValue(page, 'Shipping');
  console.log('Payment Shipping:', paymentShipping);

  expect(
    paymentShipping?.trim(),
    `Payment Shipping (${paymentShipping?.trim()}) should match cart (${cartShipping?.trim()})`
  ).toBe(cartShipping?.trim());
});

// ─── TC-RATE-05 ─────────────────────────────────────────────────────────────

test('TC-RATE-05 · payment summary Packaging matches cart Packaging', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page);

  await page.locator('text=Add to Cart').first().click();
  await page.locator('a:has-text("Cart")').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('text=Your cart is empty')).toBeHidden({ timeout: 15000 });
  const cartPackaging = await page.locator('text=Packaging').locator('xpath=following-sibling::*[1]').textContent();
  console.log('Cart Packaging:', cartPackaging?.trim());

  await page.locator('text=Proceed to Checkout').click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByPlaceholder('Enter your full name').fill(deliveryDetails.name);
  await page.getByPlaceholder('Enter your phone number').fill(deliveryDetails.phone);
  await page.getByPlaceholder('Enter your email').fill(deliveryDetails.email);
  await page.getByPlaceholder('Enter your city').fill(deliveryDetails.city);
  await page.getByPlaceholder('House number, street, landmark').fill(deliveryDetails.address);
  await page.getByPlaceholder('Enter your state').fill(deliveryDetails.state);
  await page.getByPlaceholder('Enter your pincode').fill(deliveryDetails.pincode);
  await page.locator('text=Proceed to Payment').click();
  await expect(page).toHaveURL(/payment/);
  await page.waitForTimeout(1000);

  const paymentPackaging = await getSummaryValue(page, 'Packaging');
  console.log('Payment Packaging:', paymentPackaging);

  expect(
    paymentPackaging?.trim(),
    `Payment Packaging (${paymentPackaging?.trim()}) should match cart (${cartPackaging?.trim()})`
  ).toBe(cartPackaging?.trim());
});

// ─── TC-RATE-06 ─────────────────────────────────────────────────────────────

test('TC-RATE-06 · payment summary Total Payable matches cart Grand Total', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page);

  await page.locator('text=Add to Cart').first().click();
  await page.locator('a:has-text("Cart")').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('text=Your cart is empty')).toBeHidden({ timeout: 15000 });
  const cartGrandTotal = await page.locator('text=Grand Total').locator('xpath=following-sibling::*[1]').textContent();
  console.log('Cart Grand Total:', cartGrandTotal?.trim());

  await page.locator('text=Proceed to Checkout').click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByPlaceholder('Enter your full name').fill(deliveryDetails.name);
  await page.getByPlaceholder('Enter your phone number').fill(deliveryDetails.phone);
  await page.getByPlaceholder('Enter your email').fill(deliveryDetails.email);
  await page.getByPlaceholder('Enter your city').fill(deliveryDetails.city);
  await page.getByPlaceholder('House number, street, landmark').fill(deliveryDetails.address);
  await page.getByPlaceholder('Enter your state').fill(deliveryDetails.state);
  await page.getByPlaceholder('Enter your pincode').fill(deliveryDetails.pincode);
  await page.locator('text=Proceed to Payment').click();
  await expect(page).toHaveURL(/payment/);
  await page.waitForTimeout(1000);

  const paymentTotal = await getSummaryValue(page, 'Total Payable');
  console.log('Payment Total Payable:', paymentTotal);

  expect(
    paymentTotal?.trim(),
    `Payment Total Payable (${paymentTotal?.trim()}) should match cart Grand Total (${cartGrandTotal?.trim()})`
  ).toBe(cartGrandTotal?.trim());
});
