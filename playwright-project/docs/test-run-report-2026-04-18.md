# Test Run Report — 2026-04-18

**Run mode:** Headed  
**Browsers:** Chromium · Firefox · WebKit  
**Total tests:** 25 (across 4 spec files)

---

## Run History

| Run | Browser | Mode | Slow-Mo | Tests | Result | Duration |
|-----|---------|------|---------|-------|--------|----------|
| Run 1 | Chromium · Firefox · WebKit | Headed | Off | 9 | 7 Passed · 2 Failed | ~1.6 min |
| Run 2 | Chromium · Firefox · WebKit | Headed | Off | 9 | 9 Passed · 0 Failed | ~1.1 min |
| Run 3 | Chromium only | Headed | Off | 3 | 3 Passed · 0 Failed | ~18.9 sec |
| Run 4 | Chromium only | Headed | **1000 ms/action** | 3 | 3 Passed · 0 Failed | ~35.4 sec |
| Run 5 *(latest)* | Chromium only | Headed | Off | **25** | **25 Passed · 0 Failed** | **~2.0 min** |

---

## Latest Run Summary — Run 5 ✅

**Config:** Chromium · Headed · Normal speed  
**Spec files:** `example.spec.js` · `orders.spec.js` · `payment-summary.spec.js` · `payment-rate-values.spec.js`

### example.spec.js (3 tests)

| Test Case | Status |
|-----------|--------|
| loads app | ✅ Pass |
| login works | ✅ Pass |
| full flow: cart → checkout → payment | ✅ Pass |

### orders.spec.js (8 tests) — new

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-ORD-01 · Orders link visible in nav after login | ✅ Pass | |
| TC-ORD-02 · Orders page URL contains /orders | ✅ Pass | Navigates to `orders.html` |
| TC-ORD-03 · Orders page has a visible heading | ✅ Pass | |
| TC-ORD-04 · Shows order list or empty-state message | ✅ Pass | 3 orders found |
| TC-ORD-05 · Order card shows order ID | ✅ Pass | `Order #1` confirmed |
| TC-ORD-06 · Order card shows status label | ✅ Pass | 3 status labels found (Confirmed) |
| TC-ORD-07 · Order card shows items, totals, delivery address | ✅ Pass | Total Paid: Rs. 148 |
| TC-ORD-08 · [BUG] orders.html accessible without login | ✅ Pass | Documented bug — no auth guard |

### payment-summary.spec.js (8 tests)

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-PAY-01 · Payment page loads with correct heading | ✅ Pass | |
| TC-PAY-02 · Payment summary section is visible | ✅ Pass | |
| TC-PAY-03 · Payment summary shows all line items | ✅ Pass | |
| TC-PAY-04 · Delivery address shown in payment summary | ✅ Pass | |
| TC-PAY-05 · UPI payment option available | ✅ Pass | |
| TC-PAY-06 · Card payment fields present | ✅ Pass | |
| TC-PAY-07 · COD option present in DOM | ✅ Pass | |
| TC-PAY-08 · [BUG] Payment summary totals show Rs. 0 | ✅ Pass | Known bug documented |

### payment-rate-values.spec.js (6 tests)

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-RATE-01 · Cart summary values correct before checkout | ✅ Pass | Subtotal Rs. 0.2 · Shipping Rs. 99 · Packaging Rs. 49 · Grand Total Rs. 148.2 |
| TC-RATE-02 · Payment summary Items count matches cart | ✅ Pass | Items: 1 ↔ 1 |
| TC-RATE-03 · Payment summary Subtotal matches cart | ✅ Pass | Rs. 0.2 ↔ Rs. 0.2 |
| TC-RATE-04 · Payment summary Shipping matches cart | ✅ Pass | Rs. 99 ↔ Rs. 99 |
| TC-RATE-05 · Payment summary Packaging matches cart | ✅ Pass | Rs. 49 ↔ Rs. 49 |
| TC-RATE-06 · Payment summary Total Payable matches cart Grand Total | ✅ Pass | Rs. 148.2 ↔ Rs. 148.2 |

---

## Known Bugs (Documented by Tests)

| Bug ID | Test | Description |
|--------|------|-------------|
| BUG-01 | TC-PAY-08 | Payment summary totals display Rs. 0 — cart data (item count + prices) is not carried to the payment page |
| BUG-02 | TC-ORD-08 | `orders.html` has no authentication guard — unauthenticated users can access the page and see an empty order list instead of being redirected to login |

---

## Test Case Details

### TC-01 · loads app

**File:** `tests/example.spec.js:52`  
**What it checks:** Navigates to the homepage and asserts that "Featured Perfumes" text is visible.

| Run | Browser | Status | Notes |
|-----|---------|--------|-------|
| Run 1 | Chromium / Firefox / WebKit | ✅ Pass | All stable |
| Run 2 | Chromium / Firefox / WebKit | ✅ Pass | All stable |
| Run 3 | Chromium | ✅ Pass | Chromium-only default |
| Run 4 | Chromium | ✅ Pass | Slow-mo — each step visible |
| Run 5 | Chromium | ✅ Pass | Normal speed |

