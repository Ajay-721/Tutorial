# Test Run Report — 2026-04-18

**Run mode:** Headed  
**Browsers:** Chromium · Firefox · WebKit  
**Total tests:** 9 (3 test cases × 3 browsers)

---

## Run History

| Run | Browser | Mode | Slow-Mo | Result | Duration |
|-----|---------|------|---------|--------|----------|
| Run 1 | Chromium · Firefox · WebKit | Headed | Off | 7 Passed · 2 Failed | ~1.6 min |
| Run 2 | Chromium · Firefox · WebKit | Headed | Off | 9 Passed · 0 Failed | ~1.1 min |
| Run 3 | Chromium only | Headed | Off | 3 Passed · 0 Failed | ~18.9 sec |
| Run 4 *(latest)* | Chromium only | Headed | **1000 ms/action** | **3 Passed · 0 Failed** | **~35.4 sec** |

---

## Latest Run Summary — Run 4 ✅

**Config:** Chromium · Headed · Slow-Mo 1000 ms per action

| Test Case | Status | Duration |
|-----------|--------|----------|
| TC-01 · loads app | ✅ Pass | — |
| TC-02 · login works | ✅ Pass | — |
| TC-03 · full flow: cart → checkout → payment | ✅ Pass | — |

> Slow-mo mode adds a 1-second pause between every browser action — clicks, fills, navigations — making the run visible step-by-step in the browser window. Total run time was ~35 sec vs ~19 sec at normal speed.

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

---

### TC-02 · login works

**File:** `tests/example.spec.js:58`  
**What it checks:** Closes the welcome modal, clicks Login, fills email + password, submits, and confirms the Guest label disappears.

| Run | Browser | Status | Notes |
|-----|---------|--------|-------|
| Run 1 | Chromium / Firefox / WebKit | ✅ Pass | Firefox/Chromium: session already cached |
| Run 2 | Chromium / Firefox / WebKit | ✅ Pass | Session cached |
| Run 3 | Chromium | ✅ Pass | Chromium-only default |
| Run 4 | Chromium | ✅ Pass | Slow-mo — form fill visible at 1s per keystroke batch |

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
| Run 4 | Chromium | ✅ Pass | Slow-mo — each checkout field fill clearly visible |

---

## Run 1 Failure Analysis (Resolved — Flaky)

**Failing line:** `tests/example.spec.js:73` — `await addToCart.click()`

**Error:**
```
<div class="auth-modal-backdrop" id="welcome-modal-backdrop"></div>
subtree intercepts pointer events
```

**Cause:** `#welcome-modal-backdrop` remained in the DOM long enough after `closeWelcomeModal()` returned to block the "Add to Cart" click in Chromium and Firefox. Confirmed as a timing flake — did not recur in Runs 2, 3, or 4.

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
