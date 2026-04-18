# Payment Rate Values Test Report

**Date:** 2026-04-18  
**Browser:** Chromium  
**Test file:** `tests/payment-rate-values.spec.js`  
**Total tests:** 6  
**Result:** 6 Passed · 0 Failed  
**Duration:** ~31.5s

---

## Test Results Summary

| ID | Test Case | Status | Cart Value | Payment Page Value |
|----|-----------|--------|------------|--------------------|
| TC-RATE-01 | Cart summary values are correct before checkout | ✅ Pass | All values correct | — |
| TC-RATE-02 | Payment Items count matches cart | ✅ Pass | `1` | `1` |
| TC-RATE-03 | Payment Subtotal matches cart Subtotal | ✅ Pass | `Rs. 7,469` | `Rs. 7,469` |
| TC-RATE-04 | Payment Shipping matches cart Shipping | ✅ Pass | `Rs. 99` | `Rs. 99` |
| TC-RATE-05 | Payment Packaging matches cart Packaging | ✅ Pass | `Rs. 49` | `Rs. 49` |
| TC-RATE-06 | Payment Total Payable matches cart Grand Total | ✅ Pass | `Rs. 7,617` | `Rs. 7,617` |

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

## Payment Page Values (Actual)

Values rendered on `/payment` after full checkout flow:

| Field | Actual Value | Correct? |
|-------|-------------|---------|
| Items | 1 | ✅ |
| Subtotal | Rs. 7,469 | ✅ |
| Shipping | Rs. 99 | ✅ |
| Packaging | Rs. 49 | ✅ |
| Total Payable | Rs. 7,617 | ✅ |

---

## Failure Details

No failures in this run. All payment summary values match cart values correctly.

---

## Environment

| Property | Value |
|----------|-------|
| Playwright version | ^1.59.1 |
| Target URL | https://perfumy-api.onrender.com/ |
| Test timeout | 60 000 ms |
| Browser | Chromium |
| Workers | 6 (parallel) |
| Test account | ramu@yopmail.com |
| OS | Windows 11 |
