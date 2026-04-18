# Payment Rate Values Test Report

**Date:** 2026-04-18  
**Browser:** Chromium (headed)  
**Test file:** `tests/payment-rate-values.spec.js`  
**Total tests:** 6  
**Result:** 1 Passed · 5 Failed  
**Duration:** ~2.5 min

---

## Test Results Summary

| ID | Test Case | Status | Cart Value | Payment Page Value |
|----|-----------|--------|------------|--------------------|
| TC-RATE-01 | Cart summary values are correct before checkout | ✅ Pass | All values correct | — |
| TC-RATE-02 | Payment Items count matches cart | ❌ Fail | `1` | `0` |
| TC-RATE-03 | Payment Subtotal matches cart Subtotal | ❌ Fail | `Rs. 7,469` | `Rs. 0` |
| TC-RATE-04 | Payment Shipping matches cart Shipping | ❌ Fail | `Rs. 99` | `Rs. 0` |
| TC-RATE-05 | Payment Packaging matches cart Packaging | ❌ Fail | `Rs. 49` | `Rs. 0` |
| TC-RATE-06 | Payment Total Payable matches cart Grand Total | ❌ Fail | `Rs. 7,617` | `Rs. 0` |

---

## Cart Values (Source of Truth)

Values captured live from cart page before proceeding to payment:

| Field | Expected Value |
|-------|---------------|
| Items | 1 |
| Subtotal | Rs. 7,469 |
| Shipping | Rs. 99 |
| Packaging | Rs. 49 |
| Grand Total | Rs. 7,617 |

---

## Payment Page Values (Actual — Broken)

Values rendered on `/payment.html` after full checkout flow:

| Field | Actual Value | Correct? |
|-------|-------------|---------|
| Items | 0 | ❌ |
| Subtotal | Rs. 0 | ❌ |
| Shipping | Rs. 0 | ❌ |
| Packaging | Rs. 0 | ❌ |
| Total Payable | Rs. 0 | ❌ |

---

## Failure Details

### TC-RATE-02 — Items
```
Expected: "1"
Received: "0"
Error: Payment Items (0) should match cart (1)
```

### TC-RATE-03 — Subtotal
```
Expected: "Rs. 7,469"
Received: "Rs. 0"
Error: Payment Subtotal (Rs. 0) should match cart (Rs. 7,469)
```

### TC-RATE-04 — Shipping
```
Expected: "Rs. 99"
Received: "Rs. 0"
Error: Payment Shipping (Rs. 0) should match cart (Rs. 99)
```

### TC-RATE-05 — Packaging
```
Expected: "Rs. 49"
Received: "Rs. 0"
Error: Payment Packaging (Rs. 0) should match cart (Rs. 49)
```

### TC-RATE-06 — Total Payable
```
Expected: "Rs. 7,617"
Received: "Rs. 0"
Error: Payment Total Payable (Rs. 0) should match cart Grand Total (Rs. 7,617)
```

---

## Bug Summary

**Bug title:** Payment summary does not display cart rate values — all amounts show Rs. 0  
**Severity:** High — core feature broken  
**Affected page:** `/payment.html`  
**Affected fields:** Items count, Subtotal, Shipping, Packaging, Total Payable  

**What happens:**  
After adding 1 item (Dior J'adore, Rs. 7,469) to cart and completing the checkout form, the payment summary panel shows all amounts as Rs. 0 and Items as 0.

**What should happen:**  
Payment summary must display the same values as the cart order summary:

| Field | Should Show |
|-------|------------|
| Items | 1 |
| Subtotal | Rs. 7,469 |
| Shipping | Rs. 99 |
| Packaging | Rs. 49 |
| Total Payable | Rs. 7,617 |

**Root cause (suspected):**  
Cart state is stored in `localStorage` or session on the cart/checkout page but is not being read or populated on `payment.html` load. The payment page likely initialises its summary fields from a data source that is either empty or not passed from the previous page.

**Secondary impact:**  
- The `#cod-confirm-button` (Cash on Delivery) is also hidden when totals are Rs. 0, making COD inaccessible to the user.
- The UPI badge (`#payment-total-badge`) also shows `Rs. 0`, so the user has no correct amount reference before paying.

---

## Environment

| Property | Value |
|----------|-------|
| Playwright version | ^1.59.1 |
| Target URL | https://perfumy-api.onrender.com/ |
| Test timeout | 60 000 ms |
| Browser | Chromium (headed) |
| Workers | 1 (sequential) |
| Test account | ramu@yopmail.com |
| Product tested | Dior J'adore |
| OS | Windows 11 |
