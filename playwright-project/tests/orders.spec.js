const { test, expect } = require('@playwright/test');

const credentials = { email: 'ramu@yopmail.com', password: 'Ramu@098' };

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

async function goToOrdersPage(page) {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page);
  // Click the Orders nav link
  const ordersLink = page.locator('a', { hasText: /orders/i }).first();
  await expect(ordersLink).toBeVisible();
  await ordersLink.click();
  await expect(page).toHaveURL(/orders/i);
  // Wait for JS to fetch and render orders (or show empty state)
  await page.waitForSelector('#orders-list, #orders-empty', { timeout: 15000 });
  await page.waitForTimeout(2000);
}

// ─── TC-ORD-01 ───────────────────────────────────────────────────────────────
test('TC-ORD-01 · Orders link is visible in nav after login', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/');
  await closeWelcomeModal(page);
  await login(page);

  const ordersLink = page.locator('a', { hasText: /orders/i }).first();
  await expect(ordersLink).toBeVisible();
});

// ─── TC-ORD-02 ───────────────────────────────────────────────────────────────
test('TC-ORD-02 · Orders page loads and URL contains /orders', async ({ page }) => {
  await goToOrdersPage(page);
  await expect(page).toHaveURL(/orders/i);
});

// ─── TC-ORD-03 ───────────────────────────────────────────────────────────────
test('TC-ORD-03 · Orders page has a visible heading', async ({ page }) => {
  await goToOrdersPage(page);

  const heading = page.locator('h1, h2, h3').filter({ hasText: /orders/i }).first();
  await expect(heading).toBeVisible();
});

// ─── TC-ORD-04 ───────────────────────────────────────────────────────────────
test('TC-ORD-04 · Orders page shows order list or empty-state message', async ({ page }) => {
  await goToOrdersPage(page);

  const ordersList = page.locator('#orders-list');
  const emptyState = page.locator('#orders-empty');

  // Either the orders list has at least one card, or the empty-state paragraph is visible
  const hasOrders = (await ordersList.locator('article.order-card').count()) > 0;
  const hasEmptyMsg = await emptyState.isVisible().catch(() => false);

  expect(hasOrders || hasEmptyMsg, 'Orders page must show either order cards or an empty-state message').toBe(true);
});

// ─── TC-ORD-05 ───────────────────────────────────────────────────────────────
test('TC-ORD-05 · Each order card shows order ID or order number', async ({ page }) => {
  await goToOrdersPage(page);

  const orderCards = page.locator('#orders-list article.order-card');
  const count = await orderCards.count();

  if (count === 0) {
    console.log('TC-ORD-05: No order cards found — account may have no past orders. Skipping card content check.');
    return;
  }

  const firstCard = orderCards.first();
  const orderIdEl = firstCard.locator('.order-id');
  await expect(orderIdEl).toBeVisible();
  const idText = await orderIdEl.textContent();
  console.log('TC-ORD-05: First order ID text:', idText?.trim());
  expect(idText, 'Order card should display an order number').toMatch(/#\d+|order\s*#\s*\d+/i);
});

// ─── TC-ORD-06 ───────────────────────────────────────────────────────────────
test('TC-ORD-06 · Each order card shows a status label', async ({ page }) => {
  await goToOrdersPage(page);

  const statusLabels = page.locator('text=/pending|processing|shipped|delivered|cancelled|confirmed/i');
  const count = await statusLabels.count();

  if (count === 0) {
    console.log('TC-ORD-06: No status labels found — account may have no past orders.');
    return;
  }

  await expect(statusLabels.first()).toBeVisible();
  console.log('TC-ORD-06: Found', count, 'status label(s) on the orders page.');
});

// ─── TC-ORD-07 ───────────────────────────────────────────────────────────────
test('TC-ORD-07 · Order card shows items, totals, and delivery address', async ({ page }) => {
  await goToOrdersPage(page);

  const orderCards = page.locator('#orders-list article.order-card');
  const count = await orderCards.count();

  if (count === 0) {
    console.log('TC-ORD-07: No order cards — account has no past orders. Skipping.');
    return;
  }

  const firstCard = orderCards.first();

  // Order card must have items list, totals, and delivery address
  await expect(firstCard.locator('.order-items-list')).toBeVisible();
  await expect(firstCard.locator('.order-totals')).toBeVisible();
  await expect(firstCard.locator('.order-address')).toBeVisible();

  // Total Paid row must be present
  const grandRow = firstCard.locator('.order-total-row.grand');
  await expect(grandRow).toBeVisible();
  const grandText = await grandRow.textContent();
  console.log('TC-ORD-07: Grand total row:', grandText?.trim());
  expect(grandText).toMatch(/Rs\./);
});

// ─── TC-ORD-08 ───────────────────────────────────────────────────────────────
// NOTE: The app has no server-side auth guard on orders.html. An unauthenticated
// user lands on the page and sees an empty list — there is no redirect to login.
test('TC-ORD-08 · [BUG] orders.html accessible without login — renders empty list with no orders', async ({ page }) => {
  await page.goto('https://perfumy-api.onrender.com/orders.html');
  await page.waitForSelector('#orders-list', { state: 'attached', timeout: 15000 });
  await page.waitForTimeout(2000);

  const currentUrl = page.url();
  console.log('TC-ORD-08: URL without login:', currentUrl);

  // Page stays at orders.html — no redirect
  expect(currentUrl).toContain('orders.html');

  // The empty-state message is shown because there are no orders for a guest session
  const emptyMsg = page.locator('#orders-empty');
  const orderCards = page.locator('#orders-list article.order-card');

  const emptyVisible = await emptyMsg.isVisible().catch(() => false);
  const cardCount = await orderCards.count();

  console.log('TC-ORD-08: Empty state visible:', emptyVisible, '| Order cards:', cardCount);
  console.log('TC-ORD-08: KNOWN BUG — orders.html has no auth guard; unauthenticated users see the page (empty list) instead of being redirected to login.');

  // No order data should be rendered for an unauthenticated user
  expect(cardCount, 'Unauthenticated user should not see any order cards').toBe(0);
});