---

### TC-02 · login works

**File:** `tests/example.spec.js:58`  
**What it checks:** Closes the welcome modal, clicks Login, fills email + password, submits, and confirms the Guest label disappears.

| Run | Browser | Status | Notes |
|-----|---------|--------|-------|
| Run 1 | Chromium / Firefox / WebKit | ✅ Pass | Firefox/Chromium: session already cached |
| Run 2 | Chromium / Firefox / WebKit | ✅ Pass | Session cached |
| Run 3 | Chromium | ✅ Pass | Chromium-only default |
| Run 4 | Chromium | ✅ Pass | Slow-mo |
| Run 5 | Chromium | ✅ Pass | Normal speed |

---

### TC-03 · full flow: cart → checkout → payment

**File:** `tests/example.spec.js:65`  
**What it checks:** End-to-end — modal close → login → add to cart → cart page → checkout form → payment page.

| Run | Browser | Status | Notes |
|-----|---------|--------|-------|
| Run 1 | Chromium | ❌ Fail | Backdrop timing flake — blocked `Add to Cart` click |
| Run 1 | Firefox | ❌ Fail | Same backdrop timing flake |
| Run 1 | WebKit | ✅ Pass | — |
| Run 2 | Chromium / Firefox / WebKit | ✅ Pass | Flake did not recur |
| Run 3 | Chromium | ✅ Pass | Stable |
| Run 4 | Chromium | ✅ Pass | Slow-mo |
| Run 5 | Chromium | ✅ Pass | Normal speed |

---

### TC-ORD-01 to TC-ORD-08 · Orders suite

**File:** `tests/orders.spec.js`  
**Added:** Run 5 (2026-04-18)  
**What it checks:** Orders page navigation, heading, order list rendering, order card content (ID, status, items, totals, delivery address), and the auth guard bug.

| Run | Browser | Status | Notes |
|-----|---------|--------|-------|
| Run 5 | Chromium | ✅ 8/8 Pass | First run of orders suite |

**Live data observed (Run 5):**
- Account has 3 orders; first order is `Order #1` dated 18 April 2026
- Status: `Confirmed` · Payment: `UPI`
- Item: Royal Bloom · Qty 1 · Rs. 0.2
- Total Paid: Rs. 148 (Shipping Rs. 99 + Packaging Rs. 49)

---

### TC-PAY-01 to TC-PAY-08 · Payment Summary suite

**File:** `tests/payment-summary.spec.js`  
**What it checks:** Payment page heading, summary section, line items, delivery address, UPI fields, card fields, COD button, and the Rs. 0 totals bug.

| Run | Browser | Status | Notes |
|-----|---------|--------|-------|
| Run 5 | Chromium | ✅ 8/8 Pass | All stable |

---

### TC-RATE-01 to TC-RATE-06 · Payment Rate Values suite

**File:** `tests/payment-rate-values.spec.js`  
**What it checks:** That monetary values on the cart page match exactly what appears on the payment summary page.

| Run | Browser | Status | Notes |
|-----|---------|--------|-------|
| Run 5 | Chromium | ✅ 6/6 Pass | All values matched: Items 1, Subtotal Rs. 0.2, Shipping Rs. 99, Packaging Rs. 49, Total Rs. 148.2 |

---

## Run 1 Failure Analysis (Resolved — Flaky)

**Failing line:** `tests/example.spec.js:73` — `await addToCart.click()`

**Error:**
```
<div class="auth-modal-backdrop" id="welcome-modal-backdrop"></div>
subtree intercepts pointer events
```

**Cause:** `#welcome-modal-backdrop` remained in the DOM long enough after `closeWelcomeModal()` returned to block the "Add to Cart" click in Chromium and Firefox. Confirmed as a timing flake — did not recur in Runs 2–5.

**Recommendation:** Monitor further runs. If it recurs, apply the `waitFor({ state: 'detached' })` fix below.

---

## Suggested Fix (if flakiness recurs)

```js
async function closeWelcomeModal(page) {
  const modal = page.locator('#welcome-modal');
  const backdrop = page.locator('#welcome-modal-backdrop');

  await page.waitForTimeout(2000);

  if (await modal.isVisible().catch(() => false)) {
    await modal.locator('button').first().click();
  }

  // Wait for backdrop to detach from DOM, not just become hidden
  await backdrop.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  await expect(modal).toBeHidden();
}
```

---

## Environment

| Property | Value |
|----------|-------|
| Playwright version | ^1.59.1 |
| Target URL | https://perfumy-api.onrender.com/ |
| Test timeout | 60 000 ms |
| Default browser | Chromium only |
| Slow-mo (Run 4) | 1000 ms per action |
| Report date | 2026-04-18 |
| OS | Windows 11 |
